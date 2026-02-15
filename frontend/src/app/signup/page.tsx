"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthService } from "@/services/auth/auth.service";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await AuthService.signup({ name, email, password });
      localStorage.setItem("auth_token", res.token);
      localStorage.setItem("auth_user", JSON.stringify(res.user));
      router.push("/"); // or /trigger
    } catch (err: any) {
      setError(err?.message ?? "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="container">
        <header className="header">
          <h1 className="title">Create account</h1>
          <p className="subtitle">Sign up to save contacts and preferences.</p>
        </header>

        <section className="card">
          <form onSubmit={onSubmit} className="form">
            <label className="field">
              <span className="label">Name</span>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </label>

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
              <span className="hint">At least 6 characters.</span>
            </label>

            {error ? <p className="error">{error}</p> : null}

            <button className="primaryBtn" disabled={loading} type="submit">
              {loading ? "Creating…" : "Sign up"}
            </button>

            <p className="finePrint">
              Already have an account? <Link href="/login">Log in</Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
