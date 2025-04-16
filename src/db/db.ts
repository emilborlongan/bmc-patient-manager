// src/db/db.ts
import Dexie, { Table } from "dexie";
import { Patient } from "../types/Patient";

export class PatientDB extends Dexie {
  patients!: Table<Patient, string>;

  constructor() {
    super("PatientDatabase");
    this.version(1).stores({
      // include checkupDate in the index if you like
      patients: "id, name, address, age, gender, diagnosis, checkupDate",
    });
  }
}

export const db = new PatientDB();
