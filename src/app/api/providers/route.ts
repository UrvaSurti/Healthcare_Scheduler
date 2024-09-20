import { NextResponse } from 'next/server';
import { HealthcareProvider } from '@/lib/types';  // Import HealthcareProvider type
import { fetchDataProviders } from '../../../utils/fetchedDataProviders';

// GET method for fetching providers
export async function GET() {
  try {
    const providers: HealthcareProvider[] = await fetchDataProviders();  // Ensure fetchDataProviders returns an array of HealthcareProvider[]
    return NextResponse.json(providers);  // Return the providers array
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load providers' }, { status: 500 });
  }
}
