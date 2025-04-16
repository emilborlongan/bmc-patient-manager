import Dexie, { Table } from "dexie";
import { Patient } from "../types/Patient";

export class PatientDB extends Dexie {
  patients!: Table<Patient, string>;

  constructor() {
    super("PatientDatabase");
    this.version(1).stores({
      patients: "id, name, age, diagnosis",
    });
  }
}

export const db = new PatientDB();
