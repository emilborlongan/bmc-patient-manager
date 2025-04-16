import { useState } from "react";
import { Patient } from "../types/Patient";
import { v4 as uuidv4 } from "uuid";

import styles from './PatientForm.module.css';

interface Props {
    onAdd: (patient: Patient) => void;
}

export default function PatientForm({ onAdd }: Props) {

    const initialState = {
        name: "",
        age: "",
        diagnosis: "",
        address: ""
    }

    const [patientData, setPatientData] = useState(initialState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPatientData((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!patientData.name || patientData.age === "" || !patientData.diagnosis) return;

        onAdd({
            id: uuidv4(),
            name: patientData.name,
            age: Number(patientData.age),
            address: patientData.address,
            diagnosis: patientData.diagnosis,
        });

        setPatientData(initialState)
    };

    return (
        <div className={styles.pfContainer}>
            <form onSubmit={handleSubmit} className={styles.pfForm}>
                <input className={styles.pfInputFields} value={patientData.name} name={"name"} onChange={handleChange} placeholder="Name" />
                <input className={styles.pfInputFields} value={patientData.address} name={"address"} onChange={handleChange} placeholder="Address" />
                <input className={styles.pfInputFields} type="number" value={patientData.age} name={"age"} onChange={handleChange} placeholder="Age" />
                <input className={styles.pfInputFields} value={patientData.diagnosis} name={"diagnosis"} onChange={handleChange} placeholder="Diagnosis" />
                <button className={styles.pfSubmitButton} type="submit">Add Patient</button>
            </form>
        </div>
    );
}


