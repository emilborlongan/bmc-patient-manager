// src/components/PatientForm.tsx
import { useState, useEffect } from "react";
import { Patient } from "../types/Patient";
import { v4 as uuidv4 } from "uuid";
import styles from "./PatientForm.module.css";

interface Props {
  initial?: Patient;
  onSave: (patient: Patient) => void;
  onCancel?: () => void;
}

export default function PatientForm({ initial, onSave, onCancel }: Props) {
  const emptyState = {
    name: "",
    address: "",
    age: "",
    gender: "",
    diagnosis: "",
    prescription: "",
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
        prescription: initial.prescription,
        checkupDate: initial.checkupDate,
      });
    } else {
      setForm(emptyState);
    }
  }, [initial]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, address, age, gender, diagnosis, prescription, checkupDate } = form;
    if (!name || !diagnosis || !gender || !checkupDate) return;

    const patient: Patient = {
      id: initial?.id ?? uuidv4(),
      name,
      address,
      age: Number(age),
      gender,
      diagnosis,
      prescription,
      checkupDate,
    };
    onSave(patient);
  };

  return (
    <div className={styles.pfContainer}>
      <form onSubmit={handleSubmit} className={styles.pfForm}>

        <div className={styles.pfFlexInputfields}>
          <div className={styles.pfInputLabels}>Name: </div>
          <div className={styles.pfInputFieldsContainer}><input
            className={styles.pfInputFields}
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          /></div>
        </div>

        <div className={styles.pfFlexInputfields}>
          <div className={styles.pfInputLabels}>Address: </div>
          <div className={styles.pfInputFieldsContainer}>
            <input
              className={styles.pfInputFields}
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.pfFlexInputfields}>
          <div className={styles.pfInputLabels}>Age: </div>
          <div style={{width: '15%'}}>
            <input
              className={styles.pfInputFields}
              type="number"
              name="age"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
            />
          </div>
        </div>


        <div className={styles.pfFlexInputfields}>
          <div className={styles.pfInputLabels}>Gender: </div>
          <div style={{width: '45%'}}>
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
          </div>
        </div>

        <div className={styles.pfFlexInputfields}>
          <div className={styles.pfInputLabels}>Prescription: </div>
          <div className={styles.pfInputFieldsContainer}>
            <textarea
              className={`${styles.pfInputFields} ${styles.textarea}`}
              name="prescription"
              placeholder="Prescription"
              value={form.prescription}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.pfFlexInputfields}>
          <div className={styles.pfInputLabels}>Diagnosis: </div>
          <div className={styles.pfInputFieldsContainer}>
            <textarea
              className={`${styles.pfInputFields} ${styles.textarea}`}
              name="diagnosis"
              placeholder="Diagnosis"
              value={form.diagnosis}
              onChange={handleChange}
            />
          </div>
        </div>


        <div className={styles.pfFlexInputfields}>
          <div className={styles.pfInputLabels}>Check-up Date: </div>
          <div style={{width: '35%'}}>
            <input
              className={styles.pfInputFields}
              type="date"
              name="checkupDate"
              value={form.checkupDate}
              onChange={handleChange}
            />
          </div>
        </div>



        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", alignItems: "center", justifyContent: "flex-end" }}>
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
