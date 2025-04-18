import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout/Layout";
import PatientApp from "./pages/PatientDisplay";
import Login from "./pages/Login";
import { useAuth } from "./auth/useAuth";
import Landing from "./pages/Landing";
import PatientFormPage from "./components/PatientForm/PatientFormPage";
import MedicationListPage from "./components/Medication/MedicationList";
import GeneratePrescriptionPage from "./components/Prescription/GeneratePrescriptionPage";

export default function App() {
  const { loggedIn } = useAuth();

  return (
    <Routes>
      {/* Public Route (Login Page) */}
      <Route path="/" element={<Login />} />


      {/* Protected Routes */}
      {loggedIn ? (
        <Route element={<Layout />}>
          <Route path="/welcome" element={<Landing />} />
          <Route path="/add" element={<PatientFormPage mode="add" />} />
          <Route path="/edit/:id" element={<PatientFormPage mode="edit" />} />
          <Route path="/list" element={<PatientApp />} />
          <Route path="/medication" element={<MedicationListPage />} />
          <Route
            path="/prescriptions/generate/:patientId"
            element={<GeneratePrescriptionPage />}
          />
        </Route>
      ) : (
        // If not logged in, redirect all protected routes back to login
        <>
          <Route path="/welcome" element={<Navigate to="/" />} />
          <Route path="/add" element={<Navigate to="/" />} />
          <Route path="/edit/:id" element={<Navigate to="/" />} />
          <Route path="/list" element={<Navigate to="/" />} />
          <Route path="/medication" element={<Navigate to="/" />} />
          <Route
            path="/prescriptions/generate/:patientId"
            element={<Navigate to="/" />}
          />
        </>
      )}

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
