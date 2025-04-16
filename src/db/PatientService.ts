import { db } from "./db";
import { Patient } from "../types/Patient";

export const PatientService = {
  async getAll(): Promise<Patient[]> {
    return db.patients.toArray();
  },
  async add(patient: Patient): Promise<void> {
    await db.patients.add(patient);
  },
  async update(patient: Patient): Promise<void> {
    await db.patients.put(patient);
  },
  async remove(id: string): Promise<void> {
    await db.patients.delete(id);
  },
};
