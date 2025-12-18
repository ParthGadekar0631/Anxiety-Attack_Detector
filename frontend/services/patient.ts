import type { AnxietyCheckinPayload, PatientSummary } from '@/types/api';
import { authHeaders, http } from './http';

export async function fetchPatientSummary(accessToken: string) {
  const { data } = await http.get<PatientSummary>('/checkins/me', { headers: authHeaders(accessToken) });
  return data;
}

export async function submitCheckin(accessToken: string, payload: AnxietyCheckinPayload) {
  const { data } = await http.post('/checkins', payload, { headers: authHeaders(accessToken) });
  return data;
}
