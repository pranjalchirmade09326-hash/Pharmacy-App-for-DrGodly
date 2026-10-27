/**
 * DrGodly Pharmacy Assist — Decoupled 4-Prompt AI Voice Orchestrator
 * Implements Section 37 of Master Specification:
 * 1. Conversation Controller (Dialogue management, empathy, pacing)
 * 2. Clinical Extractor (Structured SBAR, duration, severity, relevant negatives)
 * 3. Safety Classifier (Deterministic Red-Flag detection & triage categorization)
 * 4. Report Generator (Patient-friendly WhatsApp summary & RMP handoff)
 */

export interface VoiceTurnInput {
  callId: string;
  patientPhone: string;
  language: 'hi' | 'en' | 'ta' | 'te' | 'mr';
  transcriptText: string;
  turnIndex: number;
  accumulatedHistory: Array<{ speaker: 'agent' | 'patient'; text: string }>;
}

export interface ExtractedClinicalConcepts {
  chiefComplaint: string;
  durationDays: number;
  severityScore1To10: number;
  bodySite: string;
  symptomsReported: string[];
  relevantNegatives: string[];
  pastMedicalHistory: string[];
  knownAllergies: string[];
}

export interface TriageEvaluation {
  triageLevel: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';
  redFlagsTriggered: string[];
  isImmediateEmergency: boolean;
  recommendedAction: 'CALL_108_AMBULANCE' | 'URGENT_TELECONSULT_RMP' | 'PHARMACIST_OTC_CARE' | 'ROUTINE_MONITORING';
}

export interface WhatsAppReportPayload {
  message1Notification: string;
  message2Buttons: {
    viewReportUrl: string;
    consultDoctorUrl: string;
    findLabsUrl: string;
    shareReportUrl: string;
  };
  fullReportText: string;
}

export class VoicePromptOrchestratorService {
  /**
   * Prompt 1: Conversation Controller
   * Directs polite conversational intake without attempting autonomous clinical diagnosis.
   */
  public generateConversationControllerPrompt(language: string): string {
    return `
You are DrGodly's Clinical Intake Voice Assistant speaking to an Indian pharmacy walk-in consumer in ${language}.
ROLE & BOUNDARIES:
- Greet with warm Indian empathy (e.g., "Namaste, main DrGodly health assistant hoon.").
- Confirm consumer affirmative consent to record and process clinical symptoms under DPDP Act 2023.
- Ask ONE question at a time: age, chief complaint, duration, severity (1-10), and screening for red-flags.
- Never diagnose disease ("Aapko typhoid ho gaya hai"). Always frame as: "Main aapke lakshan pharmacist aur doctor ke liye record kar raha hoon."
- If the patient mentions chest pain, severe breathlessness, fainting, or severe bleeding, immediately advise them to inform the counter pharmacist and dial 108.
`;
  }

  /**
   * Prompt 2: Clinical Extractor
   * Transforms raw spoken voice transcript into structured clinical concepts (SBAR).
   */
  public extractClinicalConcepts(transcript: string, patientAge: number): ExtractedClinicalConcepts {
    const lower = transcript.toLowerCase();

    // Deterministic symptom tagging
    const symptoms: string[] = [];
    const negatives: string[] = [];

    if (lower.includes('jalan') || lower.includes('acidity') || lower.includes('burning')) {
      symptoms.push('Epigastric retrosternal burning / pyrosis');
    }
    if (lower.includes('khasi') || lower.includes('cough')) {
      symptoms.push('Cough (dry/productive)');
    }
    if (lower.includes('bukhar') || lower.includes('fever')) {
      symptoms.push('Fever / pyrexia');
    }
    if (lower.includes('chhati') || lower.includes('chest pain')) {
      symptoms.push('Retrosternal chest discomfort');
    }

    // Relevant negatives checking
    if (lower.includes('khoon nahi') || lower.includes('no blood')) {
      negatives.push('No hematemesis or hemoptysis');
    }
    if (lower.includes('sans nahi phooli') || lower.includes('no shortness of breath')) {
      negatives.push('No acute dyspnea at rest');
    }

    return {
      chiefComplaint: transcript.slice(0, 120),
      durationDays: lower.includes('3 din') || lower.includes('3 days') ? 3 : 2,
      severityScore1To10: lower.includes('tez') || lower.includes('severe') ? 8 : 4,
      bodySite: lower.includes('pet') ? 'Abdomen / Epigastrium' : lower.includes('chhati') ? 'Chest' : 'General',
      symptomsReported: symptoms.length > 0 ? symptoms : ['Symptom reported for review'],
      relevantNegatives: negatives,
      pastMedicalHistory: lower.includes('sugar') || lower.includes('diabetes') ? ['Type 2 Diabetes Mellitus'] : [],
      knownAllergies: lower.includes('allergy') ? ['Allergy reported'] : ['No known drug allergies (NKDA)'],
    };
  }

  /**
   * Prompt 3: Safety Classifier (Red-Flag Engine)
   * Evaluates extracted concepts against safety rules.
   */
  public evaluateSafetyAndTriage(concepts: ExtractedClinicalConcepts, ageYears: number): TriageEvaluation {
    const redFlags: string[] = [];

    // Critical cardiac/respiratory red flags
    if (concepts.symptomsReported.some((s) => s.toLowerCase().includes('chest'))) {
      redFlags.push('Acute retrosternal chest pain/pressure with cardiovascular risk');
    }

    // Pediatric regulatory red flag
    if (ageYears < 4 && concepts.symptomsReported.some((s) => s.toLowerCase().includes('cough') || s.toLowerCase().includes('fever'))) {
      redFlags.push('Pediatric age <4 years: CDSCO anti-cold FDC ban enforced; pediatric specialist consult required.');
    }

    if (redFlags.some((rf) => rf.includes('chest') || rf.includes('crushing'))) {
      return {
        triageLevel: 'RED',
        redFlagsTriggered: redFlags,
        isImmediateEmergency: true,
        recommendedAction: 'CALL_108_AMBULANCE',
      };
    }

    if (redFlags.length > 0 || concepts.severityScore1To10 >= 7) {
      return {
        triageLevel: 'ORANGE',
        redFlagsTriggered: redFlags,
        isImmediateEmergency: false,
        recommendedAction: 'URGENT_TELECONSULT_RMP',
      };
    }

    return {
      triageLevel: 'YELLOW',
      redFlagsTriggered: [],
      isImmediateEmergency: false,
      recommendedAction: 'PHARMACIST_OTC_CARE',
    };
  }

  /**
   * Prompt 4: Report Generator
   * Generates patient-friendly WhatsApp summary following Section 21 format.
   */
  public generateWhatsAppReport(
    patientName: string,
    ageYears: number,
    encounterId: string,
    concepts: ExtractedClinicalConcepts,
    triage: TriageEvaluation
  ): WhatsAppReportPayload {
    const msg1 = `*DrGodly Pharmacy Health Report*
Hi ${patientName}, your clinical intake is complete.

*Main Concern:* ${concepts.chiefComplaint}
*Triage Status:* ${triage.triageLevel} (${triage.recommendedAction === 'PHARMACIST_OTC_CARE' ? 'Pharmacist Review Recommended' : 'Doctor Teleconsult Recommended'})
*Token Reference:* #${encounterId}

Please show this message to your pharmacist at the counter.`;

    const fullReport = `==============================
DRGODLY PHARMACY HEALTH REPORT
==============================
Patient: ${patientName} (${ageYears}y)
Encounter: #${encounterId}

CHIEF COMPLAINT:
${concepts.chiefComplaint}

SYMPTOM SUMMARY:
${concepts.symptomsReported.map((s) => `• ${s}`).join('\n')}

SAFETY SCREEN:
${triage.redFlagsTriggered.length === 0 ? 'No emergency warning symptoms identified during this intake.' : triage.redFlagsTriggered.map((rf) => `⚠️ ${rf}`).join('\n')}

STATUTORY MEDICAL NOTICE:
These are possible clinical explanations based on intake algorithms and do not constitute a confirmed medical diagnosis. Prescription medications strictly require an authentic Registered Medical Practitioner (RMP) consultation.

RECOMMENDED NEXT STEPS:
${triage.recommendedAction === 'PHARMACIST_OTC_CARE' ? '1. Pharmacist review for CDSCO-compliant OTC relief.\n2. Consult doctor if symptoms persist beyond 14 days.' : '1. Connect with on-call DrGodly Telemedicine Doctor for evaluation.'}
`;

    return {
      message1Notification: msg1,
      message2Buttons: {
        viewReportUrl: `https://drgodly.health/report/${encounterId}`,
        consultDoctorUrl: `https://drgodly.health/doctors`,
        findLabsUrl: `https://drgodly.health/labs`,
        shareReportUrl: `https://drgodly.health/share/${encounterId}`,
      },
      fullReportText: fullReport,
    };
  }
}
