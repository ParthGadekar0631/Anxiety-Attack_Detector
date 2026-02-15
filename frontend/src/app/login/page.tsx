"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthService } from "@/services/auth/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await AuthService.login({ email, password });
      localStorage.setItem("auth_token", res.token);
      localStorage.setItem("auth_user", JSON.stringify(res.user));
      router.push("/");
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="container">
        <header className="header">
          <h1 className="title">Welcome back</h1>
          <p className="subtitle">Log in to access your saved settings.</p>
        </header>

        <section className="card">
          <form onSubmit={onSubmit} className="form">
            <label className="field">
              <span className="label">Email</span>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>

            <label className="field">
              <span className="label">Password</span>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {error ? <p className="error">{error}</p> : null}

            <button className="primaryBtn" disabled={loading} type="submit">
              {loading ? "Logging in…" : "Log in"}
            </button>

            <p className="finePrint">
              New here? <Link href="/signup">Create an account</Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
