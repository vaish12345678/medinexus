import { useEffect, useMemo, useState } from "react";
import api, { errorMessage } from "../../services/api";
import {
  Button,
  Card,
  Input,
  Page,
  Select,
  Notice,
} from "../../components/UI";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [medicines, setMedicines] = useState([]);

  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [medicinesLoading, setMedicinesLoading] = useState(true);

  const [inventoryError, setInventoryError] = useState("");
  const [medicinesError, setMedicinesError] = useState("");

  const [f, setF] = useState({
    medicineId: "",
    stockQuantity: "",
    reorderLevel: "",
    reorderQuantity: "",
    price: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ============================================================
  // LOAD INVENTORY
  // ============================================================

  async function loadInventory() {
    try {
      setInventoryLoading(true);
      setInventoryError("");

      const response = await api.get("/pharmacy-inventory/my");

      const data = response.data;

      setInventory(
        Array.isArray(data)
          ? data
          : data?.content || data?.data || []
      );
    } catch (e) {
      setInventoryError(errorMessage(e));
      setInventory([]);
    } finally {
      setInventoryLoading(false);
    }
  }

  // ============================================================
  // LOAD MEDICINES
  // ============================================================

  async function loadMedicines() {
    try {
      setMedicinesLoading(true);
      setMedicinesError("");

      const response = await api.get("/medicines");

      const data = response.data;

      setMedicines(
        Array.isArray(data)
          ? data
          : data?.content || data?.data || []
      );
    } catch (e) {
      setMedicinesError(errorMessage(e));
      setMedicines([]);
    } finally {
      setMedicinesLoading(false);
    }
  }

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadInventory();
    loadMedicines();
  }, []);

  // ============================================================
  // MEDICINE NAME
  // ============================================================

  function getMedicineName(item) {
    return (
      item.medicineName ||
      medicines.find((m) => m.id === item.medicineId)?.name ||
      `Medicine #${item.medicineId}`
    );
  }

  // ============================================================
  // STOCK STATUS
  // ============================================================

  function getStockStatus(stock, reorderLevel) {
    const quantity = Number(stock ?? 0);
    const reorder = Number(reorderLevel ?? 0);

    if (quantity === 0) {
      return {
        label: "Out of Stock",
        text: "text-red-700",
        bg: "bg-red-50",
        border: "border-red-200",
        dot: "bg-red-500",
      };
    }

    if (quantity <= reorder) {
      return {
        label: "Low Stock",
        text: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
        dot: "bg-amber-500",
      };
    }

    return {
      label: "In Stock",
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    };
  }

  // ============================================================
  // SUMMARY
  // ============================================================

  const summary = useMemo(() => {
    const total = inventory.length;

    const lowStock = inventory.filter((item) => {
      const stock = Number(item.stockQuantity ?? 0);
      const reorder = Number(item.reorderLevel ?? 0);

      return stock > 0 && stock <= reorder;
    }).length;

    const outOfStock = inventory.filter(
      (item) => Number(item.stockQuantity ?? 0) === 0
    ).length;

    const inStock = inventory.filter((item) => {
      const stock = Number(item.stockQuantity ?? 0);
      const reorder = Number(item.reorderLevel ?? 0);

      return stock > reorder;
    }).length;

    return {
      total,
      lowStock,
      outOfStock,
      inStock,
    };
  }, [inventory]);

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredInventory = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return inventory;
    }

    return inventory.filter((item) =>
      getMedicineName(item).toLowerCase().includes(value)
    );
  }, [inventory, search, medicines]);

  // ============================================================
  // RESET FORM
  // ============================================================

  function resetForm() {
    setF({
      medicineId: "",
      stockQuantity: "",
      reorderLevel: "",
      reorderQuantity: "",
      price: "",
    });

    setEditingId(null);
    setFormError("");
  }

  // ============================================================
  // START EDIT
  // ============================================================

  function startEdit(item) {
    setEditingId(item.id);

    setF({
      medicineId: String(item.medicineId ?? ""),
      stockQuantity: String(item.stockQuantity ?? ""),
      reorderLevel: String(item.reorderLevel ?? ""),
      reorderQuantity: String(item.reorderQuantity ?? ""),
      price: String(item.price ?? ""),
    });

    setFormError("");
    setSuccessMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ============================================================
  // SAVE INVENTORY
  // ============================================================

  async function save(e) {
    e.preventDefault();

    setFormError("");
    setSuccessMessage("");

    if (!f.medicineId) {
      setFormError("Please select a medicine.");
      return;
    }

    if (
      f.stockQuantity === "" ||
      Number(f.stockQuantity) < 0
    ) {
      setFormError("Please enter a valid stock quantity.");
      return;
    }

    if (
      f.reorderLevel === "" ||
      Number(f.reorderLevel) < 0
    ) {
      setFormError("Please enter a valid reorder level.");
      return;
    }

    if (
      f.reorderQuantity === "" ||
      Number(f.reorderQuantity) <= 0
    ) {
      setFormError("Reorder quantity must be greater than 0.");
      return;
    }

    if (
      f.price === "" ||
      Number(f.price) < 0
    ) {
      setFormError("Please enter a valid price.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        medicineId: Number(f.medicineId),
        stockQuantity: Number(f.stockQuantity),
        reorderLevel: Number(f.reorderLevel),
        reorderQuantity: Number(f.reorderQuantity),
        price: Number(f.price),
        available: Number(f.stockQuantity) > 0,
      };

      if (editingId) {
        await api.put(
          `/pharmacy-inventory/${editingId}`,
          payload
        );

        setSuccessMessage(
          "Inventory updated successfully."
        );
      } else {
        await api.post(
          "/pharmacy-inventory",
          payload
        );

        setSuccessMessage(
          "Medicine added to inventory successfully."
        );
      }

      resetForm();

      await loadInventory();
    } catch (e) {
      setFormError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // DELETE
  // ============================================================

  async function del(id) {
    setFormError("");
    setSuccessMessage("");

    if (
      !window.confirm(
        "Remove this medicine from your inventory?"
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);

      await api.delete(
        `/pharmacy-inventory/${id}`
      );

      setSuccessMessage(
        "Medicine removed from inventory successfully."
      );

      await loadInventory();
    } catch (e) {
      setFormError(errorMessage(e));
    } finally {
      setDeletingId(null);
    }
  }

  // ============================================================
  // SUMMARY ICON
  // ============================================================

  function SummaryIcon({ type }) {
    if (type === "total") {
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
            d="M9 3h6l1 3H8l1-3Zm-2 3h10l1 15H6L7 6Zm3 4v7m4-7v7"
          />
        </svg>
      );
    }

    if (type === "stock") {
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

    if (type === "low") {
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
            d="M12 9v3m0 4h.01M10.3 4.9 3.5 17a2 2 0 0 0 1.7 3h13.6a2 2 0 0 0 1.7 0 2 2 0 0 0 1.7-3L13.7 4.9a2 2 0 0 0-3.4 0Z"
          />
        </svg>
      );
    }

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
          d="m9 9 6 6m0-6-6 6m3-12a9 9 0 1 0 0 18 9 9 0 0 0-9-9 9 9 0 0 0 9-9Z"
        />
      </svg>
    );
  }

  return (
    <Page
      title="Pharmacy Inventory"
      subtitle="Manage medicines, monitor stock levels, and keep your inventory up to date."
    >
      {/* ============================================================
          HERO
      ============================================================ */}

      <div className="mb-7 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-sm">
        <div className="relative p-6 sm:p-8">
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs font-semibold text-indigo-300">
              Inventory Management
            </div>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Medicine Inventory
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              Track your medicine stock, configure reorder thresholds,
              and quickly identify medicines that need attention.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================
          MESSAGES
      ============================================================ */}

      {formError && (
        <div className="mb-5">
          <Notice>{formError}</Notice>
        </div>
      )}

      {successMessage && (
        <div className="mb-5">
          <Notice type="success">{successMessage}</Notice>
        </div>
      )}

      {/* ============================================================
          SUMMARY
      ============================================================ */}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Medicines
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {summary.total}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Medicines in inventory
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <SummaryIcon type="total" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                In Stock
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-600">
                {summary.inStock}
              </p>

              <p className="mt-1 text-xs text-emerald-600">
                Healthy stock levels
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <SummaryIcon type="stock" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Low Stock
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-amber-600">
                {summary.lowStock}
              </p>

              <p className="mt-1 text-xs text-amber-600">
                Requires attention
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <SummaryIcon type="low" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Out of Stock
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-red-600">
                {summary.outOfStock}
              </p>

              <p className="mt-1 text-xs text-red-600">
                Currently unavailable
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <SummaryIcon type="out" />
            </div>
          </div>
        </Card>
      </div>

      {/* ============================================================
          ADD / EDIT FORM
      ============================================================ */}

      <Card>
        <div className="mb-6 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
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
              </div>

              <h2 className="text-base font-semibold text-slate-900">
                {editingId
                  ? "Update Inventory"
                  : "Add Medicine"}
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {editingId
                ? "Update stock and reorder settings for this medicine."
                : "Add a medicine and configure its stock management settings."}
            </p>
          </div>

          {editingId && (
            <Button
              type="button"
              variant="secondary"
              onClick={resetForm}
              disabled={saving}
            >
              Cancel Edit
            </Button>
          )}
        </div>

        <form
          onSubmit={save}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5"
        >
          <Select
            label="Medicine"
            required
            value={f.medicineId}
            onChange={(e) => {
              setFormError("");

              setF({
                ...f,
                medicineId: e.target.value,
              });
            }}
          >
            <option value="">Select medicine</option>

            {medicines.map((medicine) => (
              <option
                key={medicine.id}
                value={medicine.id}
              >
                {medicine.name}
              </option>
            ))}
          </Select>

          <Input
            label="Current Stock"
            type="number"
            min="0"
            required
            value={f.stockQuantity}
            onChange={(e) =>
              setF({
                ...f,
                stockQuantity: e.target.value,
              })
            }
            placeholder="e.g. 50"
          />

          <Input
            label="Reorder Level"
            type="number"
            min="0"
            required
            value={f.reorderLevel}
            onChange={(e) =>
              setF({
                ...f,
                reorderLevel: e.target.value,
              })
            }
            placeholder="e.g. 20"
          />

          <Input
            label="Reorder Quantity"
            type="number"
            min="1"
            required
            value={f.reorderQuantity}
            onChange={(e) =>
              setF({
                ...f,
                reorderQuantity: e.target.value,
              })
            }
            placeholder="e.g. 100"
          />

          <Input
            label="Price"
            type="number"
            min="0"
            step="0.01"
            required
            value={f.price}
            onChange={(e) =>
              setF({
                ...f,
                price: e.target.value,
              })
            }
            placeholder="e.g. 120"
          />

          <div className="flex items-end sm:col-span-2 lg:col-span-5">
            <Button
              type="submit"
              disabled={saving || medicinesLoading}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Inventory"
                : "Add to Inventory"}
            </Button>
          </div>
        </form>

        {medicinesError && (
          <div className="mt-4">
            <Notice>
              Could not load medicines: {medicinesError}
            </Notice>
          </div>
        )}
      </Card>

      {/* ============================================================
          INVENTORY LIST
      ============================================================ */}

      <div className="mt-9">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              My Inventory
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredInventory.length} medicine
              {filteredInventory.length !== 1 ? "s" : ""} shown
            </p>
          </div>

          <div className="w-full lg:w-80">
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                />
              </svg>

              <Input
                label=""
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search medicines..."
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* ============================================================
            LOADING
        ============================================================ */}

        {inventoryLoading && (
          <div className="grid gap-5">
            {[1, 2].map((item) => (
              <Card key={item}>
                <div className="animate-pulse space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-3 w-20 rounded bg-slate-200" />
                      <div className="h-6 w-40 rounded bg-slate-200" />
                      <div className="h-3 w-24 rounded bg-slate-200" />
                    </div>

                    <div className="h-8 w-24 rounded-full bg-slate-200" />
                  </div>

                  <div className="h-28 rounded-xl bg-slate-100" />

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="h-24 rounded-xl bg-slate-100" />
                    <div className="h-24 rounded-xl bg-slate-100" />
                    <div className="h-24 rounded-xl bg-slate-100" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ============================================================
            ERROR
        ============================================================ */}

        {!inventoryLoading && inventoryError && (
          <Card>
            <div className="py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.7}
                    d="M12 9v3m0 4h.01M10.3 4.9 3.5 17a2 2 0 0 0 1.7 3h13.6a2 2 0 0 0 1.7-3L13.7 4.9a2 2 0 0 0-3.4 0Z"
                  />
                </svg>
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                Could not load inventory
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                {inventoryError}
              </p>

              <div className="mt-5">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={loadInventory}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* ============================================================
            EMPTY / RESULTS
        ============================================================ */}

        {!inventoryLoading &&
          !inventoryError &&
          filteredInventory.length === 0 && (
            <Card>
              <div className="py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.7}
                      d="M9 3h6l1 3H8l1-3Zm-2 3h10l1 15H6L7 6Zm3 4v7m4-7v7"
                    />
                  </svg>
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  No medicines found
                </h3>

                <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                  {search
                    ? "No inventory medicines match your search."
                    : "Add a medicine to your pharmacy inventory to see it here."}
                </p>
              </div>
            </Card>
          )}

        {!inventoryLoading &&
          !inventoryError &&
          filteredInventory.length > 0 && (
            <div className="grid gap-5">
              {filteredInventory.map((x) => {
                const status = getStockStatus(
                  x.stockQuantity,
                  x.reorderLevel
                );

                const stock = Number(
                  x.stockQuantity ?? 0
                );

                const reorderLevel = Number(
                  x.reorderLevel ?? 0
                );

                const stockPercentage =
                  reorderLevel > 0
                    ? Math.min(
                        100,
                        Math.round(
                          (stock / reorderLevel) * 100
                        )
                      )
                    : stock > 0
                    ? 100
                    : 0;

                return (
                  <Card key={x.id}>
                    <div className="space-y-5">
                      {/* HEADER */}

                      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                            Medicine
                          </p>

                          <h3 className="mt-1 text-lg font-semibold text-slate-900">
                            {getMedicineName(x)}
                          </h3>

                          <p className="mt-1 text-xs text-slate-400">
                            Medicine ID: {x.medicineId}
                          </p>
                        </div>

                        <span
                          className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.bg} ${status.text} ${status.border}`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${status.dot}`}
                          />

                          {status.label}
                        </span>
                      </div>

                      {/* STOCK */}

                      <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-xs font-medium text-slate-500">
                              Current Stock
                            </p>

                            <p className="mt-1 text-2xl font-bold text-slate-900">
                              {stock}

                              <span className="ml-1 text-sm font-medium text-slate-400">
                                units
                              </span>
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-slate-500">
                              Reorder at
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-700">
                              {reorderLevel} units
                            </p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className={`h-full rounded-full transition-all ${
                                stock === 0
                                  ? "bg-red-500"
                                  : stock <= reorderLevel
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                              style={{
                                width: `${stockPercentage}%`,
                              }}
                            />
                          </div>

                          <div className="mt-1.5 flex justify-between text-[10px] text-slate-400">
                            <span>0 units</span>

                            <span>
                              {stockPercentage}% of reorder level
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* DETAILS */}

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl border border-slate-100 bg-white p-4">
                          <p className="text-xs font-medium text-slate-500">
                            Reorder Level
                          </p>

                          <p className="mt-1 text-lg font-semibold text-amber-700">
                            {reorderLevel}
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-400">
                            Minimum stock threshold
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-white p-4">
                          <p className="text-xs font-medium text-slate-500">
                            Reorder Quantity
                          </p>

                          <p className="mt-1 text-lg font-semibold text-indigo-700">
                            {x.reorderQuantity ?? "—"}
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-400">
                            Units to replenish
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-100 bg-white p-4">
                          <p className="text-xs font-medium text-slate-500">
                            Selling Price
                          </p>

                          <p className="mt-1 text-lg font-semibold text-slate-900">
                            ₹{x.price ?? "—"}
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-400">
                            Per unit
                          </p>
                        </div>
                      </div>

                      {/* LOW STOCK */}

                      {stock > 0 &&
                        stock <= reorderLevel && (
                          <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                            <svg
                              className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
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

                            <div>
                              <p className="text-sm font-semibold text-amber-900">
                                Low stock alert
                              </p>

                              <p className="mt-0.5 text-xs leading-relaxed text-amber-800">
                                Stock has reached the reorder threshold.
                                Consider adding{" "}
                                <strong>
                                  {x.reorderQuantity ??
                                    "additional"}
                                </strong>{" "}
                                units.
                              </p>
                            </div>
                          </div>
                        )}

                      {/* OUT OF STOCK */}

                      {stock === 0 && (
                        <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                          <svg
                            className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.8}
                              d="m9 9 6 6m0-6-6 6m3-12a9 9 0 1 0 0 18 9 9 0 0 0-9-9 9 9 0 0 0 9-9Z"
                            />
                          </svg>

                          <div>
                            <p className="text-sm font-semibold text-red-900">
                              Out of stock
                            </p>

                            <p className="mt-0.5 text-xs text-red-700">
                              This medicine is currently unavailable.
                              Restock it to make it available again.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* ACTIONS */}

                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <p className="text-xs text-slate-400">
                          Inventory ID: {x.id}
                        </p>

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => startEdit(x)}
                            disabled={
                              saving ||
                              deletingId !== null
                            }
                          >
                            Edit
                          </Button>

                          <Button
                            type="button"
                            variant="danger"
                            onClick={() => del(x.id)}
                            disabled={
                              deletingId === x.id ||
                              saving
                            }
                          >
                            {deletingId === x.id
                              ? "Removing..."
                              : "Remove"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
      </div>
    </Page>
  );
}