
import { useEffect, useState } from "react";
import api, { errorMessage } from "../../services/api";
import { Button, Card, Input, Page, Select } from "../../components/UI";

export default function Availability() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [f, setF] = useState({
    dayOfWeek: "MONDAY",
    startTime: "09:00",
    endTime: "17:00",
  });

  useEffect(() => {
    loadAvailability();
  }, []);

  async function loadAvailability() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/doctors/availability");
      setData(response.data || []);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function add(e) {
    e.preventDefault();

    try {
      await api.post("/doctors/availability", f);
      location.reload();
    } catch (e) {
      alert(errorMessage(e));
    }
  }

  async function del(id) {
    try {
      await api.delete(`/doctors/availability/${id}`);
      location.reload();
    } catch (e) {
      alert(errorMessage(e));
    }
  }

  return (
    <Page
      title="Availability"
      subtitle="Define when patients can request appointments."
    >
      <Card>
        <form onSubmit={add} className="grid gap-3 sm:grid-cols-4">
          <Select
            label="Day"
            value={f.dayOfWeek}
            onChange={(e) => setF({ ...f, dayOfWeek: e.target.value })}
          >
            {[
              "MONDAY",
              "TUESDAY",
              "WEDNESDAY",
              "THURSDAY",
              "FRIDAY",
              "SATURDAY",
              "SUNDAY",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </Select>

          <Input
            label="Start"
            type="time"
            value={f.startTime}
            onChange={(e) => setF({ ...f, startTime: e.target.value })}
          />

          <Input
            label="End"
            type="time"
            value={f.endTime}
            onChange={(e) => setF({ ...f, endTime: e.target.value })}
          />

          <div className="sm:self-end">
            <Button>Add slot</Button>
          </div>
        </form>
      </Card>

      {loading && (
        <p className="py-4 text-center text-sm text-slate-500">
          Loading...
        </p>
      )}

      {error && (
        <p className="py-4 text-center text-sm text-red-600">
          {error}
        </p>
      )}

      {!loading && !error && data.length === 0 && (
        <p className="py-4 text-center text-sm text-slate-500">
          No records found.
        </p>
      )}

      {!loading &&
        !error &&
        data.map((x) => (
          <div key={x.id}>
            <div>
              <h3>{x.dayOfWeek}</h3>
              <p>
                {x.startTime} – {x.endTime}
              </p>

              <Button variant="danger" onClick={() => del(x.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
    </Page>
  );
}
