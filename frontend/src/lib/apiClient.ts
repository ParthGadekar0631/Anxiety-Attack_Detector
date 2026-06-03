export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const STATIC_DEMO_ENABLED = process.env.NEXT_PUBLIC_STATIC_DEMO === "true";

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
  if (shouldUseStaticDemo()) {
    return mockApiFetch<T>(path, options);
  }

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

type DemoUser = {
  id: string;
  name: string;
  email: string;
  password: string;
};

type DemoState = {
  token: string;
  users: Record<string, DemoUser>;
  contacts: Array<Record<string, unknown>>;
  episodes: EpisodePayload[];
};

declare global {
  var __AAD_STATIC_DEMO_STATE__: DemoState | undefined;
}

function shouldUseStaticDemo() {
  if (STATIC_DEMO_ENABLED) return true;
  if (typeof window === "undefined") return false;
  return window.location.hostname.endsWith("github.io") && !process.env.NEXT_PUBLIC_API_URL;
}

function getDemoState() {
  globalThis.__AAD_STATIC_DEMO_STATE__ ??= {
    token: "demo-static-token",
    users: {},
    contacts: [],
    episodes: [],
  };
  return globalThis.__AAD_STATIC_DEMO_STATE__;
}

function parseBody(options: RequestInit) {
  if (!options.body || typeof options.body !== "string") return {};
  try {
    return JSON.parse(options.body) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function scoreEpisode(payload: Partial<EpisodePayload>) {
  const riskScore = clamp(
    Number(payload.stressLevel ?? 5) * 7 +
      Math.max(0, Number(payload.heartRate ?? 80) - 75) * 0.65 +
      Number(payload.chestTightness ?? 0) * 3 +
      Number(payload.dizziness ?? 0) * 2 +
      (payload.breathingIrregularity ? 10 : 0) +
      (payload.triggerEvent ? 8 : 0) -
      Number(payload.sleepQuality ?? 5) * 1.5,
  );
  const riskCategory = riskScore >= 75 ? "high" : riskScore >= 45 ? "moderate" : "low";
  return {
    riskScore,
    confidenceScore: riskScore >= 70 ? 0.88 : 0.79,
    escalationProbability: Number((riskScore / 100).toFixed(2)),
    riskCategory,
  };
}

async function mockApiFetch<T>(path: string, options: RequestInit): Promise<T> {
  const state = getDemoState();
  const body = parseBody(options);

  await new Promise((resolve) => setTimeout(resolve, 120));

  if (path === "/api/health") {
    return { status: "ok", mode: "static-demo" } as T;
  }

  if (path === "/api/auth/register" || path === "/api/auth/login") {
    const email = String(body.email ?? "demo@anxiety-detector.local").toLowerCase();
    state.users[email] ??= {
      id: `demo-${Object.keys(state.users).length + 1}`,
      name: String(body.name ?? "Demo User"),
      email,
      password: String(body.password ?? "demo12345"),
    };
    state.token = `static.${state.users[email].id}.${Date.now()}`;
    return { token: state.token, user: state.users[email] } as T;
  }

  if (path === "/api/contacts") {
    state.contacts.push({ ...body, id: `contact-${state.contacts.length + 1}` });
    return { contact: state.contacts.at(-1) } as T;
  }

  if (path === "/api/episodes") {
    const payload = body as Partial<EpisodePayload>;
    state.episodes.push(payload as EpisodePayload);
    return {
      prediction: scoreEpisode(payload),
      aiResponse: {
        message: "Static demo response: your risk signals are elevated, so shift to a slower breathing cycle and lower stimulation.",
        breathingInstruction: "Inhale for 4 seconds, hold for 2, exhale for 6. Repeat for five rounds.",
      },
    } as T;
  }

  if (path === "/api/wearables/simulate") {
    const source = String(body.source ?? "apple");
    const heartRate = source === "fitbit" ? 104 : source === "samsung" ? 111 : 118;
    const wearableRiskScore = clamp((heartRate - 70) * 1.25);
    return {
      reading: { source, heartRate, heartRateVariability: 38, oxygenSaturation: 98 },
      analysis: { wearableRiskScore, anomalyDetected: wearableRiskScore >= 45 },
    } as T;
  }

  if (path === "/api/voice/analyze") {
    const transcript = String(body.transcript ?? "").toLowerCase();
    const triggerDetected = ["help", "panic", "emergency", "right now"].some((term) => transcript.includes(term));
    const voiceStressScore = triggerDetected ? 82 : 41;
    return {
      triggerDetected,
      sample: {
        voiceStressScore,
        analysisSummary: "Static demo extraction combined transcript keywords with simulated pitch, pause, and speech-rate stress features.",
      },
    } as T;
  }

  if (path === "/api/emergency/start") {
    return { episodeId: `emergency-${Date.now()}`, status: "started" } as T;
  }

  if (path === "/api/emergency/notify") {
    return {
      provider: "mock-sms-static-demo",
      message: `Sent ${state.contacts.length || 1} simulated trusted-contact alert with the provided location context.`,
    } as T;
  }

  if (path === "/api/insights/personalized") {
    return {
      insights: {
        personalizedRiskNotes: "Static demo insight: recent simulated episodes show stronger risk when sleep quality is low and heart rate is elevated.",
        recommendedPreventiveActions: [
          "Start a two-minute breathing session when heart rate crosses your baseline.",
          "Reduce caffeine on days with poor sleep quality.",
          "Use the voice trigger if escalation feels difficult to explain manually.",
        ],
      },
    } as T;
  }

  if (path === "/api/insights/relapse-risk") {
    const recentEpisodeCount = Math.max(1, state.episodes.length);
    return {
      relapseRisk: {
        relapseRiskScore: clamp(35 + recentEpisodeCount * 12),
        relapseRiskCategory: recentEpisodeCount >= 3 ? "moderate-high" : "moderate",
        window: "next 7 days",
        explanation: [
          "Simulated recent episode frequency increased the score.",
          "Wearable and voice modules are active in demo mode.",
          "A real deployment should retrain this model on consented longitudinal data.",
        ],
      },
    } as T;
  }

  throw new Error(`Static demo has no mock for ${path}`);
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
