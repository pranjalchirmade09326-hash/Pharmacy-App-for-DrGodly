from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, Optional, List

router = APIRouter(prefix="/a2ui", tags=["A2UI Protocol"])

class A2UIAgentTurnRequest(BaseModel):
    turn_index: int
    language: Optional[str] = "Hindi"
    patient_name: Optional[str] = "Rajesh Kumar"
    age: Optional[int] = 42
    chief_complaint: Optional[str] = "Epigastric burning & dyspepsia"
    severity: Optional[int] = 5

class A2UIAgentTurnResponse(BaseModel):
    turn_index: int
    rootId: str
    components: Dict[str, Any]
    active_prompt: str
    is_final_turn: bool

@router.post("/agent-turn", response_model=A2UIAgentTurnResponse)
async def generate_a2ui_agent_turn(payload: A2UIAgentTurnRequest):
    """
    Returns a declarative A2UI JSON payload for DrGodly clinical assistant dialog turns.
    Conforms to open A2UI declarative component catalog.
    """
    turn = payload.turn_index
    is_hi = "hi" in payload.language.lower()

    if turn == 0:
        return A2UIAgentTurnResponse(
            turn_index=0,
            active_prompt="Namaste! Main DrGodly AI clinical assistant hoon. Kripya apna naam aur umar bataiye.",
            is_final_turn=False,
            rootId="card_demo",
            components={
                "card_demo": {
                    "id": "card_demo",
                    "type": "Card",
                    "children": ["badge_step", "title_demo", "chips_demo", "btn_confirm"],
                },
                "badge_step": {
                    "id": "badge_step",
                    "type": "Badge",
                    "label": "AI STEP 1 • PATIENT IDENTITY" if not is_hi else "AI चरण १ • पहचान सत्यापन",
                },
                "title_demo": {
                    "id": "title_demo",
                    "type": "Text",
                    "variant": "title",
                    "content": f"Patient: {payload.patient_name}, {payload.age} Years",
                },
                "chips_demo": {
                    "id": "chips_demo",
                    "type": "Row",
                    "children": ["chip_1", "chip_2"],
                },
                "chip_1": {
                    "id": "chip_1",
                    "type": "Button",
                    "variant": "chip",
                    "selected": True,
                    "label": f"👤 {payload.patient_name}",
                    "action": "CONFIRM_IDENTITY",
                },
                "chip_2": {
                    "id": "chip_2",
                    "type": "Button",
                    "variant": "chip",
                    "selected": True,
                    "label": f"🎂 {payload.age} Yrs",
                    "action": "CONFIRM_AGE",
                },
                "btn_confirm": {
                    "id": "btn_confirm",
                    "type": "Button",
                    "variant": "primary",
                    "label": "Verified — Continue ›" if not is_hi else "विवरण सत्यापित — आगे बढ़ें ›",
                    "action": "ACTION_PROCEED_NEXT",
                },
            },
        )

    elif turn == 1:
        return A2UIAgentTurnResponse(
            turn_index=1,
            active_prompt="Aapko aaj kya takleef ho rahi hai aur ye kitne din se hai?",
            is_final_turn=False,
            rootId="card_complaint",
            components={
                "card_complaint": {
                    "id": "card_complaint",
                    "type": "Card",
                    "children": ["badge_step2", "title_comp", "row_complaints", "btn_next"],
                },
                "badge_step2": {
                    "id": "badge_step2",
                    "type": "Badge",
                    "label": "AI STEP 2 • SYMPTOM SELECTION" if not is_hi else "AI चरण २ • लक्षण चयन",
                },
                "title_comp": {
                    "id": "title_comp",
                    "type": "Text",
                    "variant": "title",
                    "content": "Select primary symptoms reported:" if not is_hi else "प्राथमिक लक्षण का चयन करें:",
                },
                "row_complaints": {
                    "id": "row_complaints",
                    "type": "Row",
                    "children": ["opt_1", "opt_2", "opt_3"],
                },
                "opt_1": {
                    "id": "opt_1",
                    "type": "Button",
                    "variant": "chip",
                    "selected": True,
                    "label": "🔥 Epigastric Burning & Acidity",
                    "action": "ACTION_SET_COMPLAINT",
                },
                "opt_2": {
                    "id": "opt_2",
                    "type": "Button",
                    "variant": "chip",
                    "label": "🤢 Nausea & Belching",
                    "action": "ACTION_SET_COMPLAINT",
                },
                "opt_3": {
                    "id": "opt_3",
                    "type": "Button",
                    "variant": "chip",
                    "label": "💨 Abdominal Fullness",
                    "action": "ACTION_SET_COMPLAINT",
                },
                "btn_next": {
                    "id": "btn_next",
                    "type": "Button",
                    "variant": "primary",
                    "label": "Next: Severity & Red Flags ›" if not is_hi else "आगे: तीव्रता व रेड-फ्लैग जाँच ›",
                    "action": "ACTION_PROCEED_NEXT",
                },
            },
        )

    elif turn == 2:
        return A2UIAgentTurnResponse(
            turn_index=2,
            active_prompt="1 se 10 ke scale par dard kitna tez hai? Aur kya dard seene ya baayein haath me jaa raha hai?",
            is_final_turn=False,
            rootId="card_sev",
            components={
                "card_sev": {
                    "id": "card_sev",
                    "type": "Card",
                    "children": ["badge_step3", "title_sev", "row_sev", "btn_cardiac_rf", "btn_sev_ok"],
                },
                "badge_step3": {
                    "id": "badge_step3",
                    "type": "Badge",
                    "label": "AI STEP 3 • TRIAGE & RED FLAGS",
                },
                "title_sev": {
                    "id": "title_sev",
                    "type": "Text",
                    "variant": "title",
                    "content": "Severity Assessment (1–10) & Cardiac Screening:",
                },
                "row_sev": {
                    "id": "row_sev",
                    "type": "Row",
                    "children": ["sev_mild", "sev_mod", "sev_high"],
                },
                "sev_mild": {"id": "sev_mild", "type": "Button", "variant": "chip", "label": "🟢 Mild (1–3)", "action": "SET_SEV_2"},
                "sev_mod": {"id": "sev_mod", "type": "Button", "variant": "chip", "selected": True, "label": "🟡 Moderate (4–6)", "action": "SET_SEV_5"},
                "sev_high": {"id": "sev_high", "type": "Button", "variant": "chip", "label": "🔴 Severe (7–10)", "action": "SET_SEV_8"},
                "btn_cardiac_rf": {
                    "id": "btn_cardiac_rf",
                    "type": "Button",
                    "variant": "danger",
                    "label": "🚨 Acute Chest / Arm Radiating Pain (Emergency)",
                    "action": "ACTION_TRIGGER_REDFLAG",
                },
                "btn_sev_ok": {
                    "id": "btn_sev_ok",
                    "type": "Button",
                    "variant": "outline",
                    "label": "No Chest Radiation — Clear ›",
                    "action": "ACTION_PROCEED_NEXT",
                },
            },
        )

    else:
        return A2UIAgentTurnResponse(
            turn_index=3,
            active_prompt="Kya ulti me khoon ya kala mal aane jaisi koi dikkat hui hai?",
            is_final_turn=True,
            rootId="card_final",
            components={
                "card_final": {
                    "id": "card_final",
                    "type": "Card",
                    "children": ["badge_step4", "title_final", "btn_no_bleed", "btn_yes_bleed", "btn_finish"],
                },
                "badge_step4": {
                    "id": "badge_step4",
                    "type": "Badge",
                    "label": "AI STEP 4 • GI SAFETY VERIFICATION",
                },
                "title_final": {
                    "id": "title_final",
                    "type": "Text",
                    "variant": "title",
                    "content": "Verify Absence of Upper GI Bleeding:",
                },
                "btn_no_bleed": {
                    "id": "btn_no_bleed",
                    "type": "Button",
                    "variant": "chip",
                    "selected": True,
                    "label": "✅ Negative for Melena or Hematemesis",
                    "action": "ACTION_CLEAR_REDFLAG",
                },
                "btn_yes_bleed": {
                    "id": "btn_yes_bleed",
                    "type": "Button",
                    "variant": "danger",
                    "label": "🚨 Presence of Coffee-Ground Vomit",
                    "action": "ACTION_TRIGGER_REDFLAG",
                },
                "btn_finish": {
                    "id": "btn_finish",
                    "type": "Button",
                    "variant": "primary",
                    "label": "📋 Generate SBAR Clinical Note & WhatsApp Token ✓",
                    "action": "ACTION_FINALIZE_INTAKE",
                },
            },
        )
