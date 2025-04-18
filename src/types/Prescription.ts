export interface Prescription {
  id: string;
  patientId: string;
  medicationIds: string[];
  date: string;
  notes?: string;
}