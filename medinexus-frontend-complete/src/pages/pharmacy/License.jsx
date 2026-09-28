
import { useEffect, useState } from "react";

import api, { errorMessage } from "../../services/api";

import { Button, Card, Input, Page } from "../../components/UI";

export default function License() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [n, setN] = useState("");

  const [file, setFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadLicenses();
  }, []);

  async function loadLicenses() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/pharmacy/licenses");

      setData(response.data || []);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function submit(e) {
    e.preventDefault();

    if (!file) {
      alert("Please select your pharmacy license document.");
      return;
    }

    const fd = new FormData();

    fd.append("licenseNumber", n);
    fd.append("document", file);

    try {
      setSubmitting(true);

      await api.post("/pharmacy/licenses", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("License submitted successfully.");

      setN("");
      setFile(null);

      location.reload();
    } catch (e) {
      alert(errorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }

  function getStatus(status) {
    const value = String(status || "").toUpperCase();

    if (value === "VERIFIED" || value === "APPROVED") {
      return {
        label: "Verified",
        className:
          "bg-emerald-100 text-emerald-700 border-emerald-200",
      };
    }

    if (value === "REJECTED") {
      return {
        label: "Rejected",
        className:
          "bg-red-100 text-red-700 border-red-200",
      };
    }

    return {
      label: "Pending Verification",
      className:
        "bg-amber-100 text-amber-700 border-amber-200",
    };
  }

  function getDocumentUrl(item) {
    return (
      item.documentUrl ||
      item.licenseUrl ||
      item.fileUrl ||
      item.document ||
      item.file ||
      null
    );
  }

  return (
    <Page
      title="License Verification"
      subtitle="Submit and track your pharmacy license verification."
    >
      {/* Upload Section */}
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <div className="mb-6">
            <div className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-xl">
              📄
            </div>

            <h2 className="text-xl font-bold text-slate-800">
              Submit Pharmacy License
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Upload a clear copy of your valid pharmacy license.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <Input
              label="License Number"
              required
              value={n}
              onChange={(e) => setN(e.target.value)}
              placeholder="Enter your license number"
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                License Document
              </label>

              <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 px-5 text-center transition hover:border-indigo-400 hover:bg-indigo-50">
                <span className="text-3xl">☁️</span>

                <span className="mt-2 text-sm font-semibold text-indigo-700">
                  {file ? file.name : "Choose license document"}
                </span>

                <span className="mt-1 text-xs text-slate-500">
                  JPG, PNG or PDF
                </span>

                <input
                  type="file"
                  required
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) =>
                    setFile(e.target.files?.[0] || null)
                  }
                />
              </label>
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting
                ? "Submitting..."
                : "Submit for Verification"}
            </Button>
          </form>
        </Card>

        {/* Information Card */}
        <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6 text-white shadow-lg">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="mb-5 text-4xl">🏥</div>

              <h2 className="text-2xl font-bold">
                Why verify your license?
              </h2>

              <p className="mt-3 text-sm leading-6 text-indigo-100">
                License verification helps Medinexus ensure that
                only authorized pharmacies can manage medicines and
                provide pharmacy services.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="font-semibold">
                  🔐 Secure Verification
                </p>

                <p className="mt-1 text-xs text-indigo-100">
                  Your submitted document is reviewed by the system
                  administrator.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="font-semibold">
                  💊 Pharmacy Access
                </p>

                <p className="mt-1 text-xs text-indigo-100">
                  Verified pharmacies can manage their medicine
                  inventory.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submitted Licenses */}
      <div className="mt-8">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-800">
            Submitted Licenses
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track your license verification status and documents.
          </p>
        </div>

        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">
              Loading licenses...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {data.length === 0 ? (
              <Card>
                <div className="py-12 text-center">
                  <div className="text-5xl">📑</div>

                  <h3 className="mt-4 font-semibold text-slate-800">
                    No license submitted
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Submit your pharmacy license using the form above.
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {data.map((x) => {
                  const status = getStatus(
                    x.verificationStatus || x.status
                  );

                  const documentUrl = getDocumentUrl(x);

                  return (
                    <Card key={x.id}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            License ID
                          </p>

                          <h3 className="mt-1 text-lg font-bold text-slate-800">
                            #{x.id}
                          </h3>
                        </div>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-medium text-slate-500">
                          License Number
                        </p>

                        <p className="mt-1 font-semibold text-slate-800">
                          {x.licenseNumber || "Not available"}
                        </p>
                      </div>

                      {/* Document Preview */}
                      <div className="mt-5">
                        <p className="mb-2 text-sm font-semibold text-slate-700">
                          Uploaded Document
                        </p>

                        {documentUrl ? (
                          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                            {String(documentUrl)
                              .toLowerCase()
                              .match(/\.(jpg|jpeg|png|webp)(\?.*)?$/) ? (
                              <img
                                src={documentUrl}
                                alt="Pharmacy license"
                                className="h-64 w-full object-contain"
                              />
                            ) : (
                              <div className="flex h-48 flex-col items-center justify-center">
                                <div className="text-5xl">📄</div>

                                <p className="mt-2 text-sm font-medium text-slate-700">
                                  License document
                                </p>

                                <a
                                  href={documentUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                                >
                                  View Document
                                </a>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
                            <div className="text-4xl">📄</div>

                            <p className="mt-2 text-sm font-medium text-slate-600">
                              Document preview unavailable
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              No document URL was returned by the API.
                            </p>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </Page>
  );
}
