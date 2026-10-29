import { A2UISpec } from '../components/A2UIRenderer';

export interface ClinicalAgentState {
  patientName: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  duration: string;
  severity: number;
  redFlagsCleared: string[];
  activeRedFlag?: string;
  triageLevel: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';
}

export class AIAgentService {
  /**
   * Generates a declarative A2UI specification for the active clinical turn.
   */
  public static getTurnA2UISpec(
    turnIndex: number,
    state: ClinicalAgentState,
    language: string = 'Hindi'
  ): A2UISpec {
    const isHindi = language.toLowerCase().includes('hi');

    switch (turnIndex) {
      case 0:
        // Turn 1: Demographics
        return {
          rootId: 'card_demo',
          components: {
            card_demo: {
              id: 'card_demo',
              type: 'Card',
              children: ['badge_step', 'title_demo', 'chips_demo', 'btn_confirm_demo'],
            },
            badge_step: {
              id: 'badge_step',
              type: 'Badge',
              label: isHindi ? 'AI चरण १ • पहचान सत्यापन' : 'AI STEP 1 • PATIENT IDENTITY',
            },
            title_demo: {
              id: 'title_demo',
              type: 'Text',
              variant: 'title',
              content: isHindi
                ? 'कृपया अपने विवरण की पुष्टि करें:'
                : 'Please verify your demographics:',
            },
            chips_demo: {
              id: 'chips_demo',
              type: 'Row',
              children: ['chip_name', 'chip_age', 'chip_gender'],
            },
            chip_name: {
              id: 'chip_name',
              type: 'Button',
              variant: 'chip',
              selected: true,
              label: `👤 ${state.patientName}`,
              action: 'ACTION_CONFIRM_NAME',
            },
            chip_age: {
              id: 'chip_age',
              type: 'Button',
              variant: 'chip',
              selected: true,
              label: `🎂 ${state.age} Yrs`,
              action: 'ACTION_CONFIRM_AGE',
            },
            chip_gender: {
              id: 'chip_gender',
              type: 'Button',
              variant: 'chip',
              selected: true,
              label: `⚧ ${state.gender}`,
              action: 'ACTION_CONFIRM_GENDER',
            },
            btn_confirm_demo: {
              id: 'btn_confirm_demo',
              type: 'Button',
              variant: 'primary',
              label: isHindi ? 'विवरण सही हैं — आगे बढ़ें ›' : 'Details Verified — Continue ›',
              action: 'ACTION_PROCEED_NEXT',
            },
          },
        };

      case 1:
        // Turn 2: Chief Complaint & Symptoms
        return {
          rootId: 'card_complaint',
          components: {
            card_complaint: {
              id: 'card_complaint',
              type: 'Card',
              children: ['badge_step2', 'title_comp', 'row_complaints', 'btn_next_comp'],
            },
            badge_step2: {
              id: 'badge_step2',
              type: 'Badge',
              label: isHindi ? 'AI चरण २ • मुख्य लक्षण चयन' : 'AI STEP 2 • CHIEF COMPLAINT',
            },
            title_comp: {
              id: 'title_comp',
              type: 'Text',
              variant: 'title',
              content: isHindi
                ? 'मुख्य लक्षण का चयन करें (Tap to Select):'
                : 'Select the primary complaint (Tap to Select):',
            },
            row_complaints: {
              id: 'row_complaints',
              type: 'Row',
              children: ['opt_epigastric', 'opt_nausea', 'opt_bloat', 'opt_fever'],
            },
            opt_epigastric: {
              id: 'opt_epigastric',
              type: 'Button',
              variant: 'chip',
              selected: state.chiefComplaint.includes('Epigastric') || state.chiefComplaint.includes('Acidity'),
              label: isHindi ? '🔥 पेट में जलन / Acidity' : '🔥 Epigastric Burning',
              action: 'ACTION_SET_COMPLAINT',
              payload: { complaint: 'Epigastric burning & dyspepsia', duration: '2 Days' },
            },
            opt_nausea: {
              id: 'opt_nausea',
              type: 'Button',
              variant: 'chip',
              selected: state.chiefComplaint.includes('Nausea'),
              label: isHindi ? '🤢 उल्टी / मतली' : '🤢 Nausea & Vomiting',
              action: 'ACTION_SET_COMPLAINT',
              payload: { complaint: 'Nausea & acute dyspepsia', duration: '1 Day' },
            },
            opt_bloat: {
              id: 'opt_bloat',
              type: 'Button',
              variant: 'chip',
              selected: state.chiefComplaint.includes('Bloating'),
              label: isHindi ? '💨 अफारा / Bloating' : '💨 Gas & Bloating',
              action: 'ACTION_SET_COMPLAINT',
              payload: { complaint: 'Abdominal bloating & fullness', duration: '3 Days' },
            },
            opt_fever: {
              id: 'opt_fever',
              type: 'Button',
              variant: 'chip',
              selected: state.chiefComplaint.includes('Fever'),
              label: isHindi ? '🌡️ हल्का बुखार / Chills' : '🌡️ Low Grade Fever',
              action: 'ACTION_SET_COMPLAINT',
              payload: { complaint: 'Low grade fever with headache', duration: '2 Days' },
            },
            btn_next_comp: {
              id: 'btn_next_comp',
              type: 'Button',
              variant: 'primary',
              label: isHindi ? 'लक्षण सुरक्षित करें — आगे बढ़ें ›' : 'Confirm Symptoms — Next ›',
              action: 'ACTION_PROCEED_NEXT',
            },
          },
        };

      case 2:
        // Turn 3: Severity & Cardiac Red Flag Rule-Out
        return {
          rootId: 'card_severity',
          components: {
            card_severity: {
              id: 'card_severity',
              type: 'Card',
              children: ['badge_step3', 'title_sev', 'row_sev_chips', 'btn_redflag_chest', 'btn_next_sev'],
            },
            badge_step3: {
              id: 'badge_step3',
              type: 'Badge',
              label: isHindi ? 'AI चरण ३ • गंभीरता व रेड-फ्लैग जाँच' : 'AI STEP 3 • SEVERITY & RED-FLAGS',
            },
            title_sev: {
              id: 'title_sev',
              type: 'Text',
              variant: 'title',
              content: isHindi
                ? 'दर्द/तकलीफ की तीव्रता चुनें (१-१०):'
                : 'Rate discomfort severity (Scale 1–10):',
            },
            row_sev_chips: {
              id: 'row_sev_chips',
              type: 'Row',
              children: ['chip_mild', 'chip_mod', 'chip_sev'],
            },
            chip_mild: {
              id: 'chip_mild',
              type: 'Button',
              variant: 'chip',
              selected: state.severity <= 3,
              label: isHindi ? '🟢 हल्का (१-३/१०)' : '🟢 Mild (1–3/10)',
              action: 'ACTION_SET_SEVERITY',
              payload: { severity: 2 },
            },
            chip_mod: {
              id: 'chip_mod',
              type: 'Button',
              variant: 'chip',
              selected: state.severity >= 4 && state.severity <= 6,
              label: isHindi ? '🟡 मध्यम (४-६/१०)' : '🟡 Moderate (4–6/10)',
              action: 'ACTION_SET_SEVERITY',
              payload: { severity: 5 },
            },
            chip_sev: {
              id: 'chip_sev',
              type: 'Button',
              variant: 'chip',
              selected: state.severity >= 7,
              label: isHindi ? '🔴 गंभीर (७-१०/१०)' : '🔴 Severe (7–10/10)',
              action: 'ACTION_SET_SEVERITY',
              payload: { severity: 8 },
            },
            btn_redflag_chest: {
              id: 'btn_redflag_chest',
              type: 'Button',
              variant: 'danger',
              label: isHindi ? '🚨 हाँ, सीने या बाएँ हाथ में दर्द है' : '🚨 Yes, pain radiating to chest/left arm',
              action: 'ACTION_TRIGGER_REDFLAG',
              payload: { redFlag: 'Acute radiating chest/arm pain (Potential ACS)' },
            },
            btn_next_sev: {
              id: 'btn_next_sev',
              type: 'Button',
              variant: 'outline',
              label: isHindi ? 'सीने में दर्द नहीं है — सुरक्षित आगे बढ़ें ›' : 'No chest radiation — Continue safely ›',
              action: 'ACTION_PROCEED_NEXT',
            },
          },
        };

      case 3:
      default:
        // Turn 4: GI Bleeding Screening & Final SBAR Ready
        return {
          rootId: 'card_bleeding',
          components: {
            card_bleeding: {
              id: 'card_bleeding',
              type: 'Card',
              children: ['badge_step4', 'title_bleed', 'btn_no_bleed', 'btn_yes_bleed', 'btn_finalize_sbar'],
            },
            badge_step4: {
              id: 'badge_step4',
              type: 'Badge',
              label: isHindi ? 'AI चरण ४ • सुरक्षा स्क्रीनिंग' : 'AI STEP 4 • SAFETY SCREENING',
            },
            title_bleed: {
              id: 'title_bleed',
              type: 'Text',
              variant: 'title',
              content: isHindi
                ? 'क्या उल्टी में खून या काला मल (Melena) आया है?'
                : 'Any vomiting of blood or black tarry stools?',
            },
            btn_no_bleed: {
              id: 'btn_no_bleed',
              type: 'Button',
              variant: 'chip',
              selected: true,
              label: isHindi ? '✅ नहीं, कोई खून या काला मल नहीं है' : '✅ No, completely clear of GI bleeding',
              action: 'ACTION_CLEAR_REDFLAG',
              payload: { flagCleared: 'No hematemesis or melena' },
            },
            btn_yes_bleed: {
              id: 'btn_yes_bleed',
              type: 'Button',
              variant: 'danger',
              label: isHindi ? '🚨 हाँ, काला मल या उल्टी में खून है' : '🚨 Yes, noticing blood / dark stool',
              action: 'ACTION_TRIGGER_REDFLAG',
              payload: { redFlag: 'Suspected Upper GI Bleed (Melena / Hematemesis)' },
            },
            btn_finalize_sbar: {
              id: 'btn_finalize_sbar',
              type: 'Button',
              variant: 'primary',
              label: isHindi ? '📋 SBAR क्लिनिकल सारांश तैयार करें ✓' : '📋 Generate SBAR Clinical Note ✓',
              action: 'ACTION_FINALIZE_INTAKE',
            },
          },
        };
    }
  }

  /**
   * Generates Emergency Red Flag A2UI Specification
   */
  public static getEmergencyA2UISpec(reason: string, language: string = 'Hindi'): A2UISpec {
    const isHindi = language.toLowerCase().includes('hi');
    return {
      rootId: 'card_emergency',
      components: {
        card_emergency: {
          id: 'card_emergency',
          type: 'Card',
          variant: 'emergency',
          children: ['badge_emerg', 'text_warning', 'text_reason', 'btn_call_108', 'btn_counter_pharma'],
        },
        badge_emerg: {
          id: 'badge_emerg',
          type: 'Badge',
          variant: 'emergency',
          label: isHindi ? '🚨 तत्काल रेड-फ्लैग चेतावनी' : '🚨 CRITICAL RED-FLAG DETECTED',
        },
        text_warning: {
          id: 'text_warning',
          type: 'Text',
          variant: 'title',
          content: isHindi
            ? 'तुरंत चिकित्सीय सहायता आवश्यक है!'
            : 'Immediate Medical Attention Required!',
        },
        text_reason: {
          id: 'text_reason',
          type: 'Text',
          variant: 'emergency',
          content: reason,
        },
        btn_call_108: {
          id: 'btn_call_108',
          type: 'Button',
          variant: 'danger',
          label: isHindi ? '📞 108 एम्बुलेंस को तुरंत कॉल करें' : '📞 Dial 108 Emergency Ambulance',
          action: 'ACTION_DIAL_108',
        },
        btn_counter_pharma: {
          id: 'btn_counter_pharma',
          type: 'Button',
          variant: 'outline',
          label: isHindi ? 'फार्मासिस्ट को तुरंत केस सौंपें' : 'Handover to Counter Pharmacist (R.Ph)',
          action: 'ACTION_HANDOVER_PHARMACIST',
        },
      },
    };
  }
}
