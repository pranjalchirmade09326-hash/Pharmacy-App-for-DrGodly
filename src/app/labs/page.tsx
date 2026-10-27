"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  PhoneCall, 
  Star, 
  ShieldCheck, 
  Search, 
  Calendar, 
  Home, 
  CheckCircle2, 
  ArrowLeft 
} from "lucide-react";
import { MOCK_LABS, DiagnosticLab } from "@/data/labs.mock";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatINR } from "@/lib/utils";

export default function LabsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLab, setSelectedLab] = useState<DiagnosticLab | null>(null);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [isBookedModalOpen, setIsBookedModalOpen] = useState(false);

  const filteredLabs = MOCK_LABS.filter((lab) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      lab.name.toLowerCase().includes(q) ||
      lab.location.toLowerCase().includes(q) ||
      lab.popularTests.some((t) => t.testName.toLowerCase().includes(q))
    );
  });

  const handleBookTest = (lab: DiagnosticLab, testName: string) => {
    setSelectedLab(lab);
    setSelectedTest(testName);
    setIsBookedModalOpen(true);
  };

  return (
    <div className="flex-1 bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-teal-600">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Diagnostic Laboratories</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Nearby NABL-Accredited Diagnostic Laboratories
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Book investigations recommended in your DrGodly clinical intake report with home blood collection or counter walk-in.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs mb-6 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search test name (CBC, H. pylori, ECG, LFT, Lipid) or lab center..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 font-medium outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Labs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLabs.map((lab) => (
            <div
              key={lab.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Lab Name + Rating Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                      {lab.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1 text-teal-700 font-bold">
                        <MapPin className="w-3.5 h-3.5 text-teal-600" />
                        {lab.distanceKm} km away
                      </span>
                      <span>•</span>
                      <span className="text-slate-600 truncate">{lab.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{lab.rating}</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {lab.nablAccredited && (
                    <Badge variant="blue" size="sm">
                      NABL & CAP Accredited
                    </Badge>
                  )}
                  {lab.homeCollectionAvailable && (
                    <Badge variant="green" size="sm">
                      Home Sample Collection Available
                    </Badge>
                  )}
                </div>

                {/* Popular Investigations Table */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Available Clinical Investigations
                  </span>

                  <div className="space-y-2">
                    {lab.popularTests.map((test, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-teal-50/60 border border-slate-100 transition-colors text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-800">{test.testName}</p>
                          <p className="text-[10px] text-slate-500">TAT: {test.turnaroundTime}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900">
                            {formatINR(test.priceINR)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleBookTest(lab, test.testName)}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-2.5 py-1 rounded-md text-[11px] shadow-2xs transition-colors"
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lab Footer Phone */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <a
                  href={`tel:${lab.phone.replace(/[^0-9]/g, "")}`}
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-teal-700 font-semibold"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
                  <span>{lab.phone}</span>
                </a>

                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  Open Today till 08:00 PM
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Booking Confirmation Modal */}
      <Modal
        isOpen={isBookedModalOpen}
        onClose={() => setIsBookedModalOpen(false)}
        title="Diagnostic Requisition Booked!"
        description="Your lab appointment reference token has been scheduled."
      >
        <div className="space-y-4 text-xs">
          <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl text-center space-y-1">
            <p className="text-xs font-bold text-teal-800 uppercase">Lab Order Requisition Token</p>
            <p className="text-2xl font-black text-teal-900 tracking-wider">#LAB-2026-7810</p>
          </div>

          <div className="space-y-2 text-slate-600">
            <p><strong className="text-slate-800">Laboratory:</strong> {selectedLab?.name}</p>
            <p><strong className="text-slate-800">Investigation:</strong> {selectedTest}</p>
            <p><strong className="text-slate-800">Location:</strong> {selectedLab?.location}</p>
            <p><strong className="text-slate-800">Home Collection:</strong> Phlebotomist will contact for morning fasting slot</p>
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            Digital barcoded requisition and preparation instructions (fasting status) have been dispatched to your WhatsApp.
          </p>

          <Button
            onClick={() => setIsBookedModalOpen(false)}
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
