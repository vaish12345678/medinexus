import { useEffect, useState } from "react";
import api, { errorMessage } from "../../services/api";
import { Button, Card, Input, Page, Textarea } from "../../components/UI";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [f, setF] = useState({
    pharmacyName: "",
    address: "",
    licenseUrl: "",
  });

  // Load existing pharmacy profile
  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await api.get("/pharmacies/profile/me");

        const data = response.data;

        setF({
          pharmacyName: data.pharmacyName || "",
          address: data.address || "",
          licenseUrl: data.licenseUrl || "",
        });
      } catch (e) {
        // 404 means profile has not been created yet
        if (e.response?.status !== 404) {
          setError(errorMessage(e));
        }
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function change(e) {
    setF((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function save(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!f.pharmacyName.trim()) {
      setError("Pharmacy name is required.");
      return;
    }

    if (!f.address.trim()) {
      setError("Address is required.");
      return;
    }

    try {
      setSaving(true);

      await api.post("/pharmacies/profile", {
        pharmacyName: f.pharmacyName.trim(),
        address: f.address.trim(),
        licenseUrl: f.licenseUrl.trim(),
      });

      setSuccess("Pharmacy profile saved successfully.");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Page
        title="My Profile"
        subtitle="Manage your pharmacy profile."
      >
        <Card>
          <p className="text-sm text-slate-500">
            Loading profile...
          </p>
        </Card>
      </Page>
    );
  }

  return (
    <Page
      title="My Profile"
      subtitle="Create and manage your pharmacy information."
    >
      <Card>
        <form onSubmit={save} className="space-y-5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <Input
            label="Pharmacy Name"
            name="pharmacyName"
            value={f.pharmacyName}
            onChange={change}
            required
            placeholder="Enter pharmacy name"
          />

          <Textarea
            label="Address"
            name="address"
            value={f.address}
            onChange={change}
            required
            placeholder="Enter complete pharmacy address"
          />

          <Input
            label="License URL"
            name="licenseUrl"
            value={f.licenseUrl}
            onChange={change}
            placeholder="Optional"
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </Card>
    </Page>
  );
}