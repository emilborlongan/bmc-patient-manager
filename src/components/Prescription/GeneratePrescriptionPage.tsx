// src/pages/GeneratePrescriptionPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, NavigateFunction } from "react-router-dom";
import { Patient } from "../../types/Patient";
import { Prescription } from "../../types/Prescription";
import { Medication } from "../../types/Medication";
import { PatientService } from "../../db/PatientService";
import { PrescriptionService } from "../../db/PrescriptionService";
import { MedicationService } from "../../db/MedicationService";
import { Box, Button, CircularProgress } from "@mui/material";

const GeneratePrescriptionPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate: NavigateFunction = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    const load = async (): Promise<void> => {
      if (!patientId) {
        navigate("/list");
        return;
      }

      // Load patient
      const allPatients: Patient[] = await PatientService.getAll();
      const foundPatient: Patient | undefined = allPatients.find(
        (p: Patient) => p.id === patientId
      );
      if (!foundPatient) {
        navigate("/list");
        return;
      }
      setPatient(foundPatient);

      // Load prescriptions for this patient
      const allPres: Prescription[] = await PrescriptionService.getAll();
      const patientPres: Prescription[] = allPres.filter(
        (pr: Prescription) => pr.patientId === patientId
      );
      const lastPres: Prescription | undefined = patientPres
        .sort(
          (a: Prescription, b: Prescription) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
      setPrescription(lastPres ?? null);

      // Load medications and filter
      const allMeds: Medication[] = await MedicationService.getAll();
      if (lastPres) {
        setMedications(
          allMeds.filter(
            (m: Medication) => lastPres.medicationIds.includes(m.id)
          )
        );
      }

      setLoading(false);
    };

    load();
  }, [patientId, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!patient || prescription === null) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <p>No prescription found for this patient.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "8.5in",
        height: "11in",
        mx: "auto",
        mt: 2,
      }}
    >
      {/* Template background */}
      <Box
        component="img"
        src="/BMC Rx FINAL.png"
        alt="Prescription Template"
        sx={{ width: "100%", height: "100%" }}
      />

      {/* Overlay fields */}
      <Box
        sx={{ position: "absolute", top: 170, left: 150, width: "60%" }}
      >
        <strong>Patient's Name:</strong> {patient.name}
      </Box>

      <Box sx={{ position: "absolute", top: 200, left: 150 }}>
        <strong>Sex:</strong> {patient.gender} &nbsp;
        <strong>Age:</strong> {patient.age} &nbsp;
        <strong>Date:</strong>{" "}
        {new Date(prescription.date).toLocaleDateString()}
      </Box>

      <Box
        sx={{ position: "absolute", top: 230, left: 150, width: "60%" }}
      >
        <strong>Address:</strong> {patient.address}
      </Box>

      <Box sx={{ position: "absolute", top: 270, left: 100, width: "80%" }}>
        {medications.map((m: Medication, i: number) => (
          <Box key={m.id} sx={{ mb: 1 }}>
            {i + 1}. {m.name}
            {m.brandName ? ` (${m.brandName})` : ""}
          </Box>
        ))}
      </Box>

      {/* Actions */}
      <Box
        sx={{
          position: "absolute",
          bottom: "1in",
          right: "1in",
          display: "flex",
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={() => window.print()}
          sx={{ bgcolor: "#1976d2", color: "#fff" }}
        >
          Print
        </Button>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default GeneratePrescriptionPage;
