import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Ambulance,
  ArrowRight,
  CalendarDays,
  HeartPulse,
  Hospital,
  Package,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { Card, Page } from "../components/UI";
import { API_URL } from "../services/api";

const patient = [
  [
    "/patient/doctors",
    "Find a doctor",
    "Search doctors through hospital departments",
    Stethoscope,
  ],
  [
    "/patient/hospitals",
    "Nearby hospitals",
    "Explore emergency and hospital information",
    Hospital,
  ],
  [
    "/patient/ambulances",
    "Nearby ambulances",
    "See nearby ambulance services",
    Ambulance,
  ],
  [
    "/patient/symptoms",
    "Symptom checker",
    "Describe symptoms and view specialization guidance",
    Activity,
  ],
  [
    "/patient/blood",
    "Blood services",
    "Blood banks, inventory and blood requests",
    HeartPulse,
  ],
  [
    "/patient/appointments",
    "Appointments",
    "Request and manage consultations",
    CalendarDays,
  ],
  [
    "/patient/orders",
    "Medicine orders",
    "Order medicines through verified pharmacies",
    Package,
  ],
  [
    "/patient/organ",
    "Organ donation",
    "Submit and track an organ request",
    HeartPulse,
  ],
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Unable to get current user");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Unable to get current user:", error);
      } finally {
        setLoading(false);
      }
    }

    getCurrentUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const cards =
    user?.role === "PATIENT"
      ? patient
      : user?.role === "DOCTOR"
        ? [
            [
              "/doctor/appointments",
              "Appointments",
              "Review and manage patient appointments",
              CalendarDays,
            ],
            [
              "/doctor/consultations",
              "Consultations",
              "Record consultation notes",
              Stethoscope,
            ],
            [
              "/doctor/prescriptions",
              "Prescriptions",
              "Create prescriptions after consultations",
              Package,
            ],
            [
              "/doctor/license",
              "License",
              "Submit license for verification",
              ShieldCheck,
            ],
          ]
        : user?.role === "PHARMACY"
          ? [
              [
                "/pharmacy/orders",
                "Orders",
                "Process patient medicine orders",
                Package,
              ],
              [
                "/pharmacy/inventory",
                "Inventory",
                "Manage medicine stock and pricing",
                Package,
              ],
              [
                "/pharmacy/license",
                "License",
                "Submit pharmacy license",
                ShieldCheck,
              ],
            ]
          : user?.role === "ADMIN"
            ? [
                [
                  "/admin/users",
                  "Users",
                  "View and manage platform users",
                  ShieldCheck,
                ],
                [
                  "/admin/hospitals",
                  "Hospitals",
                  "Verify and manage hospitals",
                  Hospital,
                ],
                [
                  "/admin/doctor-licenses",
                  "Doctor licenses",
                  "Review submitted licenses",
                  ShieldCheck,
                ],
                [
                  "/admin/medicines",
                  "Medicines",
                  "Manage medicine catalog",
                  Package,
                ],
              ]
            : [
                [
                  "/hospital/profile",
                  "Hospital profile",
                  "Manage hospital information",
                  Hospital,
                ],
              ];

  return (
    <Page
      title={`Good to see you, ${user?.username || user?.name || "there"} `}
      subtitle={`You are signed in as ${user?.role || "User"}. Choose a service to continue.`}
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([to, t, d, I]) => (
          <Link key={to} to={to} className="group">
            <Card className="h-full transition hover:-translate-y-0.5 hover:border-med-200 hover:shadow-md">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-med-50 text-med-700">
                <I size={21} />
              </div>

              <h2 className="mt-5 font-bold">{t}</h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {d}
              </p>

              <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-med-700">
                Open{" "}
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Page>
  );
}