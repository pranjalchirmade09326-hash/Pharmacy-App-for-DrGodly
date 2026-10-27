"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Stethoscope, 
  Star, 
  Clock, 
  ShieldCheck, 
  Languages, 
  Filter, 
  RotateCcw,
  CalendarCheck,
  Building2
} from "lucide-react";
import { MOCK_DOCTORS, Doctor } from "@/data/doctors.mock";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";

const SPECIALTIES = [
  "All Specialties",
  "Internal Medicine / General Physician",
  "Pulmonology / Chest Specialist",
  "Gastroenterologist & Hepatologist",
  "Pediatrician / Child Specialist",
  "ENT / Ear, Nose & Throat Specialist",
  "Dermatologist / Skin Specialist",
];

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [maxFee, setMaxFee] = useState<number | "ALL">("ALL");
  const [availableTodayOnly, setAvailableTodayOnly] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("ALL");

  const filteredDoctors = useMemo(() => {
    return MOCK_DOCTORS.filter((doc) => {
      // Search text match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        doc.fullName.toLowerCase().includes(query) ||
        doc.specialization.toLowerCase().includes(query) ||
        doc.hospitalAffiliation.toLowerCase().includes(query) ||
        doc.languages.some((l) => l.toLowerCase().includes(query));

      // Specialty match
      const matchesSpecialty =
        selectedSpecialty === "All Specialties" ||
        doc.specialization.toLowerCase().includes(selectedSpecialty.toLowerCase());

      // Fee match
      const matchesFee =
        maxFee === "ALL" || doc.consultationFeeINR <= maxFee;

      // Available today match
      const matchesAvailability = !availableTodayOnly || doc.availableToday;

      // Language match
      const matchesLanguage =
        selectedLanguage === "ALL" || doc.languages.includes(selectedLanguage);

      return (
        matchesSearch &&
        matchesSpecialty &&
        matchesFee &&
        matchesAvailability &&
        matchesLanguage
      );
    });
  }, [searchQuery, selectedSpecialty, maxFee, availableTodayOnly, selectedLanguage]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedSpecialty("All Specialties");
    setMaxFee("ALL");
    setAvailableTodayOnly(false);
    setSelectedLanguage("ALL");
  };

  return (
    <div className="flex-1 bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumbs & Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Registered Doctors</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Consult NMC-Verified Tele-Doctors
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Book virtual consultations with certified Registered Medical Practitioners (RMPs) in compliance with the Telemedicine Practice Guidelines, 2020.
          </p>
        </div>

        {/* Layout: Sidebar Filter + Doctor Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Filter Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <Filter className="w-4 h-4 text-teal-600" />
                  Filter Practitioners
                </span>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[11px] font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>

              {/* Specialty Filter */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Specialization
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  {SPECIALTIES.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Max Consultation Fee */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Maximum Fee
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { label: "Any Fee", val: "ALL" },
                    { label: "≤ ₹500", val: 500 },
                    { label: "≤ ₹700", val: 700 },
                    { label: "≤ ₹900", val: 900 },
                  ].map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setMaxFee(option.val as any)}
                      className={`py-2 px-2.5 rounded-lg border text-center font-medium transition-colors ${
                        maxFee === option.val
                          ? "bg-teal-50 border-teal-600 text-teal-900 font-bold"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Spoken Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="ALL">All Languages (Hindi/Eng/Regional)</option>
                  <option value="Hindi">Hindi</option>
                  <option value="English">English</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Punjabi">Punjabi</option>
                </select>
              </div>

              {/* Available Today Checkbox */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={availableTodayOnly}
                    onChange={(e) => setAvailableTodayOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 cursor-pointer"
                  />
                  <span>Show Available Today Only</span>
                </label>
              </div>

            </div>

            {/* Telemedicine Compliance Box */}
            <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-4 text-xs text-teal-950 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-teal-900">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>NMC RMP Verification</span>
              </div>
              <p className="text-[11px] leading-relaxed text-teal-800">
                All clinicians listed on DrGodly possess verified State Medical Council registrations and adhere to digital prescription protocols.
              </p>
            </div>

          </div>

          {/* Right Column: Search Bar & Doctor Cards Grid */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Search Input Bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by doctor name, specialty, hospital, or symptoms (e.g. cough, chest pain, fever)..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
              />
            </div>

            {/* Results Count Banner */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <p>
                Showing <strong className="text-slate-800">{filteredDoctors.length}</strong> verified doctors
              </p>
              {availableTodayOnly && (
                <Badge variant="green" size="sm">
                  Filtered by Today Available
                </Badge>
              )}
            </div>

            {/* Doctors Cards Grid */}
            {filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Doctor Avatar + Name + Rating Header */}
                      <div className="flex items-start gap-3.5">
                        <img
                          src={doc.avatarUrl}
                          alt={doc.fullName}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h3 className="font-extrabold text-base text-slate-900 truncate">
                              {doc.fullName}
                            </h3>
                            <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 shrink-0">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span>{doc.rating}</span>
                            </div>
                          </div>

                          <p className="text-xs text-teal-700 font-semibold truncate mt-0.5">
                            {doc.specialization}
                          </p>

                          <p className="text-[11px] text-slate-500 truncate">
                            {doc.degrees.join(", ")} • {doc.experienceYears} yrs exp.
                          </p>
                        </div>
                      </div>

                      {/* Registration & Hospital Details */}
                      <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span className="truncate">{doc.nmcRegistrationNumber} ({doc.stateMedicalCouncil})</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{doc.hospitalAffiliation}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <Languages className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{doc.languages.join(", ")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer: Fee + Next Slot + Book CTA */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                          Consultation Fee
                        </span>
                        <span className="text-base font-extrabold text-slate-900">
                          {formatINR(doc.consultationFeeINR)}
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mb-1">
                          <Clock className="w-3 h-3" />
                          <span>{doc.nextAvailableSlot}</span>
                        </div>

                        <Link
                          href={`/doctors/${doc.id}`}
                          className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs shadow-2xs transition-colors"
                        >
                          <CalendarCheck className="w-3.5 h-3.5" />
                          <span>Select Slot</span>
                        </Link>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              /* Empty Search Results Fallback */
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  No registered doctors match your filter criteria
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing your search term, adjusting the fee range, or choosing &ldquo;All Specialties&rdquo;.
                </p>
                <Button onClick={resetFilters} variant="outline" size="sm">
                  Reset All Filters
                </Button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
