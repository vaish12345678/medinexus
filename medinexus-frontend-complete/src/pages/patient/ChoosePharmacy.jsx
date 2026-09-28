import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api, { errorMessage } from "../../services/api";
import { Button, Card, Page } from "../../components/UI";

export default function ChoosePharmacy() {
  const navigate = useNavigate();
  const location = useLocation();

  const prescriptionId =
    location.state?.prescriptionId;

  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPharmacy, setSelectedPharmacy] =
    useState("");

  const [ordering, setOrdering] = useState(false);

  // ============================================================
  // LOAD VERIFIED PHARMACIES
  // ============================================================

  async function loadPharmacies() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/pharmacies/verified"
      );

      const result = response.data;

      const pharmacyList = Array.isArray(result)
        ? result
        : result?.content ||
          result?.data ||
          [];

      setPharmacies(pharmacyList);
    } catch (e) {
      setError(errorMessage(e));
      setPharmacies([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPharmacies();
  }, []);

  // ============================================================
  // PLACE ORDER
  // ============================================================

  async function placeOrder() {
    if (!prescriptionId) {
      alert("Prescription information is missing.");
      return;
    }

    if (!selectedPharmacy) {
      alert("Please select a pharmacy.");
      return;
    }

    try {
      setOrdering(true);

      await api.post("/medicine-orders", {
        pharmacyId: Number(selectedPharmacy),
        prescriptionId: Number(prescriptionId),
      });

      alert("Medicine order placed successfully.");

      navigate("/patient/orders");
    } catch (e) {
      alert(errorMessage(e));
    } finally {
      setOrdering(false);
    }
  }

  return (
    <Page
      title="Choose Pharmacy"
      subtitle="Select a verified pharmacy for your prescription."
    >
      {/* ========================================================
          LOADING
      ======================================================== */}

      {loading && (
        <Card>
          <div className="flex items-center justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-teal-700" />

            <span className="ml-3 text-sm text-slate-600">
              Loading verified pharmacies...
            </span>
          </div>
        </Card>
      )}

      {/* ========================================================
          ERROR
      ======================================================== */}

      {!loading && error && (
        <Card>
          <div className="py-8 text-center">
            <p className="text-sm text-red-600">
              {error}
            </p>

            <Button
              className="mt-4"
              onClick={loadPharmacies}
            >
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* ========================================================
          EMPTY STATE
      ======================================================== */}

      {!loading &&
        !error &&
        pharmacies.length === 0 && (
          <Card>
            <div className="py-10 text-center">
              <p className="text-sm text-slate-500">
                No verified pharmacies are currently
                available.
              </p>
            </div>
          </Card>
        )}

      {/* ========================================================
          PHARMACY LIST
      ======================================================== */}

      {!loading &&
        !error &&
        pharmacies.length > 0 && (
          <div className="grid gap-5">
            {pharmacies.map((pharmacy) => (
              <Card key={pharmacy.id}>
                {/* HEADER */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {pharmacy.pharmacyName}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Verified Pharmacy
                    </p>
                  </div>

                  <span className="inline-flex w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                    {pharmacy.verificationStatus ||
                      "VERIFIED"}
                  </span>
                </div>

                {/* ADDRESS */}
                <div className="mt-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Address
                  </p>

                  <p className="mt-1 text-sm text-slate-800">
                    {pharmacy.address ||
                      "Not provided"}
                  </p>
                </div>

                {/* SELECT */}
                <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-teal-400 hover:bg-teal-50">
                  <input
                    type="radio"
                    name="pharmacy"
                    value={pharmacy.id}
                    checked={
                      selectedPharmacy ===
                      String(pharmacy.id)
                    }
                    onChange={(e) =>
                      setSelectedPharmacy(
                        e.target.value
                      )
                    }
                    className="h-4 w-4"
                  />

                  <span className="text-sm font-medium text-slate-700">
                    Select this pharmacy
                  </span>
                </label>
              </Card>
            ))}
          </div>
        )}

      {/* ========================================================
          CONFIRM ORDER
      ======================================================== */}

      {!loading &&
        !error &&
        pharmacies.length > 0 && (
          <div className="mt-6 flex justify-end">
            <Button
              onClick={placeOrder}
              disabled={
                ordering || !selectedPharmacy
              }
            >
              {ordering
                ? "Placing Order..."
                : "Confirm Order"}
            </Button>
          </div>
        )}
    </Page>
  );
}