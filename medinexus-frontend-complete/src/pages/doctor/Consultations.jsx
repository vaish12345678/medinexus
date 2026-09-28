import { useEffect, useState } from "react";
import api, { errorMessage } from "../../services/api";
import {
  Button,
  Card,
  Page,
  Textarea,
} from "../../components/UI";

export default function Consultations() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [f, setF] = useState({
    notes: "",
    diagnosisNotes: "",
  });

  const [saving, setSaving] = useState(false);

  // ============================================================
  // LOAD DOCTOR APPOINTMENTS
  // ============================================================

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/appointments/doctor");
      setAppointments(response.data || []);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // GET PATIENT NAME
  // ============================================================

  function getPatientName(appointment) {
    return (
      appointment?.patientName ||
      appointment?.patient?.name ||
      appointment?.patient?.user?.name ||
      appointment?.patient?.user?.fullName ||
      (appointment?.patientId
        ? `Patient #${appointment.patientId}`
        : "Patient")
    );
  }

  // ============================================================
  // START CONSULTATION
  // ============================================================

  function startConsultation(appointment) {
    setSelectedAppointment(appointment);

    setF({
      notes: "",
      diagnosisNotes: "",
    });
  }

  // ============================================================
  // CANCEL CONSULTATION
  // ============================================================

  function cancelConsultation() {
    setSelectedAppointment(null);

    setF({
      notes: "",
      diagnosisNotes: "",
    });
  }

  // ============================================================
  // SAVE CONSULTATION
  // ============================================================

  async function save(e) {
    e.preventDefault();

    if (!selectedAppointment) {
      alert("Please select an appointment.");
      return;
    }

    try {
      setSaving(true);

      await api.post("/consultations", {
        appointmentId: Number(selectedAppointment.id),
        notes: f.notes,
        diagnosisNotes: f.diagnosisNotes,
      });

      alert("Consultation saved successfully.");

      setSelectedAppointment(null);

      setF({
        notes: "",
        diagnosisNotes: "",
      });

      window.location.reload();
    } catch (e) {
      alert(errorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // NORMALIZE APPOINTMENTS
  // ============================================================

  const appointmentList = Array.isArray(appointments)
    ? appointments
    : [];

  // ============================================================
  // CONFIRMED APPOINTMENTS
  // ============================================================

  const confirmedAppointments = appointmentList.filter(
    (appointment) =>
      String(appointment.status || "").toUpperCase() ===
      "CONFIRMED"
  );

  // ============================================================
  // COMPLETED APPOINTMENTS
  // ============================================================

  const completedAppointments = appointmentList.filter(
    (appointment) =>
      String(appointment.status || "").toUpperCase() ===
      "COMPLETED"
  );

  return (
    <Page
      title="Consultations"
      subtitle="Start consultations for your confirmed appointments."
    >
      {/* =====================================================
          CONSULTATION FORM
      ====================================================== */}

      {selectedAppointment && (
        <Card className="max-w-3xl mx-auto shadow-md border border-slate-200/80 rounded-2xl overflow-hidden p-6 bg-white">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
              Start Consultation
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Record the consultation details for this patient.
            </p>
          </div>

          {/* =====================================================
              APPOINTMENT INFORMATION
          ====================================================== */}

          <div className="mb-8 rounded-xl border border-teal-100 bg-teal-50/50 p-5">
            <div className="grid gap-y-4 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Patient */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                  Patient
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900 truncate">
                  {getPatientName(selectedAppointment)}
                </p>
              </div>

              {/* Appointment */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                  Appointment
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  #{selectedAppointment.id}
                </p>
              </div>

              {/* Date */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                  Date
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {selectedAppointment.appointmentDate || "—"}
                </p>
              </div>

              {/* Time */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                  Time
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {selectedAppointment.appointmentTime
                    ? String(
                        selectedAppointment.appointmentTime
                      ).slice(0, 5)
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              CONSULTATION FORM
          ====================================================== */}

          <form onSubmit={save} className="space-y-6">
            <div className="space-y-4">
              <Textarea
                label="Consultation Notes"
                value={f.notes}
                onChange={(e) =>
                  setF({
                    ...f,
                    notes: e.target.value,
                  })
                }
                placeholder="Enter consultation notes..."
                rows={4}
              />

              <Textarea
                label="Diagnosis Notes"
                value={f.diagnosisNotes}
                onChange={(e) =>
                  setF({
                    ...f,
                    diagnosisNotes: e.target.value,
                  })
                }
                placeholder="Enter diagnosis details..."
                rows={4}
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="secondary"
                onClick={cancelConsultation}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Consultation"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* =====================================================
          CONFIRMED APPOINTMENTS
      ====================================================== */}

      {!selectedAppointment && (
        <div className="mt-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
              Confirmed Appointments
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Select an appointment to start the consultation.
            </p>
          </div>

          {loading && (
            <div className="py-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
              <p className="text-sm font-medium text-slate-500 animate-pulse">
                Loading appointments...
              </p>
            </div>
          )}

          {error && (
            <div className="py-6 px-4 text-center rounded-2xl border border-red-100 bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            confirmedAppointments.length === 0 && (
              <div className="py-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                <p className="text-sm text-slate-500">
                  No confirmed appointments found.
                </p>
              </div>
            )}

          {!loading && !error && confirmedAppointments.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {confirmedAppointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className="flex flex-col justify-between p-5 border border-slate-200/80 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all duration-200 bg-white"
                >
                  <div>
                    {/* Header: Name + Badge */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg leading-snug">
                          {getPatientName(appointment)}
                        </h3>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                          Patient: {getPatientName(appointment)}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
                        {appointment.status}
                      </span>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-100 my-4 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">
                          ID
                        </span>
                        <span className="font-medium text-slate-700">
                          #{appointment.id}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">
                          Date
                        </span>
                        <span className="font-medium text-slate-700">
                          {appointment.appointmentDate || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">
                          Time
                        </span>
                        <span className="font-medium text-slate-700">
                          {appointment.appointmentTime
                            ? String(
                                appointment.appointmentTime
                              ).slice(0, 5)
                            : "—"}
                        </span>
                      </div>
                    </div>

                    {/* Reason */}
                    {appointment.reason && (
                      <div className="mb-5 text-xs">
                        <span className="text-slate-400 block font-medium mb-0.5">
                          Reason for Visit
                        </span>
                        <p className="text-slate-600 line-clamp-2">
                          {appointment.reason}
                        </p>
                      </div>
                    )}
                  </div>

                  <Button
                    type="button"
                    className="w-full justify-center"
                    onClick={() => startConsultation(appointment)}
                  >
                    Start Consultation
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================
          COMPLETED APPOINTMENTS
      ====================================================== */}

      {!selectedAppointment &&
        !loading &&
        completedAppointments.length > 0 && (
          <div className="mt-12">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
                Completed Appointments
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Appointments for which the consultation has already been completed.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {completedAppointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className="p-5 border border-slate-200/60 rounded-2xl bg-slate-50/50 opacity-90 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-800 text-base">
                        {getPatientName(appointment)}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        Patient: {getPatientName(appointment)}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200/70 text-slate-600 shrink-0">
                      {appointment.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200/60 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">
                        ID
                      </span>
                      <span className="font-medium text-slate-700">
                        #{appointment.id}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">
                        Date
                      </span>
                      <span className="font-medium text-slate-700">
                        {appointment.appointmentDate || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">
                        Time
                      </span>
                      <span className="font-medium text-slate-700">
                        {appointment.appointmentTime
                          ? String(
                              appointment.appointmentTime
                            ).slice(0, 5)
                          : "—"}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
    </Page>
  );
}