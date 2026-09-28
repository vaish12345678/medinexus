import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  Bell,
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileCheck,
  FileText,
  HeartPulse,
  Hospital,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Pill,
  Search,
  Stethoscope,
  User,
  Users,
  X,
} from "lucide-react";

import { API_URL } from "../services/api";

// ======================================================
// COMMON NAVIGATION
// ======================================================

const commonLinks = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/notifications",
    label: "Notifications",
    icon: Bell,
  },
];

// ======================================================
// PATIENT NAVIGATION
// ======================================================

const patientLinks = [
  {
    to: "/patient/profile",
    label: "My Profile",
    icon: User,
  },
  {
    to: "/patient/doctors",
    label: "Find Doctors",
    icon: Stethoscope,
  },
  {
    to: "/patient/hospitals",
    label: "Hospitals",
    icon: Hospital,
  },
  {
    to: "/patient/ambulances",
    label: "Ambulances",
    icon: HeartPulse,
  },
  {
    to: "/patient/blood",
    label: "Blood Services",
    icon: HeartPulse,
  },
  {
    to: "/patient/symptoms",
    label: "Symptom Checker",
    icon: Search,
  },
  {
    to: "/patient/appointments",
    label: "Appointments",
    icon: Calendar,
  },
  {
    to: "/patient/prescriptions",
    label: "Prescriptions",
    icon: FileText,
  },
  {
    to: "/patient/orders",
    label: "Medicine Orders",
    icon: Package,
  },
  {
    to: "/patient/organ",
    label: "Organ Donation",
    icon: HeartPulse,
  },
  {
    to: "/patient/schemes",
    label: "Hospital Schemes",
    icon: ClipboardList,
  },
];

// ======================================================
// DOCTOR NAVIGATION
// ======================================================

const doctorLinks = [
  {
    to: "/doctor/profile",
    label: "My Profile",
    icon: User,
  },
  {
    to: "/doctor/license",
    label: "License",
    icon: FileCheck,
  },
  {
    to: "/doctor/availability",
    label: "Availability",
    icon: CalendarDays,
  },
  {
    to: "/doctor/appointments",
    label: "Appointments",
    icon: Calendar,
  },
  {
    to: "/doctor/consultations",
    label: "Consultations",
    icon: Stethoscope,
  },
  {
    to: "/doctor/prescriptions",
    label: "Prescriptions",
    icon: FileText,
  },
  {
    to: "/doctor/organ-requests",
    label: "Organ Requests",
    icon: HeartPulse,
  },
];

// ======================================================
// PHARMACY NAVIGATION
// ======================================================

const pharmacyLinks = [
  {
    to: "/pharmacy/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/pharmacy/profile",
    label: "My Pharmacy",
    icon: Pill,
  },
  {
    to: "/pharmacy/license",
    label: "License",
    icon: FileCheck,
  },
  {
    to: "/pharmacy/orders",
    label: "See Orders",
    icon: Package,
  },
  {
    to: "/pharmacy/inventory",
    label: "Inventory",
    icon: Package,
  },
];

// ======================================================
// ADMIN NAVIGATION
// ======================================================

const adminLinks = [
  {
    to: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/admin/doctor-licenses",
    label: "Doctor Licenses",
    icon: FileCheck,
  },
  {
    to: "/admin/pharmacy-licenses",
    label: "Pharmacy Licenses",
    icon: FileCheck,
  },
  {
    to: "/admin/hospitals",
    label: "Hospitals",
    icon: Hospital,
  },
  {
    to: "/admin/organ-requests",
    label: "Organ Requests",
    icon: HeartPulse,
  },
  {
    to: "/admin/medicines",
    label: "Medicines",
    icon: Pill,
  },
  {
    to: "/admin/departments",
    label: "Departments",
    icon: ClipboardList,
  },
  {
    to: "/admin/beds",
    label: "Hospital Beds",
    icon: Hospital,
  },
];

// ======================================================
// ROLE → NAVIGATION
// ======================================================

const roleLinks = {
  PATIENT: patientLinks,
  DOCTOR: doctorLinks,
  PHARMACY: pharmacyLinks,
  ADMIN: adminLinks,
};

// ======================================================
// APP LAYOUT
// ======================================================

export default function AppLayout({ children }) {
  const navigate = useNavigate();

  // ----------------------------------------------------
  // Logged-in user
  // ----------------------------------------------------

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // ----------------------------------------------------
  // Notification count
  // ----------------------------------------------------

  const [unreadCount, setUnreadCount] = useState(0);

  // ----------------------------------------------------
  // Sidebar / mobile state
  // ----------------------------------------------------

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ----------------------------------------------------
  // Get current logged-in user
  // ----------------------------------------------------

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("User is not logged in");
        }

        const data = await response.json();

        setUser(data);
      } catch (error) {
        console.error("Unable to get current user:", error);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    }

    getCurrentUser();
  }, []);

  // ----------------------------------------------------
  // Get unread notification count
  // ----------------------------------------------------

  useEffect(() => {
    if (!user) {
      return;
    }

    async function loadUnreadCount() {
      try {
        const response = await fetch(
          `${API_URL}/notifications/unread/count`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load unread notification count"
          );
        }

        const count = await response.json();

        setUnreadCount(Number(count) || 0);
      } catch (error) {
        console.error(
          "Unable to load unread notification count:",
          error
        );

        setUnreadCount(0);
      }
    }

    // Load immediately
    loadUnreadCount();

    // Check for new notifications every 15 seconds
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 15000);

    // Cleanup when user changes/unmounts
    return () => {
      clearInterval(interval);
    };
  }, [user]);

  // ----------------------------------------------------
  // Build navigation according to role
  // ----------------------------------------------------

  const links = [
    ...(
      user?.role === "PHARMACY" ||
      user?.role === "ADMIN"
        ? commonLinks.filter(
            (item) => item.to !== "/dashboard"
          )
        : commonLinks
    ),

    ...(roleLinks[user?.role] || []),
  ];

  // ----------------------------------------------------
  // Logout
  // ----------------------------------------------------

  async function handleLogout() {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setUnreadCount(0);

      navigate("/login", {
        replace: true,
      });
    }
  }

  // ----------------------------------------------------
  // Navigation item
  // ----------------------------------------------------

  const NavigationItem = ({
    item,
    mobile = false,
  }) => {
    const Icon = item.icon;

    return (
      <NavLink
        to={item.to}
        onClick={() => {
          if (mobile) {
            setMobileMenuOpen(false);
          }
        }}
        className={({ isActive }) =>
          `
          flex items-center gap-3 rounded-xl 
          px-3 py-2.5 
          text-sm font-medium 
          transition-all duration-200

          ${
            isActive
              ? "bg-teal-50 text-teal-700"
              : "text-slate-600 hover:bg-slate-50 hover:text-teal-700"
          }

          ${mobile ? "py-3" : ""}
          `
        }
      >
        <Icon
          size={18}
          className="shrink-0"
        />

        {(sidebarOpen || mobile) && (
          <span className="truncate">
            {item.label}
          </span>
        )}
      </NavLink>
    );
  };

  // ----------------------------------------------------
  // Loading
  // ----------------------------------------------------

  if (loadingUser) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Loading...
        </p>
      </div>
    );
  }

  // ----------------------------------------------------
  // Layout
  // ----------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ==================================================
          DESKTOP SIDEBAR
      ================================================== */}

      <aside
        className={`
          fixed 
          inset-y-0 
          left-0 
          z-40 
          hidden 
          border-r 
          border-slate-200 
          bg-white 
          transition-all 
          duration-300 
          lg:block

          ${sidebarOpen ? "w-72" : "w-20"} 
        `}
      >
        <div className="flex h-full flex-col">

          {/* Logo */}

          <div className="flex h-20 items-center justify-between border-b border-slate-200 px-5">

            <div className="flex items-center gap-3 overflow-hidden">

              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-600 text-white">

                <HeartPulse size={22} />

              </div>

              {sidebarOpen && (
                <div>

                  <div className="font-extrabold text-teal-700">
                    Medinexus
                  </div>

                  <div className="text-[11px] text-slate-400">
                    Digital healthcare
                  </div>

                </div>
              )}

            </div>

            {/* Collapse */}

            <button
              type="button"
              onClick={() =>
                setSidebarOpen(
                  (previous) => !previous
                )
              }
              className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label={
                sidebarOpen
                  ? "Collapse sidebar"
                  : "Expand sidebar"
              }
            >

              {sidebarOpen ? (
                <ChevronLeft size={20} />
              ) : (
                <ChevronRight size={20} />
              )}

            </button>

          </div>

          {/* Navigation */}

          <nav className="flex-1 space-y-1 overflow-y-auto p-3">

            {links.map((item) => (
              <NavigationItem
                key={item.to}
                item={item}
              />
            ))}

          </nav>

          {/* Logout */}

          <div className="border-t border-slate-200 p-3">

            <button
              type="button"
              onClick={handleLogout}
              className="
                flex w-full items-center gap-3 
                rounded-xl px-3 py-2.5 
                text-sm font-semibold 
                text-red-600 
                transition 
                hover:bg-red-50
              "
            >

              <LogOut size={18} />

              {sidebarOpen && (
                <span>
                  Logout
                </span>
              )}

            </button>

          </div>

        </div>
      </aside>

      {/* ==================================================
          MOBILE NAVIGATION
      ================================================== */}

      <div className="lg:hidden">

        {/* Mobile top bar */}

        <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">

          <div className="flex items-center gap-2">

            <div className="grid h-9 w-9 place-items-center rounded-lg bg-teal-600 text-white">

              <HeartPulse size={19} />

            </div>

            <div className="font-extrabold text-teal-700">
              Medinexus
            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(true)
            }
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Open navigation"
          >

            <Menu size={22} />

          </button>

        </div>

        {/* Mobile drawer */}

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-white">

            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">

              <div className="flex items-center gap-2">

                <div className="grid h-9 w-9 place-items-center rounded-lg bg-teal-600 text-white">

                  <HeartPulse size={19} />

                </div>

                <span className="font-extrabold text-teal-700">
                  Medinexus
                </span>

              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                aria-label="Close navigation"
              >

                <X size={22} />

              </button>

            </div>

            <nav className="space-y-1 overflow-y-auto p-4">

              {links.map((item) => (
                <NavigationItem
                  key={item.to}
                  item={item}
                  mobile
                />
              ))}

              {/* Mobile logout */}

              <button
                type="button"
                onClick={handleLogout}
                className="
                  mt-4 flex w-full items-center gap-3 
                  rounded-xl px-3 py-3 
                  text-sm font-semibold 
                  text-red-600 
                  hover:bg-red-50
                "
              >

                <LogOut size={18} />

                <span>
                  Logout
                </span>

              </button>

            </nav>

          </div>
        )}

      </div>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main
        className={`
          min-h-screen 
          transition-all 
          duration-300

          ${
            sidebarOpen
              ? "lg:ml-72"
              : "lg:ml-20"
          }
        `}
      >

        {/* Desktop Header */}

        <header className="sticky top-0 z-20 hidden h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-8 backdrop-blur lg:flex">

          <div>

            <span className="text-sm text-slate-400">
              Welcome back
            </span>

            <div className="font-semibold text-slate-800">

              {user?.username ||
                user?.name ||
                "User"}

            </div>

          </div>

          <div className="flex items-center gap-3">

            {/* ==================================================
                NOTIFICATIONS
            ================================================== */}

            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `
                relative 
                rounded-xl 
                p-2.5 
                transition

                ${
                  isActive
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-500 hover:bg-slate-100"
                }
                `
              }
              aria-label={
                unreadCount > 0
                  ? `${unreadCount} unread notifications`
                  : "Notifications"
              }
            >

              <Bell size={20} />

              {/* Unread notification badge */}

              {unreadCount > 0 && (
                <span
                  className="
                    absolute 
                    -right-1 
                    -top-1 
                    flex 
                    h-5 
                    min-w-5 
                    items-center 
                    justify-center 
                    rounded-full 
                    bg-red-500 
                    px-1 
                    text-[10px] 
                    font-bold 
                    leading-none 
                    text-white 
                    shadow-sm
                  "
                >
                  {unreadCount > 9
                    ? "9+"
                    : unreadCount}
                </span>
              )}

            </NavLink>

            {/* Role */}

            <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700">

              {user?.role || "USER"}

            </span>

          </div>

        </header>

        {/* Page Content */}

        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

          {children}

        </div>

      </main>

    </div>
  );
}