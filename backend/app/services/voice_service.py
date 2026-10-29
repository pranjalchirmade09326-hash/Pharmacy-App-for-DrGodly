import uuid
from typing import Dict, Any, List
from datetime import datetime

class VoiceOrchestratorService:
    """
    Manages conversational dialog turns and WhatsApp clinical summary dispatch.
    """

    DIALOG_TURNS = [
        {
            "turn": 1,
            "topic": "Demographics Verification",
            "prompt_hi": "Namaste! Main DrGodly AI clinical assistant hoon. Kripya apna naam aur umar bataiye.",
            "prompt_en": "Hello! I am DrGodly clinical assistant. Please state your name and age.",
        },
        {
            "turn": 2,
            "topic": "Chief Complaint & Duration",
            "prompt_hi": "Aapko aaj kya takleef ho rahi hai aur ye kitne din se hai?",
            "prompt_en": "What symptoms are you experiencing today and for how many days?",
        },
        {
            "turn": 3,
            "topic": "Severity & Red Flag Rule-Out",
            "prompt_hi": "1 se 10 ke scale par dard kitna tez hai? Aur kya dard seene ya baayein haath me jaa raha hai?",
            "prompt_en": "On a scale of 1 to 10, how severe is the discomfort? Is there any chest or left arm pain?",
        },
        {
            "turn": 4,
            "topic": "GI Bleeding Screening",
            "prompt_hi": "Kya ulti me khoon ya kala mal aane jaisi koi dikkat hui hai?",
            "prompt_en": "Have you noticed any vomiting with blood or black tarry stools?",
        },
    ]

    @classmethod
    def get_turn_prompt(cls, turn_index: int, language: str = "hi") -> Dict[str, Any]:
        idx = max(0, min(turn_index, len(cls.DIALOG_TURNS) - 1))
        turn_data = cls.DIALOG_TURNS[idx]
        return {
            "turn": turn_data["turn"],
            "topic": turn_data["topic"],
            "prompt": turn_data["prompt_hi"] if language.lower() in ["hi", "hindi"] else turn_data["prompt_en"],
            "is_final": idx == len(cls.DIALOG_TURNS) - 1,
        }

    @classmethod
    def generate_whatsapp_dispatch(
        cls,
        patient_phone: str,
        encounter_number: str,
        sbar: Dict[str, Any],
        triage_level: str,
    ) -> Dict[str, Any]:
        token = f"#INTAKE-{encounter_number.split('-')[-1] if '-' in encounter_number else '0042'}"
        return {
            "patient_phone": patient_phone,
            "token_number": token,
            "triage_level": triage_level,
            "sbar_summary": sbar,
            "message_text": (
                f"🏥 *DrGodly Counter Intake Summary*\n"
                f"Token: *{token}*\nTriage: *{triage_level}*\n\n"
                f"• *Situation:* {sbar.get('situation')}\n"
                f"• *Assessment:* {sbar.get('assessment')}\n"
                f"• *Recommendation:* {sbar.get('recommendation')}\n\n"
                f"_Please present this token at the pharmacy counter for safe dispensing._"
            ),
            "dispatched_at": datetime.utcnow().isoformat(),
        }
