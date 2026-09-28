import { useEffect, useState } from "react";
import api, { errorMessage } from "../../services/api";
import { Button, Card, Page } from "../../components/UI";

// ============================================================
// LOCAL LIST STATE
// Replaces DataList/ListState dependency
// ============================================================

function ListState({ loading, error, data, children }) {
  if (loading) {
    return (
      <Card>
        <div className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
          Loading medicine orders...
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <div className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
          No medicine orders found.
        </div>
      </Card>
    );
  }

  return <div className="space-y-4">{children}</div>;
}

export default function Orders() {
  // ============================================================
  // ORDERS
  // ============================================================

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // LOAD PHARMACY ORDERS
  // ============================================================

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/medicine-orders/pharmacy"
        );

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.content || [];

        setOrders(data);
      } catch (e) {
        setError(errorMessage(e));
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  // ============================================================
  // ORDER ACTIONS
  // ============================================================

  const actions = {
    PLACED: "accept",
    ACCEPTED: "process",
    PROCESSING: "ready",
    READY: "complete",
  };

  // ============================================================
  // ACTION LABELS
  // ============================================================

  const labels = {
    PLACED: "Accept Order",
    ACCEPTED: "Start Processing",
    PROCESSING: "Mark as Ready",
    READY: "Complete Order",
  };

  // ============================================================
  // PERFORM ORDER ACTION
  // ============================================================

  async function act(id, action) {
    try {
      await api.put(
        `/medicine-orders/${id}/${action}`
      );

      alert(
        action === "accept"
          ? "Order accepted successfully."
          : action === "process"
          ? "Order is now being processed."
          : action === "ready"
          ? "Order marked as ready."
          : "Order completed successfully."
      );

      location.reload();
    } catch (e) {
      alert(errorMessage(e));
    }
  }

  return (
    <Page
      title="Medicine Orders"
      subtitle="Manage patient medicine orders through the pharmacy workflow."
    >
      <ListState
        loading={loading}
        error={error}
        data={orders}
      >
        {orders.map((order) => {
          const action = actions[order.status];

          return (
            <Card key={order.id}>
              {/* Header */}

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Order #{order.id}
                  </h3>

                  <p className="text-sm text-slate-500">
                    Prescription #
                    {order.prescriptionId || "—"}
                  </p>
                </div>

                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                  {order.status}
                </span>
              </div>

              {/* Patient Details */}

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <h4 className="font-semibold text-slate-800">
                  Patient Details
                </h4>

                <div className="mt-2 space-y-1 text-sm text-slate-600">
                  <p>
                    <strong>Name:</strong>{" "}
                    {order.patientName ||
                      `Patient #${order.patientId}`}
                  </p>

                  {order.patientPhone && (
                    <p>
                      <strong>Phone:</strong>{" "}
                      {order.patientPhone}
                    </p>
                  )}

                  {order.patientAddress && (
                    <p>
                      <strong>Address:</strong>{" "}
                      {order.patientAddress}
                    </p>
                  )}
                </div>
              </div>

              {/* Prescription Notes */}

              {order.prescriptionNotes && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                  <h4 className="font-semibold text-slate-800">
                    Prescription Notes
                  </h4>

                  <p className="mt-2 text-sm text-slate-600">
                    {order.prescriptionNotes}
                  </p>
                </div>
              )}

              {/* Medicines */}

              <div className="mt-5">
                <h4 className="font-semibold text-slate-800">
                  Medicines to Prepare
                </h4>

                {!order.medicines ||
                order.medicines.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-500">
                    No medicine details available.
                  </p>
                ) : (
                  <div className="mt-3 space-y-3">
                    {order.medicines.map(
                      (medicine, index) => (
                        <div
                          key={
                            medicine.medicineId ||
                            index
                          }
                          className="rounded-xl border border-slate-200 bg-white p-4"
                        >
                          <p className="font-medium text-slate-800">
                            {medicine.medicineName ||
                              `Medicine #${medicine.medicineId}`}
                          </p>

                          <div className="mt-2 grid gap-1 text-sm text-slate-600">
                            <p>
                              <strong>
                                Quantity:
                              </strong>{" "}
                              {medicine.quantity ??
                                "—"}
                            </p>

                            <p>
                              <strong>
                                Dosage:
                              </strong>{" "}
                              {medicine.dosage ||
                                "—"}
                            </p>

                            <p>
                              <strong>
                                Frequency:
                              </strong>{" "}
                              {medicine.frequency ||
                                "—"}
                            </p>

                            <p>
                              <strong>
                                Duration:
                              </strong>{" "}
                              {medicine.duration ||
                                "—"}
                            </p>

                            {medicine.instructions && (
                              <p>
                                <strong>
                                  Instructions:
                                </strong>{" "}
                                {
                                  medicine.instructions
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Ordered Time */}

              {order.createdAt && (
                <p className="mt-4 text-sm text-slate-500">
                  <strong>Ordered:</strong>{" "}
                  {new Date(
                    order.createdAt
                  ).toLocaleString()}
                </p>
              )}

              {/* Action */}

              {action && (
                <div className="mt-5">
                  <Button
                    onClick={() =>
                      act(order.id, action)
                    }
                  >
                    {labels[order.status]}
                  </Button>
                </div>
              )}

              {/* Completed */}

              {order.status === "COMPLETED" && (
                <p className="mt-4 text-sm font-medium text-green-600">
                  ✓ Order completed successfully
                </p>
              )}

              {/* Cancelled */}

              {order.status === "CANCELLED" && (
                <p className="mt-4 text-sm font-medium text-red-600">
                  Order cancelled
                </p>
              )}
            </Card>
          );
        })}
      </ListState>
    </Page>
  );
}