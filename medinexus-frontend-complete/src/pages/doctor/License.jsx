
import { useEffect, useState } from "react";
import api, { errorMessage } from "../../services/api";
import { Button, Card, Input, Page } from "../../components/UI";

export default function License() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [n, setN] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    loadLicenses();
  }, []);

  async function loadLicenses() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/doctor/licenses");
      setData(response.data || []);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function submit(e) {
    e.preventDefault();

    const fd = new FormData();
    fd.append("licenseNumber", n);
    fd.append("document", file);

    try {
      await api.post("/doctor/licenses", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      location.reload();
    } catch (e) {
      alert(errorMessage(e));
    }
  }

  return (
    <Page
      title="Doctor License"
      subtitle="Upload your medical license for admin verification."
    >
      <Card>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <Input
            label="License number"
            required
            value={n}
            onChange={(e) => setN(e.target.value)}
          />

          <label>
            <span className="mb-1.5 block text-sm font-medium">
              License document
            </span>

            <input
              className="w-full rounded-xl border p-2.5 text-sm"
              type="file"
              required
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          <Button disabled={!file}>Submit for verification</Button>
        </form>
      </Card>

      {loading && (
        <div className="mt-4 rounded-xl border p-4 text-sm text-slate-500">
          Loading...
        </div>
      )}

      {!loading && error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div>
          {data.map((x) => (
            <div
              key={x.id}
              className="mt-4 rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-800">
                  {`License #${x.id}`}
                </h3>

                {(x.verificationStatus || x.status) && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {x.verificationStatus || x.status}
                  </span>
                )}
              </div>

              <p>
                <strong>Number:</strong> {x.licenseNumber}
              </p>

              {x.licenseUrl && (
                <div className="mt-3">
                  <p className="mb-2 text-sm font-semibold">
                    License Document
                  </p>

                  <img
                    src={x.licenseUrl}
                    alt="Medical license"
                    className="max-h-96 w-full rounded-xl border object-contain"
                  />
                </div>
              )}

              {x.rejectionReason && (
                <p className="text-sm text-red-600">
                  <strong>Rejection reason:</strong>{" "}
                  {x.rejectionReason}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Page>
  );
}
