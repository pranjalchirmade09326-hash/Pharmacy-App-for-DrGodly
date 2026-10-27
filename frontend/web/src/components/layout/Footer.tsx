import React from "react";
import Link from "next/link";
import { ShieldCheck, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Compliance Badges Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-8 border-b border-slate-800">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-200">CDSCO 2026 Compliant</p>
              <p className="text-[11px] text-slate-500">
                Centrally versioned formulary enforcing Schedule H/H1 gates & under-4 pediatric FDC restrictions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-200">Telemedicine Guidelines 2020</p>
              <p className="text-[11px] text-slate-500">
                AI triage supports RMPs and Pharmacists; final diagnosis and prescription delivered by registered clinicians.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <FileText className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-200">DPDP Act 2023 Protected</p>
              <p className="text-[11px] text-slate-500">
                Explicit affirmative consent with 30-day voice audio purge and local data residency in India.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-200">ABDM FHIR R4 Ready</p>
              <p className="text-[11px] text-slate-500">
                Direct export to Ayushman Bharat Digital Mission (ABDM) health records and MCTS registries.
              </p>
            </div>
          </div>
        </div>

        {/* Regulatory Disclaimers */}
        <div className="pt-6 pb-4">
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-start gap-2 text-slate-300">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong className="text-white">STATUTORY MEDICAL DISCLAIMER:</strong> DrGodly Pharmacy Assist is a clinical intake, structured documentation, and triage decision-support tool. It does not provide medical diagnoses or prescribe medications autonomously. All medication dispensing must be authorized by a licensed Registered Pharmacist in accordance with the Drugs and Cosmetics Act, 1940. Prescription medicines (Schedule H, H1, X) strictly require an authentic prescription from a registered medical practitioner (RMP).
            </p>
          </div>
        </div>

        {/* Copyright & Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/60 text-[11px]">
          <p>© 2026 DrGodly Health Systems India. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-200 transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-slate-200 transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-slate-200 transition-colors">Pharmacist Guide</Link>
            <Link href="tel:108" className="text-red-400 font-bold hover:underline">National Ambulance: 108</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
