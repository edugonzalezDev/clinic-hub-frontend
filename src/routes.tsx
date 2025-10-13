import { Navigate, Route, Routes } from "react-router";
import LandingPage from "./pages/Landing";
import Login from "./pages/Login";
import SelectUserType from "./pages/SelectUserType";
import RegisterPage from "./pages/RegisterPage";
import DoctorDashboard from "./pages/DoctorDashboard";
import useAppStore from "./store/appStore";
import type { PropsWithChildren } from "react";
import { Outdent } from "lucide-react";
import MedicalHistoryPage from "./features/medical/MedicalHistoryPage";
import TeleconsultationPage from "./features/televisit/TeleconsultationPage";
import DoctorAppointmentsPage from "./features/scheduling/DoctorAppointmentsPage";
import PatientsPage from "./features/patients/PatientsPage";
import NewClinicalNotePage from "./features/medical/NewClinicalNotePage";
import SignatureSettingsPage from "./features/doctor/SignatureSettingsPage";
import NewPrescriptionPage from "./features/medical/NewPrescriptionPage";
import NewCertificatePage from "./features/medical/NewCertificatePage";
import PacienteDashboard from "./features/patient/pages/PatientDashboard";
import MedicalHistory from "./features/patient/pages/MedicalHistory.tsx";
import NewLabResultPage from "./features/medical/NewLabResultPage.tsx";
import NewVitalPage from "./features/medical/NewVitalPage.tsx";

function RequireAuth({ children }: PropsWithChildren) {
  const user = useAppStore((s) => s.currentUser);
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// Redirige según rol
// function RoleHome() {
//   const user = useAppStore((s) => s.currentUser);
//   if (!user) return <Navigate to="/login" replace />;
//   switch (user.role) {
//     case "doctor": return <Navigate to="/doctor" replace />;
//     case "patient": return <Navigate to="/patient" replace />;
//     case "admin": return <Navigate to="/admin" replace />;
//     default: return <Navigate to="/login" replace />;
//   }
// }

export default function AppRoutes() {
  return (
    <Routes>
      {/* publicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/select-user-type" element={<SelectUserType />} />{" "}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* protegidas */}
      <Route
        element={
          <RequireAuth>
            <Outdent />
          </RequireAuth>
        }
      />
      <Route path="/patients/:id" element={<MedicalHistoryPage />} />
      {/* Doctor */}
      {/* <Route path="/doctor" element={<DoctorDashboard />} /> */}
      <Route
        path="/doctor"
        element={
          <RequireAuth>
            <DoctorDashboard />
          </RequireAuth>
        }
      />
      {/* alias temporal para compatibilidad */}
      <Route
        path="/doctor-dashboard"
        element={<Navigate to="/doctor" replace />}
      />
      <Route
        path="/televisit/:appointmentId"
        element={
          <RequireAuth>
            <TeleconsultationPage />
          </RequireAuth>
        }
      />
      <Route
        path="/doctor/appointments"
        element={
          <RequireAuth>
            {" "}
            <DoctorAppointmentsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/patients"
        element={
          <RequireAuth>
            {" "}
            <PatientsPage />{" "}
          </RequireAuth>
        }
      />
      <Route
        path="/doctor/note/new"
        element={
          <RequireAuth>
            {" "}
            <NewClinicalNotePage />{" "}
          </RequireAuth>
        }
      />
      <Route
        path="/doctor/settings/signature"
        element={
          <RequireAuth>
            <SignatureSettingsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/doctor/certificate/new"
        element={
          <RequireAuth>
            <NewCertificatePage />
          </RequireAuth>
        }
      />
      <Route
        path="/doctor/prescription/new"
        element={
          <RequireAuth>
            <NewPrescriptionPage />
          </RequireAuth>
        }
      />

      <Route path="/doctor/labs/new" element={<NewLabResultPage />} />
      <Route path="/doctor/vitals/new" element={<NewVitalPage />} />
      {/* admin */}
      {/* <Route path="/admin" element={<AdminDashboard />} /> */}
      {/* pacietes */}
      {
        <Route
          path="/paciente"
          element={
            <RequireAuth>
              <PacienteDashboard />
            </RequireAuth>
          }
        />
      }
      <Route
        path="/paciente/historial-medico"
        element={
          <RequireAuth>
            <MedicalHistory />
          </RequireAuth>
        }
      />
      {/* compartidas */}
      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
