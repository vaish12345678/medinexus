import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Input,
  Page,
  Notice,
  Loading,
  Textarea,
} from "../components/UI";
import { API_URL } from "../services/api";

function getErrorMessage(data) {
  return (
    data?.message ||
    data?.error ||
    "Something went wrong."
  );
}

export default function Profile({ role }) {
  const [existing, setExisting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [f, setF] = useState({
    specialization: "",
    experienceYears: "",
    consultationFee: "",
    qualification: "",
    bio: "",

    name: "",
    phone: "",
    address: "",
    city: "",
    description: "",
  });

  useEffect(() => {
    async function loadProfile() {
      const url =
        role === "DOCTOR"
          ? "/doctors/profile"
          : role === "PHARMACY"
            ? "/pharmacies/profile/me"
            : "/hospitals";

      setLoading(true);
      setErr("");
      setMsg("");

      try {
        const response = await fetch(`${API_URL}${url}`, {
          credentials: "include",
        });

        if (!response.ok) {
          if (role === "DOCTOR" && response.status === 404) {
            setExisting(null);
            return;
          }

          let data = {};

          try {
            data = await response.json();
          } catch {
            // Response did not contain JSON.
          }

          throw new Error(getErrorMessage(data));
        }

        const data = await response.json();

        const d = Array.isArray(data)
          ? data[0]
          : data;

        setExisting(d || null);

        if (d) {
          setF((previous) => ({
            ...previous,
            ...d,
          }));
        }
      } catch (error) {
        setErr(error.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [role]);

  if (loading) {
    return <Loading />;
  }

  /*
   * HOSPITAL PROFILE
   */
  if (role === "HOSPITAL") {
    return (
      <Page
        title="Hospital Profile"
        subtitle="Hospital profile information."
      >
        {err && <Notice>{err}</Notice>}

        {existing ? (
          <Card>
            <h2 className="text-xl font-bold">
              {existing.name ||
                existing.hospitalName ||
                "Hospital"}
            </h2>

            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <p>
                <b>City:</b> {existing.city || "—"}
              </p>

              <p>
                <b>Phone:</b>{" "}
                {existing.phone ||
                  existing.contactNumber ||
                  "—"}
              </p>

              <p>
                <b>Address:</b>{" "}
                {existing.address || "—"}
              </p>

              <p>
                <b>Status:</b>{" "}
                {existing.status ||
                  existing.verificationStatus ||
                  "—"}
              </p>

              <p className="sm:col-span-2">
                <b>Description:</b>{" "}
                {existing.description || "—"}
              </p>
            </div>
          </Card>
        ) : (
          <Card>
            <p className="text-slate-600">
              No hospital profile is available yet.
            </p>
          </Card>
        )}
      </Page>
    );
  }

  /*
   * SAVE PROFILE
   */
  async function save(e) {
    e.preventDefault();

    setErr("");
    setMsg("");

    try {
      /*
       * DOCTOR PROFILE
       */
      if (role === "DOCTOR") {
        const payload = {
          specialization: f.specialization,
          experienceYears: f.experienceYears
            ? Number(f.experienceYears)
            : null,
          consultationFee: f.consultationFee
            ? Number(f.consultationFee)
            : null,
          qualification: f.qualification,
          bio: f.bio,
        };

        const method = existing ? "PUT" : "POST";

        const response = await fetch(
          `${API_URL}/doctors/profile`,
          {
            method,
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(getErrorMessage(data));
        }

        setExisting(data);

        setF((previous) => ({
          ...previous,
          ...data,
        }));

        setMsg(
          existing
            ? "Doctor profile updated successfully."
            : "Doctor profile created successfully."
        );

        return;
      }

      /*
       * PHARMACY PROFILE
       */
      if (role === "PHARMACY") {
        const payload = {
          name: f.name,
          phone: f.phone,
          address: f.address,
          city: f.city,
          description: f.description,
        };

        if (!existing) {
          const response = await fetch(
            `${API_URL}/pharmacies/profile`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify(payload),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(getErrorMessage(data));
          }

          setExisting(data);

          setF((previous) => ({
            ...previous,
            ...data,
          }));

          setMsg(
            "Pharmacy profile created successfully."
          );
        } else {
          setMsg(
            "Pharmacy profile already exists; the supplied backend has no pharmacy update endpoint."
          );
        }
      }
    } catch (error) {
      setErr(
        error.message || "Something went wrong."
      );
    }
  }

  return (
    <Page
      title={
        role === "DOCTOR"
          ? "Doctor Profile"
          : "Pharmacy Profile"
      }
      subtitle="Keep your profile information current."
    >
      {err && <Notice>{err}</Notice>}

      {msg && (
        <Notice type="success">
          {msg}
        </Notice>
      )}

      <Card>
        <form
          onSubmit={save}
          className="grid gap-4 sm:grid-cols-2"
        >
          {/* =========================
              DOCTOR PROFILE
          ========================== */}

          {role === "DOCTOR" && (
            <>
              <Input
                label="Specialization"
                value={f.specialization}
                onChange={(e) =>
                  setF({
                    ...f,
                    specialization: e.target.value,
                  })
                }
                placeholder="e.g. Cardiology"
                required
              />

              <Input
                label="Experience (years)"
                type="number"
                min="0"
                value={f.experienceYears}
                onChange={(e) =>
                  setF({
                    ...f,
                    experienceYears: e.target.value,
                  })
                }
                placeholder="e.g. 5"
              />

              <Input
                label="Consultation Fee"
                type="number"
                min="0"
                value={f.consultationFee}
                onChange={(e) =>
                  setF({
                    ...f,
                    consultationFee: e.target.value,
                  })
                }
                placeholder="e.g. 500"
              />

              <Input
                label="Qualification"
                value={f.qualification}
                onChange={(e) =>
                  setF({
                    ...f,
                    qualification: e.target.value,
                  })
                }
                placeholder="e.g. MBBS, MD"
              />

              <div className="sm:col-span-2">
                <Textarea
                  label="Bio"
                  value={f.bio}
                  onChange={(e) =>
                    setF({
                      ...f,
                      bio: e.target.value,
                    })
                  }
                  placeholder="Tell patients briefly about your experience and expertise."
                />
              </div>
            </>
          )}

          {/* =========================
              PHARMACY PROFILE
          ========================== */}

          {role === "PHARMACY" && (
            <>
              <Input
                label="Name"
                value={f.name || ""}
                onChange={(e) =>
                  setF({
                    ...f,
                    name: e.target.value,
                  })
                }
              />

              <Input
                label="Phone"
                value={f.phone || ""}
                onChange={(e) =>
                  setF({
                    ...f,
                    phone: e.target.value,
                  })
                }
              />

              <Input
                label="Address"
                value={f.address || ""}
                onChange={(e) =>
                  setF({
                    ...f,
                    address: e.target.value,
                  })
                }
              />

              <Input
                label="City"
                value={f.city || ""}
                onChange={(e) =>
                  setF({
                    ...f,
                    city: e.target.value,
                  })
                }
              />

              <div className="sm:col-span-2">
                <Textarea
                  label="Description"
                  value={f.description || ""}
                  onChange={(e) =>
                    setF({
                      ...f,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </>
          )}

          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit">
              {existing
                ? "Update Profile"
                : "Create Profile"}
            </Button>
          </div>
        </form>
      </Card>
    </Page>
  );
}