// src/db/db.ts
import Dexie, { Table } from "dexie";
import { Patient } from "../types/Patient";
import { Medication } from "../types/Medication";
import { Prescription } from "../types/Prescription";

export class PatientDB extends Dexie {
  patients!: Table<Patient, string>;
  medications!: Table<Medication, string>;
  prescriptions!: Table<Prescription, string>;

  constructor() {
    super("PatientDatabase");
    this.version(1).stores({
      patients: "id, name, address, age, gender, complaint, assessment, findings, checkupDate",
    });
    this.version(2).stores({
      patients: null, // keep as-is
      medications: "id, name, brandName",
    });
    this.version(3).stores({
      patients: "id, name, address, age, gender, complaint, assessment, findings, checkupDate",
      medications: "id, name, brandName",
      prescriptions: "id, patientId, date, *items.medicationId",
    });
  }
}

export const db = new PatientDB();
