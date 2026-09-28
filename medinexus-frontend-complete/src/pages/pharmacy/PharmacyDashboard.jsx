import { useEffect, useMemo, useState } from "react";
import api, { errorMessage } from "../../services/api";
import { Card, Page } from "../../components/UI";

export default function PharmacyDashboard() {
  // ============================================================
  // INVENTORY
  // ============================================================

  const [inventory, setInventory] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState("");

  // ============================================================
  // LICENSES
  // ============================================================

  const [licenses, setLicenses] = useState([]);
  const [licenseLoading, setLicenseLoading] = useState(true);
  const [licenseError, setLicenseError] = useState("");

  // ============================================================
  // LOAD INVENTORY
  // ============================================================

  useEffect(() => {
    async function loadInventory() {
      try {
        setInventoryLoading(true);
        setInventoryError("");

        const response = await api.get("/pharmacy-inventory/my");

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.content || [];

        setInventory(data);
      } catch (e) {
        setInventoryError(errorMessage(e));
      } finally {
        setInventoryLoading(false);
      }
    }

    loadInventory();
  }, []);

  // ============================================================
  // LOAD LICENSES
  // ============================================================

  useEffect(() => {
    async function loadLicenses() {
      try {
        setLicenseLoading(true);
        setLicenseError("");

        const response = await api.get("/pharmacy/licenses");

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.content || [];

        setLicenses(data);
      } catch (e) {
        setLicenseError(errorMessage(e));
      } finally {
        setLicenseLoading(false);
      }
    }

    loadLicenses();
  }, []);

  // ============================================================
  // INVENTORY STATS
  // ============================================================

  const stats = useMemo(() => {
    const total = inventory.length;

    const outOfStock = inventory.filter(
      (item) => Number(item.stockQuantity ?? 0) === 0
    ).length;

    const lowStock = inventory.filter((item) => {
      const stock = Number(item.stockQuantity ?? 0);
      const reorderLevel = Number(item.reorderLevel ?? 0);

      return stock > 0 && stock <= reorderLevel;
    }).length;

    const inStock = inventory.filter((item) => {
      const stock = Number(item.stockQuantity ?? 0);
      const reorderLevel = Number(item.reorderLevel ?? 0);

      return stock > reorderLevel;
    }).length;

    return {
      total,
      inStock,
      lowStock,
      outOfStock,
    };
  }, [inventory]);

  // ============================================================
  // MEDICINE NAME
  // ============================================================

  function getMedicineName(item) {
    return (
      item.medicineName ||
      item.medicine?.name ||
      item.medicine?.medicineName ||
      "Unknown Medicine"
    );
  }

  // ============================================================
  // LATEST LICENSE
  // ============================================================

  const latestLicense = useMemo(() => {
    if (!licenses.length) {
      return null;
    }

    return [...licenses].sort((a, b) => {
      const dateA = a.createdAt
        ? new Date(a.createdAt).getTime()
        : Number(a.id || 0);

      const dateB = b.createdAt
        ? new Date(b.createdAt).getTime()
        : Number(b.id || 0);

      return dateB - dateA;
    })[0];
  }, [licenses]);

  const verificationStatus =
    latestLicense?.verificationStatus ||
    latestLicense?.status ||
    "PENDING";

  // ============================================================
  // STOCK LISTS
  // ============================================================

  const lowStockMedicines = inventory.filter((item) => {
    const stock = Number(item.stockQuantity ?? 0);
    const reorderLevel = Number(item.reorderLevel ?? 0);

    return stock > 0 && stock <= reorderLevel;
  });

  const outOfStockMedicines = inventory.filter(
    (item) => Number(item.stockQuantity ?? 0) === 0
  );

  // ============================================================
  // LICENSE STATUS
  // ============================================================

  function statusStyle(status) {
    const value = String(status || "").toUpperCase();

    if (value === "VERIFIED" || value === "APPROVED") {
      return {
        label: "Verified",
        icon: (
          <svg
            className="h-5 w-5 text-teal-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ),
      };
    }

    if (value === "REJECTED") {
      return {
        label: "Rejected",
        icon: (
          <svg
            className="h-5 w-5 text-rose-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ),
      };
    }

    return {
      label: "Pending Verification",
      icon: (
        <svg
          className="h-5 w-5 text-amber-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    };
  }

  const licenseStatus = statusStyle(verificationStatus);

  return (
    <Page
      title="Pharmacy Dashboard"
      subtitle="Manage your pharmacy, medicines, and verification status."
    >
      {/* ======================================================
          HERO (MEDINEXUS TEAL BRANDING)
      ======================================================= */}

      <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-950 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-medium text-teal-100 ring-1 ring-teal-400/30 backdrop-blur-sm">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.603 15.12a1.8 1.8 0 01-1.228-1.78l.102-3.137a1.8 1.8 0 011.082-1.614l2.585-1.149a6 6 0 013.86-.517l.318.158a6 6 0 003.86.517l2.387-.477a2 2 0 012.302 1.55l.386 1.932a2 2 0 01-.54 1.802l-1.305 1.305z" />
              </svg>
              Pharmacy Operations Hub
            </span>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Welcome to your Pharmacy
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-teal-100/90 sm:text-base">
              Monitor your medicine inventory, manage pharmacy operations,
              and keep your license verification up to date.
            </p>
          </div>

          <div className="min-w-[250px] rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-200">
              Pharmacy License
            </p>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                {licenseStatus.icon}
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  {licenseStatus.label}
                </p>

                {latestLicense?.licenseNumber && (
                  <p className="mt-0.5 text-xs text-teal-200">
                    #{latestLicense.licenseNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          VERIFICATION NOTICE
      ======================================================= */}

      {!licenseLoading &&
        (!latestLicense ||
          String(verificationStatus).toUpperCase() !== "VERIFIED") && (
          <div className="mb-8 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 p-5 shadow-sm">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <div>
                <h3 className="text-sm font-bold text-amber-900">
                  License verification required
                </h3>

                <p className="mt-1 text-sm leading-5 text-amber-800">
                  Submit your pharmacy license and wait for verification
                  before managing your inventory.
                </p>

                <a
                  href="/pharmacy/license"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-100/80 px-3.5 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-200/80"
                >
                  Go to License Page
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}

      {/* ======================================================
          STATISTICS
      ======================================================= */}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Medicines */}
        <Card>
          <div className="rounded-2xl bg-gradient-to-br from-teal-50/60 via-white to-white p-1">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Medicines
                </p>

                <p className="mt-2 text-3xl font-bold text-teal-900">
                  {stats.total}
                </p>

                <p className="mt-1 text-xs font-medium text-teal-700">
                  In your inventory
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100/80 text-teal-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.603 15.12a1.8 1.8 0 01-1.228-1.78l.102-3.137a1.8 1.8 0 011.082-1.614l2.585-1.149a6 6 0 013.86-.517l.318.158a6 6 0 003.86.517l2.387-.477a2 2 0 012.302 1.55l.386 1.932a2 2 0 01-.54 1.802l-1.305 1.305z" />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        {/* In Stock */}
        <Card>
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50/60 via-white to-white p-1">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  In Stock
                </p>

                <p className="mt-2 text-3xl font-bold text-emerald-600">
                  {stats.inStock}
                </p>

                <p className="mt-1 text-xs font-medium text-emerald-600">
                  Healthy stock
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100/80 text-emerald-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        {/* Low Stock */}
        <Card>
          <div className="rounded-2xl bg-gradient-to-br from-amber-50/60 via-white to-white p-1">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Low Stock
                </p>

                <p className="mt-2 text-3xl font-bold text-amber-600">
                  {stats.lowStock}
                </p>

                <p className="mt-1 text-xs font-medium text-amber-600">
                  Needs attention
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100/80 text-amber-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        {/* Out of Stock */}
        <Card>
          <div className="rounded-2xl bg-gradient-to-br from-rose-50/60 via-white to-white p-1">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Out of Stock
                </p>

                <p className="mt-2 text-3xl font-bold text-rose-600">
                  {stats.outOfStock}
                </p>

                <p className="mt-1 text-xs font-medium text-rose-600">
                  Currently unavailable
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100/80 text-rose-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ======================================================
          QUICK ACTIONS
      ======================================================= */}

      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Quick Actions
          </h2>

          <p className="text-sm text-slate-500">
            Frequently used pharmacy operations.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Inventory */}
          <a
            href="/pharmacy/inventory"
            className="group rounded-2xl border border-slate-200/80 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-100">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>

            <h3 className="mt-4 font-bold text-slate-900">
              Manage Inventory
            </h3>

            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              Add, update and monitor medicines.
            </p>

            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-700">
              Open Inventory
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </a>

          {/* License */}
          <a
            href="/pharmacy/license"
            className="group rounded-2xl border border-slate-200/80 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-100">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            <h3 className="mt-4 font-bold text-slate-900">
              Pharmacy License
            </h3>

            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              Submit and track verification.
            </p>

            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-700">
              View License
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </a>

          {/* Profile */}
          <a
            href="/pharmacy/profile"
            className="group rounded-2xl border border-slate-200/80 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-100">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            <h3 className="mt-4 font-bold text-slate-900">
              Pharmacy Profile
            </h3>

            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              Manage pharmacy information.
            </p>

            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-700">
              View Profile
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* ======================================================
          STOCK ALERTS
      ======================================================= */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* LOW STOCK */}
        <Card>
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-bold text-slate-900">
                Low Stock Alerts
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Medicines approaching reorder threshold.
              </p>
            </div>

            <span className="rounded-full bg-amber-100/80 px-3 py-1 text-xs font-semibold text-amber-800">
              {lowStockMedicines.length} items
            </span>
          </div>

          {lowStockMedicines.length === 0 ? (
            <div className="rounded-2xl bg-slate-50/70 p-7 text-center border border-dashed border-slate-200">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <p className="mt-3 text-sm font-bold text-slate-800">
                All stock levels normal
              </p>

              <p className="mt-1 text-xs text-slate-500">
                No medicines are currently below reorder levels.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockMedicines.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50/40 p-4"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {getMedicineName(item)}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Reorder target: {item.reorderLevel} units
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-amber-600">
                      {item.stockQuantity}
                    </p>

                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                      units left
                    </p>
                  </div>
                </div>
              ))}

              {lowStockMedicines.length > 5 && (
                <a
                  href="/pharmacy/inventory"
                  className="block pt-2 text-center text-xs font-bold text-teal-700 hover:underline"
                >
                  View all low-stock items →
                </a>
              )}
            </div>
          )}
        </Card>

        {/* OUT OF STOCK */}
        <Card>
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-bold text-slate-900">
                Out of Stock
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Medicines currently unavailable.
              </p>
            </div>

            <span className="rounded-full bg-rose-100/80 px-3 py-1 text-xs font-semibold text-rose-800">
              {outOfStockMedicines.length} items
            </span>
          </div>

          {outOfStockMedicines.length === 0 ? (
            <div className="rounded-2xl bg-slate-50/70 p-7 text-center border border-dashed border-slate-200">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <p className="mt-3 text-sm font-bold text-slate-800">
                No out-of-stock items
              </p>

              <p className="mt-1 text-xs text-slate-500">
                All inventory items currently have stock available.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {outOfStockMedicines.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-rose-100 bg-rose-50/40 p-4"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {getMedicineName(item)}
                    </p>

                    <p className="mt-1 text-xs font-medium text-rose-600">
                      Out of stock
                    </p>
                  </div>

                  <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
                    0 units
                  </span>
                </div>
              ))}

              {outOfStockMedicines.length > 5 && (
                <a
                  href="/pharmacy/inventory"
                  className="block pt-2 text-center text-xs font-bold text-teal-700 hover:underline"
                >
                  View full inventory →
                </a>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* ======================================================
          ERROR
      ======================================================= */}

      {(inventoryError || licenseError) && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">
            Some dashboard information could not be loaded.
          </p>

          <p className="mt-1 text-xs text-red-600">
            Please refresh the page and try again.
          </p>
        </div>
      )}
    </Page>
  );
}