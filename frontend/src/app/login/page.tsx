"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { apiFetch, setToken } from "@/lib/apiClient";

export default function LoginPage() {
  const [email, setEmail] = useState("demo@anxiety-detector.local");
  const [password, setPassword] = useState("demo12345");
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      const body = await apiFetch<{ token: string }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      setToken(body.token);
      setStatus("Logged in. You can now use protected API features.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Login failed.");
    }
  }

  return (
    <main className="page">
      <div className="container narrow">
        <header className="header"><h1 className="title">Log in</h1><p className="subtitle">Use the demo account after registering once, or create a new account.</p></header>
        <form className="card form" onSubmit={submit}>
          <label className="field">Email<input className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="field">Password<input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          <button className="primaryBtn" type="submit">Log in</button>
          <Link className="footerLink" href="/signup">Need an account?</Link>
          <p className="statusText">{status}</p>
        </form>
      </div>
    </main>
  );
}
