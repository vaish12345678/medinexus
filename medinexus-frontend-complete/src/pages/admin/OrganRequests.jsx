import { useEffect, useState } from "react";
import api, { errorMessage } from "../../services/api";
import { Button, Card, Page } from "../../components/UI";

function formatLabel(value) {
  if (!value) return "—";

  return value
    .toString()
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function StatusBadge({ status }) {
  const styles = {
    PENDING: "bg-amber-100 text-amber-800",
    APPROVED: "bg-green-100 text-green-800",
    ACTIVE: "bg-emerald-100 text-emerald-800",
    REJECTED: "bg-red-100 text-red-800",
    WITHDRAWN: "bg-slate-200 text-slate-700",
    FULFILLED: "bg-blue-100 text-blue-800",
    CANCELLED: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {formatLabel(status)}
    </span>
  );
}

function UrgencyBadge({ urgency }) {
  const styles = {
    ROUTINE: "bg-slate-100 text-slate-700",
    URGENT: "bg-orange-100 text-orange-800",
    CRITICAL: "bg-red-100 text-red-800",
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

function DetailRow({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </h3>
  );
}

/* =========================================================
   LOADING / ERROR / EMPTY STATE
========================================================= */

function SectionState({
  loading,
  error,
  data,
  onRetry,
  children,
}) {
  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-teal-700" />

          <span className="ml-3 text-sm text-slate-600">
            Loading...
          </span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="py-8 text-center">
          <p className="text-sm text-red-600">
            {error}
          </p>

          <Button
            className="mt-4"
            onClick={onRetry}
          >
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <div className="py-10 text-center">
          <p className="text-sm text-slate-500">
            No records found.
          </p>
        </div>
      </Card>
    );
  }

  return children;
}

/* =========================================================
   ORGAN REQUESTS
========================================================= */

function OrganRequestsSection() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRequests() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/organ-requests"
      );

      const result = response.data;

      const requests = Array.isArray(result)
        ? result
        : result?.content ||
          result?.data ||
          [];

      setData(requests);
    } catch (e) {
      setError(errorMessage(e));
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function act(id, action) {
    try {
      await api.put(
        `/admin/organ-requests/${id}/${action}`
      );

      location.reload();
    } catch (e) {
      alert(errorMessage(e));
    }
  }

  return (
    <SectionState
      loading={loading}
      error={error}
      data={data}
      onRetry={loadRequests}
    >
      <div className="grid gap-5">
        {data.map((request) => (
          <Card key={request.id}>
            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Organ Request #{request.id}
              </h2>

              <StatusBadge status={request.status} />
            </div>

            {/* REQUEST OVERVIEW */}
            <div className="mb-6">
              <SectionTitle>
                Request Overview
              </SectionTitle>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <DetailRow
                  label="Organ Required"
                  value={formatLabel(request.organType)}
                />

                <DetailRow
                  label="Blood Group"
                  value={formatLabel(request.bloodGroup)}
                />

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Urgency
                  </p>

                  <div className="mt-1">
                    <UrgencyBadge
                      urgency={request.urgency}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Status
                  </p>

                  <div className="mt-1">
                    <StatusBadge
                      status={request.status}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* MEDICAL INFORMATION */}
            <div className="mb-6 border-t border-slate-200 pt-6">
              <SectionTitle>
                Medical Information
              </SectionTitle>

              <div className="grid gap-5 sm:grid-cols-2">
                <DetailRow
                  label="Diagnosis"
                  value={request.diagnosis}
                />

                <DetailRow
                  label="Reason for Transplant"
                  value={request.transplantReason}
                />

                <DetailRow
                  label="Current Treatment"
                  value={request.currentTreatment}
                />

                <DetailRow
                  label="Additional Medical Notes"
                  value={request.additionalNotes}
                />
              </div>
            </div>

            {/* DOCTOR / HOSPITAL */}
            <div className="mb-6 border-t border-slate-200 pt-6">
              <SectionTitle>
                Doctor & Hospital Information
              </SectionTitle>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <DetailRow
                  label="Doctor Name"
                  value={request.doctorName}
                />

                <DetailRow
                  label="Doctor Contact"
                  value={request.doctorContact}
                />

                <DetailRow
                  label="Hospital Name"
                  value={request.hospitalName}
                />

                <DetailRow
                  label="Hospital City"
                  value={request.hospitalCity}
                />
              </div>
            </div>

            {/* SUPPORTING DOCUMENT */}
            <div className="mb-6 border-t border-slate-200 pt-6">
              <SectionTitle>
                Supporting Medical Document
              </SectionTitle>

              {request.medicalDocumentUrl ? (
                <a
                  href={request.medicalDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-sm font-medium text-teal-700 underline hover:text-teal-800"
                >
                  View Medical Document
                </a>
              ) : (
                <p className="text-sm text-slate-500">
                  No medical document provided.
                </p>
              )}
            </div>

            {/* TIMELINE */}
            <div className="mb-6 border-t border-slate-200 pt-6">
              <SectionTitle>
                Request Timeline
              </SectionTitle>

              <div className="grid gap-5 sm:grid-cols-2">
                <DetailRow
                  label="Submitted At"
                  value={formatDate(request.createdAt)}
                />

                <DetailRow
                  label="Last Updated"
                  value={formatDate(request.updatedAt)}
                />
              </div>
            </div>

            {/* ACTIONS */}
            {request.status === "PENDING" && (
              <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
                <Button
                  onClick={() =>
                    act(request.id, "approve")
                  }
                >
                  Approve Request
                </Button>

                <Button
                  variant="danger"
                  onClick={() =>
                    act(request.id, "reject")
                  }
                >
                  Reject Request
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </SectionState>
  );
}

/* =========================================================
   ORGAN DONORS
========================================================= */

function OrganDonorsSection() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDonors() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/organ-donors"
      );

      const result = response.data;

      const donors = Array.isArray(result)
        ? result
        : result?.content ||
          result?.data ||
          [];

      setData(donors);
    } catch (e) {
      setError(errorMessage(e));
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDonors();
  }, []);

  async function act(id, action) {
    try {
      await api.put(
        `/admin/organ-donors/${id}/${action}`
      );

      location.reload();
    } catch (e) {
      alert(errorMessage(e));
    }
  }

  return (
    <SectionState
      loading={loading}
      error={error}
      data={data}
      onRetry={loadDonors}
    >
      <div className="grid gap-5">
        {data.map((donor) => (
          <Card key={donor.id}>
            {/* HEADER */}
            <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Organ Donor #{donor.id}
              </h2>

              <StatusBadge status={donor.status} />
            </div>

            {/* DONOR OVERVIEW */}
            <div className="mb-6">
              <SectionTitle>
                Donor Overview
              </SectionTitle>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <DetailRow
                  label="Patient ID"
                  value={donor.patientId}
                />

                <DetailRow
                  label="Donation Type"
                  value={formatLabel(donor.donationType)}
                />

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Status
                  </p>

                  <div className="mt-1">
                    <StatusBadge
                      status={donor.status}
                    />
                  </div>
                </div>

                <DetailRow
                  label="Consent"
                  value={
                    donor.consent
                      ? "Provided"
                      : "Not Provided"
                  }
                />
              </div>
            </div>

            {/* ORGANS */}
            <div className="mb-6 border-t border-slate-200 pt-6">
              <SectionTitle>
                Organs Willing to Donate
              </SectionTitle>

              {donor.organTypes?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {donor.organTypes.map((organ) => (
                    <span
                      key={organ}
                      className="rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800"
                    >
                      {formatLabel(organ)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No organs specified.
                </p>
              )}
            </div>

            {/* MEDICAL INFORMATION */}
            <div className="mb-6 border-t border-slate-200 pt-6">
              <SectionTitle>
                Medical Information
              </SectionTitle>

              <div className="grid gap-5 sm:grid-cols-2">
                <DetailRow
                  label="Medical History"
                  value={donor.medicalHistory}
                />

                <DetailRow
                  label="Existing Medical Conditions"
                  value={donor.medicalConditions}
                />

                <DetailRow
                  label="Current Medications"
                  value={donor.currentMedications}
                />

                <DetailRow
                  label="Previous Surgeries"
                  value={donor.previousSurgeries}
                />

                <DetailRow
                  label="Allergies"
                  value={donor.allergies}
                />

                <DetailRow
                  label="Additional Medical Notes"
                  value={donor.additionalMedicalNotes}
                />
              </div>
            </div>

            {/* EMERGENCY CONTACT */}
            <div className="mb-6 border-t border-slate-200 pt-6">
              <SectionTitle>
                Emergency Contact
              </SectionTitle>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <DetailRow
                  label="Name"
                  value={donor.emergencyContactName}
                />

                <DetailRow
                  label="Relationship"
                  value={donor.emergencyContactRelation}
                />

                <DetailRow
                  label="Contact Number"
                  value={donor.emergencyContactNumber}
                />
              </div>
            </div>

            {/* MEDICAL DOCUMENT */}
            <div className="mb-6 border-t border-slate-200 pt-6">
              <SectionTitle>
                Supporting Medical Document
              </SectionTitle>

              {donor.medicalDocumentUrl ? (
                <a
                  href={donor.medicalDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-sm font-medium text-teal-700 underline hover:text-teal-800"
                >
                  View Medical Document
                </a>
              ) : (
                <p className="text-sm text-slate-500">
                  No medical document provided.
                </p>
              )}
            </div>

            {/* TIMELINE */}
            <div className="mb-6 border-t border-slate-200 pt-6">
              <SectionTitle>
                Registration Timeline
              </SectionTitle>

              <div className="grid gap-5 sm:grid-cols-2">
                <DetailRow
                  label="Registered At"
                  value={formatDate(donor.createdAt)}
                />

                <DetailRow
                  label="Last Updated"
                  value={formatDate(donor.updatedAt)}
                />
              </div>
            </div>

            {/* DONOR ACTIONS */}
            <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
              {donor.status === "PENDING" && (
                <>
                  <Button
                    onClick={() =>
                      act(donor.id, "approve")
                    }
                  >
                    Approve Donor
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() =>
                      act(donor.id, "reject")
                    }
                  >
                    Reject Donor
                  </Button>
                </>
              )}

              {donor.status === "APPROVED" && (
                <Button
                  onClick={() =>
                    act(donor.id, "activate")
                  }
                >
                  Activate Donor
                </Button>
              )}

              {donor.status === "ACTIVE" && (
                <Button
                  variant="danger"
                  onClick={() =>
                    act(donor.id, "withdraw")
                  }
                >
                  Withdraw Donor
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </SectionState>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function OrganManagement() {
  const [activeTab, setActiveTab] = useState("requests");

  return (
    <Page
      title="Organ Management"
      subtitle="Manage organ requests and organ donor registrations."
    >
      {/* TABS */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("requests")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            activeTab === "requests"
              ? "bg-teal-700 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Organ Requests
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("donors")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            activeTab === "donors"
              ? "bg-teal-700 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Organ Donors
        </button>
      </div>

      {/* REQUESTS TAB */}
      {activeTab === "requests" && (
        <OrganRequestsSection />
      )}

      {/* DONORS TAB */}
      {activeTab === "donors" && (
        <OrganDonorsSection />
      )}
    </Page>
  );
}