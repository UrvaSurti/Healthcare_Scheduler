// Represents an available time slot
export type TimeSlot = string; // e.g., "09:00"

// Represents a healthcare provider
export interface HealthcareProvider {
  id: string;
  facilityName: string;
  doctorName: string;
  specialty: string;
  availableHours: TimeSlot[];
}

// Represents the entire data structure
export interface HealthcareData {
  providers: HealthcareProvider[];
}

// Enum for specialties (can be expanded as needed)
export enum Specialty {
  TBTest = "TB Test",
  DrugTest = "Drug Test",
  HeartScreening = "Heart Screening",
  GeneralHealthCheck = "General Health Check",
  BloodTest = "Blood Test",
}

// Optional: Type for creating a new provider (without id)
export type NewHealthcareProvider = Omit<HealthcareProvider, 'id'>;

// Optional: Type for updating a provider (all fields optional except id)
export type UpdateHealthcareProvider = Partial<HealthcareProvider> & { id: string };

// Optional: Type for a booked appointment
export interface Appointment {
  id: string;
  providerId: string;
  dateTime: string;
  patientName: string;
  patientEmail: string;
  reservationCode: string;
}