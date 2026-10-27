export interface DoctorSlot {
  slotId: string;
  date: string;
  time: string;
  period: 'morning' | 'afternoon' | 'evening';
  isBooked: boolean;
}

export interface Doctor {
  id: string;
  fullName: string;
  degrees: string[];
  nmcRegistrationNumber: string;
  stateMedicalCouncil: string;
  specialization: string;
  experienceYears: number;
  languages: string[];
  consultationFeeINR: number;
  rating: number;
  reviewCount: number;
  avatarUrl: string;
  hospitalAffiliation: string;
  aboutBio: string;
  availableToday: boolean;
  nextAvailableSlot: string;
  slots: DoctorSlot[];
}

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: "doc-del-001",
    fullName: "Dr. Rajesh K. Sharma",
    degrees: ["MBBS", "MD (General Medicine)"],
    nmcRegistrationNumber: "NMC-MCI-2014-48291",
    stateMedicalCouncil: "Delhi Medical Council",
    specialization: "Internal Medicine / General Physician",
    experienceYears: 14,
    languages: ["Hindi", "English", "Punjabi"],
    consultationFeeINR: 499,
    rating: 4.9,
    reviewCount: 1280,
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80",
    hospitalAffiliation: "Max Super Speciality Hospital & DrGodly Virtual Care",
    aboutBio: "Senior Physician with over 14 years clinical experience managing acute respiratory infections, acid peptic disorders, type 2 diabetes, and hypertension. Trained at Maulana Azad Medical College, New Delhi.",
    availableToday: true,
    nextAvailableSlot: "Today, 04:30 PM",
    slots: [
      { slotId: "s1-1", date: "2026-10-27", time: "04:30 PM", period: "afternoon", isBooked: false },
      { slotId: "s1-2", date: "2026-10-27", time: "05:00 PM", period: "evening", isBooked: false },
      { slotId: "s1-3", date: "2026-10-27", time: "05:30 PM", period: "evening", isBooked: true },
      { slotId: "s1-4", date: "2026-10-27", time: "06:00 PM", period: "evening", isBooked: false },
      { slotId: "s1-5", date: "2026-10-28", time: "10:00 AM", period: "morning", isBooked: false },
      { slotId: "s1-6", date: "2026-10-28", time: "11:30 AM", period: "morning", isBooked: false },
    ]
  },
  {
    id: "doc-blr-002",
    fullName: "Dr. Priya Sundaram",
    degrees: ["MBBS", "MD (Pulmonology)", "DNB (Respiratory)"],
    nmcRegistrationNumber: "NMC-KMC-2016-72910",
    stateMedicalCouncil: "Karnataka Medical Council",
    specialization: "Pulmonology / Chest Specialist",
    experienceYears: 11,
    languages: ["English", "Tamil", "Kannada", "Hindi"],
    consultationFeeINR: 650,
    rating: 4.95,
    reviewCount: 940,
    avatarUrl: "https://images.unsplash.com/photo-1594824813512-8f967f6e3c0b?w=300&auto=format&fit=crop&q=80",
    hospitalAffiliation: "Manipal Hospital, Bengaluru",
    aboutBio: "Specialist in acute and chronic lung conditions, allergic bronchitis, bronchial asthma, and post-viral cough syndromes. Recipient of European Respiratory Society Fellow Travel Award.",
    availableToday: true,
    nextAvailableSlot: "Today, 05:15 PM",
    slots: [
      { slotId: "s2-1", date: "2026-10-27", time: "05:15 PM", period: "evening", isBooked: false },
      { slotId: "s2-2", date: "2026-10-27", time: "06:00 PM", period: "evening", isBooked: false },
      { slotId: "s2-3", date: "2026-10-28", time: "09:30 AM", period: "morning", isBooked: false },
      { slotId: "s2-4", date: "2026-10-28", time: "10:15 AM", period: "morning", isBooked: true },
    ]
  },
  {
    id: "doc-mum-003",
    fullName: "Dr. Vikram Sethi",
    degrees: ["MBBS", "MD (General Medicine)", "DM (Gastro)"],
    nmcRegistrationNumber: "NMC-MMC-2010-33419",
    stateMedicalCouncil: "Maharashtra Medical Council",
    specialization: "Gastroenterologist & Hepatologist",
    experienceYears: 16,
    languages: ["Hindi", "Marathi", "English"],
    consultationFeeINR: 800,
    rating: 4.88,
    reviewCount: 1620,
    avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80",
    hospitalAffiliation: "Lilavati Hospital & Research Centre, Mumbai",
    aboutBio: "Senior Consultant Gastroenterologist. Expert in acid peptic disorders, irritable bowel syndrome, fatty liver disease, and inflammatory bowel diseases with 16+ years of clinical excellence.",
    availableToday: false,
    nextAvailableSlot: "Tomorrow, 10:00 AM",
    slots: [
      { slotId: "s3-1", date: "2026-10-28", time: "10:00 AM", period: "morning", isBooked: false },
      { slotId: "s3-2", date: "2026-10-28", time: "11:00 AM", period: "morning", isBooked: false },
      { slotId: "s3-3", date: "2026-10-28", time: "04:00 PM", period: "afternoon", isBooked: false },
    ]
  },
  {
    id: "doc-hyd-004",
    fullName: "Dr. Ananya Reddy",
    degrees: ["MBBS", "MD (Pediatrics)"],
    nmcRegistrationNumber: "NMC-TSMC-2018-91823",
    stateMedicalCouncil: "Telangana State Medical Council",
    specialization: "Pediatrician / Child Specialist",
    experienceYears: 9,
    languages: ["Telugu", "Hindi", "English"],
    consultationFeeINR: 500,
    rating: 4.92,
    reviewCount: 810,
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80",
    hospitalAffiliation: "Rainbow Children's Hospital, Hyderabad",
    aboutBio: "Pediatrician specializing in childhood respiratory infections, rational antibiotic stewardship (CDSCO 2026 pediatric anti-cold compliance), growth monitoring, and nutritional counseling.",
    availableToday: true,
    nextAvailableSlot: "Today, 06:30 PM",
    slots: [
      { slotId: "s4-1", date: "2026-10-27", time: "06:30 PM", period: "evening", isBooked: false },
      { slotId: "s4-2", date: "2026-10-27", time: "07:00 PM", period: "evening", isBooked: false },
      { slotId: "s4-3", date: "2026-10-28", time: "02:30 PM", period: "afternoon", isBooked: false },
    ]
  },
  {
    id: "doc-chn-005",
    fullName: "Dr. K. Swaminathan",
    degrees: ["MBBS", "MS (ENT)"],
    nmcRegistrationNumber: "NMC-TNMC-2012-55610",
    stateMedicalCouncil: "Tamil Nadu Medical Council",
    specialization: "ENT / Ear, Nose & Throat Specialist",
    experienceYears: 13,
    languages: ["Tamil", "English", "Hindi"],
    consultationFeeINR: 450,
    rating: 4.85,
    reviewCount: 730,
    avatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&auto=format&fit=crop&q=80",
    hospitalAffiliation: "Apollo Hospitals, Greams Road, Chennai",
    aboutBio: "ENT surgeon with extensive expertise in chronic sinusitis, allergic rhinitis, sore throat, otitis media, and tonsillar infections. Pioneer in minimally invasive coblation procedures.",
    availableToday: true,
    nextAvailableSlot: "Today, 04:00 PM",
    slots: [
      { slotId: "s5-1", date: "2026-10-27", time: "04:00 PM", period: "afternoon", isBooked: false },
      { slotId: "s5-2", date: "2026-10-27", time: "04:30 PM", period: "afternoon", isBooked: true },
      { slotId: "s5-3", date: "2026-10-27", time: "05:00 PM", period: "evening", isBooked: false },
    ]
  },
  {
    id: "doc-del-006",
    fullName: "Dr. Shalini Gupta",
    degrees: ["MBBS", "MD (Dermatology)"],
    nmcRegistrationNumber: "NMC-DMC-2015-66782",
    stateMedicalCouncil: "Delhi Medical Council",
    specialization: "Dermatologist / Skin Specialist",
    experienceYears: 10,
    languages: ["Hindi", "English"],
    consultationFeeINR: 600,
    rating: 4.91,
    reviewCount: 1150,
    avatarUrl: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=300&auto=format&fit=crop&q=80",
    hospitalAffiliation: "Fortis Memorial Research Institute, Gurugram",
    aboutBio: "Specialist in contact dermatitis, urticaria, acute drug eruptions, eczema, and fungal skin infections with a focus on topical safety and evidence-based clinical dermatology.",
    availableToday: false,
    nextAvailableSlot: "Tomorrow, 11:30 AM",
    slots: [
      { slotId: "s6-1", date: "2026-10-28", time: "11:30 AM", period: "morning", isBooked: false },
      { slotId: "s6-2", date: "2026-10-28", time: "12:00 PM", period: "morning", isBooked: false },
      { slotId: "s6-3", date: "2026-10-28", time: "03:30 PM", period: "afternoon", isBooked: false },
    ]
  }
];
