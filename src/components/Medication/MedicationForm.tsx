import { useState, useEffect } from "react";
import { TextField, Button, Stack } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { Medication } from "../../types/Medication";

interface Props {
  initial?: Medication;
  onSave: (item: Medication) => void;
  onCancel?: () => void;
}

export default function PrescriptionForm({ initial, onSave, onCancel }: Props) {
  const empty = { name: "", brandName: "" };
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (initial) setForm({ name: initial.name, brandName: initial.brandName || "" });
    else setForm(empty);
  }, [initial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({
      id: initial?.id ?? uuidv4(),
      name: form.name.trim(),
      brandName: form.brandName.trim() || undefined,
    });
  };

  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit}>
      <TextField
        name="name"
        label="Prescription Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <TextField
        name="brandName"
        label="Brand Name (optional)"
        value={form.brandName}
        onChange={handleChange}
      />
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        {onCancel && <Button onClick={onCancel}>Cancel</Button>}
        <Button type="submit" variant="contained">
          {initial ? "Update" : "Add"}
        </Button>
      </Stack>
    </Stack>
  );
}
