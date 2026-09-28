import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import api, { errorMessage } from "../../services/api";

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bookedAppointment, setBookedAppointment] = useState(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);

  // ------------------------------------------------------------
  // Load doctor's availability
  // ------------------------------------------------------------
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/doctors/availability/${doctorId}`
        );

        setAvailability(response.data || []);
      } catch (err) {
        console.error("Availability error:", err);
        setError(errorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadAvailability();
  }, [doctorId]);

  // ------------------------------------------------------------
  // Get day name
  // ------------------------------------------------------------
  const getDayName = (date) => {
    const days = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];

    return days[
      new Date(`${date}T00:00:00`).getDay()
    ];
  };

  // ------------------------------------------------------------
  // Generate 30-minute slots
  // ------------------------------------------------------------
  const generateSlots = (startTime, endTime) => {
    const slots = [];

    const [startHour, startMinute] = startTime
      .split(":")
      .map(Number);

    const [endHour, endMinute] = endTime
      .split(":")
      .map(Number);

    let currentMinutes =
      startHour * 60 + startMinute;

    const endMinutes =
      endHour * 60 + endMinute;

    while (currentMinutes + 30 <= endMinutes) {
      const nextMinutes = currentMinutes + 30;

      const startHourValue = Math.floor(
        currentMinutes / 60
      );

      const startMinuteValue =
        currentMinutes % 60;

      const endHourValue = Math.floor(
        nextMinutes / 60
      );

      const endMinuteValue =
        nextMinutes % 60;

      const formattedStart =
        `${String(startHourValue).padStart(2, "0")}:${String(
          startMinuteValue
        ).padStart(2, "0")}`;

      const formattedEnd =
        `${String(endHourValue).padStart(2, "0")}:${String(
          endMinuteValue
        ).padStart(2, "0")}`;

      slots.push({
        id: `${formattedStart}-${formattedEnd}`,
        startTime: formattedStart,
        endTime: formattedEnd,
      });

      currentMinutes = nextMinutes;
    }

    return slots;
  };

  // ------------------------------------------------------------
  // Availability for selected date
  // ------------------------------------------------------------
  const availableForSelectedDate = selectedDate
    ? availability.filter(
        (item) =>
          item.dayOfWeek === getDayName(selectedDate) &&
          item.active
      )
    : [];

  // ------------------------------------------------------------
  // Generate appointment slots
  // ------------------------------------------------------------
  const appointmentSlots =
    availableForSelectedDate.flatMap((item) =>
      generateSlots(
        item.startTime,
        item.endTime
      )
    );

  // ------------------------------------------------------------
  // Date change
  // ------------------------------------------------------------
  const handleDateChange = (event) => {
    setError("");
    setSuccess("");
    setBookedAppointment(null);

    setSelectedDate(event.target.value);
    setSelectedSlot(null);
  };

  // ------------------------------------------------------------
  // Book appointment
  // ------------------------------------------------------------
  const handleBook = async () => {
    setError("");
    setSuccess("");
    setBookedAppointment(null);

    if (!selectedDate || !selectedSlot) {
      setError(
        "Please select a date and appointment time."
      );
      return;
    }

    try {
      setBooking(true);

      const response = await api.post("/appointments", {
        doctorId: Number(doctorId),
        appointmentDate: selectedDate,
        appointmentTime: selectedSlot.startTime,
        reason: "",
      });

      // Backend response
      console.log(
        "Appointment created successfully:",
        response.data
      );

      // Store returned appointment
      setBookedAppointment(response.data);

      // Show success message
      setSuccess(
        "Appointment booked successfully!"
      );

      // Clear selected slot
      setSelectedSlot(null);
    } catch (err) {
      console.error(
        "Appointment booking error:",
        err
      );

      /*
       * Your GlobalExceptionHandler returns:
       *
       * {
       *   status: 400,
       *   error: "Bad Request",
       *   message: "...",
       *   errors: {...}
       * }
       */

      const backendMessage =
        err.response?.data?.message;

      const validationErrors =
        err.response?.data?.errors;

      if (
        validationErrors &&
        typeof validationErrors === "object"
      ) {
        const messages = Object.values(
          validationErrors
        );

        setError(
          messages.length > 0
            ? messages.join(" ")
            : backendMessage ||
                errorMessage(err)
        );
      } else {
        setError(
          backendMessage ||
            errorMessage(err) ||
            "Unable to book appointment."
        );
      }
    } finally {
      setBooking(false);
    }
  };

  // ------------------------------------------------------------
  // Loading
  // ------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-teal-600">
          <Loader2
            className="animate-spin"
            size={22}
          />

          Loading doctor's availability...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Book Appointment
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Select a date and an available 30-minute appointment slot.
          </p>
        </div>
      </div>

      {/* -------------------------------------------------------
          SUCCESS MESSAGE
      ------------------------------------------------------- */}
      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
              <CheckCircle2 size={22} />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-emerald-800">
                {success}
              </h3>

              <p className="mt-1 text-sm text-emerald-700">
                Your appointment request has been created and is
                now available in your appointments.
              </p>

              {bookedAppointment && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-white p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-slate-500">
                        Appointment Date
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {bookedAppointment.appointmentDate ||
                          selectedDate}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Appointment Time
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {bookedAppointment.appointmentTime ||
                          "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Status
                      </p>

                      <p className="mt-1 font-semibold text-amber-600">
                        {bookedAppointment.status ||
                          "REQUESTED"}
                      </p>
                    </div>

                    {bookedAppointment.id && (
                      <div>
                        <p className="text-xs text-slate-500">
                          Appointment ID
                        </p>

                        <p className="mt-1 font-semibold text-slate-800">
                          #{bookedAppointment.id}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  navigate("/patient/appointments")
                }
                className="mt-4 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                View My Appointments
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------
          ERROR MESSAGE
      ------------------------------------------------------- */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <svg
            className="mt-0.5 h-5 w-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M12 9v3m0 4h.01M10.3 4.9 3.5 17a2 2 0 0 0 1.7 3h13.6a2 2 0 0 0 1.7-3L13.7 4.9a2 2 0 0 0-3.4 0Z"
            />
          </svg>

          <span>{error}</span>
        </div>
      )}

      {/* No availability */}
      {!error &&
        !success &&
        availability.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <Calendar
              size={40}
              className="mx-auto mb-3 text-slate-400"
            />

            <h2 className="font-semibold text-slate-800">
              No availability added
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              This doctor has not added any available timings yet.
            </p>
          </div>
        )}

      {/* Booking section */}
      {!success && availability.length > 0 && (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Date */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-teal-50 p-3 text-teal-600">
                  <Calendar size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Select Date
                  </h2>

                  <p className="text-sm text-slate-500">
                    Choose your appointment date
                  </p>
                </div>
              </div>

              <input
                type="date"
                value={selectedDate}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={handleDateChange}
                disabled={booking}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
              />

              {selectedDate &&
                availableForSelectedDate.length === 0 && (
                  <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
                    This doctor is not available on this day.
                  </p>
                )}
            </div>

            {/* Time */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-teal-50 p-3 text-teal-600">
                  <Clock size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Available Time
                  </h2>

                  <p className="text-sm text-slate-500">
                    Select one 30-minute appointment slot
                  </p>
                </div>
              </div>

              {!selectedDate ? (
                <div className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
                  Select a date to see available appointment slots.
                </div>
              ) : appointmentSlots.length === 0 ? (
                <div className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
                  No appointment slots are available for this date.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {appointmentSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={booking}
                      onClick={() =>
                        setSelectedSlot(slot)
                      }
                      className={`rounded-xl border p-3 text-center transition ${
                        selectedSlot?.id === slot.id
                          ? "border-teal-500 bg-teal-50 text-teal-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-slate-50"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      <div className="font-semibold">
                        {slot.startTime}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        to {slot.endTime}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedSlot && (
                <div className="mt-5 rounded-xl border border-teal-200 bg-teal-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-teal-600">
                    Selected appointment
                  </p>

                  <p className="mt-1 font-semibold text-teal-800">
                    {selectedDate} ·{" "}
                    {selectedSlot.startTime} -{" "}
                    {selectedSlot.endTime}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Confirm */}
          <div className="flex justify-end">
            <button
              type="button"
              disabled={
                !selectedDate ||
                !selectedSlot ||
                booking
              }
              onClick={handleBook}
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {booking && (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              )}

              {booking
                ? "Booking..."
                : "Confirm Appointment"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}