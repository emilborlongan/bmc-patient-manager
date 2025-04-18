export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    address: string;
    complaint: string;
    findings: string;
    assessment: string;
    prescriptionId?: string;
    checkupDate: string;
  }