import { useEffect, useMemo, useState } from "react";
import api, { errorMessage } from "../../services/api";
import {
  Button,
  Page,
  Notice,
  ErrorState,
  Empty,
  Loading,
} from "../../components/UI";

const emptyForm = {
  hospitalName: "",
  address: "",
  city: "",
  contactNumber: "",
  email: "",
  latitude: "",
  longitude: "",
  emergencyAvailable: false,
  description: "",
};

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const [actionId, setActionId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});

  // ============================================================
  // LOAD HOSPITALS
  // ============================================================

  async function loadHospitals() {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/admin/hospitals");

      setHospitals(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHospitals();
  }, []);

  // ============================================================
  // SUMMARY
  // ============================================================

  const summary = useMemo(() => {
    const total = hospitals.length;

    const active = hospitals.filter(
      (hospital) => hospital.active
    ).length;

    const emergency = hospitals.filter(
      (hospital) => hospital.emergencyAvailable
    ).length;

    return {
      total,
      active,
      emergency,
    };
  }, [hospitals]);

  // ============================================================
  // FORM
  // ============================================================

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field-specific error when user edits it
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setSaveError("");
    setSaveSuccess("");
  }

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setFieldErrors({});
    setSaveError("");
    setSaveSuccess("");
    setShowForm(true);
  }

  function openEditForm(hospital) {
    setEditingId(hospital.id);

    setForm({
      hospitalName: hospital.hospitalName || "",
      address: hospital.address || "",
      city: hospital.city || "",
      contactNumber: hospital.contactNumber || "",
      email: hospital.email || "",
      latitude: hospital.latitude ?? "",
      longitude: hospital.longitude ?? "",
      emergencyAvailable: Boolean(
        hospital.emergencyAvailable
      ),
      description: hospital.description || "",
    });

    setFieldErrors({});
    setSaveError("");
    setSaveSuccess("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFieldErrors({});
    setSaveError("");
  }

  // ============================================================
  // CLIENT-SIDE VALIDATION
  // ============================================================

  function validateForm() {
    const errors = {};

    if (!form.hospitalName.trim()) {
      errors.hospitalName = "Hospital name is required.";
    }

    if (!form.address.trim()) {
      errors.address = "Hospital address is required.";
    }

    if (!form.contactNumber.trim()) {
      errors.contactNumber = "Contact number is required.";
    }

    if (form.email.trim()) {
      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(form.email.trim())) {
        errors.email = "Enter a valid email address.";
      }
    }

    if (form.latitude !== "") {
      const latitude = Number(form.latitude);

      if (
        Number.isNaN(latitude) ||
        latitude < -90 ||
        latitude > 90
      ) {
        errors.latitude =
          "Latitude must be between -90 and 90.";
      }
    }

    if (form.longitude !== "") {
      const longitude = Number(form.longitude);

      if (
        Number.isNaN(longitude) ||
        longitude < -180 ||
        longitude > 180
      ) {
        errors.longitude =
          "Longitude must be between -180 and 180.";
      }
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  }

  // ============================================================
  // SUBMIT
  // ============================================================

  async function handleSubmit(e) {
    e.preventDefault();

    setSaveError("");
    setSaveSuccess("");

    if (!validateForm()) {
      setSaveError(
        "Please correct the highlighted fields before submitting."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        hospitalName: form.hospitalName.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        contactNumber: form.contactNumber.trim(),
        email: form.email.trim(),
        latitude:
          form.latitude === ""
            ? null
            : Number(form.latitude),
        longitude:
          form.longitude === ""
            ? null
            : Number(form.longitude),
        emergencyAvailable: form.emergencyAvailable,
        description: form.description.trim(),
      };

      if (editingId) {
        await api.put(
          `/admin/hospitals/${editingId}`,
          payload
        );

        setSaveSuccess(
          "Hospital information updated successfully."
        );
      } else {
        await api.post(
          "/admin/hospitals",
          payload
        );

        setSaveSuccess(
          "Hospital added successfully."
        );
      }

      await loadHospitals();

      setTimeout(() => {
        closeForm();
        setSaveSuccess("");
      }, 900);
    } catch (e) {
      setSaveError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // ACTIVATE / DEACTIVATE
  // ============================================================

  async function toggleStatus(hospital) {
    const action = hospital.active
      ? "deactivate"
      : "activate";

    setActionId(hospital.id);
    setActionError("");
    setActionSuccess("");

    try {
      await api.put(
        `/admin/hospitals/${hospital.id}/${action}`
      );

      setActionSuccess(
        hospital.active
          ? `${hospital.hospitalName || "Hospital"} has been deactivated.`
          : `${hospital.hospitalName || "Hospital"} has been activated.`
      );

      await loadHospitals();

      setTimeout(() => {
        setActionSuccess("");
      }, 2500);
    } catch (e) {
      setActionError(errorMessage(e));
    } finally {
      setActionId(null);
    }
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <Page
      title="Hospitals"
      subtitle="Add, edit and manage hospitals available on Medinexus."
    >
      <div className="space-y-7">

        {/* ======================================================
            HEADER
        ======================================================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-sm">
          <div className="relative p-6 sm:p-8">

            <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-teal-500/10 blur-3xl" />

            <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <div className="inline-flex items-center rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-300">
                  Hospital Management
                </div>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Hospital Directory
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                  Manage hospital information, emergency services,
                  locations and availability across Medinexus.
                </p>
              </div>

              <Button onClick={openAddForm}>
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M12 5v14m-7-7h14"
                    />
                  </svg>

                  Add Hospital
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* ======================================================
            GLOBAL ACTION MESSAGES
        ======================================================= */}

        {actionError && (
          <Notice
            type="error"
            title="Unable to update hospital status"
            onClose={() => setActionError("")}
          >
            {actionError}
          </Notice>
        )}

        {actionSuccess && (
          <Notice
            type="success"
            title="Hospital status updated"
            onClose={() => setActionSuccess("")}
          >
            {actionSuccess}
          </Notice>
        )}

        {/* ======================================================
            SUMMARY
        ======================================================= */}

        <div className="grid gap-4 sm:grid-cols-3">

          <SummaryCard
            label="Total Hospitals"
            value={summary.total}
            description="Registered hospitals"
            icon="hospital"
            color="indigo"
          />

          <SummaryCard
            label="Active Hospitals"
            value={summary.active}
            description="Currently available"
            icon="active"
            color="emerald"
          />

          <SummaryCard
            label="Emergency Services"
            value={summary.emergency}
            description="Emergency enabled"
            icon="emergency"
            color="amber"
          />

        </div>

        {/* ======================================================
            ADD / EDIT FORM
        ======================================================= */}

        {showForm && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-6">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <HospitalIcon />
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {editingId
                        ? "Edit Hospital"
                        : "Add Hospital"}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {editingId
                        ? "Update the hospital information below."
                        : "Enter the hospital details to add it to Medinexus."}
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="self-start rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
                >
                  Cancel
                </button>

              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-5 sm:p-6"
              noValidate
            >

              {/* SERVER / VALIDATION ERROR */}

              {saveError && (
                <Notice
                  type="error"
                  title="Unable to save hospital"
                  onClose={() => setSaveError("")}
                >
                  {saveError}
                </Notice>
              )}

              {/* SUCCESS */}

              {saveSuccess && (
                <Notice
                  type="success"
                  title="Success"
                  onClose={() => setSaveSuccess("")}
                >
                  {saveSuccess}
                </Notice>
              )}

              {/* BASIC INFORMATION */}

              <div>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Basic Information
                  </h4>

                  <p className="mt-1 text-xs text-slate-500">
                    Provide the hospital's primary contact information.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  <Field
                    label="Hospital Name"
                    name="hospitalName"
                    value={form.hospitalName}
                    onChange={handleChange}
                    error={fieldErrors.hospitalName}
                    required
                  />

                  <Field
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    error={fieldErrors.city}
                  />

                  <Field
                    label="Contact Number"
                    name="contactNumber"
                    value={form.contactNumber}
                    onChange={handleChange}
                    error={fieldErrors.contactNumber}
                    required
                  />

                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    error={fieldErrors.email}
                  />

                </div>
              </div>

              {/* LOCATION */}

              <div className="border-t border-slate-100 pt-6">

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Location
                  </h4>

                  <p className="mt-1 text-xs text-slate-500">
                    Add the hospital address and coordinates for
                    location-based services.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  <div className="md:col-span-2">

                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Address
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      rows={3}
                      aria-invalid={Boolean(fieldErrors.address)}
                      className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                        fieldErrors.address
                          ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                          : "border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                      }`}
                      placeholder="Enter complete hospital address"
                    />

                    {fieldErrors.address && (
                      <FieldError>
                        {fieldErrors.address}
                      </FieldError>
                    )}

                  </div>

                  <Field
                    label="Latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={handleChange}
                    error={fieldErrors.latitude}
                    placeholder="e.g. 18.5204"
                  />

                  <Field
                    label="Longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={handleChange}
                    error={fieldErrors.longitude}
                    placeholder="e.g. 73.8567"
                  />

                </div>
              </div>

              {/* DESCRIPTION */}

              <div className="border-t border-slate-100 pt-6">

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Additional Information
                  </h4>

                  <p className="mt-1 text-xs text-slate-500">
                    Add a short description and service information.
                  </p>
                </div>

                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="Describe the hospital, facilities or services..."
                />

              </div>

              {/* EMERGENCY */}

              <div className="border-t border-slate-100 pt-6">

                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                    form.emergencyAvailable
                      ? "border-amber-200 bg-amber-50"
                      : "border-slate-200 bg-slate-50/60 hover:bg-slate-50"
                  }`}
                >

                  <input
                    type="checkbox"
                    name="emergencyAvailable"
                    checked={form.emergencyAvailable}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-amber-600 shadow-sm">
                    <EmergencyIcon />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Emergency services available
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Mark this hospital as providing emergency care.
                    </p>
                  </div>

                </label>

              </div>

              {/* ACTIONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row">

                <Button
                  type="submit"
                  loading={saving}
                  loadingText={
                    editingId
                      ? "Updating..."
                      : "Adding..."
                  }
                >
                  {editingId
                    ? "Update Hospital"
                    : "Add Hospital"}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </Button>

              </div>

            </form>
          </div>
        )}

        {/* ======================================================
            HOSPITAL LIST
        ======================================================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <div>
              <h3 className="text-base font-semibold text-slate-900">
                All Hospitals
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {hospitals.length} hospital
                {hospitals.length !== 1 ? "s" : ""} registered
              </p>
            </div>

            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Hospital Directory
            </div>

          </div>

          {loading && (
            <Loading text="Loading hospitals..." />
          )}

          {!loading && error && (
            <div className="p-5">
              <ErrorState
                title="Unable to load hospitals"
                message={error}
                onRetry={loadHospitals}
              />
            </div>
          )}

          {!loading &&
            !error &&
            hospitals.length === 0 && (
              <div className="p-5">
                <Empty
                  title="No hospitals yet"
                  action={
                    <Button onClick={openAddForm}>
                      Add First Hospital
                    </Button>
                  }
                >
                  Add your first hospital to start building
                  the Medinexus hospital directory.
                </Empty>
              </div>
            )}

          {!loading &&
            !error &&
            hospitals.length > 0 && (
              <div className="divide-y divide-slate-100">

                {hospitals.map((hospital) => (
                  <HospitalCard
                    key={hospital.id}
                    hospital={hospital}
                    onEdit={() =>
                      openEditForm(hospital)
                    }
                    onToggle={() =>
                      toggleStatus(hospital)
                    }
                    actionLoading={
                      actionId === hospital.id
                    }
                  />
                ))}

              </div>
            )}

        </div>
      </div>
    </Page>
  );
}

// ============================================================
// SUMMARY CARD
// ============================================================

function SummaryCard({
  label,
  value,
  description,
  icon,
  color,
}) {
  const colors = {
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      value: "text-slate-900",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      value: "text-emerald-600",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      value: "text-amber-600",
    },
  };

  const style = colors[color];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {label}
          </p>

          <p
            className={`mt-2 text-3xl font-bold tracking-tight ${style.value}`}
          >
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.bg} ${style.text}`}
        >
          <SummaryIcon type={icon} />
        </div>

      </div>
    </div>
  );
}

// ============================================================
// SUMMARY ICON
// ============================================================

function SummaryIcon({ type }) {
  if (type === "hospital") {
    return <HospitalIcon />;
  }

  if (type === "active") {
    return (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="m5 12 4 4L19 6"
        />
      </svg>
    );
  }

  return <EmergencyIcon />;
}

// ============================================================
// HOSPITAL CARD
// ============================================================

function HospitalCard({
  hospital,
  onEdit,
  onToggle,
  actionLoading,
}) {
  return (
    <div className="p-5 transition-colors hover:bg-slate-50/70 sm:p-6">

      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">

        <div className="min-w-0 flex-1">

          <div className="flex items-start gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <HospitalIcon />
            </div>

            <div className="min-w-0 flex-1">

              <div className="flex flex-wrap items-center gap-2">

                <h4 className="truncate text-base font-semibold text-slate-900">
                  {hospital.hospitalName ||
                    `Hospital #${hospital.id}`}
                </h4>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                    hospital.active
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      hospital.active
                        ? "bg-emerald-500"
                        : "bg-red-500"
                    }`}
                  />

                  {hospital.active
                    ? "Active"
                    : "Inactive"}
                </span>

                {hospital.emergencyAvailable && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    <EmergencyIcon small />
                    Emergency
                  </span>
                )}

              </div>

              <p className="mt-1 text-xs text-slate-400">
                Hospital ID: {hospital.id}
              </p>

            </div>
          </div>

          {/* ADDRESS */}

          <div className="mt-4 flex gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">

            <LocationIcon />

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Address
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {hospital.address ||
                  "No address provided"}
              </p>

              {hospital.city && (
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {hospital.city}
                </p>
              )}
            </div>

          </div>

          {/* CONTACT */}

          <div className="mt-3 grid gap-2 sm:grid-cols-2">

            {hospital.contactNumber && (
              <div className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2.5">

                <PhoneIcon />

                <span className="truncate text-xs text-slate-600">
                  {hospital.contactNumber}
                </span>

              </div>
            )}

            {hospital.email && (
              <div className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2.5">

                <EmailIcon />

                <span className="truncate text-xs text-slate-600">
                  {hospital.email}
                </span>

              </div>
            )}

          </div>

          {hospital.description && (
            <div className="mt-3">
              <p className="text-xs leading-relaxed text-slate-500">
                {hospital.description}
              </p>
            </div>
          )}

        </div>

        {/* ACTIONS */}

        <div className="flex shrink-0 flex-wrap gap-2 border-t border-slate-100 pt-4 xl:border-t-0 xl:pt-0">

          <Button
            variant="secondary"
            onClick={onEdit}
            disabled={actionLoading}
          >
            <span className="flex items-center gap-2">
              <EditIcon />
              Edit
            </span>
          </Button>

          <Button
            variant={
              hospital.active
                ? "danger"
                : "primary"
            }
            onClick={onToggle}
            loading={actionLoading}
            loadingText={
              hospital.active
                ? "Deactivating..."
                : "Activating..."
            }
          >
            {hospital.active
              ? "Deactivate"
              : "Activate"}
          </Button>

        </div>

      </div>
    </div>
  );
}

// ============================================================
// FORM FIELD
// ============================================================

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  step,
  placeholder,
  error,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        step={step}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        }`}
      />

      {error && (
        <FieldError>{error}</FieldError>
      )}
    </div>
  );
}

// ============================================================
// FIELD ERROR
// ============================================================

function FieldError({ children }) {
  return (
    <p className="mt-1.5 flex items-start gap-1.5 text-xs text-red-600">
      <svg
        className="mt-0.5 h-3.5 w-3.5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          strokeWidth="2"
        />
        <path
          strokeLinecap="round"
          strokeWidth="2"
          d="M12 8v4M12 16h.01"
        />
      </svg>

      <span>{children}</span>
    </p>
  );
}

// ============================================================
// ICONS
// ============================================================

function HospitalIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.7}
        d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 9h.01M15 9h.01M9 12h.01M15 12h.01"
      />
    </svg>
  );
}

function EmergencyIcon({ small = false }) {
  return (
    <svg
      className={small ? "h-3.5 w-3.5" : "h-5 w-5"}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M12 8v4l2.5 2.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"
      />
      <circle
        cx="12"
        cy="10"
        r="2.2"
        strokeWidth={1.8}
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-slate-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M5 4h3l2 5-2 2a15 15 0 0 0 5 5l2-2 5 2v3a2 2 0 0 1-2 2C10.3 21 3 13.7 3 5a2 2 0 0 1 2-2Z"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-slate-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M4 6h16v12H4z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="m4 7 8 6 8-6"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="m15.2 5.2 3.6 3.6M4 20l4.2-1 10.1-10.1a2.5 2.5 0 0 0-3.6-3.6L4.6 15.4 4 20Z"
      />
    </svg>
  );
}