import { useEffect, useState } from "react";
import api, { errorMessage } from "../../services/api";
import {
  Button,
  Card,
  Input,
  Page,
  Textarea,
} from "../../components/UI";

// ============================================================
// LOCAL LIST STATE
// Replaces DataList/ListState dependency
// ============================================================

function ListState({ loading, error, data, children }) {
  if (loading) {
    return (
      <Card>
        <div className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
          Loading consultations...
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
          No completed consultations found.
        </div>
      </Card>
    );
  }

  return <div className="space-y-4">{children}</div>;
}

// ============================================================
// LOCAL RECORD CARD
// Replaces DataList/RecordCard dependency
// ============================================================

function RecordCard({ title, actions, children }) {
  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-slate-900">
            {title}
          </h3>

          <div className="mt-3 space-y-2 text-sm text-slate-600">
            {children}
          </div>
        </div>

        {actions && (
          <div className="shrink-0">
            {actions}
          </div>
        )}
      </div>
    </Card>
  );
}

export default function Prescriptions() {
  // ============================================================
  // DOCTOR'S CONSULTATIONS
  // ============================================================

  const [consultations, setConsultations] = useState([]);
  const [consultationsLoading, setConsultationsLoading] =
    useState(true);
  const [consultationsError, setConsultationsError] =
    useState("");

  // ============================================================
  // LOAD DOCTOR'S CONSULTATIONS
  // ============================================================

  useEffect(() => {
    async function loadConsultations() {
      try {
        setConsultationsLoading(true);
        setConsultationsError("");

        const response = await api.get(
          "/consultations/doctor"
        );

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.content || [];

        setConsultations(data);
      } catch (e) {
        setConsultationsError(errorMessage(e));
      } finally {
        setConsultationsLoading(false);
      }
    }

    loadConsultations();
  }, []);

  // ============================================================
  // MEDICINES
  // ============================================================

  const [medicines, setMedicines] = useState([]);
  const [medicinesLoading, setMedicinesLoading] = useState(true);
  const [medicinesError, setMedicinesError] = useState("");

  // ============================================================
  // SELECTED CONSULTATION
  // ============================================================

  const [selectedConsultation, setSelectedConsultation] =
    useState(null);

  // ============================================================
  // CREATED / EXISTING PRESCRIPTION
  // ============================================================

  const [createdPrescription, setCreatedPrescription] =
    useState(null);

  const [prescriptionLoading, setPrescriptionLoading] =
    useState(false);

  // ============================================================
  // PRESCRIPTION ITEMS
  // ============================================================

  const [prescriptionItems, setPrescriptionItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  // ============================================================
  // PRESCRIPTION FORM
  // ============================================================

  const [prescriptionNotes, setPrescriptionNotes] =
    useState("");

  // ============================================================
  // MEDICINE FORM
  // ============================================================

  const [item, setItem] = useState({
    medicineId: "",
    dosage: "",
    frequency: "",
    duration: "",
    quantity: "",
    instructions: "",
  });

  const [savingPrescription, setSavingPrescription] =
    useState(false);

  const [addingMedicine, setAddingMedicine] =
    useState(false);

  // ============================================================
  // LOAD MEDICINES
  // ============================================================

  useEffect(() => {
    async function loadMedicines() {
      try {
        setMedicinesLoading(true);
        setMedicinesError("");

        const response = await api.get("/medicines");

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.content || [];

        setMedicines(data);
      } catch (e) {
        setMedicinesError(errorMessage(e));
      } finally {
        setMedicinesLoading(false);
      }
    }

    loadMedicines();
  }, []);

  // ============================================================
  // LOAD PRESCRIPTION
  // ============================================================

  async function loadPrescription(prescriptionId) {
    try {
      setPrescriptionLoading(true);

      const response = await api.get(
        `/prescriptions/${prescriptionId}`
      );

      const prescription = response.data;

      setCreatedPrescription(prescription);

      setPrescriptionNotes(
        prescription?.notes || ""
      );

      await loadPrescriptionItems(prescriptionId);
    } catch (e) {
      alert(errorMessage(e));
    } finally {
      setPrescriptionLoading(false);
    }
  }

  // ============================================================
  // LOAD PRESCRIPTION ITEMS
  // ============================================================

  async function loadPrescriptionItems(prescriptionId) {
    try {
      setItemsLoading(true);

      const response = await api.get(
        `/prescriptions/${prescriptionId}/items`
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.content || [];

      setPrescriptionItems(data);
    } catch (e) {
      alert(errorMessage(e));
    } finally {
      setItemsLoading(false);
    }
  }

  // ============================================================
  // GET MEDICINE NAME
  // ============================================================

  function getMedicineName(medicineId) {
    const medicine = medicines.find(
      (x) => Number(x.id) === Number(medicineId)
    );

    if (!medicine) {
      return `Medicine #${medicineId}`;
    }

    return medicine.name || `Medicine #${medicineId}`;
  }

  // ============================================================
  // GET PATIENT NAME
  // ============================================================

  function getPatientName(consultation) {
    return (
      consultation?.patientName ||
      consultation?.patient?.name ||
      consultation?.patient?.user?.name ||
      consultation?.patient?.user?.fullName ||
      (consultation?.patientId
        ? `Patient #${consultation.patientId}`
        : "Patient")
    );
  }

  // ============================================================
  // CHECK WHETHER PRESCRIPTION EXISTS
  // ============================================================

  function hasPrescription(consultation) {
    return Boolean(
      consultation?.prescriptionId
    );
  }

  // ============================================================
  // SELECT CONSULTATION
  // ============================================================

  async function selectConsultation(consultation) {
    setSelectedConsultation(consultation);

    setCreatedPrescription(null);
    setPrescriptionItems([]);
    setPrescriptionNotes("");

    setItem({
      medicineId: "",
      dosage: "",
      frequency: "",
      duration: "",
      quantity: "",
      instructions: "",
    });

    // ----------------------------------------------------------
    // Existing prescription
    // ----------------------------------------------------------

    if (consultation?.prescriptionId) {
      await loadPrescription(
        consultation.prescriptionId
      );
    }
  }

  // ============================================================
  // CANCEL
  // ============================================================

  function cancelPrescription() {
    setSelectedConsultation(null);
    setCreatedPrescription(null);
    setPrescriptionItems([]);
    setPrescriptionNotes("");

    setItem({
      medicineId: "",
      dosage: "",
      frequency: "",
      duration: "",
      quantity: "",
      instructions: "",
    });
  }

  // ============================================================
  // CREATE PRESCRIPTION
  // ============================================================

  async function createPrescription(e) {
    e.preventDefault();

    if (!selectedConsultation) {
      alert("Please select a consultation.");
      return;
    }

    // Prevent duplicate creation from frontend
    if (selectedConsultation.prescriptionId) {
      alert(
        "A prescription already exists for this consultation."
      );

      await loadPrescription(
        selectedConsultation.prescriptionId
      );

      return;
    }

    try {
      setSavingPrescription(true);

      const response = await api.post("/prescriptions", {
        consultationId: Number(
          selectedConsultation.id
        ),
        notes: prescriptionNotes,
      });

      setCreatedPrescription(response.data);

      setPrescriptionItems([]);

      alert(
        `Prescription #${response.data.id} created successfully.`
      );
    } catch (e) {
      alert(errorMessage(e));
    } finally {
      setSavingPrescription(false);
    }
  }

  // ============================================================
  // ADD MEDICINE
  // ============================================================

  async function addMedicine(e) {
    e.preventDefault();

    if (!createdPrescription) {
      alert("Please create the prescription first.");
      return;
    }

    if (!item.medicineId) {
      alert("Please select a medicine.");
      return;
    }

    if (!item.quantity || Number(item.quantity) <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    try {
      setAddingMedicine(true);

      await api.post("/prescriptions/items", {
        prescriptionId: Number(
          createdPrescription.id
        ),
        medicineId: Number(item.medicineId),
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        quantity: Number(item.quantity),
        instructions: item.instructions,
      });

      alert("Medicine added to prescription.");

      // Clear medicine form
      setItem({
        medicineId: "",
        dosage: "",
        frequency: "",
        duration: "",
        quantity: "",
        instructions: "",
      });

      // Reload prescription items
      await loadPrescriptionItems(
        createdPrescription.id
      );
    } catch (e) {
      alert(errorMessage(e));
    } finally {
      setAddingMedicine(false);
    }
  }

  // ============================================================
  // FINISH PRESCRIPTION
  // ============================================================

  function finishPrescription() {
    if (
      !createdPrescription ||
      prescriptionItems.length === 0
    ) {
      alert(
        "Please add at least one medicine before finishing the prescription."
      );
      return;
    }

    alert(
      `Prescription #${createdPrescription.id} completed successfully.`
    );

    cancelPrescription();
  }

  const consultationList = Array.isArray(consultations)
    ? consultations
    : [];

  return (
    <Page
      title="Prescriptions"
      subtitle="Create and manage prescriptions for completed consultations."
    >
      {/* ======================================================
          SELECTED CONSULTATION
      ======================================================= */}

      {selectedConsultation && (
        <div className="space-y-5">

          {/* ==================================================
              CONSULTATION DETAILS
          =================================================== */}

          <Card>
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900">
                {hasPrescription(selectedConsultation)
                  ? "Existing Prescription"
                  : "Selected Consultation"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {hasPrescription(selectedConsultation)
                  ? "Review the existing prescription and add medicines if required."
                  : "Create a prescription for this completed consultation."}
              </p>
            </div>

            <div className="grid gap-4 rounded-xl border border-teal-100 bg-teal-50 p-4 sm:grid-cols-2">

              {/* Patient */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-teal-600">
                  Patient
                </p>

                <p className="mt-1 text-base font-bold text-slate-900">
                  {getPatientName(
                    selectedConsultation
                  )}
                </p>
              </div>

              {/* Consultation */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-teal-600">
                  Consultation
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  #{selectedConsultation.id}
                </p>
              </div>

              {/* Appointment */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-teal-600">
                  Appointment
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  #{selectedConsultation.appointmentId}
                </p>
              </div>

              {/* Prescription */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-teal-600">
                  Prescription
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {createdPrescription
                    ? `#${createdPrescription.id}`
                    : hasPrescription(
                        selectedConsultation
                      )
                    ? `#${selectedConsultation.prescriptionId}`
                    : "Not created"}
                </p>
              </div>

              {/* Consultation Notes */}

              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-teal-600">
                  Consultation Notes
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {selectedConsultation.notes ||
                    "No consultation notes added."}
                </p>
              </div>

              {/* Diagnosis */}

              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-teal-600">
                  Diagnosis
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {selectedConsultation.diagnosisNotes ||
                    "No diagnosis notes added."}
                </p>
              </div>
            </div>
          </Card>

          {/* ==================================================
              LOADING EXISTING PRESCRIPTION
          =================================================== */}

          {prescriptionLoading && (
            <Card>
              <div className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
                Loading existing prescription...
              </div>
            </Card>
          )}

          {/* ==================================================
              CREATE PRESCRIPTION
          =================================================== */}

          {!createdPrescription &&
            !prescriptionLoading &&
            !hasPrescription(selectedConsultation) && (
              <Card>
                <h2 className="text-lg font-bold text-slate-900">
                  Create Prescription
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add general prescription notes.
                </p>

                <form
                  onSubmit={createPrescription}
                  className="mt-5 space-y-4"
                >
                  <Textarea
                    label="Prescription Notes"
                    value={prescriptionNotes}
                    onChange={(e) =>
                      setPrescriptionNotes(
                        e.target.value
                      )
                    }
                    placeholder="Enter general prescription instructions..."
                  />

                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={cancelPrescription}
                      disabled={savingPrescription}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      disabled={savingPrescription}
                    >
                      {savingPrescription
                        ? "Creating..."
                        : "Create Prescription"}
                    </Button>
                  </div>
                </form>
              </Card>
            )}

          {/* ==================================================
              PRESCRIPTION
          =================================================== */}

          {createdPrescription && (
            <Card>
              <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-green-600">
                  Prescription Ready
                </p>

                <p className="mt-1 text-lg font-bold text-green-800">
                  Prescription #
                  {createdPrescription.id}
                </p>

                <p className="mt-1 text-sm text-green-700">
                  Patient:{" "}
                  {getPatientName(
                    selectedConsultation
                  )}
                </p>

                <p className="mt-1 text-sm text-green-700">
                  Consultation #
                  {createdPrescription.consultationId}
                </p>

                {createdPrescription.notes && (
                  <p className="mt-3 text-sm text-green-800">
                    {createdPrescription.notes}
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* ==================================================
              ADD MEDICINE
          =================================================== */}

          {createdPrescription && (
            <Card>
              <h2 className="text-lg font-bold text-slate-900">
                Add Medicine
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add one or more medicines to this prescription.
              </p>

              {medicinesError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {medicinesError}
                </div>
              )}

              <form
                onSubmit={addMedicine}
                className="mt-5 grid gap-4 sm:grid-cols-2"
              >
                {/* Medicine */}

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Medicine
                  </label>

                  <select
                    value={item.medicineId}
                    onChange={(e) =>
                      setItem({
                        ...item,
                        medicineId:
                          e.target.value,
                      })
                    }
                    required
                    disabled={medicinesLoading}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="">
                      {medicinesLoading
                        ? "Loading medicines..."
                        : "Select medicine"}
                    </option>

                    {medicines.map((medicine) => (
                      <option
                        key={medicine.id}
                        value={medicine.id}
                      >
                        {medicine.name}
                        {medicine.genericName
                          ? ` - ${medicine.genericName}`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dosage */}

                <Input
                  label="Dosage"
                  value={item.dosage}
                  onChange={(e) =>
                    setItem({
                      ...item,
                      dosage: e.target.value,
                    })
                  }
                  placeholder="e.g. 1 tablet"
                  required
                />

                {/* Frequency */}

                <Input
                  label="Frequency"
                  value={item.frequency}
                  onChange={(e) =>
                    setItem({
                      ...item,
                      frequency: e.target.value,
                    })
                  }
                  placeholder="e.g. Twice daily"
                  required
                />

                {/* Duration */}

                <Input
                  label="Duration"
                  value={item.duration}
                  onChange={(e) =>
                    setItem({
                      ...item,
                      duration: e.target.value,
                    })
                  }
                  placeholder="e.g. 5 days"
                  required
                />

                {/* Quantity */}

                <Input
                  label="Quantity"
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    setItem({
                      ...item,
                      quantity: e.target.value,
                    })
                  }
                  placeholder="e.g. 10"
                  required
                />

                {/* Instructions */}

                <div className="sm:col-span-2">
                  <Textarea
                    label="Instructions"
                    value={item.instructions}
                    onChange={(e) =>
                      setItem({
                        ...item,
                        instructions:
                          e.target.value,
                      })
                    }
                    placeholder="e.g. Take after food"
                  />
                </div>

                <div className="flex justify-end sm:col-span-2">
                  <Button
                    type="submit"
                    disabled={
                      addingMedicine ||
                      medicinesLoading
                    }
                  >
                    {addingMedicine
                      ? "Adding..."
                      : "Add Medicine"}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* ==================================================
              ADDED MEDICINES
          =================================================== */}

          {createdPrescription && (
            <Card>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Prescription Medicines
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Medicines already added to this prescription.
                  </p>
                </div>

                <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
                  {prescriptionItems.length} item
                  {prescriptionItems.length !== 1
                    ? "s"
                    : ""}
                </span>
              </div>

              {itemsLoading ? (
                <div className="mt-5 rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
                  Loading prescription items...
                </div>
              ) : prescriptionItems.length === 0 ? (
                <div className="mt-5 rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
                  No medicines added yet.
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {prescriptionItems.map(
                    (prescriptionItem, index) => (
                      <div
                        key={prescriptionItem.id}
                        className="rounded-xl border border-slate-200 bg-white p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {index + 1}.{" "}
                              {prescriptionItem.medicineName ||
                                getMedicineName(
                                  prescriptionItem.medicineId
                                )}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              Medicine ID:{" "}
                              {prescriptionItem.medicineId}
                            </p>
                          </div>

                          <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                            Qty:{" "}
                            {prescriptionItem.quantity}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                          <div>
                            <p className="text-xs text-slate-400">
                              Dosage
                            </p>

                            <p className="font-medium text-slate-700">
                              {prescriptionItem.dosage ||
                                "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">
                              Frequency
                            </p>

                            <p className="font-medium text-slate-700">
                              {prescriptionItem.frequency ||
                                "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">
                              Duration
                            </p>

                            <p className="font-medium text-slate-700">
                              {prescriptionItem.duration ||
                                "—"}
                            </p>
                          </div>
                        </div>

                        {prescriptionItem.instructions && (
                          <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                            <span className="font-medium">
                              Instructions:
                            </span>{" "}
                            {prescriptionItem.instructions}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Finish */}

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={cancelPrescription}
                >
                  Close
                </Button>

                <Button
                  type="button"
                  onClick={finishPrescription}
                  disabled={
                    prescriptionItems.length === 0
                  }
                >
                  Finish Prescription
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ======================================================
          COMPLETED CONSULTATIONS
      ======================================================= */}

      {!selectedConsultation && (
        <div className="mt-6">
          <h2 className="mb-1 text-lg font-bold text-slate-900">
            Completed Consultations
          </h2>

          <p className="mb-4 text-sm text-slate-500">
            Create or manage prescriptions for completed consultations.
          </p>

          <ListState
            loading={consultationsLoading}
            error={consultationsError}
            data={consultationList}
          >
            {consultationList.map((consultation) => {
              const existingPrescription =
                hasPrescription(consultation);

              return (
                <RecordCard
                  key={consultation.id}
                  title={getPatientName(consultation)}
                  actions={
                    <Button
                      type="button"
                      onClick={() =>
                        selectConsultation(
                          consultation
                        )
                      }
                    >
                      {existingPrescription
                        ? "View / Edit Prescription"
                        : "Create Prescription"}
                    </Button>
                  }
                >
                  {/* Patient */}

                  <p className="font-medium text-slate-700">
                    Patient:{" "}
                    {getPatientName(consultation)}
                  </p>

                  {/* Consultation */}

                  <p>
                    Consultation #
                    {consultation.id}
                  </p>

                  {/* Appointment */}

                  <p>
                    Appointment #
                    {consultation.appointmentId}
                  </p>

                  {/* Prescription Status */}

                  <p>
                    <span className="font-medium">
                      Prescription:
                    </span>{" "}
                    {existingPrescription
                      ? `#${consultation.prescriptionId}`
                      : "Not created"}
                  </p>

                  {/* Notes */}

                  <p>
                    {consultation.notes ||
                      "No consultation notes."}
                  </p>

                  {/* Diagnosis */}

                  <p>
                    <span className="font-medium">
                      Diagnosis:
                    </span>{" "}
                    {consultation.diagnosisNotes ||
                      "No diagnosis notes."}
                  </p>

                  {/* Created */}

                  {consultation.createdAt && (
                    <p>
                      Created:{" "}
                      {new Date(
                        consultation.createdAt
                      ).toLocaleString()}
                    </p>
                  )}
                </RecordCard>
              );
            })}
          </ListState>
        </div>
      )}
    </Page>
  );
}