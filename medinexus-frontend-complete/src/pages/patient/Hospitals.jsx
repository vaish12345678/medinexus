
import { useEffect, useMemo, useState } from "react";
import api, { errorMessage } from "../../services/api";
import { Button, Page, Notice } from "../../components/UI";
import {
  Activity,
  BedDouble,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Hospital,
  MapPin,
  Navigation,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react";

export default function Hospitals() {
  // ============================================================
  // NEARBY HOSPITALS
  // ============================================================

  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState("10");
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [busy, setBusy] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [nearbyError, setNearbyError] = useState("");
  const [locationMessage, setLocationMessage] = useState("");

  // ============================================================
  // MEDINEXUS HOSPITALS
  // ============================================================

  const [medinexusHospitals, setMedinexusHospitals] = useState([]);
  const [medinexusLoading, setMedinexusLoading] = useState(false);
  const [medinexusError, setMedinexusError] = useState("");

  const [selectedHospital, setSelectedHospital] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [beds, setBeds] = useState([]);

  const [detailsLoading, setDetailsLoading] = useState(false);

  // ============================================================
  // GET PATIENT LOCATION
  // ============================================================

  function getMyLocation() {
    setNearbyError("");
    setLocationMessage("");

    if (!navigator.geolocation) {
      setNearbyError(
        "Location services are not supported by your browser."
      );
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocationMessage(
          "Your location was detected successfully."
        );

        setLocationLoading(false);
      },
      (error) => {
        console.error(error);

        setLocationLoading(false);

        if (error.code === 1) {
          setNearbyError(
            "Location permission was denied. Please allow location access in your browser."
          );
        } else if (error.code === 2) {
          setNearbyError(
            "Your location could not be determined. Please try again."
          );
        } else if (error.code === 3) {
          setNearbyError(
            "Location request timed out. Please try again."
          );
        } else {
          setNearbyError(
            "Unable to get your current location."
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }

  // ============================================================
  // GOOGLE MAPS
  // ============================================================

  function openMap(hospital) {
    const latitude =
      hospital.latitude ?? hospital.lat;

    const longitude =
      hospital.longitude ?? hospital.lng;

    let destination = "";

    if (
      latitude !== undefined &&
      latitude !== null &&
      longitude !== undefined &&
      longitude !== null
    ) {
      destination = `${latitude},${longitude}`;
    } else {
      const hospitalName =
        hospital.name ||
        hospital.hospitalName ||
        `Hospital #${hospital.id}`;

      const address =
        hospital.address ||
        hospital.city ||
        "";

      destination = `${hospitalName}, ${address}`;
    }

    let mapUrl =
      "https://www.google.com/maps/dir/?api=1";

    if (location) {
      mapUrl +=
        `&origin=${encodeURIComponent(
          `${location.latitude},${location.longitude}`
        )}`;
    }

    mapUrl +=
      `&destination=${encodeURIComponent(
        destination
      )}`;

    mapUrl += "&travelmode=driving";

    window.open(
      mapUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  // ============================================================
  // SEARCH NEARBY HOSPITALS
  // ============================================================

  async function searchHospitals() {
    setNearbyError("");

    if (!location) {
      setNearbyError(
        "Please allow location access first so we can find nearby hospitals."
      );
      return;
    }

    const radiusValue = Number(radius);

    if (!radiusValue || radiusValue <= 0) {
      setNearbyError("Please select a valid search radius.");
      return;
    }

    try {
      setBusy(true);

      const response = await api.get(
        "/hospitals/nearby",
        {
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
            radiusInKm: radiusValue,
          },
        }
      );

      setNearbyHospitals(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (e) {
      setNearbyError(errorMessage(e));
      setNearbyHospitals([]);
    } finally {
      setBusy(false);
    }
  }

  // ============================================================
  // LOAD MEDINEXUS HOSPITALS
  // ============================================================

  async function loadMedinexusHospitals() {
    try {
      setMedinexusLoading(true);
      setMedinexusError("");

      const response = await api.get(
        "/hospitals/active"
      );

      setMedinexusHospitals(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (e) {
      console.error(e);
      setMedinexusError(errorMessage(e));
    } finally {
      setMedinexusLoading(false);
    }
  }

  // ============================================================
  // LOAD DEPARTMENTS + BEDS
  // ============================================================

  async function viewHospitalDetails(hospital) {
    try {
      setSelectedHospital(hospital);
      setDepartments([]);
      setBeds([]);
      setDetailsLoading(true);
      setMedinexusError("");

      const [
        departmentResponse,
        bedResponse,
      ] = await Promise.all([
        api.get(
          `/hospitals/${hospital.id}/departments`
        ),
        api.get(
          `/hospitals/${hospital.id}/beds`
        ),
      ]);

      setDepartments(
        Array.isArray(departmentResponse.data)
          ? departmentResponse.data
          : []
      );

      setBeds(
        Array.isArray(bedResponse.data)
          ? bedResponse.data
          : []
      );
    } catch (e) {
      console.error(e);
      setMedinexusError(errorMessage(e));
    } finally {
      setDetailsLoading(false);
    }
  }

  // ============================================================
  // CLOSE DETAILS
  // ============================================================

  function closeHospitalDetails() {
    setSelectedHospital(null);
    setDepartments([]);
    setBeds([]);
    setMedinexusError("");
  }

  // ============================================================
  // BED STATISTICS
  // ============================================================

  const bedStats = useMemo(() => {
    const total = beds.reduce(
      (sum, bed) =>
        sum + Number(bed.totalBeds || 0),
      0
    );

    const available = beds.reduce(
      (sum, bed) =>
        sum + Number(bed.availableBeds || 0),
      0
    );

    const occupied = Math.max(
      total - available,
      0
    );

    return {
      total,
      available,
      occupied,
    };
  }, [beds]);

  // ============================================================
  // LOAD ON PAGE LOAD
  // ============================================================

  useEffect(() => {
    loadMedinexusHospitals();
  }, []);

  // ============================================================
  // UI
  // ============================================================

  return (
    <Page
      title="Hospitals"
      subtitle="Find trusted hospitals, explore departments, and check current bed availability."
    >
      {/* ========================================================
          MEDINEXUS HOSPITALS
      ========================================================= */}

      <section>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
              <ShieldCheck size={14} />
              Medinexus Network
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Hospital Network
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Explore hospitals available through Medinexus,
              including departments, emergency services,
              and current bed availability.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
              <Building2
                size={20}
                className="text-teal-600"
              />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">
                Registered Hospitals
              </p>

              <p className="text-lg font-bold text-slate-900">
                {medinexusHospitals.length}
              </p>
            </div>
          </div>
        </div>

        {medinexusError && (
          <div className="mb-5">
            <Notice>{medinexusError}</Notice>
          </div>
        )}

        {/* Loading */}
        {medinexusLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50">
              <RefreshCw
                size={25}
                className="animate-spin text-teal-600"
              />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-800">
              Loading hospital directory
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Please wait while we fetch available hospitals.
            </p>
          </div>
        )}

        {/* Empty */}
        {!medinexusLoading &&
          medinexusHospitals.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Hospital
                  size={27}
                  className="text-slate-400"
                />
              </div>

              <h3 className="mt-4 font-semibold text-slate-800">
                No hospitals available
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
                Hospitals added by the administrator will
                appear here.
              </p>
            </div>
          )}

        {/* Hospital Cards */}
        {!medinexusLoading &&
          medinexusHospitals.length > 0 && (
            <div className="grid gap-5 lg:grid-cols-2">
              {medinexusHospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg"
                >
                  {/* Header */}
                  <div className="border-b border-slate-100 bg-gradient-to-br from-teal-50 via-white to-white p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                          <Hospital
                            size={27}
                            className="text-teal-600"
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold text-slate-900">
                            {hospital.hospitalName ||
                              `Hospital #${hospital.id}`}
                          </h3>

                          <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                            <MapPin size={14} />
                            <span>
                              {hospital.city ||
                                "Location not provided"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          hospital.emergencyAvailable
                            ? "bg-red-50 text-red-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            hospital.emergencyAvailable
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                        />

                        {hospital.emergencyAvailable
                          ? "Emergency"
                          : "Active"}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="space-y-4">
                      {/* Address */}
                      <div className="flex gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50">
                          <MapPin
                            size={17}
                            className="text-slate-500"
                          />
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Address
                          </p>

                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {hospital.address ||
                              "Address not provided"}
                          </p>
                        </div>
                      </div>

                      {/* Contact */}
                      {hospital.contactNumber && (
                        <div className="flex gap-3">
                          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50">
                            <Phone
                              size={17}
                              className="text-slate-500"
                            />
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Contact
                            </p>

                            <a
                              href={`tel:${hospital.contactNumber}`}
                              className="mt-1 inline-block text-sm font-semibold text-teal-700 transition hover:text-teal-800 hover:underline"
                            >
                              {hospital.contactNumber}
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Description */}
                      {hospital.description && (
                        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                          <p className="text-sm leading-6 text-slate-500">
                            {hospital.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Quick Information */}
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                        <div className="flex items-center gap-2">
                          <Building2
                            size={16}
                            className="text-slate-500"
                          />

                          <p className="text-xs font-medium text-slate-500">
                            Network
                          </p>
                        </div>

                        <p className="mt-2 font-semibold text-slate-800">
                          Medinexus
                        </p>
                      </div>

                      <div
                        className={`rounded-xl p-3.5 ${
                          hospital.emergencyAvailable
                            ? "border border-red-100 bg-red-50"
                            : "border border-green-100 bg-green-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CircleAlert
                            size={16}
                            className={
                              hospital.emergencyAvailable
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          />

                          <p
                            className={`text-xs font-medium ${
                              hospital.emergencyAvailable
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            Emergency
                          </p>
                        </div>

                        <p
                          className={`mt-2 font-semibold ${
                            hospital.emergencyAvailable
                              ? "text-red-700"
                              : "text-green-700"
                          }`}
                        >
                          {hospital.emergencyAvailable
                            ? "Available"
                            : "Not listed"}
                        </p>
                      </div>
                    </div>

                    {/* Details Button */}
                    <button
                      type="button"
                      onClick={() =>
                        viewHospitalDetails(hospital)
                      }
                      className="mt-5 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 active:scale-[0.99]"
                    >
                      View Departments & Beds
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </section>

      {/* ========================================================
          HOSPITAL DETAILS
      ========================================================= */}

      {selectedHospital && (
        <section className="mt-10">
          <div className="overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm">
            {/* Details Header */}
            <div className="border-b border-slate-100 bg-gradient-to-br from-teal-50 via-white to-slate-50 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-600 shadow-sm">
                    <Hospital
                      size={27}
                      className="text-white"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-teal-600">
                      Hospital Details
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                      {selectedHospital.hospitalName}
                    </h2>

                    <p className="mt-2 flex items-start gap-1.5 text-sm leading-6 text-slate-500">
                      <MapPin
                        size={15}
                        className="mt-1 shrink-0"
                      />

                      <span>
                        {selectedHospital.address}

                        {selectedHospital.city
                          ? `, ${selectedHospital.city}`
                          : ""}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeHospitalDetails}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <X size={16} />
                  Close
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {selectedHospital.emergencyAvailable && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
                    <CircleAlert size={14} />
                    Emergency services available
                  </span>
                )}

                {selectedHospital.contactNumber && (
                  <a
                    href={`tel:${selectedHospital.contactNumber}`}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-teal-700 ring-1 ring-slate-200 transition hover:bg-teal-50"
                  >
                    <Phone size={14} />
                    {selectedHospital.contactNumber}
                  </a>
                )}
              </div>
            </div>

            {/* Details Content */}
            <div className="p-6">
              {detailsLoading ? (
                <div className="py-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50">
                    <RefreshCw
                      size={25}
                      className="animate-spin text-teal-600"
                    />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-slate-700">
                    Loading hospital information
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Fetching departments and bed availability.
                  </p>
                </div>
              ) : (
                <>
                  {/* BED SUMMARY */}
                  <div>
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <Activity
                          size={20}
                          className="text-teal-600"
                        />

                        <h3 className="text-lg font-bold text-slate-900">
                          Bed Overview
                        </h3>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        Current availability across the hospital.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      {/* Total */}
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-500">
                            Total Beds
                          </span>

                          <BedDouble
                            size={20}
                            className="text-slate-500"
                          />
                        </div>

                        <p className="mt-3 text-3xl font-bold text-slate-900">
                          {bedStats.total}
                        </p>
                      </div>

                      {/* Available */}
                      <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-700">
                            Available
                          </span>

                          <CheckCircle2
                            size={20}
                            className="text-green-600"
                          />
                        </div>

                        <p className="mt-3 text-3xl font-bold text-green-700">
                          {bedStats.available}
                        </p>
                      </div>

                      {/* Occupied */}
                      <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-orange-700">
                            Occupied
                          </span>

                          <Activity
                            size={20}
                            className="text-orange-600"
                          />
                        </div>

                        <p className="mt-3 text-3xl font-bold text-orange-700">
                          {bedStats.occupied}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* DEPARTMENTS */}
                  <div className="mt-9">
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <Stethoscope
                          size={20}
                          className="text-teal-600"
                        />

                        <h3 className="text-lg font-bold text-slate-900">
                          Departments
                        </h3>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        Medical departments available at this hospital.
                      </p>
                    </div>

                    {departments.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                          <Stethoscope
                            size={23}
                            className="text-slate-400"
                          />
                        </div>

                        <p className="mt-3 text-sm text-slate-500">
                          No departments have been added yet.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {departments.map((department) => (
                          <div
                            key={department.id}
                            className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-teal-200 hover:bg-teal-50/30"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                                <Stethoscope
                                  size={18}
                                  className="text-teal-600"
                                />
                              </div>

                              <div className="min-w-0">
                                <h4 className="font-semibold text-slate-800">
                                  {department.name}
                                </h4>

                                {department.floor && (
                                  <p className="mt-1 text-xs text-slate-400">
                                    Floor {department.floor}
                                  </p>
                                )}
                              </div>
                            </div>

                            {department.description && (
                              <p className="mt-3 text-sm leading-5 text-slate-500">
                                {department.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* BED AVAILABILITY */}
                  <div className="mt-9">
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <BedDouble
                          size={20}
                          className="text-teal-600"
                        />

                        <h3 className="text-lg font-bold text-slate-900">
                          Bed Availability
                        </h3>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        Current bed availability reported by the hospital.
                      </p>
                    </div>

                    {beds.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                          <BedDouble
                            size={23}
                            className="text-slate-400"
                          />
                        </div>

                        <p className="mt-3 text-sm text-slate-500">
                          No bed availability records have been added yet.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {beds.map((bed) => {
                          const total =
                            Number(bed.totalBeds || 0);

                          const available =
                            Number(bed.availableBeds || 0);

                          const occupied = Math.max(
                            total - available,
                            0
                          );

                          const percentage =
                            total > 0
                              ? Math.round(
                                  (available / total) * 100
                                )
                              : 0;

                          const availabilityClass =
                            percentage > 30
                              ? "bg-green-500"
                              : percentage > 0
                              ? "bg-orange-500"
                              : "bg-red-500";

                          const badgeClass =
                            percentage > 30
                              ? "bg-green-50 text-green-700"
                              : percentage > 0
                              ? "bg-orange-50 text-orange-700"
                              : "bg-red-50 text-red-700";

                          return (
                            <div
                              key={bed.id}
                              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    {bed.departmentName ||
                                      "Department"}
                                  </p>

                                  <h4 className="mt-1 text-lg font-bold text-slate-800">
                                    {bed.bedType}
                                  </h4>
                                </div>

                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
                                >
                                  {percentage}% available
                                </span>
                              </div>

                              <div className="mt-5">
                                <div className="mb-2 flex justify-between text-sm">
                                  <span className="text-slate-500">
                                    Availability
                                  </span>

                                  <span className="font-semibold text-slate-800">
                                    {available} / {total}
                                  </span>
                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                  <div
                                    className={`h-full rounded-full ${availabilityClass}`}
                                    style={{
                                      width: `${percentage}%`,
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="mt-4 grid grid-cols-2 gap-3">
                                <div className="rounded-xl bg-green-50 p-3">
                                  <p className="text-xs font-medium text-green-700">
                                    Available
                                  </p>

                                  <p className="mt-1 text-xl font-bold text-green-700">
                                    {available}
                                  </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-3">
                                  <p className="text-xs font-medium text-slate-500">
                                    Occupied
                                  </p>

                                  <p className="mt-1 text-xl font-bold text-slate-700">
                                    {occupied}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          NEARBY HOSPITALS
      ========================================================= */}

      <section className="mt-12 border-t border-slate-200 pt-10">
        <div className="mb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
            <MapPin size={14} />
            Location Based
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Nearby Hospitals
          </h2>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Find hospitals around your current location using
            location-based search and Google Maps directions.
          </p>
        </div>

        {/* Location Search */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50">
                <Search
                  size={19}
                  className="text-sky-600"
                />
              </div>

              <div>
                <h3 className="font-bold text-slate-800">
                  Search Around You
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Choose a search radius and allow location access.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Search Radius
                </label>

                <select
                  value={radius}
                  onChange={(e) =>
                    setRadius(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                >
                  <option value="5">
                    Within 5 km
                  </option>

                  <option value="10">
                    Within 10 km
                  </option>

                  <option value="25">
                    Within 25 km
                  </option>

                  <option value="50">
                    Within 50 km
                  </option>
                </select>
              </div>

              <Button
                type="button"
                onClick={getMyLocation}
                disabled={locationLoading}
              >
                {locationLoading
                  ? "Detecting..."
                  : location
                  ? "Location Detected"
                  : "Use My Location"}
              </Button>
            </div>

            {locationMessage && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                <CheckCircle2
                  size={18}
                  className="shrink-0"
                />

                {locationMessage}
              </div>
            )}

            {location && (
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <MapPin
                  size={17}
                  className="shrink-0 text-slate-500"
                />

                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Location ready
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    We'll search for hospitals within{" "}
                    {radius} km of your current location.
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={searchHospitals}
              disabled={busy || !location}
              className="mt-5 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? (
                <>
                  <RefreshCw
                    size={17}
                    className="animate-spin"
                  />
                  Finding Hospitals...
                </>
              ) : (
                <>
                  <Search size={17} />
                  Find Nearby Hospitals
                </>
              )}
            </button>
          </div>
        </div>

        {nearbyError && (
          <div className="mt-5">
            <Notice>{nearbyError}</Notice>
          </div>
        )}

        {/* Nearby Results */}
        <div className="mt-7">
          {nearbyHospitals.length > 0 && (
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Hospitals Near You
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Found within {radius} km of your location.
                </p>
              </div>

              <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700">
                {nearbyHospitals.length} found
              </span>
            </div>
          )}

          {nearbyHospitals.length === 0 &&
            !busy &&
            location &&
            !nearbyError && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Search
                    size={25}
                    className="text-slate-400"
                  />
                </div>

                <h3 className="mt-4 font-semibold text-slate-800">
                  No hospitals found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Try increasing the search radius.
                </p>
              </div>
            )}

          <div className="grid gap-5 md:grid-cols-2">
            {nearbyHospitals.map((hospital, index) => {
              const hospitalName =
                hospital.name ||
                hospital.hospitalName ||
                `Hospital #${hospital.id || index + 1}`;

              const phone =
                hospital.phoneNumber ||
                hospital.phone;

              const distance =
                hospital.distanceInKm;

              return (
                <div
                  key={hospital.id || index}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
                >
                  {/* Nearby Hospital Header */}
                  <div className="flex items-start gap-4 border-b border-slate-100 bg-gradient-to-r from-sky-50/60 to-white p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50">
                      <Hospital
                        size={23}
                        className="text-sky-600"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900">
                          {hospitalName}
                        </h3>

                        {distance !== undefined &&
                          distance !== null && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700">
                              <MapPin size={12} />
                              {Number(distance).toFixed(2)} km
                            </span>
                          )}
                      </div>

                      <p className="mt-2 text-sm leading-5 text-slate-500">
                        {hospital.address ||
                          hospital.city ||
                          "Address not available"}
                      </p>
                    </div>
                  </div>

                  {/* Nearby Hospital Body */}
                  <div className="p-5">
                    {phone && (
                      <a
                        href={`tel:${phone}`}
                        className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-teal-50 hover:text-teal-700"
                      >
                        <Phone
                          size={18}
                          className="text-slate-500"
                        />

                        <span>{phone}</span>
                      </a>
                    )}

                    {hospital.emergencyAvailable && (
                      <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                        <CircleAlert size={17} />

                        <span>
                          Emergency services available
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        openMap(hospital)
                      }
                      className="mt-4 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                    >
                      <Navigation size={17} />
                      Get Directions
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Page>
  );
}
