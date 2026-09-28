import { useEffect, useMemo, useState } from "react";
import api, { errorMessage } from "../../services/api";
import { Button, Card, Page } from "../../components/UI";

export default function Users() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [suspendingId, setSuspendingId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionError, setActionError] = useState("");

  // ============================================================
  // LOAD USERS
  // ============================================================

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/users");

      const result = response.data;

      setData(
        Array.isArray(result)
          ? result
          : result?.content ||
              result?.data ||
              []
      );
    } catch (e) {
      setError(errorMessage(e));
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadUsers();
  }, []);

  // ============================================================
  // ROLE STYLES
  // ============================================================

  const roleStyles = {
    ADMIN:
      "bg-purple-100 text-purple-800 border-purple-200",
    DOCTOR:
      "bg-blue-100 text-blue-800 border-blue-200",
    PATIENT:
      "bg-emerald-100 text-emerald-800 border-emerald-200",
    HOSPITAL:
      "bg-amber-100 text-amber-800 border-amber-200",
    PHARMACY:
      "bg-rose-100 text-rose-800 border-rose-200",
  };

  // ============================================================
  // STATUS BADGE
  // ============================================================

  function getStatusBadge(status) {
    const val = String(
      status || "ACTIVE"
    ).toUpperCase();

    if (
      val === "SUSPENDED" ||
      val === "INACTIVE"
    ) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
          <span className="h-2 w-2 rounded-full bg-red-600" />
          Suspended
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
        <span className="h-2 w-2 rounded-full bg-emerald-600" />
        Active
      </span>
    );
  }

  // ============================================================
  // FILTER USERS
  // ============================================================

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.filter((user) => {
      const name = (
        user.name ||
        user.username ||
        ""
      ).toLowerCase();

      const email = (
        user.email || ""
      ).toLowerCase();

      const query = search
        .trim()
        .toLowerCase();

      const matchesSearch =
        name.includes(query) ||
        email.includes(query);

      const matchesRole =
        roleFilter === "ALL" ||
        user.role === roleFilter;

      return (
        matchesSearch &&
        matchesRole
      );
    });
  }, [data, search, roleFilter]);

  // ============================================================
  // USER STATS
  // ============================================================

  const userStats = useMemo(() => {
    if (!Array.isArray(data)) {
      return {
        total: 0,
        active: 0,
        suspended: 0,
        admins: 0,
      };
    }

    return {
      total: data.length,

      active: data.filter(
        (u) =>
          String(
            u.status
          ).toUpperCase() !==
          "SUSPENDED"
      ).length,

      suspended: data.filter(
        (u) =>
          String(
            u.status
          ).toUpperCase() ===
          "SUSPENDED"
      ).length,

      admins: data.filter(
        (u) =>
          u.role === "ADMIN"
      ).length,
    };
  }, [data]);

  // ============================================================
  // SUSPEND USER
  // ============================================================

  async function handleSuspend() {
    if (!selectedUser) {
      return;
    }

    try {
      setSuspendingId(
        selectedUser.id
      );

      setActionError("");

      await api.put(
        `/admin/users/${selectedUser.id}/suspend`
      );

      setSelectedUser(null);

      await loadUsers();
    } catch (e) {
      setActionError(
        errorMessage(e)
      );
    } finally {
      setSuspendingId(null);
    }
  }

  return (
    <Page
      title="User Management"
      subtitle="Comprehensive view and account management for all system users."
      className="w-full max-w-none px-0"
    >
      <div className="w-full space-y-6">

        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Card className="!w-full !max-w-none p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Accounts
            </p>

            <p className="mt-2 text-3xl font-extrabold text-slate-900">
              {userStats.total}
            </p>
          </Card>

          <Card className="!w-full !max-w-none p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Active Users
            </p>

            <p className="mt-2 text-3xl font-extrabold text-emerald-700">
              {userStats.active}
            </p>
          </Card>

          <Card className="!w-full !max-w-none p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-600">
              Suspended Users
            </p>

            <p className="mt-2 text-3xl font-extrabold text-red-700">
              {userStats.suspended}
            </p>
          </Card>

          <Card className="!w-full !max-w-none p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">
              System Admins
            </p>

            <p className="mt-2 text-3xl font-extrabold text-purple-700">
              {userStats.admins}
            </p>
          </Card>

        </div>

        {/* =====================================================
            SEARCH + FILTER
        ===================================================== */}

        <Card className="!w-full !max-w-none p-5">
          <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">

            {/* Search */}

            <div className="relative flex-1">

              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <input
                type="text"
                placeholder="Search users by name, username, or email..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-3 pl-11 pr-4 text-base text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />

            </div>

            {/* Role Filter */}

            <div className="flex items-center gap-3">

              <label className="whitespace-nowrap text-sm font-semibold text-slate-700">
                Role Filter:
              </label>

              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(
                    e.target.value
                  )
                }
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="ALL">
                  All Roles ({userStats.total})
                </option>

                <option value="PATIENT">
                  Patients
                </option>

                <option value="DOCTOR">
                  Doctors
                </option>

                <option value="HOSPITAL">
                  Hospitals
                </option>

                <option value="PHARMACY">
                  Pharmacies
                </option>

                <option value="ADMIN">
                  Admins
                </option>
              </select>

            </div>

          </div>
        </Card>

        {/* =====================================================
            USERS TABLE
        ===================================================== */}

        {loading ? (
          <Card className="!w-full !max-w-none p-10">
            <div className="flex flex-col items-center justify-center text-center">

              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading users...
              </p>

            </div>
          </Card>
        ) : error ? (
          <Card className="!w-full !max-w-none p-10">
            <div className="text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M12 9v3m0 4h.01M10.3 4.9 3.5 17a2 2 0 0 0 1.7 3h13.6a2 2 0 0 0 1.7-3L13.7 4.9a2 2 0 0 0-3.4 0Z"
                  />
                </svg>
              </div>

              <p className="mt-4 font-semibold text-red-700">
                Could not load users
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {error}
              </p>

              <div className="mt-5">
                <Button
                  variant="secondary"
                  onClick={loadUsers}
                >
                  Try Again
                </Button>
              </div>

            </div>
          </Card>
        ) : (
          <Card className="!w-full !max-w-none overflow-hidden shadow-sm">

            {filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-base font-medium text-slate-500">
                No user records match your search query or filter.
              </div>
            ) : (
              <div className="w-full overflow-x-auto">

                <table className="w-full min-w-[1000px] border-collapse text-left">

                  {/* TABLE HEADER */}

                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100/70">

                      <th className="w-[30%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">
                        User Profile
                      </th>

                      <th className="w-[25%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">
                        Email Address
                      </th>

                      <th className="w-[15%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">
                        Assigned Role
                      </th>

                      <th className="w-[15%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">
                        Account Status
                      </th>

                      <th className="w-[15%] px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-600">
                        Actions
                      </th>

                    </tr>
                  </thead>

                  {/* TABLE BODY */}

                  <tbody className="divide-y divide-slate-200 bg-white">

                    {filteredUsers.map((x) => {
                      const isSuspended =
                        String(
                          x.status
                        ).toUpperCase() ===
                        "SUSPENDED";

                      return (
                        <tr
                          key={x.id}
                          className="transition-colors hover:bg-slate-50/80"
                        >

                          {/* USER PROFILE */}

                          <td className="w-[30%] px-6 py-5">

                            <div className="flex items-center gap-4">

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-200 text-base font-bold text-slate-700">
                                {(
                                  x.name ||
                                  x.username ||
                                  "U"
                                )[0].toUpperCase()}
                              </div>

                              <div>
                                <p className="text-base font-semibold text-slate-900">
                                  {x.name ||
                                    x.username ||
                                    `User #${x.id}`}
                                </p>

                                <p className="text-xs text-slate-400">
                                  ID: #{x.id}
                                </p>
                              </div>

                            </div>

                          </td>

                          {/* EMAIL */}

                          <td className="w-[25%] px-6 py-5">
                            <span className="break-words text-sm font-medium text-slate-700">
                              {x.email || "—"}
                            </span>
                          </td>

                          {/* ROLE */}

                          <td className="w-[15%] px-6 py-5">

                            <span
                              className={`inline-flex items-center rounded-md border px-3 py-1 text-xs font-bold ${
                                roleStyles[
                                  x.role
                                ] ||
                                "border-slate-300 bg-slate-100 text-slate-800"
                              }`}
                            >
                              {x.role || "USER"}
                            </span>

                          </td>

                          {/* STATUS */}

                          <td className="w-[15%] px-6 py-5">
                            {getStatusBadge(
                              x.status
                            )}
                          </td>

                          {/* ACTION */}

                          <td className="w-[15%] px-6 py-5 text-right">

                            <Button
                              variant="danger"
                              disabled={
                                isSuspended
                              }
                              onClick={() =>
                                setSelectedUser(
                                  x
                                )
                              }
                              className="px-4 py-2 text-sm font-medium"
                            >
                              {isSuspended
                                ? "Suspended"
                                : "Suspend User"}
                            </Button>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>
            )}

          </Card>
        )}

      </div>

      {/* =====================================================
          CONFIRMATION MODAL
      ===================================================== */}

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">

            {/* Warning Icon */}

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">

              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>

            </div>

            {/* Title */}

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              Confirm Account Suspension
            </h3>

            {/* Description */}

            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Are you sure you want to suspend{" "}
              <span className="font-semibold text-slate-900">
                {selectedUser.name ||
                  selectedUser.email}
              </span>
              ? This action will disable their access to all
              services on the platform.
            </p>

            {/* Error */}

            {actionError && (
              <p className="mt-3 text-xs font-semibold text-red-600">
                {actionError}
              </p>
            )}

            {/* Modal Actions */}

            <div className="mt-6 flex justify-end gap-3">

              <Button
                variant="secondary"
                disabled={
                  suspendingId !== null
                }
                onClick={() => {
                  setSelectedUser(null);
                  setActionError("");
                }}
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                disabled={
                  suspendingId ===
                  selectedUser.id
                }
                onClick={handleSuspend}
              >
                {suspendingId ===
                selectedUser.id
                  ? "Suspending..."
                  : "Yes, Suspend Account"}
              </Button>

            </div>

          </div>

        </div>
      )}

    </Page>
  );
}