// src/db/db.ts
import Dexie, { Table } from "dexie";
import { Patient } from "../types/Patient";
import { Prescription } from "../types/Prescription";

export class PatientDB extends Dexie {
  patients!: Table<Patient, string>;
  prescriptions!: Table<Prescription, string>;

  constructor() {
    super("PatientDatabase");
    this.version(1).stores({
      patients: "id, name, address, age, gender, complaint, findings, assessment, prescription, checkupDate",
    });
    this.version(2).stores({
      patients: "id, name, address, age, gender, complaint, assessment, findings, checkupDate, prescriptionId",
      prescriptions: "id, name, brandName",
    });
  }
}

export const db = new PatientDB();







