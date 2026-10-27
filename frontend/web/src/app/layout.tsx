import type { Metadata } from "next";
import "./globals.css";
import { EmergencyBanner } from "@/components/layout/EmergencyBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "DrGodly Pharmacy Assist — AI Clinical Intake & Triage for Indian Pharmacies",
  description:
    "India's premier AI clinical intake, doctor teleconsultation, and care navigation system for retail pharmacies. CDSCO 2026 and Telemedicine Guidelines 2020 compliant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <EmergencyBanner />
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
