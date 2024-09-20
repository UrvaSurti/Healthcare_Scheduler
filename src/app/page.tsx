// // src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectTrigger, 
  SelectContent, 
  SelectItem, 
  SelectValue 
} from "@/components/ui/select";
import { HealthcareProvider } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [providers, setProviders] = useState<HealthcareProvider[]>([]);  // Store providers for booking and managing
  const [selectedProviderForBooking, setSelectedProviderForBooking] = useState<HealthcareProvider | null>(null);  // Selected provider for booking
  const [selectedProviderForManage, setSelectedProviderForManage] = useState<string>('');  // Selected provider for managing appointments
  const [selectedTime, setSelectedTime] = useState<string>('');          // Store selected time for booking
  const router = useRouter();

  // Fetch providers when the page loads
  useEffect(() => {
    async function fetchProviders() {
      const response = await fetch('/api/providers');
      const data: HealthcareProvider[] = await response.json();
      setProviders(data);  
    }
    fetchProviders();
  }, []);

  // Reset the form for booking another appointment
  const resetForm = () => {
    setSelectedProviderForBooking(null);
    setSelectedTime('');
    setEmail('');
  };

  // Handle appointment reservation
  const handleReserveAppointment = async () => {
    const today = new Date().toISOString().split('T')[0];  

    if (!selectedProviderForBooking || !selectedTime) {
      alert('Please select a provider and an available time.');
      return;
    }

    // Call the backend API to create an appointment
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        providerId: selectedProviderForBooking.id,
        dateTime: `${today}T${selectedTime}`,  
        userEmail: email || 'guest@example.com'
      }),
    });

    if (response.ok) {
      const data = await response.json();
      alert(`Appointment reserved! Your reservation code is: ${data.reservationCode}`);

      // Reset the form to allow the user to book another appointment
      resetForm();
    } else {
      alert('Failed to reserve appointment. Please try again.');
    }
  };

  // Handle managing appointments
  const handleManageAppointment = () => {
    if (email && selectedProviderForManage) {
      // Case 3: Both email and provider are selected
      router.push(`/manage/${email}?providerId=${selectedProviderForManage}`);
    } else if (email) {
      // Case 1: Only email is provided
      router.push(`/manage/${email}`);
    } else if (selectedProviderForManage) {
      // Case 2: Only provider is selected
      router.push(`/manage/providerId=${selectedProviderForManage}`);
    } else {
      alert('Please enter your email or select a provider to manage appointments');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      
      
      <h1 className="text-4xl font-bold">Healthcare Scheduler</h1>

      {/* Section: Book Your Appointment */}
      <div className="flex flex-col items-center justify-center space-y-4 p-4 border-b-2 border-gray-200">
        <h2 className="text-3xl font-bold">Book Your Appointment</h2>

        {/* Provider dropdown for booking */}
        <Select 
          value={selectedProviderForBooking?.id || ''}
          onValueChange={(providerId) => {
            const provider = providers.find(p => p.id === providerId);
            setSelectedProviderForBooking(provider || null);
            setSelectedTime('');  // Clear selected time when provider changes
          }}  
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a provider" />
          </SelectTrigger>
          <SelectContent>
            {providers.length > 0 ? (
              providers.map(provider => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.doctorName} - {provider.specialty}
                </SelectItem>
              ))
            ) : (
              <SelectItem disabled value="no-providers">
                No providers available
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        {/* Display facility name when provider is selected */}
        {selectedProviderForBooking && (
          <p className="mt-2 text-gray-700">
            Facility: {selectedProviderForBooking.facilityName}
          </p>
        )}

        {/* Available times as buttons */}
        {selectedProviderForBooking && (
          <div className="flex flex-wrap space-x-2 mt-4">
            {selectedProviderForBooking.availableHours.map((time) => (
              <Button 
                key={time} 
                onClick={() => setSelectedTime(time)} 
                className={`btn px-4 py-2 text-lg font-semibold rounded-lg transition-all duration-200
                  ${selectedTime === time ? 'bg-black text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-700'}
                  ${selectedTime !== time ? 'opacity-75' : 'opacity-100'}`}
              >
                {time}
              </Button>
            ))}
          </div>
        )}

        {/* Book Appointment Button */}
        {selectedTime && (
          <Button onClick={handleReserveAppointment} className="btn-primary mt-4">
            Book Appointment
          </Button>
        )}
      </div>

      {/* Section: Reschedule Your Appointment */}
      <div className="flex flex-col items-center justify-center space-y-4 mt-6">
        <h2 className="text-3xl font-bold">Reschedule Your Appointment</h2>

        {/* Email input for managing appointments */}
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        {/* Provider dropdown for managing appointments */}
        <Select 
          value={selectedProviderForManage}
          onValueChange={setSelectedProviderForManage}  // Set selected provider for managing appointments
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a provider" />
          </SelectTrigger>
          <SelectContent>
            {providers.length > 0 ? (
              providers.map(provider => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.doctorName} - {provider.specialty}
                </SelectItem>
              ))
            ) : (
              <SelectItem disabled value="no-providers">
                No providers available
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        {/* Manage Appointments Button (centered) */}
        <div className="flex justify-center w-full">
          <Button onClick={handleManageAppointment} className="btn-secondary mt-4">
            Manage Appointments
          </Button>
        </div>
      </div>
    </div>
  );
}

