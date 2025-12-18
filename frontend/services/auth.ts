import type { AuthResponse, RegisterPayload } from '@/types/api';
import { http } from './http';

export async function registerUser(payload: RegisterPayload) {
  const { data } = await http.post<AuthResponse>('/auth/register', payload);
  return data;
}

export async function loginUser(credentials: { email: string; password: string }) {
  const { data } = await http.post<AuthResponse>('/auth/login', credentials);
  return data;
}
