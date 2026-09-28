
import { useEffect, useState } from "react";
import api, { errorMessage } from "../../services/api";
import {
  Button,
  Card,
  Page,
  Select,
} from "../../components/UI";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pharmacies, setPharmacies] = useState([]);
  const [pharmaciesLoading, setPharmaciesLoading] = useState(true);
  const [pharmaciesError, setPharmaciesError] = useState("");

  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionsLoading, setPrescriptionsLoading] = useState(true);
  const [prescriptionsError, setPrescriptionsError] = useState("");

  const [f, setF] = useState({
    pharmacyId: "",
    prescriptionId: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadOrders();
    loadPharmacies();
    loadPrescriptions();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/medicine-orders/my");
      setOrders(response.data || []);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function loadPharmacies() {
    try {
      setPharmaciesLoading(true);
      setPharmaciesError("");

      const response = await api.get("/pharmacies/verified");
      setPharmacies(response.data || []);
    } catch (e) {
      setPharmaciesError(errorMessage(e));
    } finally {
      setPharmaciesLoading(false);
    }
  }

  async function loadPrescriptions() {
    try {
      setPrescriptionsLoading(true);
      setPrescriptionsError("");

      const response = await api.get("/prescriptions/my");
      setPrescriptions(response.data || []);
    } catch (e) {
      setPrescriptionsError(errorMessage(e));
    } finally {
      setPrescriptionsLoading(false);
    }
  }

  async function create(e) {
    e.preventDefault();

    if (!f.pharmacyId) {
      alert("Please select a pharmacy.");
      return;
    }

    if (!f.prescriptionId) {
      alert("Please select a prescription.");
      return;
    }

    try {
      setSaving(true);

      await api.post("/medicine-orders", {
        pharmacyId: Number(f.pharmacyId),
        prescriptionId: Number(f.prescriptionId),
      });

      alert("Medicine order created successfully.");

      setF({
        pharmacyId: "",
        prescriptionId: "",
      });

      location.reload();
    } catch (e) {
      alert(errorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  async function cancel(id) {
    if (!window.confirm("Cancel this medicine order?")) {
      return;
    }

    try {
      await api.put(`/medicine-orders/${id}/cancel`);

      alert("Order cancelled successfully.");

      location.reload();
    } catch (e) {
      alert(errorMessage(e));
    }
  }

  return (
    <Page
      title="Medicine Orders"
      subtitle="Order prescribed medicines from a verified pharmacy and track your order."
    >
      {/* Create Order */}
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          Place Medicine Order
        </h2>

        <form
          onSubmit={create}
          className="grid gap-4 sm:grid-cols-2"
        >
          {/* Pharmacy */}
          <Select
            label="Select Pharmacy"
            required
            value={f.pharmacyId}
            onChange={(e) =>
              setF({
                ...f,
                pharmacyId: e.target.value,
              })
            }
          >
            <option value="">
              Select a pharmacy
            </option>

            {pharmacies.map((pharmacy) => (
              <option
                key={pharmacy.id}
                value={pharmacy.id}
              >
                {pharmacy.pharmacyName}
              </option>
            ))}
          </Select>

          {/* Prescription */}
          <Select
            label="Select Prescription"
            required
            value={f.prescriptionId}
            onChange={(e) =>
              setF({
                ...f,
                prescriptionId: e.target.value,
              })
            }
          >
            <option value="">
              Select prescription
            </option>

            {prescriptions.map((prescription) => (
              <option
                key={prescription.id}
                value={prescription.id}
              >
                Prescription #{prescription.id}
              </option>
            ))}
          </Select>

          {/* Submit */}
          <div className="sm:col-span-2">
            <Button
              type="submit"
              disabled={
                saving ||
                pharmaciesLoading ||
                prescriptionsLoading
              }
            >
              {saving
                ? "Creating Order..."
                : "Place Medicine Order"}
            </Button>
          </div>
        </form>

        {pharmaciesError && (
          <p className="mt-3 text-sm text-red-600">
            Could not load pharmacies:{" "}
            {pharmaciesError}
          </p>
        )}

        {prescriptionsError && (
          <p className="mt-3 text-sm text-red-600">
            Could not load prescriptions:{" "}
            {prescriptionsError}
          </p>
        )}

        {!prescriptionsLoading &&
          !prescriptionsError &&
          prescriptions.length === 0 && (
            <p className="mt-3 text-sm text-slate-500">
              You don't have any prescriptions yet.
              Complete a doctor consultation first.
            </p>
          )}

        {!pharmaciesLoading &&
          !pharmaciesError &&
          pharmacies.length === 0 && (
            <p className="mt-3 text-sm text-slate-500">
              No verified pharmacies are currently
              available.
            </p>
          )}
      </Card>

      {/* Existing Orders */}
      <div className="mt-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          My Orders
        </h2>

        {loading && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              Loading...
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
            No records found.
          </div>
        )}

        {!loading &&
          !error &&
          orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-800">
                  {`Order #${order.id}`}
                </h3>

                {order.status && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {order.status}
                  </span>
                )}
              </div>

              <p>
                <strong>Pharmacy:</strong>{" "}
                {pharmacies.find(
                  (pharmacy) =>
                    pharmacy.id === order.pharmacyId
                )?.pharmacyName ||
                  `Pharmacy #${order.pharmacyId}`}
              </p>

              <p>
                <strong>Prescription:</strong>{" "}
                {order.prescriptionId
                  ? `#${order.prescriptionId}`
                  : "—"}
              </p>

              {order.createdAt && (
                <p>
                  <strong>Ordered:</strong>{" "}
                  {new Date(
                    order.createdAt
                  ).toLocaleString()}
                </p>
              )}

              {![
                "COMPLETED",
                "CANCELLED",
              ].includes(order.status) && (
                <div className="mt-4">
                  <Button
                    variant="danger"
                    onClick={() =>
                      cancel(order.id)
                    }
                  >
                    Cancel Order
                  </Button>
                </div>
              )}

              {order.status === "COMPLETED" && (
                <p className="mt-3 text-sm font-medium text-green-600">
                  ✓ Order completed
                </p>
              )}

              {order.status === "CANCELLED" && (
                <p className="mt-3 text-sm font-medium text-red-600">
                  Order cancelled
                </p>
              )}
            </div>
          ))}
      </div>
    </Page>
  );
}
