export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type EpisodePayload = {
  stressLevel: number;
  heartRate: number;
  sleepQuality: number;
  breathingIrregularity: boolean;
  triggerEvent: boolean;
  triggerType: string;
  caffeineIntake: number;
  mood: string;
  chestTightness: number;
  dizziness: number;
  notes?: string;
  latitude?: number;
  longitude?: number;
};

export function getToken() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("aad_token") || "";
}

export function setToken(token: string) {
  if (typeof window !== "undefined") window.localStorage.setItem("aad_token", token);
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.message || body.error || "Request failed");
  return body as T;
}

export async function ensureDemoUser() {
  const existing = getToken();
  if (existing) return existing;

  const email = "demo@anxiety-detector.local";
  const password = "demo12345";
  try {
    const registered = await apiFetch<{ token: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Demo User",
        email,
        password,
        medicalNotes: "No medical notes configured. Replace with user-provided notes in production.",
        preferredCalmingStyle: "grounded",
      }),
    });
    setToken(registered.token);
    return registered.token;
  } catch {
    const loggedIn = await apiFetch<{ token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(loggedIn.token);
    return loggedIn.token;
  }
}

export async function seedDemoContact() {
  await ensureDemoUser();
  await apiFetch("/api/contacts", {
    method: "POST",
    body: JSON.stringify({
      name: "Trusted Contact",
      relationship: "Friend",
      phone: "+15551234567",
      isPrimary: true,
      priority: 1,
    }),
  });
}
