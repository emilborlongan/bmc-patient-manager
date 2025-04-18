import { db } from "./db";
import { Prescription } from "../types/Prescription";

export const PrescriptionService = {
  getAll: () => db.prescriptions.toArray(),
  add: (p: Prescription) => db.prescriptions.add(p),
  update: (p: Prescription) => db.prescriptions.put(p),
  remove: (id: string) => db.prescriptions.delete(id),
};