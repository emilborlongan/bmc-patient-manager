import { useEffect, useState } from "react";
import PatientForm from "../components/PatientForm";
import PatientList from "../components/PatientList";
import { Patient } from "../types/Patient";
import { PatientService } from "../db/PatientService";

interface Props {
    view?: "add" | "list";
  }


export default function PatientDisplay({ view }: Props) {
    const [patients, setPatients] = useState<Patient[]>([]);
  
    useEffect(() => {
      PatientService.getAll().then(setPatients);
    }, []);
  
    const handleAdd = async (patient: Patient) => {
      await PatientService.add(patient);
      setPatients(await PatientService.getAll());
    };
  
    const handleDelete = async (id: string) => {
      await PatientService.remove(id);
      setPatients(await PatientService.getAll());
    };
  
    return (
      <>
        {view === "add" ? (
          <>
            <h2 style={{color: "black"}}>Patient Information</h2>
            <PatientForm onAdd={handleAdd} />
          </>
        ) : (
          <>
            <h2 style={{color: "black"}}>Patient List</h2>
            <PatientList patients={patients} onDelete={handleDelete} />
          </>
        )}
      </>
    );
  }