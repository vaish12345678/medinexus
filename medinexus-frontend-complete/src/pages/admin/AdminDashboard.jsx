import { useEffect, useMemo, useState } from "react";
import api, { errorMessage } from "../../services/api";
import { Card, Page, Button } from "../../components/UI";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      // ✅ Correct admin endpoint
      const response = await api.get("/admin/users");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.content || [];

      setUsers(data);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const stats = useMemo(() => {
    return {
      total: users.length,
      patients: users.filter((u) => u.role === "PATIENT").length,
      doctors: users.filter((u) => u.role === "DOCTOR").length,
      hospitals: users.filter((u) => u.role === "HOSPITAL").length,
      pharmacies: users.filter((u) => u.role === "PHARMACY").length,
      ambulances: users.filter((u) => u.role === "AMBULANCE").length,
      admins: users.filter((u) => u.role === "ADMIN").length,
    };
  }, [users]);

  const recentUsers = useMemo(() => {
    return [...users]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      )
      .slice(0, 6);
  }, [users]);

  return (
    <Page>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          Manage users, healthcare services and the Medinexus system.
        </p>
      </div>

      {/* Error */}
      {error && (
        <Card className="mb-6 border border-red-200 bg-red-50">
          <div className="p-4">
            <p className="font-semibold text-red-700">
              Unable to load dashboard
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>

            <Button
              className="mt-3"
              onClick={loadUsers}
            >
              Try Again
            </Button>
          </div>
        </Card>
      )}

      {/* Loading */}
      {loading ? (
        <Card>
          <div className="p-8 text-center text-slate-500">
            Loading dashboard...
          </div>
        </Card>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <div className="p-5">
                <p className="text-sm text-slate-500">
                  Total Users
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {stats.total}
                </h2>
              </div>
            </Card>

            <Card>
              <div className="p-5">
                <p className="text-sm text-slate-500">
                  Patients
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {stats.patients}
                </h2>
              </div>
            </Card>

            <Card>
              <div className="p-5">
                <p className="text-sm text-slate-500">
                  Doctors
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {stats.doctors}
                </h2>
              </div>
            </Card>

            <Card>
              <div className="p-5">
                <p className="text-sm text-slate-500">
                  Pharmacies
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {stats.pharmacies}
                </h2>
              </div>
            </Card>
          </div>

          {/* System Overview */}
          <Card className="mt-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-slate-900">
                System Overview
              </h2>

              <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-sm text-blue-600">
                    Patients
                  </p>
                  <p className="mt-1 text-2xl font-bold text-blue-900">
                    {stats.patients}
                  </p>
                </div>

                <div className="rounded-xl bg-green-50 p-4">
                  <p className="text-sm text-green-600">
                    Doctors
                  </p>
                  <p className="mt-1 text-2xl font-bold text-green-900">
                    {stats.doctors}
                  </p>
                </div>

                <div className="rounded-xl bg-purple-50 p-4">
                  <p className="text-sm text-purple-600">
                    Hospitals
                  </p>
                  <p className="mt-1 text-2xl font-bold text-purple-900">
                    {stats.hospitals}
                  </p>
                </div>

                <div className="rounded-xl bg-orange-50 p-4">
                  <p className="text-sm text-orange-600">
                    Pharmacies
                  </p>
                  <p className="mt-1 text-2xl font-bold text-orange-900">
                    {stats.pharmacies}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Quick Actions
              </h2>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  onClick={() =>
                    (window.location.href = "/admin/users")
                  }
                >
                  Manage Users
                </Button>

                <Button
                  onClick={() =>
                    (window.location.href = "/admin/hospitals")
                  }
                >
                  Manage Hospitals
                </Button>

                <Button
                  onClick={() =>
                    (window.location.href = "/admin/pharmacy-licenses")
                  }
                >
                  Pharmacy Licenses
                </Button>
              </div>
            </div>
          </Card>

          {/* Recent Users */}
          <Card className="mt-6">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Recent Users
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Recently registered Medinexus users
                  </p>
                </div>

                <Button
                  onClick={() =>
                    (window.location.href = "/admin/users")
                  }
                >
                  View All
                </Button>
              </div>

              <div className="mt-5 overflow-x-auto">
                {recentUsers.length === 0 ? (
                  <p className="py-6 text-center text-slate-500">
                    No users found.
                  </p>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                          Name
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                          Email
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                          Role
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                          Status
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                          Registered
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-slate-100"
                        >
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {user.name || "—"}
                          </td>

                          <td className="px-4 py-3 text-sm text-slate-600">
                            {user.email || "—"}
                          </td>

                          <td className="px-4 py-3 text-sm text-slate-600">
                            {user.role || "—"}
                          </td>

                          <td className="px-4 py-3 text-sm text-slate-600">
                            {user.status || "—"}
                          </td>

                          <td className="px-4 py-3 text-sm text-slate-600">
                            {user.createdAt
                              ? new Date(
                                  user.createdAt
                                ).toLocaleDateString()
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </Card>
        </>
      )}
    </Page>
  );
}