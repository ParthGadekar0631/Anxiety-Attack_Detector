"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, setToken } from "@/lib/apiClient";

type AuthResult = {
  token?: string;
  requiresTwoFactor?: boolean;
  challengeId?: string;
  devCode?: string;
};

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@anxiety-detector.local");
  const [password, setPassword] = useState("demo12345");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [status, setStatus] = useState("");

  const finishLogin = useCallback((token: string) => {
    setToken(token);
    setStatus("Logged in. Redirecting to your dashboard...");
    router.push("/dashboard");
  }, [router]);

  const handleGoogleAuth = useCallback(async (payload: { credential?: string; profile?: Record<string, string> }) => {
    const body = await apiFetch<AuthResult>("/api/auth/google", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (body.requiresTwoFactor && body.challengeId) {
      setChallengeId(body.challengeId);
      setStatus(body.devCode ? `Google account found. Enter 2FA code: ${body.devCode}` : "Google account found. Enter your 2FA code.");
      return;
    }
    if (body.token) finishLogin(body.token);
  }, [finishLogin]);

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
            setStatus(error instanceof Error ? error.message : "Google login failed.");
          });
        },
      });
    };
    document.head.appendChild(script);
  }, [handleGoogleAuth]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      const body = await apiFetch<AuthResult>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      if (body.requiresTwoFactor && body.challengeId) {
        setChallengeId(body.challengeId);
        setStatus(body.devCode ? `Enter the 2FA code. Demo code: ${body.devCode}` : "Enter the 2FA code sent to your account.");
        return;
      }
      if (body.token) finishLogin(body.token);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Login failed.");
    }
  }

  async function verifyTwoFactor(event: FormEvent) {
    event.preventDefault();
    try {
      const body = await apiFetch<{ token: string }>("/api/auth/2fa/verify", {
        method: "POST",
        body: JSON.stringify({ challengeId, code: twoFactorCode }),
      });
      finishLogin(body.token);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "2FA verification failed.");
    }
  }

  async function continueWithGoogle() {
    try {
      if (googleClientId) {
        if (window.google) {
          window.google.accounts.id.prompt();
        } else {
          setStatus("Google sign-in is still loading. Try again in a moment.");
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
      setStatus(error instanceof Error ? error.message : "Google login failed.");
    }
  }

  return (
    <main className="page">
      <div className="container narrow">
        <header className="header"><h1 className="title">Log in</h1><p className="subtitle">Use the demo account after registering once, or create a new account.</p></header>
        <form className="card form" onSubmit={challengeId ? verifyTwoFactor : submit}>
          {challengeId ? (
            <>
              <label className="field">2FA code<input className="input" value={twoFactorCode} inputMode="numeric" maxLength={6} onChange={(e) => setTwoFactorCode(e.target.value)} /></label>
              <button className="primaryBtn" type="submit">Verify and continue</button>
              <button className="secondaryBtn" type="button" onClick={() => { setChallengeId(""); setTwoFactorCode(""); setStatus(""); }}>Back to login</button>
            </>
          ) : (
            <>
              <label className="field">Email<input className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
              <label className="field">Password<input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
              <button className="primaryBtn" type="submit">Log in</button>
              <button className="secondaryBtn" type="button" onClick={continueWithGoogle}>Continue with Google</button>
              <Link className="footerLink" href="/signup">Need an account?</Link>
            </>
          )}
          <p className="statusText">{status}</p>
        </form>
      </div>
    </main>
  );
}
