import { useEffect, useState } from "react";
import api, { errorMessage } from "../../services/api";
import {
  Button,
  Card,
  Input,
  Page,
  Textarea,
} from "../../components/UI";

export default function Medicines() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [f, setF] = useState({
    name: "",
    genericName: "",
    manufacturer: "",
    description: "",
  });

  // ============================================================
  // LOAD MEDICINES
  // ============================================================

  async function loadMedicines() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/medicines");
      const result = response.data;

      const medicines = Array.isArray(result)
        ? result
        : result?.content ||
          result?.data ||
          [];

      setData(medicines);
    } catch (e) {
      setError(errorMessage(e));
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedicines();
  }, []);

  // ============================================================
  // CREATE MEDICINE
  // ============================================================

  async function create(e) {
    e.preventDefault();

    try {
      await api.post("/medicines", f);
      location.reload();
    } catch (e) {
      alert(errorMessage(e));
    }
  }

  // ============================================================
  // DELETE MEDICINE
  // ============================================================

  async function del(id) {
    try {
      await api.delete(`/medicines/${id}`);
      location.reload();
    } catch (e) {
      alert(errorMessage(e));
    }
  }

  return (
    <Page
      title="Medicine Catalog"
      subtitle="Manage medicines available to pharmacies and prescriptions."
    >
      {/* ========================================================
          ADD MEDICINE
      ======================================================== */}

      <Card>
        <form onSubmit={create} className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Medicine name"
            required
            value={f.name}
            onChange={(e) =>
              setF({ ...f, name: e.target.value })
            }
          />

          <Input
            label="Generic name"
            value={f.genericName}
            onChange={(e) =>
              setF({ ...f, genericName: e.target.value })
            }
          />

          <Input
            label="Manufacturer"
            value={f.manufacturer}
            onChange={(e) =>
              setF({ ...f, manufacturer: e.target.value })
            }
          />

          <Textarea
            label="Description"
            value={f.description}
            onChange={(e) =>
              setF({ ...f, description: e.target.value })
            }
          />

          <Button>Add medicine</Button>
        </form>
      </Card>

      {/* ========================================================
          MEDICINE LIST
      ======================================================== */}

      <div className="mt-6">
        {loading && (
          <Card>
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-800" />
              <span className="ml-3 text-sm text-gray-600">
                Loading medicines...
              </span>
            </div>
          </Card>
        )}

        {!loading && error && (
          <Card>
            <div className="py-6 text-center">
              <p className="text-sm text-red-600">{error}</p>

              <Button
                className="mt-3"
                onClick={loadMedicines}
              >
                Retry
              </Button>
            </div>
          </Card>
        )}

        {!loading && !error && data.length === 0 && (
          <Card>
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500">
                No medicines found.
              </p>
            </div>
          </Card>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="grid gap-4">
            {data.map((x) => (
              <Card key={x.id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {x.name || `Medicine #${x.id}`}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      <span className="font-medium">
                        Generic:
                      </span>{" "}
                      {x.genericName || "—"}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      <span className="font-medium">
                        Manufacturer:
                      </span>{" "}
                      {x.manufacturer || "—"}
                    </p>

                    {x.description && (
                      <p className="mt-2 text-sm text-gray-500">
                        {x.description}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0">
                    <Button
                      variant="danger"
                      onClick={() => del(x.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}