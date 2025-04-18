import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import PatientForm from "./PatientForm";
import { PatientService } from "../../db/PatientService";
import { Patient } from "../../types/Patient";
import { PrescriptionService } from "../../db/PrescriptionService";
import { Prescription } from "../../types/Prescription";

export default function PatientFormPage({ mode }: { mode: "add" | "edit" }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [initial, setInitial] = useState<Patient | undefined>();
  const [showSuccess, setShowSuccess] = useState(false);
  const [actionType, setActionType] = useState<"add" | "update">("add");

  useEffect(() => {
    if (mode === "edit" && id) {
      PatientService.getAll().then((list) => {
        const patient = list.find((p) => p.id === id);
        if (patient) setInitial(patient);
        else navigate("/list");
      });
    }
  }, [mode, id]);

  const handleSave = async (patient: Patient, prescription: Prescription) => {

    if (mode === "edit") {
      await PatientService.update(patient);
      const allPres = await PrescriptionService.getAll();
      const existing = allPres.find((p) => p.patientId === patient.id);
      if (existing) {
        await PrescriptionService.update({ ...prescription, id: existing.id });
      } else {
        await PrescriptionService.add(prescription);
      }
      setActionType("update");
    } else {
      await PatientService.add(patient);
      await PrescriptionService.add(prescription);
      setActionType("add");
    }
    setShowSuccess(true);
  };

  return (
    <Container sx={{ mt: 4, maxWidth: 600 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {mode === "add" ? "Add New Patient" : "Edit Patient"}
        </Typography>

        <PatientForm
          initial={initial}
          onSave={handleSave}
          onCancel={() => navigate("/list")}
        />
      </Paper>

      <Dialog
        open={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          navigate("/list");
        }}
      >
        <DialogTitle>
          {actionType === "update" ? "Patient Updated" : "Patient Added"}
        </DialogTitle>
        <DialogContent>
          Patient record successfully{" "}
          {actionType === "update" ? "updated" : "created"}.
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowSuccess(false);
              navigate("/list");
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}