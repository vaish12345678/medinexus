
import { useEffect, useState } from "react";
import api, { errorMessage } from "../../services/api";
import {
  Button,
  Card,
  Notice,
  Page,
  Textarea,
} from "../../components/UI";

export default function Symptoms() {
  const [txt, setTxt] = useState("");
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      setHistoryLoading(true);
      setHistoryError("");

      const response = await api.get("/symptoms/my");

      setHistory(response.data || []);
    } catch (e) {
      setHistoryError(errorMessage(e));
    } finally {
      setHistoryLoading(false);
    }
  }

  async function check(e) {
    e.preventDefault();

    setErr("");

    try {
      const r = await api.post("/symptoms/check", {
        symptoms: txt,
      });

      setResult(r.data);

      // Refresh previous checks after a new check
      await loadHistory();
    } catch (e) {
      setErr(errorMessage(e));
    }
  }

  return (
    <Page
      title="Symptom Checker"
      subtitle="Describe your symptoms and use the returned specialization as guidance for your doctor search."
    >
      <Card>
        <form onSubmit={check} className="space-y-4">
          <Textarea
            label="What symptoms are you experiencing?"
            required
            value={txt}
            onChange={(e) => setTxt(e.target.value)}
            placeholder="Example: chest pain and shortness of breath"
          />

          <Button>Check symptoms</Button>
        </form>

        {err && (
          <div className="mt-3">
            <Notice>{err}</Notice>
          </div>
        )}

        {result && (
          <div className="mt-5 rounded-xl bg-med-50 p-4 text-sm">
            <b>Result</b>

            <pre className="mt-2 whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </Card>

      <div>
        <h2 className="mb-3 font-bold">
          Previous checks
        </h2>

        {historyLoading && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
            Loading previous checks...
          </div>
        )}

        {historyError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {historyError}
          </div>
        )}

        {!historyLoading &&
          !historyError &&
          history.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
              No previous checks found.
            </div>
          )}

        {!historyLoading &&
          !historyError &&
          history.length > 0 && (
            <div className="space-y-4">
              {history.map((x) => (
                <div
                  key={x.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <h3 className="font-semibold text-slate-900">
                    Check #{x.id}
                  </h3>

                  <pre className="mt-3 whitespace-pre-wrap text-xs text-slate-600">
                    {JSON.stringify(x, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
      </div>
    </Page>
  );
}
