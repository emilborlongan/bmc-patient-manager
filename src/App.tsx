import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout/Layout";
import PatientApp from "./pages/PatientDisplay";
import Home from "./pages/Home";
import { useAuth } from "./auth/useAuth";
import Landing from "./pages/Landing";

export default function App() {
  const { loggedIn } = useAuth();

  return (
    <Routes>
      {/* Public Route (Login Page) */}
      <Route path="/" element={<Home />} />


      {/* Protected Routes */}
      {loggedIn ? (
        <Route element={<Layout />}>
          <Route path="/welcome" element={<Landing />} />
          <Route path="/add" element={<PatientApp />} />
          <Route path="/list" element={<PatientApp />} />
        </Route>
      ) : (
        // If not logged in, redirect all protected routes back to login
        <>
          <Route path="/welcome" element={<Navigate to="/" />} />
          <Route path="/add" element={<Navigate to="/" />} />
          <Route path="/list" element={<Navigate to="/" />} />
        </>
      )}

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
