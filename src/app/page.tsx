// src/app/page.tsx
'use client';

import { useState , useEffect } from 'react';
// import { Input, Button } from 'shadcn-ui';
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
  const [providers, setProviders] = useState<HealthcareProvider[]>([]); // State to store providers
  const [selectedProvider, setSelectedProvider] = useState<string>(''); // State to store selected provider ID
  const router = useRouter();

  // Fetch the providers when the page loads
  useEffect(() => {
    async function fetchProviders() {
      const response = await fetch('/api/providers');
      const data: HealthcareProvider[] = await response.json();
      setProviders(data);  // Set the fetched providers
    }
    fetchProviders();
  }, []);

  const handleManageAppointment = () => {
    if (email && selectedProvider) {
      // Case 3: Both email and provider are selected
      router.push(`/manage/${email}?providerId=${selectedProvider}`);
    } else if (email) {
      // Case 1: Only email is provided
      router.push(`/manage/${email}`);
    } else if (selectedProvider) {
      // Case 2: Only provider is selected
      router.push(`/manage/providerId=${selectedProvider}`);
    } else {
      alert('Please enter your email or select a provider to manage appointments');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <h1 className="text-3xl font-bold">Healthcare Scheduler</h1>

      <div className="space-y-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email to manage appointments"
          required
        />

        {/* Provider dropdown */}
        <Select 
          value={selectedProvider}
          onValueChange={setSelectedProvider} // Set the selected provider ID
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a provider" />
          </SelectTrigger>
          <SelectContent>
            {providers.map(provider => (
              <SelectItem key={provider.id} value={provider.id}>
                {provider.doctorName} - {provider.specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleManageAppointment} className="btn-primary">
          Manage Appointments
        </Button>
      </div>
    </div>
  );
}
