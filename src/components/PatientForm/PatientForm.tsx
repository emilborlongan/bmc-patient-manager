import { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Patient } from "../../types/Patient";
import { v4 as uuidv4 } from "uuid";
import {
  TextField,
  Button,
  Stack,
  Autocomplete,
  MenuItem
} from "@mui/material";
import { PrescriptionService } from "../../db/PrescriptionService";
import { Medication } from "../../types/Medication";
import { MedicationService } from "../../db/MedicationService";
import { Prescription } from "../../types/Prescription";

interface SelectedMed extends Medication {
  quantity: number;
}

interface Props {
  initial?: Patient;
  onSave: (patient: Patient, prescription: Prescription) => void;
  onCancel?: () => void;
}

export default function PatientForm({ initial, onSave, onCancel }: Props) {
  // form state
  const empty = {
    name: "",
    address: "",
    age: "",
    gender: "",
    complaint: "",
    assessment: "",
    findings: "",
    checkupDate: "",
  };
  const [form, setForm] = useState(empty);

  const [allMeds, setAllMeds] = useState<Medication[]>([]);
  const [selectedMeds, setSelectedMeds] = useState<SelectedMed[]>([]);

  const [medError, setMedError] = useState(false);

  useEffect(() => {
    MedicationService.getAll().then(setAllMeds);
  }, []);

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
      });

      // load existing prescription for this patient
      PrescriptionService.getAll().then((list) => {
        const pres = list.find((p) => p.patientId === initial.id);
        if (pres) {
          // build selectedMeds with quantities
          const items = pres.items.map((it) => {
            const med = allMeds.find((m) => m.id === it.medicationId)!;
            return { ...med, quantity: it.quantity };
          });
          setSelectedMeds(items);
        }
      });
    } else {
      setForm(empty);
      setSelectedMeds([]);
    }
  }, [initial, allMeds]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const patient: Patient = {
      id: initial?.id ?? uuidv4(),
      name: form.name,
      address: form.address,
      age: Number(form.age),
      gender: form.gender,
      complaint: form.complaint,
      assessment: form.assessment,
      findings: form.findings,
      checkupDate: form.checkupDate,
    };


    if (selectedMeds.length === 0) {
      setMedError(true);
      return;
    }

    const items = selectedMeds.map((m) => ({
      medicationId: m.id,
      quantity: m.quantity,
    }));
    const prescription = {
      id: uuidv4(),
      patientId: patient.id,
      date: new Date().toISOString(),
      items,
      notes: "",
    };
    onSave(patient, prescription);
  };

  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit}>
      <TextField
        name="name"
        label="Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <TextField
        name="address"
        label="Address"
        value={form.address}
        onChange={handleChange}
      />
      <TextField
        name="age"
        label="Age"
        type="number"
        value={form.age}
        onChange={handleChange}
      />
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

      <Autocomplete
        multiple
        options={allMeds}
        getOptionLabel={(m) => m.name + (m.brandName ? ` (${m.brandName})` : "")}
        value={selectedMeds}
        onChange={(_, meds) => {
          // preserve quantities for meds already selected
          const merged = meds.map((m) => {
            const prev = selectedMeds.find((x) => x.id === m.id);
            return { ...m, quantity: prev?.quantity ?? 1 };
          });
          setSelectedMeds(merged);
          if (merged.length > 0) setMedError(false);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Medications"
            error={medError && selectedMeds.length === 0}
            helperText={medError && "Please select meds & quantities"}
            placeholder="Search…"
          />
        )}
      />

      {/* Quantity inputs */}
      {selectedMeds.map((m) => (
        <TextField
          key={m.id}
          label={`${m.name} Quantity`}
          type="number"
          value={m.quantity}
          onChange={(e) => {
            const q = parseInt(e.target.value, 10) || 0;
            setSelectedMeds((prev) =>
              prev.map((x) =>
                x.id === m.id ? { ...x, quantity: q } : x
              )
            );
          }}
          inputProps={{ min: 1 }}
          required
        />
      ))}

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
        {onCancel && (
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="contained">
          {initial ? "Update Patient" : "Add Patient"}
        </Button>
      </Stack>
    </Stack>
  );
}
