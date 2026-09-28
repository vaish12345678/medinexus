import { useEffect, useState } from "react";
import { Button, Page } from "../components/UI";
import api, { errorMessage } from "../services/api";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notifications/my");

      setItems(response.data || []);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function read(id) {
    try {
      await api.put(`/notifications/${id}/read`);

      setItems((current) =>
        current.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (e) {
      alert(errorMessage(e));
    }
  }

  // Count unread items dynamically
  const unreadCount = items.filter((item) => !item.isRead).length;

  return (
    <Page
      title="Notifications"
      subtitle="Updates from consultations, prescriptions and other workflows."
    >
      {/* Header bar with Unread Count & Action Button */}
      {!loading && !error && items.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700">
                Unread
              </span>
              <span className="inline-flex items-center justify-center rounded-full bg-teal-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
                {unreadCount}
              </span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-medium text-slate-500">
              Total: {items.length}
            </span>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => items.filter(n => !n.isRead).forEach(n => read(n.id))}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>
      )}

      {loading && (
        <div className="py-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
          <p className="text-sm font-medium text-slate-500 animate-pulse">
            Loading notifications...
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 font-medium">
          {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center text-slate-500 text-sm">
          No notifications yet.
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="space-y-3">
          {items.map((notification) => (
            <div
              key={notification.id}
              className={`relative overflow-hidden rounded-2xl border transition-all duration-200 bg-white p-5 shadow-sm ${
                notification.isRead
                  ? "border-slate-200/70 opacity-80"
                  : "border-teal-200/90 ring-1 ring-teal-500/10 shadow-md"
              }`}
            >
              {/* Unread Indicator Bar */}
              {!notification.isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500" />
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {/* Glowing/Pulsing Dot for Unread Items */}
                  {!notification.isRead && (
                    <span className="mt-1.5 relative flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                    </span>
                  )}

                  <div>
                    <h2 className="font-semibold text-slate-900 text-base">
                      {notification.title || "Notification"}
                    </h2>

                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                      {notification.message}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    notification.isRead
                      ? "bg-slate-100 text-slate-500"
                      : "bg-teal-50 text-teal-700 border border-teal-200/60"
                  }`}
                >
                  {notification.isRead ? "READ" : "UNREAD"}
                </span>
              </div>

              {!notification.isRead && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <Button
                    variant="secondary"
                    onClick={() => read(notification.id)}
                  >
                    Mark as read
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Page>
  );
}