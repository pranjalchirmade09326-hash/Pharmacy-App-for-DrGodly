from typing import List, Dict, Any, Tuple
from app.models.models import PharmacyTriageLevel

class ClinicalTriageEngine:
    """
    Deterministic Clinical Triage & Red-Flag Screening Engine
    Compliant with CDSCO 2026 Guidelines and NMC Telemedicine Practice Guidelines.
    """

    CRITICAL_RED_FLAGS = [
        "chest pain with radiation",
        "chest pain",
        "shortness of breath at rest",
        "hematemesis (vomiting blood)",
        "vomiting blood",
        "melena (black tarry stool)",
        "severe sudden onset headache (thunderclap)",
        "unconscious or altered mental state",
        "stridor or severe respiratory distress",
    ]

    ORANGE_FLAGS = [
        "pediatric age under 4 years",
        "persistent high fever > 103 F for > 3 days",
        "inability to tolerate oral fluids",
        "severe localized abdominal tenderness (rebound)",
        "pregnancy with systemic fever or pain",
    ]

    @classmethod
    def evaluate_triage(
        cls,
        chief_complaint: str,
        duration: str,
        severity: int,
        age: int,
        gender: str,
        is_pregnant: bool,
        reported_red_flags: List[str],
    ) -> Tuple[PharmacyTriageLevel, List[str], Dict[str, Any]]:
        detected_red_flags = []
        complaint_lower = chief_complaint.lower() if chief_complaint else ""
        
        # 1. Check Explicit Critical Red Flags
        for rf in cls.CRITICAL_RED_FLAGS:
            if any(rf in flag.lower() for flag in reported_red_flags) or rf in complaint_lower:
                detected_red_flags.append(f"EMERGENCY: {rf.upper()}")

        if detected_red_flags:
            return (
                PharmacyTriageLevel.RED,
                detected_red_flags,
                cls.build_sbar(
                    patient_name="Patient",
                    age=age,
                    gender=gender,
                    complaint=chief_complaint,
                    duration=duration,
                    severity=severity,
                    triage="RED",
                    recommendation="IMMEDIATE 108 AMBULANCE DISPATCH. Do NOT dispense self-care OTC medication."
                )
            )

        # 2. Check Pediatric CDSCO 2026 Guardrail
        if age < 4 and ("cough" in complaint_lower or "cold" in complaint_lower):
            detected_red_flags.append("CDSCO 2026: FDC cold syrups (Chlorpheniramine + Phenylephrine) prohibited under 4 years.")
            return (
                PharmacyTriageLevel.ORANGE,
                detected_red_flags,
                cls.build_sbar(
                    patient_name="Pediatric Patient",
                    age=age,
                    gender=gender,
                    complaint=chief_complaint,
                    duration=duration,
                    severity=severity,
                    triage="ORANGE",
                    recommendation="Escalate to Registered Medical Practitioner (Pediatrician). Pediatric safe antipyretic only per kg bodyweight."
                )
            )

        # 3. Check High Severity or Pregnant patients
        if is_pregnant or severity >= 8:
            return (
                PharmacyTriageLevel.ORANGE,
                detected_red_flags,
                cls.build_sbar(
                    patient_name="Patient",
                    age=age,
                    gender=gender,
                    complaint=chief_complaint,
                    duration=duration,
                    severity=severity,
                    triage="ORANGE",
                    recommendation="Tele-consultation recommended with on-call NMC General Physician before dispensing."
                )
            )

        # 4. Moderate Complaints -> Pharmacist Review (YELLOW)
        if severity >= 4 or "3-5 days" in str(duration).lower():
            return (
                PharmacyTriageLevel.YELLOW,
                detected_red_flags,
                cls.build_sbar(
                    patient_name="Patient",
                    age=age,
                    gender=gender,
                    complaint=chief_complaint,
                    duration=duration,
                    severity=severity,
                    triage="YELLOW",
                    recommendation="Pharmacist clinical review and CDSCO-approved OTC dispensing."
                )
            )

        # 5. Routine Low-Risk -> GREEN
        return (
            PharmacyTriageLevel.GREEN,
            detected_red_flags,
            cls.build_sbar(
                patient_name="Patient",
                age=age,
                gender=gender,
                complaint=chief_complaint,
                duration=duration,
                severity=severity,
                triage="GREEN",
                recommendation="Safe routine OTC self-care support. Pharmacist counseling on hydration and rest."
            )
        )

    @staticmethod
    def build_sbar(
        patient_name: str,
        age: int,
        gender: str,
        complaint: str,
        duration: str,
        severity: int,
        triage: str,
        recommendation: str,
    ) -> Dict[str, str]:
        return {
            "situation": f"{age}{gender[0].upper() if gender else 'M'} presenting at pharmacy counter with {complaint} (Severity: {severity}/10).",
            "background": f"Symptoms ongoing for {duration}. Evaluated against CDSCO 2026 formulary protocols.",
            "assessment": f"Clinical triage assigned as {triage}. Red flags screened per emergency decision matrix.",
            "recommendation": recommendation,
        }
