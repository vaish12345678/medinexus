import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Clock,
  Stethoscope,
  UserRound,
} from "lucide-react";
import api from "../../services/api";

const specializations = [
  {
    name: "Cardiology",
    description: "Heart and cardiovascular care",
    icon: "❤️",
  },
  {
    name: "Neurology",
    description: "Brain and nervous-system care",
    icon: "🧠",
  },
  {
    name: "Dermatology",
    description: "Skin, hair and nail care",
    icon: "✨",
  },
  {
    name: "Orthopedics",
    description: "Bones, joints and muscles",
    icon: "🦴",
  },
  {
    name: "Pediatrics",
    description: "Healthcare for children",
    icon: "👶",
  },
  {
    name: "Gynecology",
    description: "Women's reproductive health",
    icon: "🌸",
  },
  {
    name: "ENT",
    description: "Ear, nose and throat care",
    icon: "👂",
  },
  {
    name: "General Medicine",
    description: "General health and common conditions",
    icon: "🩺",
  },
];

export default function FindDoctors() {
  const { specialization } = useParams();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!specialization) {
      setDoctors([]);
      return;
    }

    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/doctors/specialization/${encodeURIComponent(specialization)}`
        );

        setDoctors(response.data || []);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setError("Unable to load doctors right now.");
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [specialization]);

  const handleSpecializationClick = (name) => {
    navigate(`/find-doctors/${encodeURIComponent(name)}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        {specialization ? (
          <button
            type="button"
            onClick={() => navigate("/find-doctors")}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-teal-700"
          >
            <ArrowLeft size={18} />
            Back to Specializations
          </button>
        ) : null}

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
            Find Doctors
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            {specialization
              ? `${specialization} Doctors`
              : "Find the right doctor"}
          </h1>

          <p className="mt-2 text-slate-500">
            {specialization
              ? `Browse verified ${specialization.toLowerCase()} specialists and book an appointment.`
              : "Choose a medical specialization to find the right doctor."}
          </p>
        </div>
      </div>

      {/* Specialization cards */}
      {!specialization && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {specializations.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => handleSpecializationClick(item.name)}
              className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-2xl">
                  {item.icon}
                </div>

                <ChevronRight
                  size={20}
                  className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-teal-600"
                />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                {item.name}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.description}
              </p>

              <div className="mt-5 text-sm font-semibold text-teal-600">
                View doctors →
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Doctors */}
      {specialization && (
        <>
          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />
              <p className="mt-4 text-sm text-slate-500">
                Finding verified doctors...
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && doctors.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50">
                <Stethoscope className="text-teal-600" size={28} />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                No verified doctors found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                There are currently no verified doctors available for{" "}
                {specialization}.
              </p>
            </div>
          )}

          {!loading && !error && doctors.length > 0 && (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onBook={() =>
                    navigate(`/appointments/book/${doctor.id}`)
                  }
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function DoctorCard({ doctor, onBook }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-50">
          <UserRound className="text-teal-700" size={28} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-slate-900">
            {doctor.name || "Doctor"}
          </h2>

          <p className="mt-1 font-medium text-teal-700">
            {doctor.specialization}
          </p>

          {doctor.qualification && (
            <p className="mt-1 text-sm text-slate-500">
              {doctor.qualification}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <InfoItem
          icon={<Clock size={16} />}
          label="Experience"
          value={
            doctor.experienceYears != null
              ? `${doctor.experienceYears} years`
              : "Not specified"
          }
        />

        <InfoItem
          icon={<Calendar size={16} />}
          label="Consultation"
          value={
            doctor.consultationFee != null
              ? `₹${doctor.consultationFee}`
              : "Not specified"
          }
        />
      </div>

      {doctor.bio && (
        <p className="mt-5 line-clamp-2 text-sm leading-6 text-slate-500">
          {doctor.bio}
        </p>
      )}

      <button
        type="button"
        onClick={onBook}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 font-semibold text-white transition hover:bg-teal-700"
      >
        <Calendar size={18} />
        Book Appointment
      </button>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        {icon}
        {label}
      </div>

      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}