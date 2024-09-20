import { NextResponse } from 'next/server';
import { fetchDataProviders } from '../../../utils/fetchedDataProviders';

// GET method for fetching providers
export async function GET() {
  try {
    const providers = await fetchDataProviders();
    return NextResponse.json(providers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load providers' }, { status: 500 });
  }
}
