"use client";

import React, { use } from "react";
import Link from "next/link";
import { 
  FileText, 
  MessageSquare, 
  ShieldCheck, 
  AlertTriangle, 
  Share2, 
  Stethoscope, 
  Building2, 
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export default function PatientReportPage({ params }: ReportPageProps) {
  const resolvedParams = use(params);
  const encounterId = resolvedParams.id || "DG-2026-00981";

  return (
    <div className="flex-1 bg-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation & WhatsApp simulation bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Pharmacy Home</span>
          </Link>

          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
            Delivered via WhatsApp Bot
          </span>
        </div>

        {/* WhatsApp Chat Simulation Card */}
        <div className="bg-[#EFEAE2] p-4 sm:p-6 rounded-3xl border border-slate-300 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-300 text-xs text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-bold text-slate-800">DrGodly Health Official WhatsApp</span>
            <span className="text-[10px] text-slate-500 font-mono">10:18 AM</span>
          </div>

          {/* WhatsApp Message 1 Bubble */}
          <div className="bg-white p-3.5 rounded-2xl rounded-tl-xs max-w-md shadow-2xs text-xs space-y-1.5 text-slate-800">
            <p className="font-black text-emerald-800 text-sm">
              DrGodly Pharmacy Health Report
            </p>
            <p>Your clinical intake is complete.</p>
            <p><strong>Main Concern:</strong> Upper abdominal discomfort & acid regurgitation</p>
            <p><strong>Next Step:</strong> Pharmacist review recommended.</p>
            <p className="text-[10px] text-slate-400 font-mono">Token: #{encounterId}</p>
          </div>

          {/* WhatsApp Message 2 Interactive Actions Bubble */}
          <div className="bg-white p-3 rounded-2xl rounded-tl-xs max-w-sm shadow-2xs space-y-2">
            <p className="text-[11px] font-bold text-slate-700">Choose an action:</p>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <a
                href="#full-report"
                className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold py-2 px-3 rounded-lg text-center border border-emerald-200 transition-colors"
              >
                📄 View Report
              </a>
              <Link
                href="/doctors"
                className="bg-teal-50 text-teal-800 hover:bg-teal-100 font-bold py-2 px-3 rounded-lg text-center border border-teal-200 transition-colors"
              >
                🩺 Consult Doctor
              </Link>
              <Link
                href="/labs"
                className="bg-sky-50 text-sky-800 hover:bg-sky-100 font-bold py-2 px-3 rounded-lg text-center border border-sky-200 transition-colors"
              >
                🔬 Find Labs
              </Link>
              <button
                type="button"
                onClick={() => alert(`Share Link: https://drgodly.health/report/${encounterId}`)}
                className="bg-slate-50 text-slate-700 hover:bg-slate-100 font-bold py-2 px-3 rounded-lg text-center border border-slate-200 transition-colors"
              >
                🔗 Share Report
              </button>
            </div>
          </div>
        </div>

        {/* Formal Full Clinical Report Document */}
        <div id="full-report" className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-md space-y-8 font-sans">
          
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Official Clinical Intake Record
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-2">
                DRGODLY PHARMACY HEALTH REPORT
              </h1>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Encounter Reference: #{encounterId}
              </p>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p><strong className="text-slate-800">Patient:</strong> Rajesh Kumar</p>
              <p>42 years • Male • +91 98765 43210</p>
              <p className="text-[10px] text-slate-500 mt-1">Generated: 27 Oct 2026, 10:18 AM</p>
            </div>
          </div>

          {/* Section 1: Chief Complaint & Symptoms */}
          <div className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
              1. Chief Complaint & Symptom Summary
            </h2>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-1.5 text-slate-800">
              <p><strong className="text-slate-900">Chief Complaint:</strong> Upper abdominal discomfort and retrosternal sour burning for 2 days.</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                <li>Epigastric discomfort exacerbated 30-60 minutes after meals</li>
                <li>Associated with occasional water brash (sour acid regurgitation)</li>
                <li>No vomiting, hematemesis, or melena (black tarry stools) reported</li>
                <li>No acute radiation to left shoulder, back, or jaw</li>
              </ul>
            </div>
          </div>

          {/* Section 2: Safety Screen (Red Flags) */}
          <div className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
              2. Red-Flag Safety Screen
            </h2>
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs space-y-2 text-emerald-950">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Screened Negative for Emergency Warning Signs</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-800">
                No acute cardiovascular crushing pain, severe dyspnea, hematemesis, involuntary weight loss, or difficulty swallowing detected during intake.
              </p>
            </div>
          </div>

          {/* Section 3: Possible Explanations (Differential) */}
          <div className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
              3. Possible Clinical Explanations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block">1. Dyspepsia</span>
                <span className="text-[10px] text-teal-700 font-mono">ICD-10: K30</span>
                <p className="text-[11px] text-slate-500 mt-1">Functional post-prandial fullness and upper abdominal pain.</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block">2. Acute Gastritis</span>
                <span className="text-[10px] text-teal-700 font-mono">ICD-10: K29.7</span>
                <p className="text-[11px] text-slate-500 mt-1">Mucosal irritation secondary to dietary indiscretion or tea intake.</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block">3. GERD</span>
                <span className="text-[10px] text-teal-700 font-mono">ICD-10: K21.9</span>
                <p className="text-[11px] text-slate-500 mt-1">Gastroesophageal reflux with pyrosis.</p>
              </div>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-900">
              <strong>STATUTORY NOTICE:</strong> These are algorithmic clinical possibilities based on reported symptoms and do not replace a confirmed diagnosis by a Registered Medical Practitioner.
            </div>
          </div>

          {/* Section 4: Recommended Next Steps & Symptomatic Care */}
          <div className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
              4. Recommended Next Steps & Symptomatic Care
            </h2>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-2 text-slate-700">
              <p><strong className="text-slate-900">Pharmacist Review:</strong> Show this report to the registered pharmacist for CDSCO-approved OTC antacid suspension (Magaldrate + Simethicone 10-20ml post-meals).</p>
              <p><strong className="text-slate-900">Lifestyle Guidance:</strong> Avoid spicy foods, carbonated drinks, and avoid lying down within 2 hours of dinner.</p>
              <p><strong className="text-slate-900">Medical Follow-up:</strong> If symptoms persist beyond 14 days or worsen, consult an NMC-registered General Physician.</p>
            </div>
          </div>

          {/* Section 5: Nearby Diagnostic Laboratories */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
                5. Relevant Investigations & Partner Laboratories
              </h2>
              <Link href="/labs" className="text-xs font-bold text-teal-700 hover:underline">
                View All Nearby Labs &rarr;
              </Link>
            </div>

            <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-200 text-xs space-y-2">
              <p className="text-teal-900 font-bold">Suggested if refractory to initial 14-day antacid care:</p>
              <p className="text-slate-700">• Serum H. pylori Stool Antigen Detection / Serology</p>
              <p className="text-slate-700">• Complete Blood Count (CBC) with ESR</p>
              <div className="pt-2 flex flex-wrap gap-2">
                <span className="bg-white px-2.5 py-1 rounded-md border border-teal-200 text-[11px] font-bold text-teal-800">
                  Dr. Lal PathLabs (0.8 km)
                </span>
                <span className="bg-white px-2.5 py-1 rounded-md border border-teal-200 text-[11px] font-bold text-teal-800">
                  Thyrocare Centre (1.2 km)
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Action CTAs */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/doctors"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-2 shadow-xs"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Consult DrGodly Tele-Doctor</span>
            </Link>

            <Link
              href="/catalog"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow-xs"
            >
              Browse Recommended OTC Antacids
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
