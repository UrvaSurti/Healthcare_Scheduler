// import { promises as fs } from 'fs';
// import path from 'path';
// import { Provider } from '../models';

// // Method to read providers.json file

// export async function fetchDataProviders(): Promise<Provider[]> {
//   const filePath = path.resolve('./src/data/providers.json');
//   const providersData = await fs.readFile(filePath, 'utf-8');
//   const providers: Provider[] = JSON.parse(providersData).providers;
//   return providers;
// }

import { promises as fs } from 'fs';
import path from 'path';
import { HealthcareProvider } from '@/lib/types';  // Import HealthcareProvider type

// Method to read providers.json file
export async function fetchDataProviders(): Promise<HealthcareProvider[]> {
  const filePath = path.resolve('./src/data/providers.json');
  const providersData = await fs.readFile(filePath, 'utf-8');
  
  // Parse the data and type it as HealthcareProvider[]
  const providers: HealthcareProvider[] = JSON.parse(providersData).providers;
  
  return providers;
}
