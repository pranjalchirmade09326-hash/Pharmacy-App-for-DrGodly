'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Video,
  Pill,
  FileText,
  User,
  Clock,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';

export interface ClinicalWorkspaceProps {
  intake: {
    id: number | string;
    patient_name: string;
    patient_age: number;
    patient_gender: string;
    patient_phone: string;
    preferred_language: string;
    chief_complaint: string;
    duration_days: number;
    severity_score: number;
    triage_level: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' | 'UNABLE_TO_ASSESS';
    symptoms: Array<{ name: string; details?: string }>;
    red_flags_cleared: string[];
    red_flags_positive: string[];
    differentials: Array<{ condition_name: string; icd10: string; confidence: string }>;
    candidate_medications: Array<{ id: string; name: string; dosage: string; schedule: string }>;
    audio_recording_url?: string;
  };
  onDispense: (items: any[], notes: string) => void;
  onEscalateDoctor: () => void;
  onReferEmergency: () => void;
}

export const ClinicalWorkspace4Column: React.FC<ClinicalWorkspaceProps> = ({
  intake,
  onDispense,
  onEscalateDoctor,
  onReferEmergency,
}) => {
  const [allergiesVerified, setAllergiesVerified] = useState(false);
  const [redFlagsVerified, setRedFlagsVerified] = useState(false);
  const [counselingNotes, setCounselingNotes] = useState('');
  const [selectedMeds, setSelectedMeds] = useState<string[]>([]);

  const triageBadgeStyles = {
    RED: 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400',
    ORANGE: 'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400',
    YELLOW: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
    GREEN: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
    UNABLE_TO_ASSESS: 'bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400',
  };

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground font-sans">
      {/* Top Bar Header */}
      <div className="flex items-center justify-between border-b px-6 py-3 bg-muted/30">
        <div className="flex items-center gap-3">
          <Stethoscope className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold">DrGodly Pharmacy Clinical Workspace</h2>
          <span className="text-xs text-muted-foreground font-mono">Encounter #{intake.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
              triageBadgeStyles[intake.triage_level]
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
            Triage: {intake.triage_level}
          </span>
        </div>
      </div>

      {/* 4-Column Clinical Review Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-b flex-1 overflow-auto">
        {/* Column 1: Patient Profile & Demographics */}
        <div className="p-5 flex flex-col gap-4 bg-card">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            <User className="h-4 w-4" />
            Patient Profile
          </div>
          <div>
            <h3 className="text-lg font-bold">{intake.patient_name}</h3>
            <p className="text-sm text-muted-foreground">
              {intake.patient_age} yrs • {intake.patient_gender} • {intake.patient_phone}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Preferred Language: <span className="font-medium text-foreground">{intake.preferred_language}</span>
            </p>
          </div>

          <div className="mt-2 p-3 rounded-lg border bg-muted/20">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <PhoneCall className="h-3.5 w-3.5" />
              Inbound Call Recording
            </span>
            {intake.audio_recording_url ? (
              <audio controls className="w-full mt-2 h-8" src={intake.audio_recording_url} />
            ) : (
              <p className="text-xs text-muted-foreground mt-1 italic">Audio playback synchronized via Vapi gateway</p>
            )}
          </div>
        </div>

        {/* Column 2: Clinical Summary & Timeline */}
        <div className="p-5 flex flex-col gap-4 bg-card">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            <Clock className="h-4 w-4" />
            Reported Clinical Presentation
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-muted-foreground">Chief Complaint</span>
              <p className="text-sm font-semibold">{intake.chief_complaint}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <span className="text-xs text-muted-foreground">Duration</span>
                <p className="text-sm font-medium">{intake.duration_days} days</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Severity</span>
                <p className="text-sm font-medium">{intake.severity_score} / 10</p>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <span className="text-xs font-semibold text-muted-foreground">Extracted Symptoms</span>
            <ul className="mt-1 space-y-1">
              {intake.symptoms.map((s, idx) => (
                <li key={idx} className="text-xs bg-muted/40 p-2 rounded flex justify-between">
                  <span>{s.name}</span>
                  <span className="text-muted-foreground">{s.details}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Column 3: AI Safety & Differentials */}
        <div className="p-5 flex flex-col gap-4 bg-card">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            <ShieldCheck className="h-4 w-4" />
            AI Safety & Differentials
          </div>

          <div>
            <span className="text-xs font-semibold text-muted-foreground">Red Flags Screened</span>
            <div className="mt-1 space-y-1">
              {intake.red_flags_cleared.map((rf, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{rf} — Cleared (Negative)</span>
                </div>
              ))}
              {intake.red_flags_positive.map((rf, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-semibold">
                  <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{rf} — POSITIVE (EMERGENCY)</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2">
            <span className="text-xs font-semibold text-muted-foreground">Considerations (Non-Diagnosis)</span>
            <ul className="mt-1 space-y-1">
              {intake.differentials.map((diff, idx) => (
                <li key={idx} className="text-xs p-2 rounded border bg-background flex items-center justify-between">
                  <span className="font-medium">{diff.condition_name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted">ICD-10: {diff.icd10}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Column 4: Pharmacist Action Panel */}
        <div className="p-5 flex flex-col gap-4 bg-muted/10">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            <Pill className="h-4 w-4" />
            Pharmacist Decision & Audit
          </div>

          {/* Mandatory Checkboxes */}
          <div className="space-y-2 p-3 rounded-lg border bg-background">
            <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allergiesVerified}
                onChange={(e) => setAllergiesVerified(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
              />
              <span className="font-medium">I have verified patient drug allergies</span>
            </label>
            <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
              <input
                type="checkbox"
                checked={redFlagsVerified}
                onChange={(e) => setRedFlagsVerified(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
              />
              <span className="font-medium">I have reviewed and cleared danger signs</span>
            </label>
          </div>

          {/* Candidate Medications */}
          <div>
            <span className="text-xs font-semibold text-muted-foreground">CDSCO Approved OTC Options</span>
            <div className="mt-1 space-y-1.5 max-h-36 overflow-auto">
              {intake.candidate_medications.map((med) => (
                <label
                  key={med.id}
                  className="flex items-center justify-between p-2 rounded border bg-background text-xs cursor-pointer hover:bg-muted/30"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedMeds.includes(med.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedMeds([...selectedMeds, med.id]);
                        else setSelectedMeds(selectedMeds.filter((id) => id !== med.id));
                      }}
                      className="rounded text-primary h-3.5 w-3.5"
                    />
                    <span className="font-medium">{med.name}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{med.dosage}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 mt-auto pt-4">
            <button
              onClick={() => onDispense(selectedMeds, counselingNotes)}
              disabled={!allergiesVerified || !redFlagsVerified}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
            >
              <Pill className="h-4 w-4" />
              Dispense Protocol OTC Care
            </button>

            <button
              onClick={onEscalateDoctor}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
            >
              <Video className="h-4 w-4" />
              1-Tap Doctor Teleconsultation (LiveKit)
            </button>

            <button
              onClick={onReferEmergency}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-600 hover:bg-red-500/10 text-xs font-medium transition-colors"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              Emergency Hospital Referral
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
