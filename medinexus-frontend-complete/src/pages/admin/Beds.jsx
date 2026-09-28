import { useEffect, useMemo, useState } from "react";
import {
  BedDouble,
  Building2,
  CheckCircle2,
  Plus,
  RefreshCw,
  MapPin,
  Users,
  Activity,
  AlertCircle,
} from "lucide-react";

import api, { errorMessage } from "../../services/api";

export default function Beds() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [beds, setBeds] = useState([]);

  const [hospitalLoading, setHospitalLoading] = useState(true);
  const [departmentLoading, setDepartmentLoading] = useState(false);
  const [bedsLoading, setBedsLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    departmentId: "",
    bedType: "",
    totalBeds: "",
    availableBeds: "",
  });

  /* ---------------- LOAD HOSPITALS ---------------- */

  const loadHospitals = async () => {
    try {
      setHospitalLoading(true);
      setError("");

      const response = await api.get("/admin/hospitals");

      setHospitals(response.data || []);
    } catch (err) {
      console.error(err);
      setError(errorMessage(err));
    } finally {
      setHospitalLoading(false);
    }
  };

  /* ---------------- LOAD DEPARTMENTS ---------------- */

  const loadDepartments = async (hospitalId) => {
    if (!hospitalId) return;

    try {
      setDepartmentLoading(true);
      setError("");

      const response = await api.get(
        `/hospitals/${hospitalId}/departments`
      );

      setDepartments(response.data || []);
    } catch (err) {
      console.error(err);
      setError(errorMessage(err));
      setDepartments([]);
    } finally {
      setDepartmentLoading(false);
    }
  };

  /* ---------------- LOAD BEDS ---------------- */

  const loadBeds = async (hospitalId) => {
    if (!hospitalId) return;

    try {
      setBedsLoading(true);
      setError("");

      const response = await api.get(
        `/hospitals/${hospitalId}/beds`
      );

      setBeds(response.data || []);
    } catch (err) {
      console.error(err);
      setError(errorMessage(err));
      setBeds([]);
    } finally {
      setBedsLoading(false);
    }
  };

  /* ---------------- SELECT HOSPITAL ---------------- */

  const selectHospital = async (hospital) => {
    setSelectedHospital(hospital);

    setDepartments([]);
    setBeds([]);

    setForm({
      departmentId: "",
      bedType: "",
      totalBeds: "",
      availableBeds: "",
    });

    setMessage("");
    setError("");

    await Promise.all([
      loadDepartments(hospital.id),
      loadBeds(hospital.id),
    ]);
  };

  /* ---------------- ADD BED AVAILABILITY ---------------- */

  const addBeds = async (e) => {
    e.preventDefault();

    if (!selectedHospital) {
      setError("Please select a hospital first.");
      return;
    }

    if (!form.departmentId) {
      setError("Please select a department.");
      return;
    }

    if (!form.bedType) {
      setError("Please select a bed type.");
      return;
    }

    if (!form.totalBeds || Number(form.totalBeds) <= 0) {
      setError("Total beds must be greater than 0.");
      return;
    }

    if (
      form.availableBeds === "" ||
      Number(form.availableBeds) < 0
    ) {
      setError("Available beds cannot be negative.");
      return;
    }

    if (
      Number(form.availableBeds) > Number(form.totalBeds)
    ) {
      setError(
        "Available beds cannot be greater than total beds."
      );
      return;
    }

    try {
      setAdding(true);
      setError("");
      setMessage("");

      await api.post(
        `/hospitals/${selectedHospital.id}/beds`,
        {
          departmentId: Number(form.departmentId),
          bedType: form.bedType,
          totalBeds: Number(form.totalBeds),
          availableBeds: Number(form.availableBeds),
        }
      );

      setForm({
        departmentId: "",
        bedType: "",
        totalBeds: "",
        availableBeds: "",
      });

      setMessage(
        "Bed availability added successfully."
      );

      await loadBeds(selectedHospital.id);
    } catch (err) {
      console.error(err);
      setError(errorMessage(err));
    } finally {
      setAdding(false);
    }
  };

  /* ---------------- REFRESH ---------------- */

  const refreshBeds = async () => {
    if (!selectedHospital) return;

    await Promise.all([
      loadDepartments(selectedHospital.id),
      loadBeds(selectedHospital.id),
    ]);
  };

  /* ---------------- TOTALS ---------------- */

  const totals = useMemo(() => {
    return beds.reduce(
      (acc, bed) => {
        acc.total += Number(bed.totalBeds || 0);
        acc.available += Number(bed.availableBeds || 0);

        return acc;
      },
      {
        total: 0,
        available: 0,
      }
    );
  }, [beds]);

  const occupied = Math.max(
    totals.total - totals.available,
    0
  );

  const availabilityPercentage =
    totals.total > 0
      ? Math.round(
          (totals.available / totals.total) * 100
        )
      : 0;

  /* ---------------- INITIAL LOAD ---------------- */

  useEffect(() => {
    loadHospitals();
  }, []);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-[#f5f8f7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* HEADER */}

        <div className="rounded-3xl bg-gradient-to-r from-[#0f766e] to-[#115e59] p-6 text-white shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                  <BedDouble size={24} />
                </div>

                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                  HOSPITAL MANAGEMENT
                </span>
              </div>

              <h1 className="text-2xl font-bold sm:text-3xl">
                Bed Availability
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-teal-50">
                Manage department-wise hospital bed capacity
                and keep availability information up to date.
              </p>
            </div>

            <button
              type="button"
              onClick={refreshBeds}
              disabled={!selectedHospital || bedsLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#0f766e] transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  bedsLoading ? "animate-spin" : ""
                }
              />
              Refresh
            </button>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <span>{error}</span>
          </div>
        )}

        {/* SUCCESS */}

        {message && (
          <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            <CheckCircle2 size={18} />
            {message}
          </div>
        )}

        {/* HOSPITAL SELECTOR */}

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Select Hospital
              </h2>

              <p className="text-sm text-slate-500">
                Choose the hospital whose bed availability
                you want to manage.
              </p>
            </div>

            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
              {hospitals.length} hospitals
            </span>
          </div>

          {hospitalLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-32 animate-pulse rounded-2xl bg-white"
                />
              ))}
            </div>
          ) : hospitals.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <Building2
                size={35}
                className="mx-auto mb-3 text-slate-400"
              />

              <p className="font-semibold text-slate-700">
                No hospitals found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Add a hospital before managing beds.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {hospitals.map((hospital) => {
                const selected =
                  selectedHospital?.id === hospital.id;

                return (
                  <button
                    key={hospital.id}
                    type="button"
                    onClick={() =>
                      selectHospital(hospital)
                    }
                    className={`group rounded-2xl border p-5 text-left transition ${
                      selected
                        ? "border-teal-500 bg-teal-50 shadow-md ring-2 ring-teal-100"
                        : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                        <Building2 size={21} />
                      </div>

                      {hospital.active ? (
                        <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                          <CheckCircle2 size={13} />
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                          Inactive
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 font-bold text-slate-900">
                      {hospital.hospitalName}
                    </h3>

                    <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin size={15} />

                      {hospital.city ||
                        "Location unavailable"}
                    </div>

                    {selected && (
                      <div className="mt-4 text-xs font-semibold text-teal-700">
                        ✓ Currently selected
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* SELECTED HOSPITAL */}

        {selectedHospital && (
          <>
            {/* HOSPITAL SUMMARY */}

            <div className="rounded-2xl border border-teal-100 bg-white p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-600">
                    Managing beds for
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {selectedHospital.hospitalName}
                  </h2>

                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin size={15} />

                    {selectedHospital.address}
                  </p>
                </div>

                <div className="rounded-2xl bg-teal-50 px-5 py-3 text-center">
                  <p className="text-xs font-semibold text-teal-600">
                    Availability
                  </p>

                  <p className="text-2xl font-bold text-teal-700">
                    {availabilityPercentage}%
                  </p>
                </div>
              </div>
            </div>

            {/* STATS */}

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">
                    Total Beds
                  </span>

                  <BedDouble
                    size={20}
                    className="text-slate-400"
                  />
                </div>

                <p className="mt-3 text-3xl font-bold text-slate-900">
                  {totals.total}
                </p>
              </div>

              <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
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
                  {totals.available}
                </p>
              </div>

              <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-orange-700">
                    Occupied
                  </span>

                  <Users
                    size={20}
                    className="text-orange-600"
                  />
                </div>

                <p className="mt-3 text-3xl font-bold text-orange-700">
                  {occupied}
                </p>
              </div>
            </div>

            {/* ADD BED FORM */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                  <Plus size={21} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Add Bed Availability
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add the current bed capacity for a
                    hospital department.
                  </p>
                </div>
              </div>

              <form
                onSubmit={addBeds}
                className="grid gap-4 md:grid-cols-5"
              >
                {/* DEPARTMENT */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Department
                  </label>

                  <select
                    value={form.departmentId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        departmentId: e.target.value,
                      })
                    }
                    disabled={departmentLoading}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50"
                  >
                    <option value="">
                      {departmentLoading
                        ? "Loading..."
                        : "Select department"}
                    </option>

                    {departments.map((department) => (
                      <option
                        key={department.id}
                        value={department.id}
                      >
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* BED TYPE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Bed Type
                  </label>

                  <select
                    value={form.bedType}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bedType: e.target.value,
                      })
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="">
                      Select bed type
                    </option>

                    <option value="GENERAL">
                      General
                    </option>

                    <option value="ICU">
                      ICU
                    </option>

                    <option value="EMERGENCY">
                      Emergency
                    </option>

                    <option value="PRIVATE">
                      Private
                    </option>

                    <option value="PEDIATRIC">
                      Pediatric
                    </option>

                    <option value="MATERNITY">
                      Maternity
                    </option>

                    <option value="ISOLATION">
                      Isolation
                    </option>
                  </select>
                </div>

                {/* TOTAL */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Total Beds
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={form.totalBeds}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        totalBeds: e.target.value,
                      })
                    }
                    placeholder="e.g. 50"
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                {/* AVAILABLE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Available Beds
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.availableBeds}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        availableBeds: e.target.value,
                      })
                    }
                    placeholder="e.g. 18"
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                {/* BUTTON */}

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={adding}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-4 text-sm font-semibold text-white transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Plus size={17} />

                    {adding
                      ? "Adding..."
                      : "Add Beds"}
                  </button>
                </div>
              </form>

              {departments.length === 0 &&
                !departmentLoading && (
                  <p className="mt-4 text-sm text-orange-600">
                    No departments are available for this
                    hospital. Add a department first.
                  </p>
                )}
            </div>

            {/* BED RECORDS */}

            <section>
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Department Bed Status
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Current capacity across hospital
                    departments.
                  </p>
                </div>

                <Activity
                  size={22}
                  className="text-teal-600"
                />
              </div>

              {bedsLoading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-36 animate-pulse rounded-2xl bg-white"
                    />
                  ))}
                </div>
              ) : beds.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                  <BedDouble
                    size={36}
                    className="mx-auto mb-3 text-slate-400"
                  />

                  <p className="font-semibold text-slate-700">
                    No bed records yet
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Add bed availability for a department
                    above.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {beds.map((bed) => {
                    const total = Number(
                      bed.totalBeds || 0
                    );

                    const available = Number(
                      bed.availableBeds || 0
                    );

                    const percentage =
                      total > 0
                        ? Math.round(
                            (available / total) * 100
                          )
                        : 0;

                    const isFull = available === 0;

const department =
  bed.department ||
  departments.find(
    (item) =>
      Number(item.id) ===
      Number(
        bed.departmentId ||
        bed.department?.id
      )
  );

                    return (
                      <div
                        key={bed.id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                              <BedDouble size={20} />
                            </div>

                            <div>
                              <h3 className="font-bold text-slate-900">
                                {department?.name ||
  bed.departmentName ||
  "Department"}
                              </h3>

                              <p className="text-xs text-slate-500">
                                {bed.bedType
                                  ? bed.bedType.replace(
                                      /_/g,
                                      " "
                                    )
                                  : "Bed"}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                              isFull
                                ? "bg-red-50 text-red-600"
                                : percentage <= 25
                                ? "bg-orange-50 text-orange-600"
                                : "bg-green-50 text-green-600"
                            }`}
                          >
                            {isFull
                              ? "Full"
                              : `${available} Available`}
                          </span>
                        </div>

                        <div className="mt-5 flex items-end justify-between">
                          <div>
                            <p className="text-3xl font-bold text-slate-900">
                              {available}
                            </p>

                            <p className="text-xs text-slate-500">
                              available out of {total}
                            </p>
                          </div>

                          <p className="text-sm font-bold text-slate-600">
                            {percentage}%
                          </p>
                        </div>

                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-teal-500 transition-all"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                          <span>
                            Occupied:{" "}
                            {Math.max(
                              total - available,
                              0
                            )}
                          </span>

                          <span>
                            Total: {total}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}