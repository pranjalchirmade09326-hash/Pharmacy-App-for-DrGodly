from typing import Dict, Any, List

class CDSCOFormularyService:
    """
    CDSCO 2026 Indian Drug Formulary and Schedule Enforcement Engine.
    Enforces Drugs & Cosmetics Act 1940 and Schedule H/H1 restrictions.
    """

    SCHEDULE_H_KEYWORDS = [
        "amoxicillin", "azithromycin", "cefixime", "ciprofloxacin", 
        "metronidazole", "pantoprazole injection", "alprazolam", "tramadol"
    ]

    SCHEDULE_H1_KEYWORDS = [
        "meropenem", "linezolid", "colistin", "faropenem", "levofloxacin"
    ]

    @classmethod
    def verify_medication_dispense(
        cls,
        generic_composition: str,
        patient_age: int,
        is_pregnant: bool,
    ) -> Dict[str, Any]:
        comp_lower = generic_composition.lower()

        # 1. Schedule H1 check
        for h1 in cls.SCHEDULE_H1_KEYWORDS:
            if h1 in comp_lower:
                return {
                    "can_dispense_otc": False,
                    "schedule": "SCHEDULE_H1",
                    "reason": f"Active ingredient '{h1}' is strictly Schedule H1. Mandatory RMP prescription and 3-year audit register entry required.",
                }

        # 2. Schedule H check
        for h in cls.SCHEDULE_H_KEYWORDS:
            if h in comp_lower:
                return {
                    "can_dispense_otc": False,
                    "schedule": "SCHEDULE_H",
                    "reason": f"Active ingredient '{h}' is Schedule H prescription-only drug. Cannot be dispensed as OTC.",
                }

        # 3. Pediatric FDC restriction
        if patient_age < 4 and ("chlorpheniramine" in comp_lower and "phenylephrine" in comp_lower):
            return {
                "can_dispense_otc": False,
                "schedule": "BANNED_FDC",
                "reason": "CDSCO 2026: Fixed-dose combination cold syrups are prohibited for pediatric patients under 4 years of age.",
            }

        # 4. Safe OTC
        return {
            "can_dispense_otc": True,
            "schedule": "OTC",
            "reason": "Approved for counter self-care dispensing under registered pharmacist counseling.",
        }
