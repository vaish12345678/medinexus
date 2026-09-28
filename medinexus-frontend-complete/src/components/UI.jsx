import React from "react";

// ============================================================
// ICON
// ============================================================

function Icon({ name, size = 18, strokeWidth = 2 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const paths = {
    check: (
      <>
        <path d="m5 12 4 4L19 6" />
      </>
    ),
    error: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </>
    ),
    warning: (
      <>
        <path d="M10.3 3.6 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5" />
        <path d="M12 8h.01" />
      </>
    ),
    refresh: (
      <>
        <path d="M20 11a8.1 8.1 0 0 0-15.5-2" />
        <path d="M4 4v5h5" />
        <path d="M4 13a8.1 8.1 0 0 0 15.5 2" />
        <path d="M20 20v-5h-5" />
      </>
    ),
    loader: (
      <>
        <path d="M12 3a9 9 0 1 0 9 9" />
      </>
    ),
  };

  return <svg {...common}>{paths[name] || paths.info}</svg>;
}

// ============================================================
// CARD
// ============================================================

export function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}

// ============================================================
// BUTTON
// ============================================================

export function Button({
  children,
  variant = "primary",
  loading = false,
  loadingText = "Please wait...",
  className = "",
  disabled,
  ...p
}) {
  const styles = {
    primary:
      "bg-med-600 text-white hover:bg-med-700 focus-visible:ring-med-500",
    secondary:
      "bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-400",
    danger:
      "bg-red-50 text-red-700 hover:bg-red-100 focus-visible:ring-red-400",
    ghost:
      "bg-transparent text-med-700 hover:bg-med-50 focus-visible:ring-med-400",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500",
  };

  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant] || styles.primary} ${className}`}
      disabled={loading || disabled}
      aria-busy={loading}
      {...p}
    >
      {loading && (
        <Icon
          name="loader"
          size={16}
          strokeWidth={2.2}
          className="animate-spin"
        />
      )}

      {loading ? loadingText : children}
    </button>
  );
}

// ============================================================
// INPUT
// ============================================================

export function Input({
  label,
  error,
  hint,
  required = false,
  className = "",
  ...p
}) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </span>
      )}

      <input
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${p.id || p.name}-error` : undefined}
        className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-med-400 focus:ring-2 focus:ring-med-100"
        } ${className}`}
        {...p}
      />

      {error ? (
        <span
          id={p.id || p.name ? `${p.id || p.name}-error` : undefined}
          className="mt-1.5 flex items-start gap-1.5 text-xs text-red-600"
        >
          <Icon name="error" size={14} />
          <span>{error}</span>
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
}

// ============================================================
// SELECT
// ============================================================

export function Select({
  label,
  error,
  hint,
  required = false,
  className = "",
  children,
  ...p
}) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </span>
      )}

      <select
        aria-invalid={Boolean(error)}
        className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-med-400 focus:ring-2 focus:ring-med-100"
        } ${className}`}
        {...p}
      >
        {children}
      </select>

      {error ? (
        <span className="mt-1.5 flex items-start gap-1.5 text-xs text-red-600">
          <Icon name="error" size={14} />
          <span>{error}</span>
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
}

// ============================================================
// TEXTAREA
// ============================================================

export function Textarea({
  label,
  error,
  hint,
  required = false,
  className = "",
  ...p
}) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </span>
      )}

      <textarea
        aria-invalid={Boolean(error)}
        className={`min-h-28 w-full resize-y rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-med-400 focus:ring-2 focus:ring-med-100"
        } ${className}`}
        {...p}
      />

      {error ? (
        <span className="mt-1.5 flex items-start gap-1.5 text-xs text-red-600">
          <Icon name="error" size={14} />
          <span>{error}</span>
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-slate-500">{hint}</span>
      ) : null}
    </label>
  );
}

// ============================================================
// BADGE
// ============================================================

export function Badge({ value }) {
  const v = String(value || "").toUpperCase();

  const c =
    v.includes("APPROV") ||
    v.includes("ACTIVE") ||
    v.includes("COMPLETE") ||
    v.includes("READY") ||
    v === "READ"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : v.includes("PENDING") ||
          v.includes("REQUEST") ||
          v.includes("PROCESS") ||
          v === "UNREAD"
        ? "bg-amber-50 text-amber-700 border-amber-100"
        : v.includes("REJECT") ||
            v.includes("CANCEL") ||
            v.includes("SUSPEND")
          ? "bg-red-50 text-red-700 border-red-100"
          : "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${c}`}
    >
      {value || "—"}
    </span>
  );
}

// ============================================================
// PAGE
// ============================================================

export function Page({ title, subtitle, actions, children }) {
  return (
    <div className="page-enter space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          )}
        </div>

        {actions}
      </div>

      {children}
    </div>
  );
}

// ============================================================
// LOADING
// ============================================================

export function Loading({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-14">
      <div className="mb-3 h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-med-600" />

      <p className="text-sm font-medium text-slate-600">{text}</p>

      <p className="mt-1 text-xs text-slate-400">
        Please wait while we load your data.
      </p>
    </div>
  );
}

// ============================================================
// NOTICE
// ============================================================

export function Notice({
  children,
  type = "error",
  title,
  onClose,
  className = "",
}) {
  const styles = {
    error: {
      wrapper: "border-red-200 bg-red-50 text-red-700",
      icon: "error",
      iconBg: "bg-red-100",
    },

    success: {
      wrapper: "border-emerald-200 bg-emerald-50 text-emerald-700",
      icon: "check",
      iconBg: "bg-emerald-100",
    },

    warning: {
      wrapper: "border-amber-200 bg-amber-50 text-amber-700",
      icon: "warning",
      iconBg: "bg-amber-100",
    },

    info: {
      wrapper: "border-med-100 bg-med-50 text-med-700",
      icon: "info",
      iconBg: "bg-med-100",
    },
  };

  const style = styles[type] || styles.error;

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${style.wrapper} ${className}`}
    >
      <span
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${style.iconBg}`}
      >
        <Icon name={style.icon} size={16} />
      </span>

      <div className="min-w-0 flex-1">
        {title && (
          <p className="text-sm font-semibold leading-5">{title}</p>
        )}

        <div className={title ? "mt-0.5 text-sm" : "text-sm"}>
          {children}
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="rounded-lg p-1 text-current opacity-60 transition hover:bg-black/5 hover:opacity-100"
        >
          <span className="text-lg leading-none">×</span>
        </button>
      )}
    </div>
  );
}

// ============================================================
// EMPTY
// ============================================================

export function Empty({
  children = "No records found.",
  title,
  action,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <Icon name="info" size={21} />
      </div>

      {title && (
        <h3 className="mt-4 text-sm font-semibold text-slate-800">
          {title}
        </h3>
      )}

      <p className={`${title ? "mt-1" : "mt-4"} text-sm text-slate-500`}>
        {children}
      </p>

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ============================================================
// ERROR STATE
// ============================================================

export function ErrorState({
  title = "Unable to load data",
  message = "Something went wrong while loading this information.",
  onRetry,
}) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/60 px-6 py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <Icon name="error" size={22} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-red-800">{title}</h3>

      <p className="mx-auto mt-1 max-w-md text-sm text-red-600">
        {message}
      </p>

      {onRetry && (
        <Button
          type="button"
          variant="secondary"
          className="mt-5"
          onClick={onRetry}
        >
          <Icon name="refresh" size={16} />
          Try again
        </Button>
      )}
    </div>
  );
}