export interface Provider {
    id: string;
    facilityName: string;
    doctorName: string;
    specialty: string;
    availableHours: string[];
  }
  
  export interface Appointment {
    id: string;
    providerId: string;
    dateTime: string;
    userEmail?: string;  // Optional for anonymous bookings
    reservationCode: string;
  }
  
  export interface User {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
  }