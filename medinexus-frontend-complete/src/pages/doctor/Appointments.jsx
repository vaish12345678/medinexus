
import { useEffect, useState } from "react";
import api, { errorMessage } from "../../services/api";
import { Button, Page, Notice } from "../../components/UI";

export default function Appointments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionError, setActionError] = useState("");
  const [actingId, setActingId] = useState(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/appointments/doctor");
      setData(response.data || []);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function act(id, action) {
    setActionError("");

    try {
      setActingId(id);

      await api.put(`/appointments/${id}/${action}`);

      await loadAppointments();
    } catch (e) {
      setActionError(errorMessage(e));
    } finally {
      setActingId(null);
    }
  }

  const statusConfig = {
    REQUESTED: {
      label: "Pending",
      badge: "bg-amber-50 text-amber-700 border-amber-200/80",
      accent: "border-l-amber-500",
    },
    CONFIRMED: {
      label: "Confirmed",
      badge: "bg-blue-50 text-blue-700 border-blue-200/80",
      accent: "border-l-blue-500",
    },
    COMPLETED: {
      label: "Completed",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      accent: "border-l-emerald-500",
    },
    CANCELLED: {
      label: "Cancelled",
      badge: "bg-zinc-100 text-zinc-600 border-zinc-200",
      accent: "border-l-zinc-400",
    },
  };

  function formatDate(date) {
    if (!date) return "N/A";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }

  function formatTime(time) {
    if (!time) return "N/A";

    const parts = time.split(":");

    if (parts.length < 2) {
      return time;
    }

    const date = new Date();

    date.setHours(
      Number(parts[0]),
      Number(parts[1]),
      0
    );

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <Page
      title="Doctor Appointments"
      subtitle="Manage patient consultations and schedule requests."
      className="w-full max-w-none px-0"
    >
      {actionError && (
        <div className="mb-5">
          <Notice>{actionError}</Notice>
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-sm text-zinc-500">
          Loading...
        </div>
      ) : error ? (
        <div className="py-8 text-center text-sm text-red-600">
          {error}
        </div>
      ) : data.length === 0 ? (
        <div className="w-full rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 p-12 text-center">
          <h3 className="text-base font-semibold text-zinc-900">
            No appointments yet
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            New appointment requests will appear here once booked.
          </p>
        </div>
      ) : (
        <div className="w-full space-y-6">
          <div className="grid w-full grid-cols-3 gap-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <span className="text-xs font-medium text-zinc-500">
                Total
              </span>

              <p className="mt-1 text-2xl font-bold tracking-tight text-zinc-900">
                {data.length}
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <span className="text-xs font-medium text-zinc-500">
                Pending
              </span>

              <p className="mt-1 text-2xl font-bold tracking-tight text-amber-600">
                {
                  data.filter(
                    (x) => x.status === "REQUESTED"
                  ).length
                }
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <span className="text-xs font-medium text-zinc-500">
                Confirmed
              </span>

              <p className="mt-1 text-2xl font-bold tracking-tight text-blue-600">
                {
                  data.filter(
                    (x) => x.status === "CONFIRMED"
                  ).length
                }
              </p>
            </div>
          </div>

          <div className="grid w-full gap-4 lg:grid-cols-2">
            {data.map((item) => {
              const conf =
                statusConfig[item.status] || {
                  label: item.status,
                  badge:
                    "bg-zinc-100 text-zinc-700 border-zinc-200",
                  accent: "border-l-zinc-300",
                };

              const isActing = actingId === item.id;

              return (
                <div
                  key={item.id}
                  className={`flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-xs transition-all hover:border-zinc-300 border-l-4 ${conf.accent}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700">
                          {(item.patientName || "Patient")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <h4 className="text-base font-semibold text-zinc-900">
                            {item.patientName ||
                              `Patient #${item.patientId}`}
                          </h4>

                          <span className="text-xs text-zinc-400">
                            Appt #{item.id}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${conf.badge}`}
                      >
                        {conf.label}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-6 border-y border-zinc-100 py-3 text-sm text-zinc-600">
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 text-zinc-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>

                        <span>
                          {formatDate(item.appointmentDate)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 text-zinc-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>

                        <span>
                          {formatTime(item.appointmentTime)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-1">
                    <span className="text-xs text-zinc-400">
                      {item.status === "REQUESTED" &&
                        "Needs review"}

                      {item.status === "CONFIRMED" &&
                        "Scheduled"}

                      {item.status === "COMPLETED" &&
                        "Done"}

                      {item.status === "CANCELLED" &&
                        "Closed"}
                    </span>

                    <div>
                      {item.status === "REQUESTED" && (
                        <Button
                          disabled={isActing}
                          onClick={() =>
                            act(item.id, "confirm")
                          }
                        >
                          {isActing
                            ? "Confirming..."
                            : "Confirm"}
                        </Button>
                      )}

                      {item.status === "CONFIRMED" && (
                        <Button
                          disabled={isActing}
                          onClick={() =>
                            act(item.id, "complete")
                          }
                        >
                          {isActing
                            ? "Completing..."
                            : "Mark Completed"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Page>
  );
}
