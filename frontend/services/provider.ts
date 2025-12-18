import type { ProviderPatient } from '@/types/api';
import { authHeaders, http } from './http';

export async function fetchProviderPatients(accessToken: string) {
  const { data } = await http.get<ProviderPatient[]>('/checkins/patients', { headers: authHeaders(accessToken) });
  return data;
}
