
import { useEffect, useState } from "react";
import api, { errorMessage } from "../../services/api";
import { Button, Card, Page } from "../../components/UI";
import { useNavigate } from "react-router-dom";

export default function Prescriptions() {
  const navigate = useNavigate();

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [items, setItems] = useState({});
  const [loadingItems, setLoadingItems] = useState({});
  const [itemErrors, setItemErrors] = useState({});

  useEffect(() => {
    loadPrescriptions();
  }, []);

  async function loadPrescriptions() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/prescriptions/my");

      setPrescriptions(response.data || []);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!prescriptions.length) {
      setItems({});
      return;
    }

    async function loadAllItems() {
      const results = {};
      const errors = {};

      await Promise.all(
        prescriptions.map(async (prescription) => {
          try {
            const response = await api.get(
              `/prescriptions/${prescription.id}/items`
            );

            results[prescription.id] = Array.isArray(response.data)
              ? response.data
              : [];
          } catch (e) {
            errors[prescription.id] = errorMessage(e);
          }
        })
      );

      setItems(results);
      setItemErrors(errors);
    }

    loadAllItems();
  }, [prescriptions]);

  async function loadPrescriptionItems(prescriptionId) {
    try {
      setLoadingItems((prev) => ({
        ...prev,
        [prescriptionId]: true,
      }));

      setItemErrors((prev) => ({
        ...prev,
        [prescriptionId]: "",
      }));

      const response = await api.get(
        `/prescriptions/${prescriptionId}/items`
      );

      setItems((prev) => ({
        ...prev,
        [prescriptionId]: Array.isArray(response.data)
          ? response.data
          : [],
      }));
    } catch (e) {
      setItemErrors((prev) => ({
        ...prev,
        [prescriptionId]: errorMessage(e),
      }));
    } finally {
      setLoadingItems((prev) => ({
        ...prev,
        [prescriptionId]: false,
      }));
    }
  }

  return (
    <Page
      title="My Prescriptions"
      subtitle="Prescriptions created by doctors after consultations."
    >
      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          Loading prescriptions...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && prescriptions.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">
          No prescriptions found.
        </div>
      )}

      {!loading && !error && prescriptions.length > 0 && (
        <div className="space-y-5">
          {prescriptions.map((prescription) => {
            const prescriptionItems =
              items[prescription.id] || [];

            return (
              <Card key={prescription.id}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      Prescription #{prescription.id}
                    </h3>

                    <p className="text-sm text-slate-500">
                      Consultation #{prescription.consultationId}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700">
                    Doctor's Notes
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {prescription.notes || "No notes added."}
                  </p>
                </div>

                <div className="mt-5">
                  <h4 className="font-semibold text-slate-800">
                    Prescribed Medicines
                  </h4>

                  {loadingItems[prescription.id] ? (
                    <p className="mt-3 text-sm text-slate-500">
                      Loading medicines...
                    </p>
                  ) : itemErrors[prescription.id] ? (
                    <div className="mt-3">
                      <p className="text-sm text-red-600">
                        {itemErrors[prescription.id]}
                      </p>

                      <Button
                        className="mt-2"
                        onClick={() =>
                          loadPrescriptionItems(prescription.id)
                        }
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : prescriptionItems.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-500">
                      No medicines were prescribed.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {prescriptionItems.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-slate-200 bg-white p-4"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="font-semibold text-slate-900">
                                {item.medicineName || "Medicine"}
                              </p>

                              <p className="mt-1 text-sm text-slate-600">
                                Dosage: {item.dosage || "—"}
                              </p>

                              <p className="text-sm text-slate-600">
                                Frequency: {item.frequency || "—"}
                              </p>

                              <p className="text-sm text-slate-600">
                                Duration: {item.duration || "—"}
                              </p>

                              <p className="text-sm text-slate-600">
                                Quantity: {item.quantity ?? "—"}
                              </p>

                              {item.instructions && (
                                <p className="mt-2 text-sm text-slate-600">
                                  Instructions: {item.instructions}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {prescriptionItems.length > 0 && (
                  <div className="mt-5">
                    <Button
                      onClick={() =>
                        navigate("/patient/choose-pharmacy", {
                          state: {
                            prescriptionId: prescription.id,
                          },
                        })
                      }
                    >
                      Order Medicines
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </Page>
  );
}
