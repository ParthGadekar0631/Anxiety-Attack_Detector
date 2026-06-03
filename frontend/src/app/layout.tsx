import type { Metadata } from "next";
import "../styles/globals.css";
import "./globals.css";
import ThemeToggle from "@/components/layout/ThemeToggle";

export const metadata: Metadata = {
  title: "Anxiety Attack Detector",
  description: "AI-assisted anxiety escalation detection and intervention platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
