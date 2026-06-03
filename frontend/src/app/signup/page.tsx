"use client";

import { FormEvent, useState } from "react";
import { apiFetch, setToken } from "@/lib/apiClient";

export default function SignupPage() {
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const body = await apiFetch<{ token: string }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          password: data.get("password"),
          medicalNotes: data.get("medicalNotes"),
        }),
      });
      setToken(body.token);
      setStatus("Account created and JWT stored locally for demo use.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Signup failed.");
    }
  }

  return (
    <main className="page">
      <div className="container narrow">
        <header className="header"><h1 className="title">Create account</h1><p className="subtitle">JWT authentication, password hashing, and user-specific data access are handled by the backend.</p></header>
        <form className="card form" onSubmit={submit}>
          <label className="field">Name<input className="input" name="name" defaultValue="Demo User" /></label>
          <label className="field">Email<input className="input" name="email" defaultValue="demo@anxiety-detector.local" /></label>
          <label className="field">Password<input className="input" name="password" type="password" defaultValue="demo12345" /></label>
          <label className="field">Medical notes<textarea className="input" name="medicalNotes" defaultValue="No medical notes configured." /></label>
          <button className="primaryBtn" type="submit">Create account</button>
          <p className="statusText">{status}</p>
        </form>
      </div>
    </main>
  );
}
