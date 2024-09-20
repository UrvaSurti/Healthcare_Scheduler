// src/app/manage/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from 'next/navigation';  // Use this for navigation
import { Appointment } from '@/lib/types';  // Import the Appointment type

export default function ManageAppointments({ params }: { params: { id: string } }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]); // State to store fetched appointments (typed as Appointment[])
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null); // State for the selected appointment
  const [newDateTime, setNewDateTime] = useState('');  // State for new appointment date/time
  const router = useRouter();  // Router hook for navigation
  const searchParams = useSearchParams();

  const providerId = searchParams.get('providerId');  // Fetch the providerId from the query params
  const decodedURL = decodeURIComponent(params.id);

useEffect(() => {
    async function fetchAppointments() {
      let url = `/api/appointments`;
      console.log('here');  
    //   If both userEmail and providerId exist
      if (decodedURL && providerId) {
        
        url += `?userEmail=${decodedURL}&providerId=${providerId}`;
      }
      // If only userEmail exists
      else if (decodedURL && decodedURL.includes('@')) {
        console.log('Fetching URL in if:');
        url += `?userEmail=${decodedURL}`;
      }

      // If only providerId exists
      else if (decodedURL) {
        console.log('Fetching URL in providers:');
        url += `?${decodedURL}`;
      }

      console.log('Fetching URL:', url);

      const response = await fetch(url);
      const data: Appointment[] = await response.json();  // Cast the response as Appointment[]
      setAppointments(data);  // Set the appointments for the user
    }

    fetchAppointments();
}, [params.id, providerId]); // Dependency on userEmail and providerId

  // Handle rescheduling of appointment
  const handleReschedule = async () => {
    if (!selectedAppointment) return;  // Ensure selectedAppointment is not null

    const response = await fetch('/api/appointments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservationCode: selectedAppointment.reservationCode, newDateTime }),
    });

    if (response.ok) {
      alert('Appointment rescheduled!');
      router.push('/');  // Navigate back to home after success
    } else {
      alert('Failed to reschedule appointment.');
    }
  };

  // Handle cancellation of appointment
  const handleCancel = async () => {
    if (!selectedAppointment) return;  // Ensure selectedAppointment is not null

    const response = await fetch('/api/appointments', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservationCode: selectedAppointment.reservationCode }),
    });

    if (response.ok) {
      alert('Appointment canceled!');
      router.push('/');  // Navigate back to home after success
    } else {
      alert('Failed to cancel appointment.');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Manage Appointments</h2>

      {/* Display available appointments */}
      <div className="space-y-4">
        {appointments.length > 0 ? (
          <div>
            <h3>Select an appointment:</h3>
            <ul className="space-y-2">
              {appointments.map((appointment) => (
                <li key={appointment.id} className="border p-2 rounded">
                  <p><strong>Provider:</strong> {appointment.providerId}</p>
                  <p><strong>Date & Time:</strong> {appointment.dateTime}</p>
                  <Button onClick={() => setSelectedAppointment(appointment)} className="btn-primary">
                    Select
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No appointments found for {params.id}</p>
        )}
      </div>

      {/* Reschedule or cancel section, only visible when an appointment is selected */}
      {selectedAppointment && (
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-bold">Selected Appointment</h3>
          <p><strong>Provider:</strong> {selectedAppointment.providerId}</p>
          <p><strong>Date & Time:</strong> {selectedAppointment.dateTime}</p>

          <Input
            type="datetime-local"
            value={newDateTime}
            onChange={(e) => setNewDateTime(e.target.value)}
            placeholder="Reschedule Date & Time"
          />

          <div className="space-x-4 mt-4">
            <Button onClick={handleReschedule} className="btn-primary">Reschedule</Button>
            <Button onClick={handleCancel} className="btn-secondary">Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}

