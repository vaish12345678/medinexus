
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Clock,
  Stethoscope,
} from "lucide-react";
import api from "../../services/api";

// Doctor photos from src/public
import cardiologyImage from "../../public/cardiology.jpg";
import dermatologyImage from "../../public/dermatology.jpg";
import entImage from "../../public/ENT.jpg";
import generalImage from "../../public/general.jpg";
import gynecologyImage from "../../public/gynecologist.jpg";
import neurologyImage from "../../public/neurology.jpg";
import orthopedicsImage from "../../public/orthopedics.jpg";
import pediatricsImage from "../../public/pediatrics.jpg";

const specializations = [
  {
    name: "Cardiology",
    description: "Heart and cardiovascular care",
    image: cardiologyImage,
  },
  {
    name: "Neurology",
    description: "Brain and nervous-system care",
    image: neurologyImage,
  },
  {
    name: "Dermatology",
    description: "Skin, hair and nail care",
    image: dermatologyImage,
  },
  {
    name: "Orthopedics",
    description: "Bones, joints and muscles",
    image: orthopedicsImage,
  },
  {
    name: "Pediatrics",
    description: "Healthcare for children",
    image: pediatricsImage,
  },
  {
    name: "Gynecology",
    description: "Women's reproductive health",
    image: gynecologyImage,
  },
  {
    name: "ENT",
    description: "Ear, nose and throat care",
    image: entImage,
  },
  {
    name: "General Medicine",
    description: "General health and common conditions",
    image: generalImage,
  },
];

const specializationImages = {
  Cardiology: cardiologyImage,
  Neurology: neurologyImage,
  Dermatology: dermatologyImage,
  Orthopedics: orthopedicsImage,
  Pediatrics: pediatricsImage,
  Gynecology: gynecologyImage,
  ENT: entImage,
  "General Medicine": generalImage,
};

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
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-teal-700"
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

      {/* Specialization Cards */}
      {!specialization && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {specializations.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => handleSpecializationClick(item.name)}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg"
            >
              {/* Specialization Image */}
              <div className="relative h-40 overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <div className="absolute bottom-3 left-4">
                  <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-teal-700 shadow-sm">
                    Medical Specialty
                  </span>
                </div>

                <ChevronRight
                  size={20}
                  className="absolute right-4 top-4 rounded-full bg-white/90 p-1 text-slate-600 transition group-hover:translate-x-1 group-hover:text-teal-600"
                />
              </div>

              {/* Specialization Content */}
              <div className="p-5">
                <h2 className="text-lg font-bold text-slate-900">
                  {item.name}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-teal-600">
                    View doctors
                  </span>

                  <span className="text-lg text-teal-600 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
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
                <Stethoscope
                  className="text-teal-600"
                  size={28}
                />
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
  const doctorImage =
    specializationImages[doctor.specialization];

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Doctor Photo */}
      <div className="relative h-64 overflow-hidden bg-slate-100">
        {doctorImage ? (
          <img
            src={doctorImage}
            alt={`${doctor.name || "Doctor"} - ${
              doctor.specialization || "Medical Specialist"
            }`}
            className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Doctor Photo
          </div>
        )}

        {/* Bottom Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Specialization */}
        <div className="absolute bottom-4 left-4">
          <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-teal-700 shadow-md">
            {doctor.specialization || "Medical Specialist"}
          </span>
        </div>
      </div>

      {/* Doctor Details */}
      <div className="p-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
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

        {/* Doctor Information */}
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

        {/* Bio */}
        {doctor.bio && (
          <p className="mt-5 line-clamp-2 text-sm leading-6 text-slate-500">
            {doctor.bio}
          </p>
        )}

        {/* Book Appointment */}
        <button
          type="button"
          onClick={onBook}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 font-semibold text-white transition hover:bg-teal-700 active:scale-[0.98]"
        >
          <Calendar size={18} />
          Book Appointment
        </button>
      </div>
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

