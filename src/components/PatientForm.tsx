// src/components/PatientForm.tsx
import { useState, useEffect } from "react";
import { Patient } from "../types/Patient";
import { v4 as uuidv4 } from "uuid";
import styles from "./PatientForm.module.css";

interface Props {
  /** Patient to edit; omit for “add” mode */
  initial?: Patient;
  /** Called with the new/updated patient */
  onSave: (patient: Patient) => void;
  /** Optional: if provided, shows a Cancel button */
  onCancel?: () => void;
}

export default function PatientForm({ initial, onSave, onCancel }: Props) {
  const emptyState = {
    name: "",
    address: "",
    age: "",
    gender: "",
    diagnosis: "",
    checkupDate: "",
  };
  const [form, setForm] = useState(emptyState);

  // Populate form when editing
  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        address: initial.address,
        age: String(initial.age),
        gender: initial.gender,
        diagnosis: initial.diagnosis,
        checkupDate: initial.checkupDate,
      });
    } else {
      setForm(emptyState);
    }
  }, [initial]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, address, age, gender, diagnosis, checkupDate } = form;
    if (!name || !diagnosis || !gender || !checkupDate) return;

    const patient: Patient = {
      id: initial?.id ?? uuidv4(),
      name,
      address,
      age: Number(age),
      gender,
      diagnosis,
      checkupDate,
    };
    onSave(patient);
  };

  return (
    <div className={styles.pfContainer}>
      <form onSubmit={handleSubmit} className={styles.pfForm}>
        <input
          className={styles.pfInputFields}
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          className={styles.pfInputFields}
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />

        <input
          className={styles.pfInputFields}
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
        />

        <select
          className={styles.pfInputFields}
          name="gender"
          value={form.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <input
          className={styles.pfInputFields}
          name="diagnosis"
          placeholder="Diagnosis"
          value={form.diagnosis}
          onChange={handleChange}
        />

        <input
          className={styles.pfInputFields}
          type="date"
          name="checkupDate"
          value={form.checkupDate}
          onChange={handleChange}
        />

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button
            type="submit"
            className={styles.pfSubmitButton}
          >
            {initial ? "Update Patient" : "Add Patient"}
          </button>
          {onCancel && (
            <button
              type="button"
              className={styles.pfCancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
