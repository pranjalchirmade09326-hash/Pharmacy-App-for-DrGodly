/**
 * DrGodly Pharmacy Assist — FHIR R4 Synchronization Service
 * Interfaces directly with the centralized FastAPI FHIR R4 server
 * Base URL: process.env.FHIR_SERVER_URL || 'http://localhost:8001'
 */

export interface PharmacyIntakePayload {
  intake_id: number;
  pharmacy_code: string;
  patient_phone: string;
  patient_name?: string;
  patient_gender?: 'male' | 'female' | 'other';
  patient_dob?: string;
  chief_complaint: string;
  symptoms: Array<{
    name: string;
    snomed_code?: string;
    duration_days?: number;
    severity_score?: number;
    body_site?: string;
  }>;
  red_flags_cleared: string[];
  differentials: Array<{
    condition_name: string;
    icd10_code: string;
    confidence: string;
  }>;
  call_started_at: string;
  call_ended_at: string;
}

export class FhirSyncService {
  private baseUrl: string;
  private jwksToken?: string;

  constructor(baseUrl?: string, jwksToken?: string) {
    this.baseUrl = baseUrl || process.env.FHIR_SERVER_URL || 'http://localhost:8001';
    this.jwksToken = jwksToken;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/fhir+json',
      Accept: 'application/fhir+json',
      ...(options.headers as Record<string, string>),
    };

    if (this.jwksToken) {
      headers['Authorization'] = `Bearer ${this.jwksToken}`;
    }

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`FHIR Server Error [${response.status}] at ${path}: ${errorText}`);
    }
    return (await response.json()) as T;
  }

  /**
   * Find or Create Patient in FHIR R4 Server
   */
  async findOrCreatePatient(payload: {
    phone: string;
    name?: string;
    gender?: 'male' | 'female' | 'other';
    dob?: string;
  }): Promise<string | number> {
    // 1. Search by telephone identifier
    try {
      const searchResult = await this.request<any>(
        `/api/fhir/v1/Patient?telecom=${encodeURIComponent(payload.phone)}`
      );
      if (searchResult?.entry && searchResult.entry.length > 0) {
        return searchResult.entry[0].resource.id;
      }
    } catch {
      // If search yields empty or not found, proceed to create
    }

    // 2. Create new FHIR Patient
    const newPatient = await this.request<any>('/api/fhir/v1/Patient', {
      method: 'POST',
      body: JSON.stringify({
        resourceType: 'Patient',
        active: true,
        name: payload.name ? [{ use: 'official', text: payload.name }] : undefined,
        telecom: [{ system: 'phone', value: payload.phone, use: 'mobile' }],
        gender: payload.gender || 'unknown',
        birthDate: payload.dob,
      }),
    });

    return newPatient.id;
  }

  /**
   * Creates an Encounter in FHIR R4 Server for the pharmacy intake
   */
  async createEncounter(patientFhirId: string | number, intake: PharmacyIntakePayload): Promise<any> {
    return this.request<any>('/api/fhir/v1/Encounter', {
      method: 'POST',
      body: JSON.stringify({
        resourceType: 'Encounter',
        status: 'finished',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'AMB',
          display: 'Ambulatory Pharmacy Clinical Intake',
        },
        subject: {
          reference: `Patient/${patientFhirId}`,
        },
        serviceProvider: {
          display: `Pharmacy Code: ${intake.pharmacy_code}`,
        },
        period: {
          start: intake.call_started_at,
          end: intake.call_ended_at,
        },
        reasonCode: [
          {
            text: intake.chief_complaint,
          },
        ],
      }),
    });
  }

  /**
   * Syncs Extracted Symptoms as Observations in FHIR R4 Server
   */
  async recordSymptomObservations(
    patientFhirId: string | number,
    encounterFhirId: string | number,
    symptoms: PharmacyIntakePayload['symptoms']
  ): Promise<void> {
    for (const symptom of symptoms) {
      await this.request<any>('/api/fhir/v1/Observation', {
        method: 'POST',
        body: JSON.stringify({
          resourceType: 'Observation',
          status: 'final',
          category: [
            {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                  code: 'exam',
                  display: 'Patient Reported Symptom',
                },
              ],
            },
          ],
          code: {
            coding: symptom.snomed_code
              ? [{ system: 'http://snomed.info/sct', code: symptom.snomed_code, display: symptom.name }]
              : undefined,
            text: symptom.name,
          },
          subject: { reference: `Patient/${patientFhirId}` },
          encounter: { reference: `Encounter/${encounterFhirId}` },
          bodySite: symptom.body_site ? { text: symptom.body_site } : undefined,
          valueString: `Duration: ${symptom.duration_days ?? 'Unknown'} days | Severity: ${symptom.severity_score ?? 'Unspecified'}/10`,
        }),
      });
    }
  }

  /**
   * Syncs AI Differential Considerations as Provisional Conditions in FHIR R4 Server
   */
  async recordDifferentialConditions(
    patientFhirId: string | number,
    encounterFhirId: string | number,
    differentials: PharmacyIntakePayload['differentials']
  ): Promise<void> {
    for (const diff of differentials) {
      await this.request<any>('/api/fhir/v1/Condition', {
        method: 'POST',
        body: JSON.stringify({
          resourceType: 'Condition',
          clinicalStatus: {
            coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }],
          },
          verificationStatus: {
            coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status', code: 'provisional' }],
          },
          category: [
            {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/condition-category',
                  code: 'encounter-diagnosis',
                  display: 'Preliminary Pharmacy Differential',
                },
              ],
            },
          ],
          code: {
            coding: [
              {
                system: 'http://hl7.org/fhir/sid/icd-10',
                code: diff.icd10_code,
                display: diff.condition_name,
              },
            ],
            text: `${diff.condition_name} (Confidence: ${diff.confidence})`,
          },
          subject: { reference: `Patient/${patientFhirId}` },
          encounter: { reference: `Encounter/${encounterFhirId}` },
        }),
      });
    }
  }
}
