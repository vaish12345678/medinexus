
import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Stethoscope,
  XCircle,
} from "lucide-react";
import api, { errorMessage } from "../../services/api";
import {
  Button,
  Page,
} from "../../components/UI";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [f, setF] = useState({
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/appointments/my");

      setAppointments(response.data || []);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function create(e) {
    e.preventDefault();

    setMsg("");

    if (!f.doctorId) {
      setMsg("Please enter a doctor ID.");
      setMsgType("error");
      return;
    }

    if (!f.appointmentDate) {
      setMsg("Please select an appointment date.");
      setMsgType("error");
      return;
    }

    if (!f.appointmentTime) {
      setMsg("Please select an appointment time.");
      setMsgType("error");
      return;
    }

    try {
      setSaving(true);

      await api.post("/appointments", {
        doctorId: Number(f.doctorId),
        appointmentDate: f.appointmentDate,
        appointmentTime: f.appointmentTime,
      });

      setMsg(
        "Appointment requested successfully. You can track its status below."
      );
      setMsgType("success");

      setF({
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
      });

      await loadAppointments();
    } catch (e) {
      setMsg(errorMessage(e));
      setMsgType("error");
    } finally {
      setSaving(false);
    }
  }

  async function cancel(id) {
    if (
      !window.confirm(
        "Are you sure you want to cancel this appointment?"
      )
    ) {
      return;
    }

    try {
      await api.put(`/appointments/${id}/cancel`);

      alert("Appointment cancelled successfully.");

      await loadAppointments();
    } catch (e) {
      alert(errorMessage(e));
    }
  }

  return (
    <Page
      title="My Appointments"
      subtitle="View your appointments and keep track of your consultations."
    >
      {/* Appointment List */}
      <div className="mt-7">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50">
            <CalendarDays
              size={22}
              className="text-teal-600"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Your Appointments
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View appointment details and current status.
            </p>
          </div>
        </div>

        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            Loading appointments...
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && appointments.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">
            No appointments found.
          </div>
        )}

        {!loading && !error && appointments.length > 0 && (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Appointment #{appointment.id}
                    </h2>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {appointment.status}
                  </span>
                </div>

                {/* Appointment Details */}
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                      <Stethoscope size={15} />
                      Doctor
                    </div>

                    <p className="mt-1.5 text-sm font-semibold text-slate-800">
                      Dr.{" "}
                      {appointment.doctorName ||
                        `Doctor #${appointment.doctorId}`}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                      <CalendarDays size={15} />
                      Date
                    </div>

                    <p className="mt-1.5 text-sm font-semibold text-slate-800">
                      {appointment.appointmentDate}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                      <Clock3 size={15} />
                      Time
                    </div>

                    <p className="mt-1.5 text-sm font-semibold text-slate-800">
                      {appointment.appointmentTime}
                    </p>
                  </div>
                </div>

                {/* Requested */}
                {appointment.status === "REQUESTED" && (
                  <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                    <Clock3
                      size={19}
                      className="mt-0.5 shrink-0 text-amber-600"
                    />

                    <div>
                      <p className="text-sm font-semibold text-amber-800">
                        Waiting for confirmation
                      </p>

                      <p className="mt-0.5 text-xs leading-5 text-amber-700">
                        Your appointment request is waiting for the
                        doctor to confirm.
                      </p>
                    </div>
                  </div>
                )}

                {/* Confirmed */}
                {appointment.status === "CONFIRMED" && (
                  <div className="mt-4 flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 px-4 py-3">
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-green-600"
                    />

                    <div>
                      <p className="text-sm font-semibold text-green-800">
                        Appointment confirmed
                      </p>

                      <p className="mt-0.5 text-xs leading-5 text-green-700">
                        Your doctor has confirmed this appointment.
                      </p>
                    </div>
                  </div>
                )}

                {/* Completed */}
                {appointment.status === "COMPLETED" && (
                  <div className="mt-4 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <div>
                      <p className="text-sm font-semibold text-blue-800">
                        Consultation completed
                      </p>

                      <p className="mt-0.5 text-xs leading-5 text-blue-700">
                        This appointment has been completed.
                      </p>
                    </div>
                  </div>
                )}

                {/* Cancelled */}
                {appointment.status === "CANCELLED" && (
                  <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                    <XCircle
                      size={19}
                      className="mt-0.5 shrink-0 text-red-600"
                    />

                    <div>
                      <p className="text-sm font-semibold text-red-800">
                        Appointment cancelled
                      </p>

                      <p className="mt-0.5 text-xs leading-5 text-red-700">
                        This appointment is no longer active.
                      </p>
                    </div>
                  </div>
                )}

                {/* Cancel Button */}
                {!["CANCELLED", "COMPLETED"].includes(
                  appointment.status
                ) && (
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <Button
                      variant="danger"
                      onClick={() => cancel(appointment.id)}
                    >
                      <span className="flex items-center gap-2">
                        <XCircle size={17} />
                        Cancel Appointment
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}
