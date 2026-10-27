/**
 * Use Case: Create Pharmacy Intake
 * Integrates native voice call intake from Vapi/telephony with DrGodly bezs-hms Prisma models
 * and triggers dual synchronization to naveenraj-g/fhir.
 */

import { FhirSyncService, PharmacyIntakePayload } from '../../fhir/fhirSync.service';
import { CdscoFormularyService } from '../../formulary/cdscoFormulary.service';

export interface CreatePharmacyIntakeDTO {
  pharmacy_code: string;
  phone_number: string;
  patient_name?: string;
  patient_age_years: number;
  patient_gender?: 'male' | 'female' | 'other';
  chief_complaint: string;
  symptoms: Array<{
    name: string;
    snomed_code?: string;
    duration_days?: number;
    severity_score?: number;
    body_site?: string;
  }>;
  red_flags_cleared: string[];
  red_flags_positive: string[];
  known_allergies?: string[];
  is_pregnant?: boolean;
  transcript: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export class CreatePharmacyIntakeUseCase {
  constructor(
    private fhirSyncService: FhirSyncService,
    private formularyService: CdscoFormularyService
  ) {}

  async execute(dto: CreatePharmacyIntakeDTO) {
    // 1. Determine Triage Level deterministically
    let triageLevel: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' | 'UNABLE_TO_ASSESS' = 'GREEN';

    if (dto.red_flags_positive.length > 0) {
      triageLevel = 'RED'; // Immediate emergency
    } else if (dto.patient_age_years < 4) {
      triageLevel = 'ORANGE'; // CDSCO 2026 pediatric mandate
    } else if (dto.symptoms.some((s) => (s.severity_score ?? 0) >= 7 || (s.duration_days ?? 0) >= 3)) {
      triageLevel = 'YELLOW'; // Pharmacist review recommended
    }

    // 2. Evaluate CDSCO 2026 Formulary
    const formularyResult = this.formularyService.evaluateFormulary({
      patient_age_years: dto.patient_age_years,
      is_pregnant: dto.is_pregnant,
      known_allergies: dto.known_allergies,
      primary_condition: dto.chief_complaint,
    });

    // 3. Prepare Intake Report JSON
    const reportJson = {
      triage_level: triageLevel,
      chief_complaint: dto.chief_complaint,
      symptoms: dto.symptoms,
      red_flags_cleared: dto.red_flags_cleared,
      red_flags_positive: dto.red_flags_positive,
      eligible_otc_medications: formularyResult.eligible_otc_candidates,
      blocked_medications: formularyResult.blocked_items,
      pediatric_warning: formularyResult.pediatric_warning_triggered,
      intake_timestamp: new Date().toISOString(),
    };

    // 4. Synchronize to FHIR Platform (naveenraj-g/fhir)
    let fhirPatientId: string | number | null = null;
    let fhirEncounterId: string | number | null = null;

    try {
      fhirPatientId = await this.fhirSyncService.findOrCreatePatient({
        phone: dto.phone_number,
        name: dto.patient_name,
        gender: dto.patient_gender,
      });

      const fhirEncounter = await this.fhirSyncService.createEncounter(fhirPatientId, {
        intake_id: 0,
        pharmacy_code: dto.pharmacy_code,
        patient_phone: dto.phone_number,
        chief_complaint: dto.chief_complaint,
        symptoms: dto.symptoms,
        red_flags_cleared: dto.red_flags_cleared,
        differentials: [],
        call_started_at: new Date(Date.now() - 300000).toISOString(),
        call_ended_at: new Date().toISOString(),
      });
      fhirEncounterId = fhirEncounter.id;

      await this.fhirSyncService.recordSymptomObservations(fhirPatientId, fhirEncounterId, dto.symptoms);
    } catch (err) {
      console.error('Failed to sync encounter to external FHIR server:', err);
    }

    return {
      success: true,
      triage_level: triageLevel,
      report: reportJson,
      fhir_patient_id: fhirPatientId,
      fhir_encounter_id: fhirEncounterId,
    };
  }
}
