// src/app/appointments/page.tsx
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
} from "@/components/ui/select";  // Using correct Select components from Shadcn UI
import { HealthcareProvider } from '@/lib/types';  // Import HealthcareProvider type

export default function BookAppointment() {
  // Form data state
  const [formData, setFormData] = useState({
    providerId: '',
    dateTime: '',
    userEmail: '',
  });

  // Providers state typed as HealthcareProvider[]
  const [providers, setProviders] = useState<HealthcareProvider[]>([]); // Use the type HealthcareProvider[]
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch providers from the API
    async function fetchProviders() {
      const response = await fetch('/api/providers');
      const data: HealthcareProvider[] = await response.json();  // Type response as HealthcareProvider[]
      setProviders(data);  // Update providers state
    }
    fetchProviders();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setIsSubmitting(false);

    if (response.ok) {
      alert('Appointment booked successfully!');
      setFormData({ providerId: '', dateTime: '', userEmail: '' });
    } else {
      alert('Failed to book appointment.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select onValueChange={(value) => setFormData({ ...formData, providerId: value })}>
          <SelectTrigger aria-label="Select Provider">
            <SelectValue placeholder="Select a provider" />
          </SelectTrigger>
          <SelectContent>
            {providers.map((provider) => (
              <SelectItem key={provider.id} value={provider.id}>
                {provider.doctorName} - {provider.specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="datetime-local"
          name="dateTime"
          value={formData.dateTime}
          onChange={handleChange}
          required
        />

        <Input
          type="email"
          name="userEmail"
          placeholder="Your Email"
          value={formData.userEmail}
          onChange={handleChange}
          required
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Booking...' : 'Book Appointment'}
        </Button>
      </form>
    </div>
  );
}
