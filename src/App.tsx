import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout/Layout";
import PatientApp from "./pages/PatientDisplay";
import Login from "./pages/Login";
import { useAuth } from "./auth/useAuth";
import Landing from "./pages/Landing";
import PatientFormPage from "./components/PatientForm/PatientFormPage";
import PrescriptionListPage from "./components/Prescription/PrescriptionList";

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
          <Route path="/prescriptions" element={<PrescriptionListPage />} />
        </Route>
      ) : (
        // If not logged in, redirect all protected routes back to login
        <>
          <Route path="/welcome" element={<Navigate to="/" />} />
          <Route path="/add" element={<Navigate to="/" />} />
          <Route path="/edit/:id" element={<Navigate to="/" />} />
          <Route path="/list" element={<Navigate to="/" />} />
          <Route path="/prescriptions" element={<Navigate to="/" />} />
        </>
      )}

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
