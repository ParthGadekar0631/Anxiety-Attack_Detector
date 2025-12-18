export type UserRole = 'patient' | 'provider' | 'admin';
export type RiskLevel = 'low' | 'medium' | 'high' | 'unknown';

export interface CheckinTrendPoint {
  id: string;
  date: string;
  anxietyLevel: number;
  riskScore: number;
}

export interface PatientSummary {
  currentAnxietyLevel: number | null;
  lastCheckin: string | null;
  totalCheckins: number;
  riskLevel: RiskLevel;
  checkinData: CheckinTrendPoint[];
}

export interface AnxietyCheckinPayload {
  anxietyLevel: number;
  symptoms?: string[];
  triggers?: string[];
  copingMechanisms?: string[];
  notes?: string;
}

export interface ProviderPatient {
  id: string;
  name: string;
  email: string;
  riskLevel: RiskLevel;
  lastCheckin: string | null;
}

export interface AdminAnalytics {
  totalUsers: number;
  activePatients: number;
  providerCount: number;
  totalCheckins: number;
  highRiskCount: number;
  apiRequests: number;
  lastModelUpdate?: string;
  recentHighRisk: { id: string; createdAt: string; user?: { name: string; email?: string } }[];
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: UserAccount;
  tokens: AuthTokens;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}
