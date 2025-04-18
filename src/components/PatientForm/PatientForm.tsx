// src/components/PatientForm.tsx
import { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Patient } from "../../types/Patient";
import { Prescription } from "../../types/Prescription";
import { v4 as uuidv4 } from "uuid";
import {
  TextField,
  Button,
  Stack,
  Autocomplete,
  MenuItem,
} from "@mui/material";
import { PrescriptionService } from "../../db/PrescriptionService";

interface Props {
  initial?: Patient;
  onSave: (patient: Patient) => void;
  onCancel?: () => void;
}

export default function PatientForm({ initial, onSave, onCancel }: Props) {
  // include prescriptionId in form state
  const empty = {
    name: "",
    address: "",
    age: "",
    gender: "",
    complaint: "",
    assessment: "",
    findings: "",
    checkupDate: "",
    prescriptionId: "",
  };
  const [form, setForm] = useState(empty);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  // load options
  useEffect(() => {
    PrescriptionService.getAll().then(setPrescriptions);
  }, []);

  // populate when editing
  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        address: initial.address,
        age: String(initial.age),
        gender: initial.gender,
        complaint: initial.complaint,
        assessment: initial.assessment,
        findings: initial.findings,
        checkupDate: initial.checkupDate,
        prescriptionId: initial.prescriptionId || "",
      });
    } else {
      setForm(empty);
    }
  }, [initial]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const p: Patient = {
      id: initial?.id ?? uuidv4(),
      name: form.name,
      address: form.address,
      age: Number(form.age),
      gender: form.gender,
      complaint: form.complaint,
      assessment: form.assessment,
      findings: form.findings,
      checkupDate: form.checkupDate,
      prescriptionId: form.prescriptionId || undefined,
    };
    onSave(p);
  };

  return (
    <Stack component="form" spacing={2} onSubmit={handleSave}>
      <TextField name="name" label="Name" value={form.name} onChange={handleChange} required />
      <TextField name="address" label="Address" value={form.address} onChange={handleChange} />
      <TextField name="age" label="Age" type="number" value={form.age} onChange={handleChange} />
      <TextField
        select
        name="gender"
        label="Gender"
        value={form.gender}
        onChange={handleChange}
        required
      >
        {["male", "female"].map((g) => (
          <MenuItem key={g} value={g}>
            {g.charAt(0).toUpperCase() + g.slice(1)}
          </MenuItem>
        ))}
      </TextField>

      {/* searchable dropdown */}
      <Autocomplete
        options={prescriptions}
        getOptionLabel={(opt) => opt.name}
        value={
          prescriptions.find((x) => x.id === form.prescriptionId) || null
        }
        onChange={(_, selected) =>
          setForm((f) => ({
            ...f,
            prescriptionId: selected?.id ?? "",
          }))
        }
        renderInput={(params) => (
          <TextField {...params} label="Prescription" placeholder="Search…" />
        )}
      />

      <TextField
        name="complaint"
        label="Chief Complaint"
        value={form.complaint}
        onChange={handleChange}
        multiline
        rows={3}
        required
      />
      <TextField
        name="assessment"
        label="Assessment"
        value={form.assessment}
        onChange={handleChange}
        multiline
        rows={3}
        required
      />
      <TextField
        name="findings"
        label="Findings"
        value={form.findings}
        onChange={handleChange}
        multiline
        rows={3}
        required
      />

      <DatePicker
        label="Checkup Date"
        value={form.checkupDate ? new Date(form.checkupDate) : null}
        onChange={(newDate) => {
          setForm((f) => ({
            ...f,
            checkupDate: newDate
              ? newDate.toISOString().split("T")[0]
              : "",
          }));
        }}
        slotProps={{
          textField: {
            name: "checkupDate",
            fullWidth: true,
            variant: "outlined",
            margin: "normal",
          },
        }}
      />

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        {onCancel && <Button onClick={onCancel}>Cancel</Button>}
        <Button type="submit" variant="contained">
          {initial ? "Update Patient" : "Add Patient"}
        </Button>
      </Stack>
    </Stack>
  );
}
