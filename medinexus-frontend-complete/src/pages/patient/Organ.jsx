import { useEffect, useState } from "react";
import api, { errorMessage } from "../../services/api";
import {
  Button,
  Card,
  Input,
  Page,
  Select,
  Textarea,
} from "../../components/UI";

const ORGAN_TYPES = [
  "KIDNEY",
  "LIVER",
  "HEART",
  "LUNG",
  "PANCREAS",
  "CORNEA",
];

const BLOOD_GROUPS = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
];

const URGENCY_LEVELS = [
  "ROUTINE",
  "URGENT",
  "CRITICAL",
];

function formatBloodGroup(value) {
  if (!value) return "";

  return value
    .replace("_POSITIVE", " +")
    .replace("_NEGATIVE", " -");
}

function formatLabel(value) {
  if (!value) return "";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function StatusBadge({ status }) {
  const styles = {
    PENDING: "bg-amber-100 text-amber-700",
    APPROVED: "bg-emerald-100 text-emerald-700",
    ACTIVE: "bg-emerald-100 text-emerald-700",
    FULFILLED: "bg-blue-100 text-blue-700",
    CANCELLED: "bg-slate-100 text-slate-700",
    REJECTED: "bg-red-100 text-red-700",
    WITHDRAWN: "bg-slate-100 text-slate-700",
    INACTIVE: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {formatLabel(status) || "Unknown"}
    </span>
  );
}

function UrgencyBadge({ urgency }) {
  const styles = {
    ROUTINE: "bg-slate-100 text-slate-700",
    URGENT: "bg-amber-100 text-amber-700",
    CRITICAL: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[urgency] || "bg-slate-100 text-slate-700"
      }`}
    >
      {formatLabel(urgency)}
    </span>
  );
}

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-900">
        {title}
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default function Organ() {
  const [activeTab, setActiveTab] = useState("request");

  const [requests, setRequests] = useState([]);
  const [requestLoading, setRequestLoading] = useState(true);
  const [requestError, setRequestError] = useState("");

  const [donor, setDonor] = useState(null);
  const [donorLoading, setDonorLoading] = useState(true);
  const [donorError, setDonorError] = useState("");

  const [requestForm, setRequestForm] = useState({
    organType: "KIDNEY",
    bloodGroup: "O_POSITIVE",
    urgency: "ROUTINE",
    diagnosis: "",
    transplantReason: "",
    currentTreatment: "",
    doctorName: "",
    hospitalName: "",
    hospitalCity: "",
    doctorContact: "",
    medicalDocumentUrl: "",
    additionalNotes: "",
  });

  const [donorForm, setDonorForm] = useState({
    organTypes: ["KIDNEY"],
    donationType: "BOTH",
    medicalHistory: "",
    medicalConditions: "",
    currentMedications: "",
    previousSurgeries: "",
    allergies: "",
    additionalMedicalNotes: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactNumber: "",
    consent: false,
    medicalDocumentUrl: "",
  });

  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [donorSubmitting, setDonorSubmitting] = useState(false);

  // =========================================================
  // LOAD REQUESTS
  // =========================================================

  async function loadRequests() {
    setRequestLoading(true);
    setRequestError("");

    try {
      const response = await api.get("/organ-requests/my");

      setRequests(
        Array.isArray(response.data)
          ? response.data
          : [],
      );
    } catch (error) {
      setRequestError(errorMessage(error));
    } finally {
      setRequestLoading(false);
    }
  }

  // =========================================================
  // LOAD DONOR
  // =========================================================

  async function loadDonor() {
    setDonorLoading(true);
    setDonorError("");

    try {
      const response = await api.get("/organ-donors/my");

      setDonor(response.data);
    } catch (error) {
      if (error?.response?.status === 404) {
        setDonor(null);
      } else {
        setDonorError(errorMessage(error));
      }
    } finally {
      setDonorLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
    loadDonor();
  }, []);

  // =========================================================
  // REQUEST FORM HANDLER
  // =========================================================

  function handleRequestChange(e) {
    const { name, value } = e.target;

    setRequestForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // =========================================================
  // SUBMIT ORGAN REQUEST
  // =========================================================

  async function submitRequest(e) {
    e.preventDefault();

    if (
      !requestForm.organType ||
      !requestForm.bloodGroup ||
      !requestForm.urgency
    ) {
      alert("Please complete the organ, blood group and urgency fields.");
      return;
    }

    if (
      !requestForm.diagnosis.trim() ||
      !requestForm.transplantReason.trim()
    ) {
      alert("Please provide the diagnosis and transplant reason.");
      return;
    }

    if (
      !requestForm.doctorName.trim() ||
      !requestForm.hospitalName.trim() ||
      !requestForm.hospitalCity.trim() ||
      !requestForm.doctorContact.trim()
    ) {
      alert("Please complete the doctor and hospital information.");
      return;
    }

    setRequestSubmitting(true);

    try {
      await api.post("/organ-requests", requestForm);

      alert(
        "Organ request submitted successfully. It is now pending admin review.",
      );

      setRequestForm({
        organType: "KIDNEY",
        bloodGroup: "O_POSITIVE",
        urgency: "ROUTINE",
        diagnosis: "",
        transplantReason: "",
        currentTreatment: "",
        doctorName: "",
        hospitalName: "",
        hospitalCity: "",
        doctorContact: "",
        medicalDocumentUrl: "",
        additionalNotes: "",
      });

      await loadRequests();
    } catch (error) {
      alert(errorMessage(error));
    } finally {
      setRequestSubmitting(false);
    }
  }

  // =========================================================
  // DONOR ORGAN TOGGLE
  // =========================================================

  function toggleDonorOrgan(organ) {
    setDonorForm((previous) => {
      const exists = previous.organTypes.includes(organ);

      if (exists) {
        return {
          ...previous,
          organTypes: previous.organTypes.filter(
            (item) => item !== organ,
          ),
        };
      }

      return {
        ...previous,
        organTypes: [
          ...previous.organTypes,
          organ,
        ],
      };
    });
  }

  // =========================================================
  // DONOR FORM HANDLER
  // =========================================================

  function handleDonorChange(e) {
    const { name, value, type, checked } = e.target;

    setDonorForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  // =========================================================
  // REGISTER DONOR
  // =========================================================

  async function registerDonor(e) {
    e.preventDefault();

    if (!donorForm.organTypes.length) {
      alert("Please select at least one organ.");
      return;
    }

    if (!donorForm.donationType) {
      alert("Please select a donation type.");
      return;
    }

    if (!donorForm.medicalHistory.trim()) {
      alert("Please provide your medical history.");
      return;
    }

    if (
      !donorForm.emergencyContactName.trim() ||
      !donorForm.emergencyContactRelation.trim() ||
      !donorForm.emergencyContactNumber.trim()
    ) {
      alert("Please complete the emergency contact information.");
      return;
    }

    if (!donorForm.consent) {
      alert(
        "Please provide your consent to register as an organ donor.",
      );
      return;
    }

    setDonorSubmitting(true);

    try {
      const response = await api.post(
        "/organ-donors",
        donorForm,
      );

      setDonor(response.data);

      alert(
        "Your organ donor registration has been submitted for admin verification.",
      );

      setDonorForm({
        organTypes: ["KIDNEY"],
        donationType: "BOTH",
        medicalHistory: "",
        medicalConditions: "",
        currentMedications: "",
        previousSurgeries: "",
        allergies: "",
        additionalMedicalNotes: "",
        emergencyContactName: "",
        emergencyContactRelation: "",
        emergencyContactNumber: "",
        consent: false,
        medicalDocumentUrl: "",
      });
    } catch (error) {
      alert(errorMessage(error));
    } finally {
      setDonorSubmitting(false);
    }
  }

  return (
    <Page
      title="Organ Donation & Requests"
      subtitle="Register as an organ donor or submit and track an organ request."
    >
      {/* =====================================================
          HERO
      ====================================================== */}

      <div className="mb-8 overflow-hidden rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">
            Medinexus Organ Care
          </p>

          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
            Help someone receive the care they need.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Register your willingness to donate an organ or submit
            an organ requirement. Requests are reviewed through the
            Medinexus workflow.
          </p>
        </div>
      </div>

      {/* =====================================================
          TABS
      ====================================================== */}

      <div className="mb-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("request")}
          className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
            activeTab === "request"
              ? "bg-teal-600 text-white shadow-sm"
              : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
          }`}
        >
          🏥 Organ Request
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("donor")}
          className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
            activeTab === "donor"
              ? "bg-teal-600 text-white shadow-sm"
              : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
          }`}
        >
          🫀 Become a Donor
        </button>
      </div>

      {/* =====================================================
          ORGAN REQUEST
      ====================================================== */}

      {activeTab === "request" && (
        <div className="space-y-8">

          {/* REQUEST FORM */}

          <Card>
            <SectionHeader
              eyebrow="Need an organ"
              title="Submit an organ request"
              description="Provide the essential medical and hospital information needed for your request. Your request will remain pending until it is reviewed."
            />

            <form
              onSubmit={submitRequest}
              className="space-y-8"
            >

              {/* ORGAN REQUIREMENT */}

              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-700">
                  Organ requirement
                </h3>

                <div className="grid gap-5 sm:grid-cols-3">

                  <Select
                    label="Organ required"
                    name="organType"
                    value={requestForm.organType}
                    onChange={handleRequestChange}
                  >
                    {ORGAN_TYPES.map((organ) => (
                      <option
                        key={organ}
                        value={organ}
                      >
                        {formatLabel(organ)}
                      </option>
                    ))}
                  </Select>

                  <Select
                    label="Blood group"
                    name="bloodGroup"
                    value={requestForm.bloodGroup}
                    onChange={handleRequestChange}
                  >
                    {BLOOD_GROUPS.map((group) => (
                      <option
                        key={group}
                        value={group}
                      >
                        {formatBloodGroup(group)}
                      </option>
                    ))}
                  </Select>

                  <Select
                    label="Urgency"
                    name="urgency"
                    value={requestForm.urgency}
                    onChange={handleRequestChange}
                  >
                    {URGENCY_LEVELS.map((level) => (
                      <option
                        key={level}
                        value={level}
                      >
                        {formatLabel(level)}
                      </option>
                    ))}
                  </Select>

                </div>
              </div>


              {/* MEDICAL INFORMATION */}

              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-700">
                  Medical information
                </h3>

                <div className="grid gap-5">

                  <Textarea
                    label="Diagnosis / medical condition"
                    name="diagnosis"
                    placeholder="Describe the diagnosed condition requiring the transplant..."
                    value={requestForm.diagnosis}
                    onChange={handleRequestChange}
                  />

                  <Textarea
                    label="Reason for transplant"
                    name="transplantReason"
                    placeholder="Explain why the transplant is required..."
                    value={requestForm.transplantReason}
                    onChange={handleRequestChange}
                  />

                  <Textarea
                    label="Current treatment"
                    name="currentTreatment"
                    placeholder="Mention current treatment, medication or ongoing care..."
                    value={requestForm.currentTreatment}
                    onChange={handleRequestChange}
                  />

                </div>
              </div>


              {/* DOCTOR / HOSPITAL */}

              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-700">
                  Doctor & hospital information
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">

                  <Input
                    label="Doctor name"
                    name="doctorName"
                    placeholder="Enter treating doctor's name"
                    value={requestForm.doctorName}
                    onChange={handleRequestChange}
                  />

                  <Input
                    label="Doctor contact"
                    name="doctorContact"
                    placeholder="Phone number"
                    value={requestForm.doctorContact}
                    onChange={handleRequestChange}
                  />

                  <Input
                    label="Hospital name"
                    name="hospitalName"
                    placeholder="Enter hospital name"
                    value={requestForm.hospitalName}
                    onChange={handleRequestChange}
                  />

                  <Input
                    label="Hospital city"
                    name="hospitalCity"
                    placeholder="Enter hospital city"
                    value={requestForm.hospitalCity}
                    onChange={handleRequestChange}
                  />

                </div>
              </div>


              {/* SUPPORTING INFORMATION */}

              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-700">
                  Supporting information
                </h3>

                <div className="grid gap-5">

                  <Input
                    label="Medical document URL (optional)"
                    name="medicalDocumentUrl"
                    placeholder="Document URL, if already uploaded"
                    value={requestForm.medicalDocumentUrl}
                    onChange={handleRequestChange}
                  />

                  <Textarea
                    label="Additional medical notes (optional)"
                    name="additionalNotes"
                    placeholder="Add any other relevant information..."
                    value={requestForm.additionalNotes}
                    onChange={handleRequestChange}
                  />

                </div>
              </div>


              {/* SUBMIT */}

              <div className="border-t border-slate-200 pt-6">
                <Button
                  type="submit"
                  disabled={requestSubmitting}
                >
                  {requestSubmitting
                    ? "Submitting..."
                    : "Submit Organ Request"}
                </Button>
              </div>

            </form>
          </Card>


          {/* MY REQUESTS */}

          <Card>
            <SectionHeader
              eyebrow="Track"
              title="My organ requests"
              description="View the requests you have submitted and their current status."
            />

            {requestLoading && (
              <div className="py-8 text-center text-sm text-slate-500">
                Loading your requests...
              </div>
            )}

            {!requestLoading && requestError && (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {requestError}
              </div>
            )}

            {!requestLoading &&
              !requestError &&
              requests.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <div className="text-3xl">🏥</div>

                  <h3 className="mt-3 font-semibold text-slate-900">
                    No organ requests yet
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Your submitted organ requests will appear here.
                  </p>
                </div>
              )}

            {!requestLoading &&
              !requestError &&
              requests.length > 0 && (
                <div className="space-y-4">

                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >

                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Request #{request.id}
                          </p>

                          <h3 className="mt-1 text-lg font-bold text-slate-900">
                            {formatLabel(request.organType)}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            Blood group:{" "}
                            {formatBloodGroup(request.bloodGroup)}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <UrgencyBadge
                            urgency={request.urgency}
                          />

                          <StatusBadge
                            status={request.status}
                          />
                        </div>

                      </div>


                      <div className="mt-5 grid gap-4 sm:grid-cols-2">

                        <div className="rounded-xl bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Diagnosis
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {request.diagnosis ||
                              "Not provided."}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Transplant reason
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {request.transplantReason ||
                              "Not provided."}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Doctor
                          </p>

                          <p className="mt-2 text-sm text-slate-700">
                            {request.doctorName ||
                              "Not provided."}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {request.doctorContact ||
                              "No contact provided"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Hospital
                          </p>

                          <p className="mt-2 text-sm text-slate-700">
                            {request.hospitalName ||
                              "Not provided."}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {request.hospitalCity || ""}
                          </p>
                        </div>

                      </div>


                      {request.currentTreatment && (
                        <div className="mt-4 rounded-xl bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Current treatment
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {request.currentTreatment}
                          </p>
                        </div>
                      )}


                      {request.additionalNotes && (
                        <div className="mt-4 rounded-xl bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Additional notes
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {request.additionalNotes}
                          </p>
                        </div>
                      )}


                      <div className="mt-4 flex flex-wrap gap-5 text-xs text-slate-500">

                        {request.createdAt && (
                          <span>
                            Submitted:{" "}
                            {new Date(
                              request.createdAt,
                            ).toLocaleDateString()}
                          </span>
                        )}

                        {request.updatedAt && (
                          <span>
                            Updated:{" "}
                            {new Date(
                              request.updatedAt,
                            ).toLocaleDateString()}
                          </span>
                        )}

                      </div>

                    </div>
                  ))}

                </div>
              )}

          </Card>
        </div>
      )}


      {/* =====================================================
          ORGAN DONOR
      ====================================================== */}

      {activeTab === "donor" && (
        <div className="space-y-8">

          {/* EXISTING DONOR */}

          {!donorLoading && donor && (
            <Card>

              <SectionHeader
                eyebrow="Your donor registration"
                title="Donation status"
                description="Your donor registration is managed through the Medinexus verification workflow."
              />

              <div className="rounded-2xl bg-slate-950 p-6 text-white">

                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
                      Registered organs
                    </p>

                    <h3 className="mt-2 text-2xl font-bold">
                      {Array.isArray(donor.organTypes)
                        ? donor.organTypes
                            .map(formatLabel)
                            .join(", ")
                        : "Not specified"}
                    </h3>
                  </div>

                  <StatusBadge status={donor.status} />

                </div>

                <div className="mt-6 border-t border-slate-700 pt-5">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Donation type
                  </p>

                  <p className="mt-2 text-sm text-slate-300">
                    {formatLabel(donor.donationType)}
                  </p>

                </div>

                {donor.createdAt && (
                  <p className="mt-5 text-xs text-slate-400">
                    Registered on{" "}
                    {new Date(
                      donor.createdAt,
                    ).toLocaleDateString()}
                  </p>
                )}

              </div>
            </Card>
          )}


          {/* DONOR FORM */}

          {!donorLoading && !donor && (
            <Card>

              <SectionHeader
                eyebrow="Become a donor"
                title="Register as an organ donor"
                description="Provide the information needed for your donor registration. Your registration will be sent to the administrator for verification."
              />

              <form
                onSubmit={registerDonor}
                className="space-y-8"
              >

                {/* ORGANS */}

                <div>
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-700">
                    Organs you are willing to donate
                  </h3>

                  <div className="grid gap-3 sm:grid-cols-3">

                    {ORGAN_TYPES.map((organ) => {
                      const selected =
                        donorForm.organTypes.includes(
                          organ,
                        );

                      return (
                        <label
                          key={organ}
                          className={`cursor-pointer rounded-xl border p-4 transition ${
                            selected
                              ? "border-teal-500 bg-teal-50"
                              : "border-slate-200 bg-white hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() =>
                              toggleDonorOrgan(
                                organ,
                              )
                            }
                            className="mr-3"
                          />

                          <span className="text-sm font-semibold text-slate-800">
                            {formatLabel(organ)}
                          </span>
                        </label>
                      );
                    })}

                  </div>
                </div>


                {/* DONATION TYPE */}

                <Select
                  label="Donation type / intent"
                  name="donationType"
                  value={donorForm.donationType}
                  onChange={handleDonorChange}
                >
                  <option value="LIVING_DONATION">
                    Living Donation
                  </option>

                  <option value="DECEASED_DONATION">
                    Deceased Donation
                  </option>

                  <option value="BOTH">
                    Both
                  </option>
                </Select>


                {/* MEDICAL INFORMATION */}

                <div>
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-700">
                    Medical information
                  </h3>

                  <div className="grid gap-5">

                    <Textarea
                      label="Medical history"
                      name="medicalHistory"
                      placeholder="Provide relevant medical history..."
                      value={donorForm.medicalHistory}
                      onChange={handleDonorChange}
                    />

                    <Textarea
                      label="Existing medical conditions"
                      name="medicalConditions"
                      placeholder="Mention any existing medical conditions..."
                      value={donorForm.medicalConditions}
                      onChange={handleDonorChange}
                    />

                    <Textarea
                      label="Current medications"
                      name="currentMedications"
                      placeholder="List current medications, if any..."
                      value={donorForm.currentMedications}
                      onChange={handleDonorChange}
                    />

                    <Textarea
                      label="Previous surgeries"
                      name="previousSurgeries"
                      placeholder="Mention previous surgeries, if any..."
                      value={donorForm.previousSurgeries}
                      onChange={handleDonorChange}
                    />

                    <Textarea
                      label="Allergies"
                      name="allergies"
                      placeholder="Mention known allergies, if any..."
                      value={donorForm.allergies}
                      onChange={handleDonorChange}
                    />

                    <Textarea
                      label="Additional medical notes"
                      name="additionalMedicalNotes"
                      placeholder="Any other relevant medical information..."
                      value={
                        donorForm.additionalMedicalNotes
                      }
                      onChange={handleDonorChange}
                    />

                  </div>
                </div>


                {/* EMERGENCY CONTACT */}

                <div>
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-700">
                    Emergency contact
                  </h3>

                  <div className="grid gap-5 sm:grid-cols-3">

                    <Input
                      label="Contact name"
                      name="emergencyContactName"
                      placeholder="Full name"
                      value={
                        donorForm.emergencyContactName
                      }
                      onChange={handleDonorChange}
                    />

                    <Input
                      label="Relationship"
                      name="emergencyContactRelation"
                      placeholder="e.g. Parent, sibling"
                      value={
                        donorForm.emergencyContactRelation
                      }
                      onChange={handleDonorChange}
                    />

                    <Input
                      label="Contact number"
                      name="emergencyContactNumber"
                      placeholder="Phone number"
                      value={
                        donorForm.emergencyContactNumber
                      }
                      onChange={handleDonorChange}
                    />

                  </div>
                </div>


                {/* DOCUMENT */}

                <Input
                  label="Medical document URL (optional)"
                  name="medicalDocumentUrl"
                  placeholder="Document URL, if already uploaded"
                  value={donorForm.medicalDocumentUrl}
                  onChange={handleDonorChange}
                />


                {/* CONSENT */}

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <input
                    type="checkbox"
                    name="consent"
                    checked={donorForm.consent}
                    onChange={handleDonorChange}
                    className="mt-1"
                  />

                  <span className="text-sm leading-6 text-slate-600">
                    I acknowledge that I am voluntarily registering
                    my willingness to donate organs and consent to
                    the information being reviewed as part of the
                    Medinexus donor-registration workflow.
                  </span>

                </label>


                {/* SUBMIT */}

                <div className="border-t border-slate-200 pt-6">

                  <Button
                    type="submit"
                    disabled={donorSubmitting}
                  >
                    {donorSubmitting
                      ? "Submitting..."
                      : "Register as Organ Donor"}
                  </Button>

                </div>

              </form>
            </Card>
          )}


          {/* LOADING */}

          {donorLoading && (
            <Card>
              <div className="py-8 text-center text-sm text-slate-500">
                Checking your donor registration...
              </div>
            </Card>
          )}


          {/* ERROR */}

          {!donorLoading && donorError && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {donorError}
            </div>
          )}


          {/* INFORMATION */}

          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">

            <h3 className="font-semibold text-teal-900">
              How donor registration works
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">

              <div>
                <div className="text-xl">1️⃣</div>

                <p className="mt-2 text-sm font-semibold text-slate-900">
                  Register
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Submit your donor information.
                </p>
              </div>

              <div>
                <div className="text-xl">2️⃣</div>

                <p className="mt-2 text-sm font-semibold text-slate-900">
                  Verification
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  An administrator reviews your registration.
                </p>
              </div>

              <div>
                <div className="text-xl">3️⃣</div>

                <p className="mt-2 text-sm font-semibold text-slate-900">
                  Active
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Your donor status can become active after approval.
                </p>
              </div>

            </div>
          </div>

        </div>
      )}
    </Page>
  );
}