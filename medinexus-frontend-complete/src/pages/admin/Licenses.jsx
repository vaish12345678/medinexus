import { useEffect, useState } from "react";
import api, { errorMessage } from "../../services/api";
import { Button, Card, Page } from "../../components/UI";

export default function Licenses({ type }) {
  const base =
    type === "doctor"
      ? "/doctor/licenses/admin/pending"
      : "/pharmacy/licenses/admin/pending";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  // ============================================================
  // LOAD PENDING LICENSES
  // ============================================================

  useEffect(() => {
    async function loadLicenses() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(base);

        const result = Array.isArray(response.data)
          ? response.data
          : response.data?.content || [];

        setData(result);
      } catch (e) {
        setError(errorMessage(e));
      } finally {
        setLoading(false);
      }
    }

    loadLicenses();
  }, [base]);

  // ============================================================
  // VERIFY LICENSE
  // ============================================================

  async function verify(id) {
    try {
      await api.put(
        `${
          type === "doctor"
            ? "/doctor/licenses"
            : "/pharmacy/licenses"
        }/${id}/verify`,
        {
          verificationStatus: "VERIFIED",
        }
      );

      location.reload();
    } catch (e) {
      alert(errorMessage(e));
    }
  }

  return (
    <>
      <Page
        title={`${type === "doctor" ? "Doctor" : "Pharmacy"} License Queue`}
        subtitle="Review pending licenses and verify approved submissions."
      >
        {/* ======================================================
            LOADING
        ======================================================= */}

        {loading && (
          <Card>
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

              <p className="mt-4 text-sm font-medium text-slate-600">
                Loading pending licenses...
              </p>
            </div>
          </Card>
        )}

        {/* ======================================================
            ERROR
        ======================================================= */}

        {!loading && error && (
          <Card>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="text-sm font-semibold text-red-800">
                Unable to load licenses
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          </Card>
        )}

        {/* ======================================================
            EMPTY
        ======================================================= */}

        {!loading && !error && data.length === 0 && (
          <Card>
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                ✓
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900">
                No pending licenses
              </h3>

              <p className="mt-1 max-w-md text-sm text-slate-500">
                There are currently no {type === "doctor" ? "doctor" : "pharmacy"}{" "}
                licenses waiting for verification.
              </p>
            </div>
          </Card>
        )}

        {/* ======================================================
            LICENSE LIST
        ======================================================= */}

        {!loading && !error && data.length > 0 && (
          <div className="space-y-6">
            {data.map((x) => (
              <Card key={x.id}>
                {/* Header */}

                <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                        Pending Verification
                      </span>

                      <span className="text-xs font-medium text-slate-400">
                        #{x.id}
                      </span>
                    </div>

                    <h2 className="mt-2 text-lg font-bold text-slate-900">
                      {type === "doctor"
                        ? "Doctor License"
                        : "Pharmacy License"}
                    </h2>
                  </div>
                </div>

                {/* License Number */}

                <div className="mb-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    License Number
                  </p>

                  <p className="mt-1 text-base font-bold text-slate-900">
                    {x.licenseNumber || "Not provided"}
                  </p>
                </div>

                {/* License Document */}

                {x.documentUrl ? (
                  <div className="mb-6">
                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          License Document
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-500">
                          Review the uploaded document before verification.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPreviewUrl(x.documentUrl)}
                        className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                      >
                        🔍 View Full Size
                      </button>
                    </div>

                    {/* Document Preview */}

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-4">
                      <button
                        type="button"
                        onClick={() => setPreviewUrl(x.documentUrl)}
                        className="flex w-full cursor-zoom-in items-center justify-center"
                      >
                        <img
                          src={x.documentUrl}
                          alt={`${type} license ${x.licenseNumber || x.id}`}
                          className="max-h-[650px] w-auto max-w-full rounded-xl object-contain shadow-md"
                        />
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                      Click the document to inspect it in full size.
                    </p>
                  </div>
                ) : (
                  <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex gap-3">
                      <span className="text-lg">⚠️</span>

                      <div>
                        <p className="text-sm font-semibold text-amber-900">
                          License document unavailable
                        </p>

                        <p className="mt-1 text-xs text-amber-700">
                          No document was attached to this license submission.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Verify */}

                <div className="flex justify-end border-t border-slate-100 pt-5">
                  <Button onClick={() => verify(x.id)}>
                    ✓ Verify License
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Page>

      {/* ========================================================
          FULL-SCREEN DOCUMENT PREVIEW
      ========================================================= */}

      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="relative flex max-h-[95vh] max-w-[95vw] items-center justify-center rounded-2xl bg-white p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}

            <button
              type="button"
              onClick={() => setPreviewUrl(null)}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-2xl text-white transition hover:bg-black"
              aria-label="Close preview"
            >
              ×
            </button>

            <img
              src={previewUrl}
              alt="License full preview"
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}