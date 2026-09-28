import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCheck,
  Calendar,
  Pill,
  Building2,
  Droplet,
  Heart,
  Activity,
  CheckCircle2,
  Bell,
  Ambulance,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  ChevronRight,
  Search,
  Star,
  MapPin,
  Clock,
  Check,
  Navigation,
  PhoneCall,
  Compass,
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("doctors");
  const [activeNearbyCategory, setActiveNearbyCategory] = useState("all");

  const services = [
    {
      icon: UserCheck,
      title: "Find Doctors",
      tagline: "Verified Specialists",
      description:
        "Filter qualified doctors by medical specialty, experience, and immediate appointment availability.",
    },
    {
      icon: Calendar,
      title: "Book Appointments",
      tagline: "Instant Scheduling",
      description:
        "Schedule and manage video consultations or in-person clinic visits with automated sync.",
    },
    {
      icon: Pill,
      title: "Pharmacy Services",
      tagline: "E-Prescriptions & Refills",
      description:
        "Digitally manage prescriptions and coordinate direct home delivery from partner pharmacies.",
    },
    {
      icon: Building2,
      title: "Hospital Network",
      tagline: "Accredited Facilities",
      description:
        "Locate emergency trauma centers, specialized surgical units, and medical hubs near you.",
    },
    {
      icon: Droplet,
      title: "Blood Donors",
      tagline: "Urgent Matching",
      description:
        "Real-time emergency dispatch connecting nearby blood donor pools with urgent hospital requests.",
    },
    {
      icon: Heart,
      title: "Organ Donation",
      tagline: "Life-Saving Network",
      description:
        "Transparent donor registration registry connecting accredited transplant medical centers.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Account",
      description:
        "Fast sign-up tailored specifically for patients, doctors, or pharmacy partners.",
    },
    {
      number: "02",
      title: "Search & Match",
      description:
        "Discover top-rated specialists, local pharmacies, and emergency services instantly.",
    },
    {
      number: "03",
      title: "Unified Care",
      description:
        "Track digital health records, consultations, and prescription status in real time.",
    },
    {
      number: "04",
      title: "Automated Alerts",
      description:
        "Receive smart SMS and push notifications for upcoming appointments and prescription refills.",
    },
  ];

  const nearbyLocations = [
    {
      id: 1,
      category: "hospital",
      name: "St. Jude Memorial Hospital & Trauma Center",
      type: "Tertiary Hospital • 24/7 ER",
      distance: "1.2 km away",
      time: "4 mins drive",
      address: "742 Evergreen Terrace, North Wing",
      status: "Open 24 Hours",
      rating: "4.9",
      icon: Building2,
      color: "bg-teal-50 text-teal-700 border-teal-200",
      accent: "bg-teal-700 text-white",
    },
    {
      id: 2,
      category: "ambulance",
      name: "Rapid Response Emergency Dispatch Unit",
      type: "ACLS Cardiac Ambulance On-Call",
      distance: "0.5 km away",
      time: "2 mins ETA",
      address: "Station 04 • Express Route Active",
      status: "3 Units Available",
      rating: "5.0",
      icon: Ambulance,
      color: "bg-red-50 text-red-600 border-red-200",
      accent: "bg-red-600 text-white",
    },
    {
      id: 3,
      category: "bloodbank",
      name: "Red Cross Emergency Blood Reserve",
      type: "Blood Bank & Component Center",
      distance: "2.4 km away",
      time: "7 mins drive",
      address: "108 Medical Center Boulevard",
      status: "O- & B+ In Stock",
      rating: "4.8",
      icon: Droplet,
      color: "bg-rose-50 text-rose-700 border-rose-200",
      accent: "bg-rose-600 text-white",
    },
  ];

  const filteredNearby =
    activeNearbyCategory === "all"
      ? nearbyLocations
      : nearbyLocations.filter((item) => item.category === activeNearbyCategory);

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 antialiased selection:bg-teal-600 selection:text-white">
      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-teal-100/70 blur-[130px]" />
        <div className="absolute top-1/3 -left-40 h-[600px] w-[600px] rounded-full bg-emerald-100/60 blur-[130px]" />
        <div className="absolute -bottom-40 right-1/4 h-[500px] w-[500px] rounded-full bg-cyan-100/60 blur-[130px]" />
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-3 text-left focus:outline-none"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white shadow-md shadow-teal-600/20 transition duration-300 group-hover:scale-105">
              <Activity className="h-6 w-6 stroke-[2.5]" />
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Medinexus
              </h1>
              <p className="text-[10px] font-bold tracking-widest text-teal-600 uppercase">
                Connected Care
              </p>
            </div>
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            {["Home", "Services", "Nearby Care", "How It Works", "About"].map((item) => {
              const href = `#${item.toLowerCase().replace(/\s+/g, "-")}`;
              return (
                <a
                  key={item}
                  href={href}
                  className="text-sm font-semibold text-slate-600 transition duration-200 hover:text-teal-700"
                >
                  {item}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl border border-slate-300/80 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:border-slate-400 hover:bg-slate-50"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-700/20 transition duration-200 hover:bg-teal-800 hover:shadow-lg active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="relative z-10">
        <section id="home" className="relative bg-white py-20 lg:py-28 border-b border-slate-200/60">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12 lg:px-8">
            
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-xs font-bold text-teal-800 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                The Complete Healthcare Ecosystem
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl lg:leading-[1.12]">
                Your health journey,{" "}
                <span className="bg-gradient-to-r from-teal-700 via-emerald-600 to-cyan-700 bg-clip-text text-transparent">
                  seamlessly connected.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                Medinexus unifies patients, doctors, and pharmacy networks into a single platform. Effortlessly book appointments, manage e-prescriptions, and access essential services.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate("/register")}
                  className="group inline-flex items-center gap-2.5 rounded-xl bg-teal-700 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-700/25 transition duration-200 hover:bg-teal-800 active:scale-95"
                >
                  Create Free Account
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() =>
                    document
                      .getElementById("services")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:border-teal-600 hover:text-teal-700"
                >
                  Explore Services
                </button>
              </div>

              {/* Badges */}
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-slate-100 pt-8 text-slate-600">
                <div>
                  <div className="text-2xl font-black text-slate-900">100%</div>
                  <div className="mt-1 text-xs font-medium text-slate-500">Verified Doctors</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">24/7</div>
                  <div className="mt-1 text-xs font-medium text-slate-500">Emergency Support</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">Protected</div>
                  <div className="mt-1 text-xs font-medium text-slate-500">HIPAA Compliant</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl shadow-slate-200/80">
                
                {/* Mockup Navigation Tabs */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex gap-2">
                    {["doctors", "schedules", "prescriptions"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition ${
                          activeTab === tab
                            ? "bg-teal-50 text-teal-700 border border-teal-200"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                {/* Mockup Tab Content */}
                <div className="mt-5 space-y-3">
                  {activeTab === "doctors" && (
                    <>
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          disabled
                          placeholder="Search specialists..."
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2 pl-9 pr-4 text-xs text-slate-700 placeholder:text-slate-400"
                        />
                      </div>

                      {[
                        { name: "Dr. Sarah Jenkins", role: "Cardiologist", rating: "4.9", location: "St. Jude Medical" },
                        { name: "Dr. Marcus Vance", role: "Neurologist", rating: "4.8", location: "Central Hospital" },
                      ].map((doc) => (
                        <div key={doc.name} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 transition hover:border-teal-200 hover:bg-teal-50/30">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-800 font-bold text-sm">
                              {doc.name[4]}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">{doc.name}</p>
                              <p className="text-[11px] text-slate-500">{doc.role}</p>
                              <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                                <span className="flex items-center gap-0.5 text-amber-500 font-semibold"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{doc.rating}</span>
                                <span>•</span>
                                <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{doc.location}</span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        </div>
                      ))}
                    </>
                  )}

                  {activeTab === "schedules" && (
                    <div className="space-y-3">
                      <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-teal-800">Confirmed Appointment</span>
                          <span className="rounded-full bg-teal-200/80 px-2 py-0.5 text-[10px] font-bold text-teal-900">Tomorrow</span>
                        </div>
                        <p className="mt-2 text-sm font-bold text-slate-900">Dr. Sarah Jenkins</p>
                        <p className="text-xs text-slate-600">10:30 AM — Video Consultation</p>
                      </div>
                    </div>
                  )}

                  {activeTab === "prescriptions" && (
                    <div className="space-y-3">
                      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900">Amoxicillin 500mg</p>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">Ready</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Rx #88392 • HealthPlus Pharmacy</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Bar */}
                <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <ShieldCheck className="h-4 w-4 text-teal-600" />
                    <span>Real-Time Sync Active</span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-teal-700">ONLINE</span>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-5 -right-5 hidden sm:flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xl">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Check className="h-5 w-5 stroke-[3]" />
                  </div>
                  <div className="text-left pr-2">
                    <p className="text-xs font-bold text-slate-900">Booking Confirmed</p>
                    <p className="text-[10px] text-slate-500">Notification Sent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" className="py-24 bg-slate-50/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold tracking-widest text-teal-700 uppercase">
                Core Capabilities
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Comprehensive healthcare services.
              </h2>
              <p className="mt-3 text-lg text-slate-600">
                Everything required to manage care for you and your family in one intuitive dashboard.
              </p>
            </div>

            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={service.title}
                    className="group relative rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 transition duration-300 group-hover:bg-teal-700 group-hover:text-white">
                      <IconComponent className="h-6 w-6 stroke-[2]" />
                    </div>

                    <p className="mt-6 text-xs font-bold text-teal-700">
                      {service.tagline}
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-slate-900">
                      {service.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {service.description}
                    </p>

                    <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 transition group-hover:translate-x-1">
                      <span>Learn More</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* NEARBY CARE & MAP DIRECTIONS FEATURE SECTION */}
        <section id="nearby-care" className="py-24 bg-white border-t border-slate-200/70">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div>
                <span className="text-xs font-bold tracking-widest text-teal-700 uppercase">
                  Real-Time Location & Emergency Services
                </span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Nearby Hospitals, Ambulances & Blood Banks
                </h2>
                <p className="mt-3 max-w-xl text-slate-600">
                  Instant GPS dispatch and turn-by-turn map guidance to accredited urgent care centers closest to you.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="mt-6 md:mt-0 flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-1.5 border border-slate-200">
                {[
                  { id: "all", label: "All Care Units" },
                  { id: "hospital", label: "Hospitals" },
                  { id: "ambulance", label: "Ambulances" },
                  { id: "bloodbank", label: "Blood Banks" },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveNearbyCategory(filter.id)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                      activeNearbyCategory === filter.id
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-12">
              {/* Nearby Items List */}
              <div className="lg:col-span-7 space-y-4">
                {filteredNearby.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition duration-200 hover:border-teal-300 hover:shadow-md"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${item.color}`}
                          >
                            <Icon className="h-6 w-6 stroke-[2]" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-slate-900">
                                {item.name}
                              </h3>
                              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                                <Star className="h-3 w-3 fill-amber-400" />
                                {item.rating}
                              </span>
                            </div>

                            <p className="mt-0.5 text-xs font-medium text-slate-500">
                              {item.type}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                              <span className="flex items-center gap-1 font-semibold text-slate-800">
                                <MapPin className="h-3.5 w-3.5 text-teal-600" />
                                {item.distance}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                <Clock className="h-3.5 w-3.5" />
                                {item.time}
                              </span>
                              <span>•</span>
                              <span className="text-slate-500">{item.status}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Navigation Button */}
                        <div className="flex sm:flex-col gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                          <button
                            onClick={() =>
                              window.open(
                                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  item.name
                                )}`,
                                "_blank"
                              )
                            }
                            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-sm ${item.accent}`}
                          >
                            <Navigation className="h-3.5 w-3.5 fill-current" />
                            Get Directions
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Visual Map Preview */}
              <div className="lg:col-span-5">
                <div className="relative h-full min-h-[360px] overflow-hidden rounded-3xl border border-slate-200/90 bg-slate-100 p-6 shadow-sm flex flex-col justify-between">
                  {/* Stylized Grid Overlay mocking map layout */}
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage:
                        "radial-gradient(#0f766e 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* Top Map Header */}
                  <div className="relative z-10 flex items-center justify-between rounded-2xl bg-white/90 p-4 shadow-sm backdrop-blur">
                    <div className="flex items-center gap-2">
                      <Compass className="h-5 w-5 text-teal-700 animate-spin-slow" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          Live Location Dispatch
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Showing verified care hubs in 5km radius
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                      GPS Lock Active
                    </span>
                  </div>

                  {/* Mock Map Route Visual */}
                  <div className="relative z-10 my-8 py-6 px-4 rounded-2xl border border-teal-200/80 bg-white/80 backdrop-blur">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white shadow-md">
                          <Navigation className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            Fastest Route Computed
                          </p>
                          <p className="text-[11px] text-teal-700 font-semibold">
                            Via Main Avenue • Clear Traffic
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-slate-900">
                          4 mins
                        </span>
                        <p className="text-[10px] text-slate-500">1.2 km distance</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Quick Call Dispatch */}
                  <div className="relative z-10 flex items-center justify-between rounded-2xl bg-slate-900 p-4 text-white shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white">
                        <PhoneCall className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold">24/7 Emergency Helpline</p>
                        <p className="text-[10px] text-slate-400">Direct hospital dispatch hotline</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate("/register")}
                      className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-bold text-white transition"
                    >
                      Call Dispatch
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="bg-slate-50/50 py-24 border-t border-slate-200/80">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center">
              <span className="text-xs font-bold tracking-widest text-teal-700 uppercase">
                Simple Process
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                How Medinexus Works
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-600">
                A streamlined connection linking patients, specialists, and fulfillment centers.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="relative rounded-2xl border border-slate-200/80 bg-white p-8 transition hover:border-teal-200 hover:shadow-md"
                >
                  <span className="text-4xl font-extrabold text-teal-200">
                    {step.number}
                  </span>

                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOR PROVIDERS */}
        <section id="about" className="border-t border-slate-200/80 bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="text-xs font-bold tracking-widest text-teal-700 uppercase">
                  For Medical Partners
                </span>

                <h2 className="mt-2 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
                  Empower your medical practice or pharmacy network.
                </h2>

                <p className="mt-4 text-slate-600 leading-relaxed">
                  Reduce administrative tasks, automate schedule bookings, and streamline prescription fulfillment on one unified system.
                </p>

                <button
                  onClick={() => navigate("/register")}
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800"
                >
                  Join as Provider
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    Doctors & Clinics
                  </h3>
                  <ul className="mt-3 space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-600" /> Automated calendar
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-600" /> Digital prescriptions
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                    <Pill className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    Pharmacies
                  </h3>
                  <ul className="mt-3 space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-600" /> Refill requests
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-teal-600" /> Patient notifications
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 shadow-sm sm:col-span-2">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Instant Alerts</h3>
                      <p className="mt-0.5 text-xs text-slate-600">
                        Stay informed with instant push notifications for critical appointments and orders.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="bg-slate-50/50 py-24 border-t border-slate-200/80">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-800 to-teal-900 px-8 py-16 text-center text-white shadow-2xl">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Ready for effortless healthcare?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-teal-100">
                Join Medinexus today and experience modern healthcare management from your mobile or desktop.
              </p>

              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => navigate("/register")}
                  className="rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-teal-900 shadow-md transition hover:bg-slate-100"
                >
                  Create Account Now
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* RESTORED DETAILED FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-md">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Medinexus
                  </h3>
                  <p className="text-[10px] font-semibold tracking-wider text-teal-700 uppercase">
                    Connected Healthcare
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                Connecting patients, doctors, and pharmacies through one integrated digital healthcare system.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900">Platform</h4>
              <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
                <li>
                  <button onClick={() => navigate("/register")} className="hover:text-teal-700">
                    For Patients
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/register")} className="hover:text-teal-700">
                    For Doctors
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/register")} className="hover:text-teal-700">
                    For Pharmacies
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900">Services</h4>
              <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
                <li><a href="#services" className="hover:text-teal-700">Find Doctors</a></li>
                <li><a href="#services" className="hover:text-teal-700">Appointments</a></li>
                <li><a href="#services" className="hover:text-teal-700">Pharmacy</a></li>
                <li><a href="#nearby-care" className="hover:text-teal-700">Hospitals & Emergency</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900">Account</h4>
              <ul className="mt-4 space-y-2.5 text-xs text-slate-600">
                <li>
                  <button onClick={() => navigate("/login")} className="hover:text-teal-700">
                    Login
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/register")} className="hover:text-teal-700">
                    Register
                  </button>
                </li>
                <li><a href="#about" className="hover:text-teal-700">About Medinexus</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 text-xs text-slate-500 sm:flex-row">
            <p>© 2026 Medinexus. All rights reserved.</p>
            <p>Connected healthcare, made simpler.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}