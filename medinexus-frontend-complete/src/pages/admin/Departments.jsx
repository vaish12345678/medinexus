import { useEffect, useState } from "react";
import {
  Building2,
  Plus,
  RefreshCw,
  Stethoscope,
  MapPin,
  CheckCircle2,
} from "lucide-react";

import api, { errorMessage } from "../../services/api";

export default function Departments() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [hospitalLoading, setHospitalLoading] = useState(true);
  const [departmentLoading, setDepartmentLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =========================================================
  // LOAD ALL HOSPITALS
  // =========================================================

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

  // =========================================================
  // LOAD DEPARTMENTS FOR SELECTED HOSPITAL
  // =========================================================

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

  // =========================================================
  // SELECT HOSPITAL
  // =========================================================

  const selectHospital = (hospital) => {
    setSelectedHospital(hospital);
    setDepartments([]);
    setName("");
    setMessage("");
    setError("");

    loadDepartments(hospital.id);
  };

  // =========================================================
  // ADD DEPARTMENT
  // =========================================================

  const addDepartment = async (e) => {
    e.preventDefault();

    if (!selectedHospital) {
      setError("Please select a hospital first.");
      return;
    }

    if (!name.trim()) {
      setError("Please enter a department name.");
      return;
    }

    try {
      setAdding(true);
      setError("");
      setMessage("");

      await api.post(
        `/hospitals/${selectedHospital.id}/departments`,
        {
          name: name.trim(),
        }
      );

      setName("");

      setMessage(
        "Department added successfully."
      );

      await loadDepartments(selectedHospital.id);
    } catch (err) {
      console.error(err);
      setError(errorMessage(err));
    } finally {
      setAdding(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadHospitals();
  }, []);

  // =========================================================
  // AUTO CLEAR SUCCESS MESSAGE
  // =========================================================

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-[#f5f8f7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="relative overflow-hidden rounded-3xl bg-[#0f766e] p-7 text-white shadow-sm sm:p-9">

          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-white/5" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <Stethoscope size={24} />
              </div>

              <p className="mb-1 text-sm font-medium text-teal-100">
                Hospital Management
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Departments
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-teal-50">
                Manage the medical departments available
                across your hospitals.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 px-6 py-5 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wider text-teal-100">
                Total Departments
              </p>

              <p className="mt-1 text-3xl font-bold">
                {departments.length}
              </p>

              {selectedHospital && (
                <p className="mt-1 max-w-[180px] truncate text-xs text-teal-100">
                  {selectedHospital.hospitalName}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* =================================================
            HOSPITAL SELECTION
        ================================================= */}

        <section>

          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-600">
                Step 1
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Select a Hospital
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose a hospital to manage its departments.
              </p>
            </div>

            <button
              type="button"
              onClick={loadHospitals}
              disabled={hospitalLoading}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-teal-200 hover:text-teal-700 disabled:opacity-60 sm:self-auto"
            >
              <RefreshCw
                size={16}
                className={
                  hospitalLoading ? "animate-spin" : ""
                }
              />

              Refresh
            </button>

          </div>

          {/* Hospital loading */}

          {hospitalLoading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-36 animate-pulse rounded-3xl bg-white"
                />
              ))}
            </div>
          )}

          {/* No hospitals */}

          {!hospitalLoading &&
            hospitals.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">

                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                  <Building2 size={28} />
                </div>

                <h3 className="font-semibold text-slate-900">
                  No hospitals available
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                  Create a hospital from the Hospitals section
                  before adding departments.
                </p>

              </div>
            )}

          {/* Hospital cards */}

          {!hospitalLoading &&
            hospitals.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {hospitals.map((hospital) => {
                  const isSelected =
                    selectedHospital?.id === hospital.id;

                  return (
                    <button
                      key={hospital.id}
                      type="button"
                      onClick={() =>
                        selectHospital(hospital)
                      }
                      className={`group relative overflow-hidden rounded-3xl border bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md ${
                        isSelected
                          ? "border-teal-500 ring-2 ring-teal-100"
                          : "border-slate-200 hover:border-teal-200"
                      }`}
                    >

                      {/* Selected indicator */}

                      {isSelected && (
                        <div className="absolute right-4 top-4">
                          <CheckCircle2
                            size={22}
                            className="text-teal-600"
                          />
                        </div>
                      )}

                      <div className="flex items-start gap-4">

                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition ${
                            isSelected
                              ? "bg-teal-100 text-teal-700"
                              : "bg-slate-100 text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-600"
                          }`}
                        >
                          <Building2 size={22} />
                        </div>

                        <div className="min-w-0 pr-6">

                          <h3 className="truncate text-base font-bold text-slate-900">
                            {hospital.hospitalName ||
                              `Hospital #${hospital.id}`}
                          </h3>

                          {hospital.city && (
                            <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                              <MapPin size={14} />
                              <span className="truncate">
                                {hospital.city}
                              </span>
                            </div>
                          )}

                        </div>

                      </div>

                      <div className="mt-5 flex items-center justify-between">

                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                            hospital.active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              hospital.active
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />

                          {hospital.active
                            ? "Active"
                            : "Inactive"}
                        </span>

                        <span className="text-xs font-medium text-slate-400">
                          #{hospital.id}
                        </span>

                      </div>

                    </button>
                  );
                })}

              </div>
            )}
        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* =================================================
            SELECTED HOSPITAL
        ================================================= */}

        {selectedHospital && (
          <>
            {/* Selected hospital banner */}

            <div className="flex flex-col gap-4 rounded-3xl border border-teal-100 bg-teal-50 p-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-teal-600 shadow-sm">
                  <Building2 size={22} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
                    Selected Hospital
                  </p>

                  <h2 className="mt-0.5 text-lg font-bold text-slate-900">
                    {selectedHospital.hospitalName}
                  </h2>

                  {selectedHospital.city && (
                    <p className="text-sm text-slate-500">
                      {selectedHospital.city}
                    </p>
                  )}
                </div>

              </div>

              <div className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-teal-700 shadow-sm">
                {departments.length}{" "}
                {departments.length === 1
                  ? "Department"
                  : "Departments"}
              </div>

            </div>

            {/* =================================================
                DEPARTMENT MANAGEMENT
            ================================================= */}

            <div className="grid gap-7 lg:grid-cols-[300px_1fr]">

              {/* ADD DEPARTMENT */}

              <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                  <Plus size={22} />
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  Add Department
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Add a new medical unit to{" "}
                  <span className="font-medium text-slate-700">
                    {selectedHospital.hospitalName}
                  </span>
                  .
                </p>

                <form
                  onSubmit={addDepartment}
                  className="mt-6 space-y-4"
                >

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Department name
                    </label>

                    <input
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      placeholder="e.g. Cardiology"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={adding}
                    className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Plus size={18} />

                    {adding
                      ? "Adding..."
                      : "Add Department"}
                  </button>

                </form>
              </aside>

              {/* DEPARTMENT LIST */}

              <section>

                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-600">
                    Step 2
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    Medical Departments
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Departments available at this hospital.
                  </p>
                </div>

                {/* Success */}

                {message && (
                  <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
                    ✓ {message}
                  </div>
                )}

                {/* Loading */}

                {departmentLoading && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="h-32 animate-pulse rounded-3xl bg-white"
                      />
                    ))}
                  </div>
                )}

                {/* Empty */}

                {!departmentLoading &&
                  departments.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">

                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                        <Stethoscope size={28} />
                      </div>

                      <h3 className="font-semibold text-slate-900">
                        No departments yet
                      </h3>

                      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                        Add the first department using the
                        panel on the left.
                      </p>

                    </div>
                  )}

                {/* Department cards */}

                {!departmentLoading &&
                  departments.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

                      {departments.map(
                        (department, index) => (
                          <div
                            key={department.id}
                            className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-md"
                          >

                            <div className="flex items-start justify-between">

                              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition group-hover:bg-teal-50 group-hover:text-teal-600">
                                <Stethoscope
                                  size={20}
                                />
                              </div>

                              <span className="text-xs font-bold text-slate-200">
                                {String(index + 1).padStart(
                                  2,
                                  "0"
                                )}
                              </span>

                            </div>

                            <h3 className="mt-5 text-lg font-bold text-slate-900">
                              {department.name ||
                                `Department #${department.id}`}
                            </h3>

                            <div className="mt-4 flex items-center justify-between">

                              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Active
                              </span>

                              <span className="text-xs text-slate-400">
                                ID #{department.id}
                              </span>

                            </div>

                          </div>
                        )
                      )}

                    </div>
                  )}

              </section>
            </div>
          </>
        )}

        {/* =================================================
            NOTHING SELECTED
        ================================================= */}

        {!selectedHospital &&
          !hospitalLoading &&
          hospitals.length > 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <Stethoscope size={25} />
              </div>

              <h3 className="font-semibold text-slate-900">
                Select a hospital to continue
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Click any hospital above to view and manage
                its departments.
              </p>

            </div>
          )}

      </div>
    </div>
  );
}