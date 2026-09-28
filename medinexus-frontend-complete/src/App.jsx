import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import { Login, Register } from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import PatientProfile from "./pages/patient/Profile";
import Doctors from "./pages/patient/Doctors";
import Hospitals from "./pages/patient/Hospitals";
import Ambulances from "./pages/patient/Ambulances";
import Blood from "./pages/patient/Blood";
import Symptoms from "./pages/patient/Symptoms";
import Appointments from "./pages/patient/Appointments";
import Prescriptions from "./pages/patient/Prescriptions";
import Orders from "./pages/patient/Orders";
import Organ from "./pages/patient/Organ";
import Schemes from "./pages/patient/Schemes";
import DoctorProfile from "./pages/Profile";
import DoctorLicense from "./pages/doctor/License";
import Availability from "./pages/doctor/Availability";
import DoctorAppointments from "./pages/doctor/Appointments";
import Consultations from "./pages/doctor/Consultations";
import DoctorPrescriptions from "./pages/doctor/Prescriptions";
import DoctorOrganRequests from "./pages/doctor/OrganRequests";
import LandingPage from "./pages/LandingPage";
import PharmacyLicense from "./pages/pharmacy/License";
import Inventory from "./pages/pharmacy/Inventory";
import PharmacyOrders from "./pages/pharmacy/Orders";

import Users from "./pages/admin/Users";
import Licenses from "./pages/admin/Licenses";
import AdminHospitals from "./pages/admin/Hospitals";
import AdminOrganRequests from "./pages/admin/OrganRequests";
import Medicines from "./pages/admin/Medicines";
import Departments from "./pages/admin/Departments";

import Beds from "./pages/admin/Beds";

import FindDoctors from "./pages/patient/FindDoctors";
import BookAppointment from "./pages/patient/BookAppointment";
import PharmacyProfile from "./pages/pharmacy/Profile";
import ChoosePharmacy from "./pages/patient/ChoosePharmacy";
import PharmacyDashboard from "./pages/pharmacy/PharmacyDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
function R({ roles, children }) {
  return (
    <ProtectedRoute roles={roles}>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<LandingPage />} />
      
<Route
  path="/find-doctors"
  element={
    <R roles={["PATIENT"]}>
      <FindDoctors />
    </R>
  }
/>
<Route
  path="/admin/dashboard"
  element={
    <R roles={["ADMIN"]}>
      <AdminDashboard />
    </R>
  }
/>
<Route
  path="/patient/choose-pharmacy"
  element={
    <R roles={["PATIENT"]}>
      <ChoosePharmacy />
    </R>
  }
/>
<Route
  path="/pharmacy/profile"
  element={
    <R roles={["PHARMACY"]}>
      <PharmacyProfile />
    </R>
  }
/>
<Route
  path="/pharmacy/dashboard"
  element={
    <R roles={["PHARMACY"]}>
      <PharmacyDashboard />
    </R>
  }
/>
<Route
  path="/find-doctors/:specialization"
  element={
    <R roles={["PATIENT"]}>
      <FindDoctors />
    </R>
  }
/><Route
  path="/appointments/book/:doctorId"
  element={
    <R roles={["PATIENT"]}>
      <BookAppointment />
    </R>
  }
/>
      <Route
        path="/dashboard"
        element={
          <R>
            <Dashboard />
          </R>
        }
      />
      <Route
        path="/notifications"
        element={
          <R>
            <Notifications />
          </R>
        }
      />
      <Route
        path="/patient/profile"
        element={
          <R roles={["PATIENT"]}>
            <PatientProfile />
          </R>
        }
      />
      <Route
        path="/patient/doctors"
        element={
          <R roles={["PATIENT"]}>
            <Doctors />
          </R>
        }
      />
      <Route
        path="/patient/hospitals"
        element={
          <R>
            <Hospitals />
          </R>
        }
      />
      <Route
        path="/patient/ambulances"
        element={
          <R roles={["PATIENT"]}>
            <Ambulances />
          </R>
        }
      />
      <Route
        path="/patient/blood"
        element={
          <R roles={["PATIENT"]}>
            <Blood />
          </R>
        }
      />
      <Route
        path="/patient/symptoms"
        element={
          <R roles={["PATIENT"]}>
            <Symptoms />
          </R>
        }
      />
      <Route
        path="/patient/appointments"
        element={
          <R roles={["PATIENT"]}>
            <Appointments />
          </R>
        }
      />
      <Route
        path="/patient/prescriptions"
        element={
          <R roles={["PATIENT"]}>
            <Prescriptions />
          </R>
        }
      />
      <Route
        path="/patient/orders"
        element={
          <R roles={["PATIENT"]}>
            <Orders />
          </R>
        }
      />
      <Route
        path="/patient/organ"
        element={
          <R roles={["PATIENT"]}>
            <Organ />
          </R>
        }
      />
      <Route
        path="/patient/schemes"
        element={
          <R>
            <Schemes />
          </R>
        }
      />
      <Route
        path="/doctor/profile"
        element={
          <R roles={["DOCTOR"]}>
            <DoctorProfile role="DOCTOR" />
          </R>
        }
      />
      <Route
        path="/doctor/license"
        element={
          <R roles={["DOCTOR"]}>
            <DoctorLicense />
          </R>
        }
      />
      <Route
        path="/doctor/availability"
        element={
          <R roles={["DOCTOR"]}>
            <Availability />
          </R>
        }
      />
      <Route
        path="/doctor/appointments"
        element={
          <R roles={["DOCTOR"]}>
            <DoctorAppointments />
          </R>
        }
      />
      <Route
        path="/doctor/consultations"
        element={
          <R roles={["DOCTOR"]}>
            <Consultations />
          </R>
        }
      />
      <Route
        path="/doctor/prescriptions"
        element={
          <R roles={["DOCTOR"]}>
            <DoctorPrescriptions />
          </R>
        }
      />
      <Route
        path="/doctor/organ-requests"
        element={
          <R roles={["DOCTOR"]}>
            <DoctorOrganRequests />
          </R>
        }
      />
      <Route
        path="/pharmacy/profile"
        element={
          <R roles={["PHARMACY"]}>
            <PharmacyProfile role="PHARMACY" />
          </R>
        }
      />
      <Route
        path="/pharmacy/license"
        element={
          <R roles={["PHARMACY"]}>
            <PharmacyLicense />
          </R>
        }
      />
      <Route
        path="/pharmacy/inventory"
        element={
          <R roles={["PHARMACY"]}>
            <Inventory />
          </R>
        }
      />
      <Route
        path="/pharmacy/orders"
        element={
          <R roles={["PHARMACY"]}>
            <PharmacyOrders />
          </R>
        }
      />
    
      <Route
        path="/admin/users"
        element={
          <R roles={["ADMIN"]}>
            <Users />
          </R>
        }
      />
      <Route
        path="/admin/doctor-licenses"
        element={
          <R roles={["ADMIN"]}>
            <Licenses type="doctor" />
          </R>
        }
      />
      <Route
        path="/admin/pharmacy-licenses"
        element={
          <R roles={["ADMIN"]}>
            <Licenses type="pharmacy" />
          </R>
        }
      />
      <Route
        path="/admin/hospitals"
        element={
          <R roles={["ADMIN"]}>
            <AdminHospitals />
          </R>
        }
      />
      <Route
        path="/admin/organ-requests"
        element={
          <R roles={["ADMIN"]}>
            <AdminOrganRequests />
          </R>
        }
      />
      <Route
        path="/admin/medicines"
        element={
          <R roles={["ADMIN"]}>
            <Medicines />
          </R>
        }
      />
      <Route
        path="/admin/departments"
        element={
          <R roles={["ADMIN"]}>
            <Departments />
          </R>
        }
      />
     
      <Route
        path="/admin/beds"
        element={
          <R roles={["ADMIN"]}>
            <Beds />
          </R>
        }
      />
    
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
