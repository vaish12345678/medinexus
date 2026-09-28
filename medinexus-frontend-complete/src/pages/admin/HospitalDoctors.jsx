import { useState } from "react";
import api, { errorMessage } from "../../services/api";
import { Button, Card, Input, Page } from "../../components/UI";
import {
  useApiList,
  ListState,
  RecordCard,
} from "../../components/DataList";

export default function HospitalDoctors() {
  const [hid, setHid] = useState("");
  const [run, setRun] = useState(false);

  const { data, loading, error } = useApiList(
    run && hid ? `/hospitals/${hid}/doctors` : null
  );

  const [f, setF] = useState({
    doctorId: "",
    departmentId: "",
  });

  async function add(e) {
    e.preventDefault();

    try {
      await api.post(`/hospitals/${hid}/doctors`, {
        doctorId: Number(f.doctorId),
        departmentId: Number(f.departmentId),
      });

      setRun(true);
    } catch (e) {
      alert(errorMessage(e));
    }
  }

  return (
    <Page
      title="Hospital Doctors"
      subtitle="Attach doctors to a hospital and department."
    >
      <Card>
        <div className="grid gap-3 sm:grid-cols-3">
          <Input
            label="Hospital ID"
            type="number"
            value={hid}
            onChange={(e) => setHid(e.target.value)}
          />

          <Input
            label="Doctor ID"
            type="number"
            value={f.doctorId}
            onChange={(e) =>
              setF({
                ...f,
                doctorId: e.target.value,
              })
            }
          />

          <Input
            label="Department ID"
            type="number"
            value={f.departmentId}
            onChange={(e) =>
              setF({
                ...f,
                departmentId: e.target.value,
              })
            }
          />

          <Button
            onClick={() => {
              if (!hid) {
                alert("Please enter a Hospital ID");
                return;
              }

              setRun(true);
            }}
          >
            Load doctors
          </Button>

          <Button variant="secondary" onClick={add}>
            Add doctor
          </Button>
        </div>
      </Card>

      {run && (
        <ListState loading={loading} error={error} data={data}>
          {data.map((x) => (
            <RecordCard
              key={x.id}
              title={x.doctorName || `Doctor #${x.doctorId}`}
            >
              <p>
                Department:{" "}
                {x.departmentName || x.departmentId || "—"}
              </p>
            </RecordCard>
          ))}
        </ListState>
      )}
    </Page>
  );
}