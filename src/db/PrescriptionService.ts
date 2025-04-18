// src/db/PrescriptionService.ts
import { db } from "./db";
import { Prescription } from "../types/Prescription";

export const PrescriptionService = {
  async getAll(): Promise<Prescription[]> {
    return db.prescriptions.toArray();
  },
  async add(item: Prescription): Promise<void> {
    await db.prescriptions.add(item);
  },
  async update(item: Prescription): Promise<void> {
    await db.prescriptions.put(item);
  },
  async remove(id: string): Promise<void> {
    await db.prescriptions.delete(id);
  },
};
