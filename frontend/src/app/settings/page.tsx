"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch, getToken } from "@/lib/apiClient";

type UserSettings = {
  name: string;
  email: string;
  preferredCalmingStyle: string;
  voiceTriggerEnabled: boolean;
  wearableMonitoringEnabled: boolean;
  smsAlertsEnabled: boolean;
  twoFactorEnabled: boolean;
  authProvider?: string;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadSettings() {
      if (!getToken()) {
        setStatus("Log in to manage security settings.");
        return;
      }
      try {
        const body = await apiFetch<{ user: UserSettings }>("/api/me");
        setSettings(body.user);
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Could not load settings.");
      }
    }
    loadSettings();
  }, []);

  async function save(patch: Partial<UserSettings>) {
    try {
      const body = await apiFetch<{ user: UserSettings }>("/api/settings/security", {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      setSettings(body.user);
      setStatus("Settings saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save settings.");
    }
  }

  return (
    <main className="page">
      <div className="container narrow">
        <header className="header">
          <p className="badge">Settings</p>
          <h1 className="title">Account security and module controls</h1>
          <p className="subtitle">Enable optional two-factor authentication and control the active support modules for your account.</p>
        </header>

        <section className="card form">
          {settings ? (
            <>
              <div>
                <h2 className="sectionTitle">{settings.name}</h2>
                <p className="sectionSub">{settings.email} · {settings.authProvider || "password"} account</p>
              </div>

              <label className="checkField">
                <input type="checkbox" checked={settings.twoFactorEnabled} onChange={(event) => save({ twoFactorEnabled: event.target.checked })} />
                Require a 2FA code during login
              </label>

              <label className="checkField">
                <input type="checkbox" checked={settings.voiceTriggerEnabled} onChange={(event) => save({ voiceTriggerEnabled: event.target.checked })} />
                Voice trigger enabled
              </label>

              <label className="checkField">
                <input type="checkbox" checked={settings.wearableMonitoringEnabled} onChange={(event) => save({ wearableMonitoringEnabled: event.target.checked })} />
                Wearable monitoring enabled
              </label>

              <label className="checkField">
                <input type="checkbox" checked={settings.smsAlertsEnabled} onChange={(event) => save({ smsAlertsEnabled: event.target.checked })} />
                SMS alerts enabled
              </label>

              <label className="field">
                Preferred calming style
                <select className="input" value={settings.preferredCalmingStyle} onChange={(event) => save({ preferredCalmingStyle: event.target.value })}>
                  <option value="grounded">Grounded</option>
                  <option value="direct">Direct</option>
                  <option value="gentle">Gentle</option>
                </select>
              </label>
            </>
          ) : (
            <div className="row">
              <p className="sectionSub">Log in to access account settings.</p>
              <Link className="primaryBtn" href="/login">Log in</Link>
            </div>
          )}
          <p className="statusText">{status}</p>
        </section>
      </div>
    </main>
  );
}
