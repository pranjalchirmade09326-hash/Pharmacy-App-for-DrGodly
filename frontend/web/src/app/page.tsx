"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  PhoneCall, 
  QrCode, 
  Sparkles, 
  MessageSquare, 
  ShieldCheck, 
  Stethoscope, 
  Pill, 
  Activity, 
  ArrowRight, 
  Play, 
  CheckCircle,
  FileText,
  Volume2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function HomePage() {
  const [simulating, setSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const startSimulation = () => {
    setSimulating(true);
    setSimStep(1);
    setTimeout(() => setSimStep(2), 2200);
    setTimeout(() => setSimStep(3), 4500);
    setTimeout(() => setSimStep(4), 7000);
  };

  const resetSimulation = () => {
    setSimulating(false);
    setSimStep(0);
  };

  return (
    <div className="flex-1 flex flex-col">
      
      {/* Hero Section: Pharmacy Counter QR & Intake */}
      <section className="bg-gradient-to-b from-teal-50/70 via-white to-slate-50 border-b border-slate-200 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading & Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Next-Generation Pharmacy Healthcare for India</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Not feeling well? <br />
                <span className="text-teal-600">Talk to DrGodly</span> at the counter.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Scan the counter QR code, tap call to explain your symptoms in your mother tongue, and receive an AI-structured clinical intake report on WhatsApp—reviewed and safely dispensed by your pharmacist or tele-doctor.
              </p>

              {/* One-Tap Call CTA & Direct Links */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="tel:+918069000000"
                  className="inline-flex items-center gap-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3.5 rounded-xl text-base shadow-md hover:shadow-lg transition-all"
                >
                  <PhoneCall className="w-5 h-5 animate-pulse" />
                  <span>Call DrGodly (+91-8069-000-000)</span>
                </a>

                <Link
                  href="/doctors"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-5 py-3.5 rounded-xl border border-slate-300 shadow-2xs hover:shadow-xs transition-all"
                >
                  <Stethoscope className="w-5 h-5 text-teal-600" />
                  <span>Book Tele-Doctor</span>
                </Link>

                <Link
                  href="/pharmacy/workspace"
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-3.5 rounded-xl shadow-xs transition-all"
                >
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <span>Pharmacist Console</span>
                </Link>
              </div>

              {/* Guarantees Bar */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>No Mobile App Install Required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Hindi, English, Tamil & Telugu</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>100% CDSCO 2026 Compliant</span>
                </div>
              </div>

            </div>

            {/* Right Column: Physical Pharmacy Counter QR Poster Display */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl border-4 border-teal-600 relative overflow-hidden">
                
                {/* Header ribbon */}
                <div className="bg-teal-600 text-white text-center py-2 px-4 rounded-xl mb-5 shadow-xs">
                  <p className="text-xs font-bold tracking-wider uppercase">In-Pharmacy Free Clinical Triage</p>
                  <h3 className="text-xl font-black">Scan to Speak with DrGodly</h3>
                </div>

                {/* QR Code Artwork Box */}
                <div className="bg-teal-50/60 border-2 border-dashed border-teal-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-44 h-44 bg-white p-3 rounded-xl border border-slate-200 shadow-md flex items-center justify-center relative group">
                    {/* Visual QR Code Pattern */}
                    <div className="w-full h-full bg-slate-900 rounded-lg p-2 flex flex-col justify-between text-white font-mono text-[9px] select-none">
                      <div className="flex justify-between">
                        <div className="w-8 h-8 border-4 border-white bg-teal-500 rounded-xs"></div>
                        <div className="w-8 h-8 border-4 border-white bg-teal-500 rounded-xs"></div>
                      </div>
                      <div className="flex items-center justify-center">
                        <span className="bg-teal-600 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest text-white shadow">
                          DRGODLY
                        </span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="w-8 h-8 border-4 border-white bg-teal-500 rounded-xs"></div>
                        <div className="w-6 h-6 border-2 border-white rounded-xs"></div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-slate-800 mt-4">
                    Universal One-Tap Action:
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Camera scan opens phone dialer directly with <span className="font-mono text-teal-700 font-bold">tel:+918069000000</span>
                  </p>
                </div>

                {/* Direct Dial Action Box */}
                <div className="mt-5 text-center space-y-2">
                  <a
                    href="tel:+918069000000"
                    className="w-full block bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-sm transition-colors text-center"
                  >
                    Tap Here to Open Dialer Now
                  </a>
                  <p className="text-[10px] text-slate-400">
                    DrGodly is an AI clinical assistant. It does not replace a doctor.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4-Step Patient Journey */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How DrGodly Works at the Pharmacy Counter
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Designed specifically for Bharat: zero app downloads, spoken natural language, and instant pharmacist coordination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-black flex items-center justify-center text-lg mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Scan Counter QR</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Customer scans the QR poster at the billing counter with any smartphone camera. A native <code className="text-teal-700 font-bold">tel:</code> link opens their dialer.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-black flex items-center justify-center text-lg mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">AI Voice Intake</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Patient talks naturally in Hindi, English, or regional languages. DrGodly collects demographic and SBAR clinical symptom history.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-black flex items-center justify-center text-lg mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">WhatsApp Report</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                As soon as the call ends, a structured clinical summary is delivered to the patient’s WhatsApp with recommended OTC care or lab tests.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-black flex items-center justify-center text-lg mb-4">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Pharmacist Action</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The licensed pharmacist reviews the AI report on their console, dispenses CDSCO-compliant OTC relief, or escalates to an RMP teleconsult.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Live Interactive Voice Intake Simulator */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <Badge variant="blue" className="mb-2">Interactive Demonstration</Badge>
                <h3 className="text-2xl font-black text-slate-900">
                  Live Clinical Intake & SBAR Engine Simulator
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Test how DrGodly processes spoken patient complaints and maps them to CDSCO 2026 formulary protocols in real time.
                </p>
              </div>

              {!simulating ? (
                <Button onClick={startSimulation} variant="primary" size="lg" className="shrink-0">
                  <Play className="w-4 h-4 fill-current" />
                  <span>Simulate Patient Intake Call</span>
                </Button>
              ) : (
                <Button onClick={resetSimulation} variant="outline" size="sm" className="shrink-0">
                  Reset Demo
                </Button>
              )}
            </div>

            {/* Interactive Simulation Console */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Box 1: Voice Call Audio Stream */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">
                      Telephony SIP Stream
                    </span>
                    <Badge variant={simulating ? "green" : "slate"}>
                      {simulating ? "CALL CONNECTED" : "STANDBY"}
                    </Badge>
                  </div>

                  <div className="py-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-teal-500/20 text-teal-400 mx-auto flex items-center justify-center mb-3">
                      <Volume2 className={`w-8 h-8 ${simulating ? "animate-bounce" : "opacity-40"}`} />
                    </div>
                    <p className="font-bold text-sm">
                      {simulating ? "Patient: Rahul Sharma (34M)" : "No Active Call"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {simulating ? "Speaking in Hindi / Connaught Place Counter" : "Scan QR code to initiate"}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800/80 rounded-xl p-3 text-xs text-slate-300 font-mono">
                  {simStep === 0 && "> Waiting for patient connection..."}
                  {simStep === 1 && "> \"Namaste DrGodly, mujhe 3 din se pet me tez jalan aur khatti dakar aa rahi hai...\""}
                  {simStep === 2 && "> AI Voice: \"Kya ulti me khoon ya nigalne me dard ho raha hai?\" -> Patient: \"Nahi, bilkul nahi.\""}
                  {simStep >= 3 && "> Call completed in 2m 14s. SBAR payload dispatched."}
                </div>
              </div>

              {/* Box 2: Real-time SBAR Clinical Extraction */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    SBAR Clinical Extraction
                  </span>
                  <Badge variant={simStep >= 2 ? "yellow" : "slate"}>
                    {simStep >= 2 ? "YELLOW TRIAGE" : "ANALYZING"}
                  </Badge>
                </div>

                <div className="py-4 space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 block">Situation (S):</span>
                    <p className="text-slate-600 mt-0.5">
                      {simStep >= 1 ? "34M with acute post-prandial retrosternal burning for 72 hrs." : "Pending audio stream..."}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 block">Background (B):</span>
                    <p className="text-slate-600 mt-0.5">
                      {simStep >= 2 ? "High intake of tea/street food; no NSAID abuse, non-smoker." : "Pending audio stream..."}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 block">Assessment (A):</span>
                    <p className="text-slate-600 mt-0.5">
                      {simStep >= 3 ? "Consistent with Acid Peptic Disease (GERD). Red flags negative." : "Pending audio stream..."}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 block">Recommendation (R):</span>
                    <p className="text-slate-600 mt-0.5">
                      {simStep >= 3 ? "CDSCO OTC Antacid suspension. Refer to RMP if >14 days." : "Pending audio stream..."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 3: WhatsApp Customer Output & Pharmacist Trigger */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      WhatsApp Report Dispatch
                    </span>
                    <Badge variant={simStep >= 4 ? "green" : "slate"}>
                      {simStep >= 4 ? "DELIVERED" : "QUEUED"}
                    </Badge>
                  </div>

                  <div className="py-3 text-xs text-slate-700 space-y-2">
                    <p className="font-bold text-emerald-900">
                      DrGodly Clinical Summary #INTAKE-0042
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Hi Rahul, your pharmacy intake is ready. Show this token to your pharmacist:
                    </p>
                    <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs shadow-2xs font-mono">
                      <p className="text-teal-700 font-bold">Recommended OTC:</p>
                      <p className="text-slate-800">Magaldrate + Simethicone 15ml post-meals</p>
                      <p className="text-slate-500 text-[10px] mt-1">Status: Pharmacist Verification Required</p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/pharmacy/workspace"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-xs"
                >
                  <span>Open Pharmacist Verification Console</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Feature Links Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <Link
              href="/doctors"
              className="p-6 rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all group bg-white"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                Verified NMC Doctors &rarr;
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Search verified general physicians, chest specialists, and gastroenterologists. Book instant teleconsultations with slot confirmation.
              </p>
            </Link>

            <Link
              href="/catalog"
              className="p-6 rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all group bg-white"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Pill className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                CDSCO-Compliant OTC Catalog &rarr;
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Explore safe oral rehydration salts, antacids, vitamins, and first aid. Complete schedule transparency with prescription gating.
              </p>
            </Link>

            <Link
              href="/pharmacy/workspace"
              className="p-6 rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all group bg-white"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Pharmacist 4-Column Console &rarr;
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Professional clinical triage workstation for licensed pharmacists to review SBAR summaries, check red flags, and sign off dispenses.
              </p>
            </Link>

          </div>
        </div>
      </section>

    </div>
  );
}
