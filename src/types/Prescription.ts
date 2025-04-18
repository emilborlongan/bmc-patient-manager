
export interface Prescription {
  id: string;
  patientId: string;
  date: string;
  notes?: string;

  items: Array<{
    medicationId: string;
    quantity: number;
  }>;
}
