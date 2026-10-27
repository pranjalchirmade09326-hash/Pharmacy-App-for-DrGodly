/**
 * DrGodly Pharmacy Assist — CDSCO 2026 Centrally Managed Medication Formulary Service
 * Strictly enforces Indian Drugs & Cosmetics Rules 1945 (2026 Gazette Updates)
 * Decoupled from LLMs: Medical rules and drug schedules are evaluated deterministically.
 */

export type DrugSchedule = 'OTC' | 'SCHEDULE_G' | 'SCHEDULE_H' | 'SCHEDULE_H1' | 'SCHEDULE_X';

export interface DrugItem {
  id: string;
  generic_name: string;
  brand_names: string[];
  dosage_form: 'TABLET' | 'SYRUP' | 'SUSPENSION' | 'GEL' | 'DROPS' | 'OINTMENT';
  strength: string;
  schedule: DrugSchedule;
  is_pediatric_banned: boolean;
  min_age_years: number;
  max_otc_duration_days: number;
  indications: string[];
  contraindicated_allergies: string[];
  pregnancy_safe: boolean;
  counseling_points: string[];
}

export interface FormularyEvaluationInput {
  patient_age_years: number;
  is_pregnant?: boolean;
  known_allergies?: string[];
  primary_condition: string; // e.g., 'Dyspepsia', 'Acute Cough', 'Acute Diarrhea'
}

export interface FormularyEvaluationResult {
  eligible_otc_candidates: DrugItem[];
  blocked_items: Array<{
    generic_name: string;
    reason: string;
    schedule: DrugSchedule;
  }>;
  pediatric_warning_triggered: boolean;
  escalation_required: boolean;
}

export class CdscoFormularyService {
  // Master Centralized Drug Registry (Reflecting current CDSCO 2026 notifications)
  private drugRegistry: DrugItem[] = [
    // 1. Antacids & Dyspepsia
    {
      id: 'DRUG-001',
      generic_name: 'Magaldrate + Simethicone',
      brand_names: ['Gelusil MPS', 'Mucaine', 'Digene'],
      dosage_form: 'SUSPENSION',
      strength: '400mg + 20mg / 5ml',
      schedule: 'OTC',
      is_pediatric_banned: false,
      min_age_years: 12,
      max_otc_duration_days: 3,
      indications: ['Dyspepsia', 'GERD', 'Gastritis', 'Heartburn'],
      contraindicated_allergies: ['Simethicone', 'Magnesium allergy'],
      pregnancy_safe: true,
      counseling_points: [
        'Take 10-20ml after meals and at bedtime',
        'Do not take within 2 hours of other oral medications',
        'Consult physician if symptoms persist >3 days',
      ],
    },
    // 2. Cough & Cold (Adult)
    {
      id: 'DRUG-002',
      generic_name: 'Diphenhydramine + Ammonium Chloride',
      brand_names: ['Benadryl Cough Syrup'],
      dosage_form: 'SYRUP',
      strength: '14.08mg + 138mg / 5ml',
      schedule: 'OTC',
      is_pediatric_banned: false,
      min_age_years: 6,
      max_otc_duration_days: 3,
      indications: ['Acute Cough', 'Allergic Cough'],
      contraindicated_allergies: ['Diphenhydramine'],
      pregnancy_safe: false,
      counseling_points: ['May cause drowsiness; avoid driving or operating machinery'],
    },
    // 3. CDSCO 2026 BANNED PEDIATRIC FORMULATION (Chlorpheniramine + Phenylephrine FDC)
    {
      id: 'DRUG-003',
      generic_name: 'Chlorpheniramine Maleate + Phenylephrine',
      brand_names: ['Maxtra', 'Solvin Cold', 'Sinarest AF'],
      dosage_form: 'DROPS',
      strength: '2mg + 5mg / ml',
      schedule: 'SCHEDULE_H', // Strictly prescription and prohibited under 4y
      is_pediatric_banned: true,
      min_age_years: 4, // Banned in children under 4 years by CDSCO 2026 mandate
      max_otc_duration_days: 0,
      indications: ['Pediatric Rhinitis'],
      contraindicated_allergies: [],
      pregnancy_safe: false,
      counseling_points: ['STRICTLY CONTRAINDICATED in children under 4 years of age'],
    },
    // 4. Acute Diarrhea Oral Rehydration
    {
      id: 'DRUG-004',
      generic_name: 'Oral Rehydration Salts (WHO Formula)',
      brand_names: ['Electral', 'Walyte', 'Prolyte'],
      dosage_form: 'SUSPENSION',
      strength: '21.8g Sachet for 1 Litre',
      schedule: 'OTC',
      is_pediatric_banned: false,
      min_age_years: 0,
      max_otc_duration_days: 2,
      indications: ['Acute Diarrhea', 'Dehydration', 'Gastroenteritis'],
      contraindicated_allergies: [],
      pregnancy_safe: true,
      counseling_points: [
        'Dissolve entire pack in exactly 1 litre of clean drinking water',
        'Consume within 24 hours of reconstitution',
      ],
    },
    // 5. Schedule H Antibiotic (Must NEVER be dispensed as OTC)
    {
      id: 'DRUG-005',
      generic_name: 'Amoxicillin + Clavulanic Acid',
      brand_names: ['Augmentin 625', 'Moxikind-CV'],
      dosage_form: 'TABLET',
      strength: '500mg + 125mg',
      schedule: 'SCHEDULE_H',
      is_pediatric_banned: false,
      min_age_years: 12,
      max_otc_duration_days: 0,
      indications: ['Bacterial Infections'],
      contraindicated_allergies: ['Penicillin', 'Amoxicillin'],
      pregnancy_safe: true,
      counseling_points: ['STRICTLY PRESCRIPTION ONLY: Dispensing without RMP prescription is illegal'],
    },
  ];

  /**
   * Evaluates candidate medications against CDSCO 2026 rules and patient context
   */
  evaluateFormulary(input: FormularyEvaluationInput): FormularyEvaluationResult {
    const eligible: DrugItem[] = [];
    const blocked: FormularyEvaluationResult['blocked_items'] = [];
    let pediatricWarning = false;
    let escalationRequired = false;

    // Check if patient is under 4 years old (CDSCO 2026 Pediatric Mandate)
    if (input.patient_age_years < 4) {
      pediatricWarning = true;
      escalationRequired = true;
    }

    const patientAllergies = (input.known_allergies || []).map((a) => a.toLowerCase().trim());

    for (const drug of this.drugRegistry) {
      // 1. Filter out Prescription-only drugs (Schedule H, H1, X)
      if (drug.schedule !== 'OTC') {
        blocked.push({
          generic_name: drug.generic_name,
          reason: `Prescription-only (${drug.schedule}). Cannot be dispensed over-the-counter under CDSCO rules.`,
          schedule: drug.schedule,
        });
        continue;
      }

      // 2. CDSCO Pediatric Restriction Enforcement
      if (input.patient_age_years < drug.min_age_years) {
        blocked.push({
          generic_name: drug.generic_name,
          reason: `Age restriction: Patient age (${input.patient_age_years}y) is below safe minimum (${drug.min_age_years}y).`,
          schedule: drug.schedule,
        });
        continue;
      }

      // 3. Pregnancy Safety Enforcement
      if (input.is_pregnant && !drug.pregnancy_safe) {
        blocked.push({
          generic_name: drug.generic_name,
          reason: 'Contraindicated during pregnancy.',
          schedule: drug.schedule,
        });
        continue;
      }

      // 4. Patient Allergy Cross-Check
      const allergyConflict = drug.contraindicated_allergies.some((allergy) =>
        patientAllergies.includes(allergy.toLowerCase())
      );
      if (allergyConflict) {
        blocked.push({
          generic_name: drug.generic_name,
          reason: `Known patient allergy conflict with [${drug.contraindicated_allergies.join(', ')}].`,
          schedule: drug.schedule,
        });
        continue;
      }

      // 5. Condition Matching
      const matchesIndication = drug.indications.some((ind) =>
        ind.toLowerCase().includes(input.primary_condition.toLowerCase())
      );
      if (matchesIndication) {
        eligible.push(drug);
      }
    }

    return {
      eligible_otc_candidates: eligible,
      blocked_items: blocked,
      pediatric_warning_triggered: pediatricWarning,
      escalation_required: escalationRequired,
    };
  }
}
