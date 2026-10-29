import uuid
from typing import Dict, Any
from datetime import datetime

class FHIRSyncService:
    """
    HL7 FHIR R4 Clinical Resource Generator for Indian ABDM/EHR Exchange.
    """

    @classmethod
    def generate_encounter_bundle(
        cls,
        encounter_id: str,
        patient_id: str,
        patient_name: str,
        patient_phone: str,
        chief_complaint: str,
        triage_level: str,
        sbar: Dict[str, Any],
    ) -> Dict[str, Any]:
        bundle_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat() + "Z"

        return {
            "resourceType": "Bundle",
            "id": bundle_id,
            "type": "document",
            "timestamp": timestamp,
            "entry": [
                {
                    "resource": {
                        "resourceType": "Patient",
                        "id": patient_id,
                        "name": [{"text": patient_name}],
                        "telecom": [{"system": "phone", "value": patient_phone}],
                    }
                },
                {
                    "resource": {
                        "resourceType": "Encounter",
                        "id": encounter_id,
                        "status": "finished",
                        "class": {
                            "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                            "code": "AMB",
                            "display": "ambulatory",
                        },
                        "subject": {"reference": f"Patient/{patient_id}"},
                        "reasonCode": [{"text": chief_complaint}],
                    }
                },
                {
                    "resource": {
                        "resourceType": "Observation",
                        "id": str(uuid.uuid4()),
                        "status": "final",
                        "code": {"text": "Clinical Triage Level"},
                        "valueString": triage_level,
                    }
                },
            ],
        }
