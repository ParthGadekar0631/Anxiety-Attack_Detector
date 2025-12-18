import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? 'http://localhost:4000/api/v1';

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export function authHeaders(accessToken?: string) {
  if (!accessToken) {
    throw new Error('Missing authentication token');
  }
  return {
    Authorization: `Bearer ${accessToken}`,
  } as const;
}
