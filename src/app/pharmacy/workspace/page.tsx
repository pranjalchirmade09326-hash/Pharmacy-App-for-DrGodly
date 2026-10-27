"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ClinicalWorkspace4Column } from "@/modules/client/pharmacy/ClinicalWorkspace4Column";
import { MOCK_INTAKES, PharmacyIntakeRecord } from "@/data/intakes.mock";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export default function PharmacyWorkspacePage() {
  const [selectedRecord, setSelectedRecord] = useState<PharmacyIntakeRecord>(
    MOCK_INTAKES[0]
  );
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const mappedIntake = {
    id: selectedRecord.intakeId,
    patient_name: selectedRecord.patient.name,
    patient_age: selectedRecord.patient.age,
    patient_gender: selectedRecord.patient.gender,
    patient_phone: selectedRecord.patient.phone,
    preferred_language: selectedRecord.patient.preferredLanguage,
    chief_complaint: selectedRecord.chiefComplaint,
    duration_days: 3,
    severity_score: selectedRecord.triageLevel === "RED" ? 9 : 4,
    triage_level: selectedRecord.triageLevel as any,
    symptoms: [{ name: selectedRecord.chiefComplaint }],
    red_flags_cleared: ["No hematemesis", "No melena", "No dysphagia"],
    red_flags_positive: selectedRecord.redFlagsDetected,
    differentials: selectedRecord.differentialDiagnoses.map((d) => ({
      condition_name: d.condition,
      icd10: d.icd10,
      confidence: d.probability,
    })),
    candidate_medications: selectedRecord.cdscoFormularyOptions.map((c, idx) => ({
      id: `med-${idx}`,
      name: c.genericName,
      dosage: c.dosage,
      schedule: c.schedule,
    })),
  };

  const handleDispense = (items: any[], notes: string) => {
    setAlertMessage(
      `Dispense Approved by RPh. Sandeep M. (Reg: DL-PH-2015-8812) for ${selectedRecord.patient.name}. Verified WhatsApp summary sent.`
    );
  };

  const handleEscalateDoctor = () => {
    setAlertMessage(
      `Teleconsultation Escalated! Patient ${selectedRecord.patient.name} linked with on-call NMC General Physician Dr. Rajesh K. Sharma.`
    );
  };

  const handleReferEmergency = () => {
    setAlertMessage(
      `EMERGENCY ALERT: 108 Ambulance protocol triggered for ${selectedRecord.patient.name}. Immediate transfer to nearest Cardiac ICU initiated.`
    );
  };

  return (
    <div className="flex-1 bg-slate-900 text-slate-100 flex flex-col">
      {/* Station Header & Queue Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white font-bold"
          >
            &larr; Exit Console
          </Link>
          <span className="text-slate-700">|</span>
          <div>
            <h2 className="text-sm font-black text-white">
              Pharmacist Clinical Triage Station
            </h2>
            <p className="text-[11px] text-teal-400 font-mono">
              Apollo Pharmacy, CP • Station ID: PHARM-DEL-041
            </p>
          </div>
        </div>

        {/* Horizontal Intake Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-bold uppercase mr-1">
            Active Queue:
          </span>
          {MOCK_INTAKES.map((intake) => {
            const isSelected = intake.intakeId === selectedRecord.intakeId;
            return (
              <button
                key={intake.intakeId}
                type="button"
                onClick={() => setSelectedRecord(intake)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-teal-600 text-white shadow-xs"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    intake.triageLevel === "RED"
                      ? "bg-red-400"
                      : intake.triageLevel === "ORANGE"
                      ? "bg-orange-400"
                      : "bg-amber-400"
                  }`}
                />
                <span>{intake.patient.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Alert Toast */}
      {alertMessage && (
        <div className="bg-teal-950 border-b border-teal-800 text-teal-200 px-6 py-2.5 text-xs font-bold flex items-center justify-between">
          <span>✓ {alertMessage}</span>
          <button
            type="button"
            onClick={() => setAlertMessage(null)}
            className="text-teal-400 hover:text-white font-mono"
          >
            ✕ Dismiss
          </button>
        </div>
      )}

      {/* 4-Column Clinical Layout */}
      <div className="flex-1 p-6">
        <ClinicalWorkspace4Column
          intake={mappedIntake}
          onDispense={handleDispense}
          onEscalateDoctor={handleEscalateDoctor}
          onReferEmergency={handleReferEmergency}
        />
      </div>
    </div>
  );
}
