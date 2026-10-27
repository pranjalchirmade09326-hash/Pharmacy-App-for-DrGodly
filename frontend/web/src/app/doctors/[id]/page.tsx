"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { 
  Star, 
  Clock, 
  ShieldCheck, 
  Building2, 
  Languages, 
  CalendarCheck, 
  CheckCircle2, 
  ArrowLeft 
} from "lucide-react";
import { MOCK_DOCTORS, DoctorSlot } from "@/data/doctors.mock";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SlotChip } from "@/components/ui/SlotChip";
import { Modal } from "@/components/ui/Modal";
import { formatINR } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DoctorDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const doctor = MOCK_DOCTORS.find((d) => d.id === resolvedParams.id) || MOCK_DOCTORS[0];

  const [selectedDate, setSelectedDate] = useState("2026-10-27");
  const [selectedSlot, setSelectedSlot] = useState<DoctorSlot | null>(
    doctor.slots.find((s) => !s.isBooked) || null
  );
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const DATES = [
    { label: "Today, 27 Oct", val: "2026-10-27" },
    { label: "Tomorrow, 28 Oct", val: "2026-10-28" },
    { label: "Wed, 29 Oct", val: "2026-10-29" },
  ];

  const availableSlots = doctor.slots.filter(
    (s) => s.date === selectedDate || selectedDate === "2026-10-27"
  );

  return (
    <div className="flex-1 bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Doctors List</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-teal-600">Home</Link>
            <span>/</span>
            <Link href="/doctors" className="hover:text-teal-600">Doctors</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">{doctor.fullName}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Doctor Profile & Verification */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <img
                  src={doctor.avatarUrl}
                  alt={doctor.fullName}
                  className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 truncate">
                      {doctor.fullName}
                    </h1>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{doctor.rating}</span>
                      <span className="text-slate-400 font-normal">({doctor.reviewCount})</span>
                    </div>
                  </div>

                  <p className="text-sm text-teal-700 font-bold mt-0.5">
                    {doctor.specialization}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {doctor.degrees.join(", ")} • {doctor.experienceYears} Years Clinical Experience
                  </p>
                </div>
              </div>

              {/* NMC Registration Box */}
              <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-4 text-xs space-y-2 text-teal-950">
                <div className="flex items-center gap-2 font-bold text-teal-900">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>National Medical Commission (NMC) Verification</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-teal-900">
                  <p>Registration No: <strong className="font-mono">{doctor.nmcRegistrationNumber}</strong></p>
                  <p>State Council: <strong>{doctor.stateMedicalCouncil}</strong></p>
                  <p>Hospital: <strong>{doctor.hospitalAffiliation}</strong></p>
                  <p>Languages: <strong>{doctor.languages.join(", ")}</strong></p>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
                  Clinical Bio & Specialties
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {doctor.aboutBio}
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Slot Selection */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div>
                <h2 className="text-base font-black text-slate-900">
                  Select Appointment Slot
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click a slot chip below. Selected time will highlight in teal.
                </p>
              </div>

              {/* Date Tabs */}
              <div className="flex gap-2">
                {DATES.map((d) => (
                  <button
                    key={d.val}
                    type="button"
                    onClick={() => setSelectedDate(d.val)}
                    className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold border transition-colors ${
                      selectedDate === d.val
                        ? "bg-teal-50 border-teal-600 text-teal-900"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {/* Slots Grid */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Available Slots
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <SlotChip
                      key={slot.slotId}
                      time={slot.time}
                      period={slot.period}
                      isSelected={selectedSlot?.slotId === slot.slotId}
                      isBooked={slot.isBooked}
                      onSelect={() => setSelectedSlot(slot)}
                    />
                  ))}
                </div>
              </div>

              {/* Highlighted Selection Summary */}
              {selectedSlot ? (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-3.5 text-xs text-teal-900 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider">
                    Selected Appointment
                  </span>
                  <p className="text-sm font-black text-teal-950">
                    {selectedDate} at {selectedSlot.time}
                  </p>
                  <p className="text-[11px] text-teal-800">
                    Encrypted WebRTC consultation link delivered to your WhatsApp.
                  </p>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center text-xs text-slate-500">
                  Please tap a slot above to book your teleconsultation.
                </div>
              )}

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>RMP Consultation Fee</span>
                  <span className="font-semibold text-slate-900">{formatINR(doctor.consultationFeeINR)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Digital Prescription & Sync</span>
                  <span className="font-semibold text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Payable</span>
                  <span className="text-teal-700">{formatINR(doctor.consultationFeeINR)}</span>
                </div>
              </div>

              <Button
                onClick={() => setIsSuccessModalOpen(true)}
                disabled={!selectedSlot}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {selectedSlot
                  ? `Confirm Booking for ${selectedSlot.time}`
                  : "Select a Slot to Continue"}
              </Button>
            </div>

          </div>

        </div>

      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Teleconsultation Booked!"
        description="Your virtual appointment reference token has been generated."
      >
        <div className="space-y-4 text-xs">
          <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl text-center space-y-1">
            <p className="text-xs font-bold text-teal-800 uppercase">Consultation Token</p>
            <p className="text-2xl font-black text-teal-900 tracking-wider">#TELE-2026-904</p>
          </div>

          <div className="space-y-2 text-slate-600">
            <p><strong className="text-slate-800">Doctor:</strong> {doctor.fullName}</p>
            <p><strong className="text-slate-800">Date & Time:</strong> {selectedDate} at {selectedSlot?.time}</p>
            <p><strong className="text-slate-800">NMC Reg:</strong> {doctor.nmcRegistrationNumber}</p>
            <p><strong className="text-slate-800">Mode:</strong> In-Pharmacy Teleconsultation Booth / WhatsApp Video</p>
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            The doctor will call you at your appointed slot. Any prescriptions issued will be automatically synchronized with your pharmacy.
          </p>

          <Button
            onClick={() => setIsSuccessModalOpen(false)}
            variant="primary"
            className="w-full"
          >
            Done
          </Button>
        </div>
      </Modal>

    </div>
  );
}
