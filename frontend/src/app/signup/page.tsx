"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, setToken } from "@/lib/apiClient";

type AuthResult = {
  token?: string;
  requiresTwoFactor?: boolean;
};

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function SignupPage() {
  const router = useRouter();
  const [status, setStatus] = useState("");

  const finishSignup = useCallback((token: string) => {
    setToken(token);
    setStatus("Account created. Redirecting to your dashboard...");
    router.push("/dashboard");
  }, [router]);

  const handleGoogleAuth = useCallback(async (payload: { credential?: string; profile?: Record<string, string> }) => {
    const body = await apiFetch<AuthResult>("/api/auth/google", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (body.requiresTwoFactor) {
      setStatus("This Google account has 2FA enabled. Use the login page to enter your verification code.");
      return;
    }
    if (body.token) finishSignup(body.token);
  }, [finishSignup]);

  useEffect(() => {
    if (!googleClientId || window.google) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response) => {
          handleGoogleAuth({ credential: response.credential }).catch((error) => {
            setStatus(error instanceof Error ? error.message : "Google signup failed.");
          });
        },
      });
    };
    document.head.appendChild(script);
  }, [handleGoogleAuth]);

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
      finishSignup(body.token);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Signup failed.");
    }
  }

  async function continueWithGoogle() {
    try {
      if (googleClientId) {
        if (window.google) {
          window.google.accounts.id.prompt();
        } else {
          setStatus("Google sign-up is still loading. Try again in a moment.");
        }
        return;
      }
      await handleGoogleAuth({
        profile: {
          email: "google-demo@anxiety-detector.local",
          name: "Google Demo User",
          sub: "mock-google-demo",
        },
      });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Google signup failed.");
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
          <button className="secondaryBtn" type="button" onClick={continueWithGoogle}>Sign up with Google</button>
          <p className="statusText">{status}</p>
        </form>
      </div>
    </main>
  );
}
