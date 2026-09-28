import { useEffect, useState } from "react";
import api, { errorMessage } from "../../services/api";
import { Page, Card } from "../../components/UI";

export default function OrganRequests() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrganRequests();
  }, []);

  async function loadOrganRequests() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/doctor/organ-requests");
      setData(response.data || []);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page
      title="Organ Requests"
      subtitle="Approved organ requests available to doctors."
    >
      {loading && (
        <div className="py-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
          <p className="text-sm font-medium text-slate-500 animate-pulse">
            Loading organ requests...
          </p>
        </div>
      )}

      {error && (
        <div className="py-6 px-4 text-center rounded-2xl border border-red-100 bg-red-50 text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="py-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
          <p className="text-sm text-slate-500">
            No organ requests found.
          </p>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((x) => (
            <Card
              key={x.id}
              className="flex flex-col justify-between p-5 border border-slate-200/80 rounded-2xl bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
            >
              <div>
                {/* Header: Request ID + Organ Badge */}
                <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-900 text-base">
                    Request #{x.id}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                    {x.organType || "Organ"}
                  </span>
                </div>

                {/* Information Grid */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                      Organ Required
                    </span>
                    <span className="font-semibold text-slate-800">
                      {x.organType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                      Blood Group
                    </span>
                    <span className="inline-flex items-center font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                      {x.bloodGroup}
                    </span>
                  </div>

                  {/* Notes */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-400 block text-xs font-medium mb-1">
                      Notes
                    </span>
                    <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {x.notes || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Page>
  );
}