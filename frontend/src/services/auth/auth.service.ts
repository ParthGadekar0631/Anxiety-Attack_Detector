type AuthUser = { id: string; name: string; email: string; createdAt: string };
type AuthResponse = { user: AuthUser; token: string };

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Request failed");
  return data as T;
}

export const AuthService = {
  signup: (payload: { name: string; email: string; password: string }) =>
    postJSON<AuthResponse>("/api/auth/signup", payload),

  login: (payload: { email: string; password: string }) =>
    postJSON<AuthResponse>("/api/auth/login", payload),
};
