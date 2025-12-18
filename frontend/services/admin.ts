import type { AdminAnalytics, UserAccount } from '@/types/api';
import { authHeaders, http } from './http';

export async function fetchAdminAnalytics(accessToken: string) {
  const { data } = await http.get<AdminAnalytics>('/analytics/summary', { headers: authHeaders(accessToken) });
  return data;
}

export async function fetchUsers(accessToken: string) {
  const { data } = await http.get<UserAccount[]>('/users', { headers: authHeaders(accessToken) });
  return data;
}
