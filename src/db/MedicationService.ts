import { db } from "./db";
import { Medication } from "../types/Medication";

export const MedicationService = {
  getAll: () => db.medications.toArray(),
  add: (m: Medication) => db.medications.add(m),
  update: (m: Medication) => db.medications.put(m),
  remove: (id: string) => db.medications.delete(id),
};