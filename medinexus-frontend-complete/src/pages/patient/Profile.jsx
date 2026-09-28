import { useEffect, useState } from "react";
import {
  Card,
  Input,
  Select,
  Textarea,
  Button,
  Page,
  Loading,
  Notice,
} from "../../components/UI";
import api, { errorMessage } from "../../services/api";

const emptyForm = {
  dateOfBirth: "",
  gender: "",
  bloodGroup: "",
  address: "",
};

const bloodGroups = [
  { value: "A_POSITIVE", label: "A+" },
  { value: "A_NEGATIVE", label: "A-" },
  { value: "B_POSITIVE", label: "B+" },
  { value: "B_NEGATIVE", label: "B-" },
  { value: "AB_POSITIVE", label: "AB+" },
  { value: "AB_NEGATIVE", label: "AB-" },
  { value: "O_POSITIVE", label: "O+" },
  { value: "O_NEGATIVE", label: "O-" },
];

export default function PatientProfile() {
  const [user, setUser] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadUserAndProfile();
  }, []);

  async function loadUserAndProfile() {
    try {
      setLoading(true);
      setError("");

      // Get logged-in user from HttpOnly cookie
      const userResponse = await api.get("/auth/me");

      setUser(userResponse.data);

      // Get patient profile
      try {
        const response = await api.get("/patients/profile");

        const data = response.data;

        setForm({
          dateOfBirth: data.dateOfBirth || "",
          gender: data.gender || "",
          bloodGroup: data.bloodGroup || "",
          address: data.address || "",
        });

        setProfileExists(true);
      } catch (err) {
        // A missing profile is expected for a newly registered patient.
        if (err?.response?.status === 404) {
          setProfileExists(false);
          setForm(emptyForm);
        } else {
          throw err;
        }
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const payload = {
        dateOfBirth: form.dateOfBirth || null,
        gender: form.gender,
        bloodGroup: form.bloodGroup || null,
        address: form.address,
      };

      let response;

      if (profileExists) {
        response = await api.put(
          "/patients/profile",
          payload
        );
      } else {
        response = await api.post(
          "/patients/profile",
          payload
        );

        setProfileExists(true);
      }

      const data = response.data;

      setForm({
        dateOfBirth: data.dateOfBirth || "",
        gender: data.gender || "",
        bloodGroup: data.bloodGroup || "",
        address: data.address || "",
      });

      setSuccess(
        "Your patient profile has been saved successfully."
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Page
        title="My Profile"
        subtitle="Manage your personal and health information."
      >
        <Loading />
      </Page>
    );
  }

  return (
    <Page
      title="My Profile"
      subtitle="Manage your personal and health information."
    >
      <div className="space-y-6">
        {error && (
          <Notice type="error">
            {error}
          </Notice>
        )}

        {success && (
          <Notice type="success">
            {success}
          </Notice>
        )}

        {/* ACCOUNT INFORMATION */}
        <Card>
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Account Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your account details from your Medinexus account.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Name"
              value={
                user?.name ||
                user?.username ||
                ""
              }
              disabled
            />

            <Input
              label="Email"
              value={
                user?.email ||
                "Your registered email"
              }
              disabled
            />
          </div>
        </Card>

        {/* HEALTH PROFILE */}
        <Card>
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Health Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              This information helps Medinexus provide
              patient-specific healthcare services.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Date of Birth"
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
              />

              <Select
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select gender
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Other">
                  Other
                </option>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Blood Group"
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
              >
                <option value="">
                  Select blood group
                </option>

                {bloodGroups.map((group) => (
                  <option
                    key={group.value}
                    value={group.value}
                  >
                    {group.label}
                  </option>
                ))}
              </Select>
            </div>

            <Textarea
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter your current address"
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : profileExists
                    ? "Update Profile"
                    : "Create Profile"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Page>
  );
}