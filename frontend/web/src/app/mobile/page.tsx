"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Smartphone, 
  RotateCcw, 
  ExternalLink,
  PhoneCall,
  Search,
  Star,
  Clock,
  ShieldCheck,
  CalendarCheck,
  ShoppingCart,
  Pill,
  Activity,
  AlertTriangle
} from "lucide-react";
import { MOCK_DOCTORS } from "@/data/doctors.mock";
import { MOCK_PRODUCTS } from "@/data/products.mock";
import { MOCK_INTAKES } from "@/data/intakes.mock";
import { formatINR } from "@/lib/utils";

type MobileScreenTab = "HOME" | "DOCTORS" | "DETAIL" | "CATALOG" | "CHECKOUT" | "PHARMACIST";

export default function MobilePreviewPage() {
  const [activeScreen, setActiveScreen] = useState<MobileScreenTab>("HOME");
  const [selectedDoctorId, setSelectedDoctorId] = useState(MOCK_DOCTORS[0].id);
  const [selectedSlotId, setSelectedSlotId] = useState("s1-1");
  const [cart, setCart] = useState<{ [id: string]: number }>({ "prod-001": 2, "prod-002": 1 });
  const [simStep, setSimStep] = useState(0);

  const selectedDoctor = MOCK_DOCTORS.find((d) => d.id === selectedDoctorId) || MOCK_DOCTORS[0];

  const totalCartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartSubtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const prod = MOCK_PRODUCTS.find((p) => p.id === id);
    return sum + (prod ? prod.sellingPriceINR * qty : 0);
  }, 0);

  const addToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="flex-1 bg-slate-900 py-10 px-4 flex flex-col items-center">
      
      {/* Top Banner */}
      <div className="text-center max-w-xl mx-auto mb-6 text-white">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 text-xs font-bold mb-2">
          <Smartphone className="w-3.5 h-3.5" />
          <span>React Native Mobile UI Simulation Frame</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight">
          DrGodly Pharmacy Assist Mobile Screens
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Interactive live demonstration of the pure React Native mobile screens located in <code className="text-teal-300 font-mono">mobile/src/screens/</code>.
        </p>

        {/* Screen Picker Tabs */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-4">
          {[
            { key: "HOME" as MobileScreenTab, label: "1. Counter QR" },
            { key: "DOCTORS" as MobileScreenTab, label: "2. Doctor Search" },
            { key: "DETAIL" as MobileScreenTab, label: "3. Doctor Slots" },
            { key: "CATALOG" as MobileScreenTab, label: "4. OTC Catalog" },
            { key: "CHECKOUT" as MobileScreenTab, label: `5. Cart (${totalCartCount})` },
            { key: "PHARMACIST" as MobileScreenTab, label: "6. Pharmacist Console" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveScreen(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeScreen === tab.key
                  ? "bg-teal-500 text-slate-950 shadow-md"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* iPhone Device Frame */}
      <div className="w-full max-w-[390px] h-[780px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700 relative flex flex-col overflow-hidden">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-900 rounded-full z-50 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-teal-950 border border-teal-500/50"></div>
        </div>

        {/* Mobile App Viewport */}
        <div className="flex-1 bg-slate-50 rounded-[38px] overflow-hidden flex flex-col relative pt-7">
          
          {/* Emergency Alert Bar in Mobile */}
          <div className="bg-red-600 text-white px-3 py-1 text-[10px] font-bold flex items-center justify-between">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              <span>EMERGENCY: Chest pain / Trauma</span>
            </span>
            <a href="tel:108" className="bg-white text-red-700 px-1.5 py-0.5 rounded text-[9px] font-black">
              Call 108
            </a>
          </div>

          {/* Mobile Top Header */}
          <div className="bg-white px-3.5 py-2 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white font-black text-xs">
                ✝
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 leading-tight">DrGodly</p>
                <p className="text-[9px] text-slate-500">Apollo Pharmacy, CP</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveScreen("CHECKOUT")}
              className="relative p-1.5 rounded-md bg-slate-100 text-slate-700"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Screen Content Body */}
          <div className="flex-1 overflow-y-auto p-3 text-slate-900 text-xs">
            
            {/* SCREEN 1: HOME / COUNTER QR */}
            {activeScreen === "HOME" && (
              <div className="space-y-3">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                  <span className="text-[9px] font-bold uppercase bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded border border-teal-200">
                    In-Pharmacy Free Intake
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1">
                    Not feeling well? <span className="text-teal-600">Talk to DrGodly</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Scan the counter QR or tap call to explain your symptoms in Hindi/English.
                  </p>
                  
                  <a
                    href="tel:+918069000000"
                    className="mt-3 w-full bg-teal-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                    <span>Call DrGodly (+91-8069-000-000)</span>
                  </a>
                </div>

                {/* Simulated Physical QR Card */}
                <div className="bg-white p-4 rounded-2xl border-2 border-teal-600 text-center space-y-2">
                  <div className="w-28 h-28 bg-slate-900 rounded-xl p-2 mx-auto flex flex-col justify-between text-white font-mono text-[7px] select-none shadow-sm">
                    <div className="flex justify-between">
                      <div className="w-5 h-5 border-2 border-white bg-teal-400 rounded-xs"></div>
                      <div className="w-5 h-5 border-2 border-white bg-teal-400 rounded-xs"></div>
                    </div>
                    <span className="bg-teal-600 px-1 py-0.5 rounded text-[8px] font-bold">DRGODLY</span>
                    <div className="flex justify-between items-end">
                      <div className="w-5 h-5 border-2 border-white bg-teal-400 rounded-xs"></div>
                      <div className="w-4 h-4 border border-white rounded-xs"></div>
                    </div>
                  </div>
                  <p className="text-[11px] font-bold text-slate-800">
                    Universal 1-Tap tel: link
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Camera scan opens phone dialer with tel:+918069000000
                  </p>
                </div>

                {/* Live Simulator Widget */}
                <div className="bg-slate-900 text-white p-3 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-teal-400 font-bold">
                    <span>AI VOICE STREAM</span>
                    <span className="bg-teal-950 px-1.5 py-0.5 rounded border border-teal-800">
                      {simStep > 0 ? "LIVE CALL" : "STANDBY"}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 font-mono italic">
                    {simStep === 0 && "> Tap below to test speech-to-SBAR intake simulation."}
                    {simStep === 1 && "> \"Namaste, mujhe 3 din se pet me jalan ho rahi hai...\""}
                    {simStep === 2 && "> AI: \"Ulti me khoon?\" -> Patient: \"Nahi bilkul nahi.\""}
                    {simStep >= 3 && "> SBAR Extracted: Acid Peptic Disorder (GERD)."}
                  </p>

                  <button
                    type="button"
                    onClick={() => setSimStep((prev) => (prev >= 3 ? 0 : prev + 1))}
                    className="w-full bg-teal-500 text-slate-950 font-bold py-1.5 rounded-lg text-xs"
                  >
                    {simStep === 0 ? "Simulate Patient Voice Intake" : `Advance Step (${simStep}/3)`}
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 2: DOCTOR SEARCH */}
            {activeScreen === "DOCTORS" && (
              <div className="space-y-3">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search doctor, cough, stomach..."
                    className="w-full bg-transparent text-xs text-slate-800 outline-none font-medium"
                  />
                </div>

                <div className="space-y-2.5">
                  {MOCK_DOCTORS.slice(0, 3).map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => {
                        setSelectedDoctorId(doc.id);
                        setActiveScreen("DETAIL");
                      }}
                      className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs cursor-pointer hover:border-teal-400"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={doc.avatarUrl}
                          alt={doc.fullName}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-slate-900 truncate">{doc.fullName}</p>
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1 rounded">
                              ★ {doc.rating}
                            </span>
                          </div>
                          <p className="text-[11px] text-teal-700 font-semibold truncate">
                            {doc.specialization}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {doc.nmcRegistrationNumber}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="font-extrabold text-slate-900">
                          {formatINR(doc.consultationFeeINR)}
                        </span>
                        <span className="text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded">
                          Select Slot ›
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN 3: DOCTOR PROFILE & SLOTS */}
            {activeScreen === "DETAIL" && (
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={selectedDoctor.avatarUrl}
                      alt={selectedDoctor.fullName}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-extrabold text-sm text-slate-900">{selectedDoctor.fullName}</p>
                      <p className="text-[11px] text-teal-700 font-semibold">{selectedDoctor.specialization}</p>
                      <p className="text-[10px] text-slate-500">{selectedDoctor.degrees.join(", ")}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg text-[10px] text-slate-600 space-y-1">
                    <p>NMC Reg: <strong className="text-slate-800">{selectedDoctor.nmcRegistrationNumber}</strong></p>
                    <p>Council: <strong className="text-slate-800">{selectedDoctor.stateMedicalCouncil}</strong></p>
                    <p>Affiliation: <strong className="text-slate-800">{selectedDoctor.hospitalAffiliation}</strong></p>
                  </div>
                </div>

                {/* Interactive Slots Box */}
                <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-2">
                  <p className="font-bold text-slate-800 text-xs">Select Appointment Slot</p>
                  <p className="text-[10px] text-slate-500">Tapping slot highlights it in teal:</p>

                  <div className="grid grid-cols-2 gap-1.5">
                    {selectedDoctor.slots.map((slot) => {
                      const isSelected = selectedSlotId === slot.slotId;
                      return (
                        <button
                          key={slot.slotId}
                          type="button"
                          onClick={() => setSelectedSlotId(slot.slotId)}
                          className={`py-2 px-2.5 rounded-lg border text-[11px] font-bold text-center transition-all ${
                            isSelected
                              ? "bg-teal-50 border-teal-600 text-teal-900 ring-2 ring-teal-500/20"
                              : "bg-white border-slate-200 text-slate-700"
                          }`}
                        >
                          {isSelected ? `✓ ${slot.time}` : slot.time}
                        </button>
                      );
                    })}
                  </div>

                  <div className="bg-teal-50 p-2 rounded-lg border border-teal-200 text-[10px] text-teal-900 mt-2">
                    <p className="font-bold">Active Highlight:</p>
                    <p>Slot locked for 10 minutes. Video call link delivered to WhatsApp.</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveScreen("HOME")}
                    className="w-full bg-teal-600 text-white font-bold py-2 rounded-xl text-xs mt-2"
                  >
                    Confirm Teleconsult ({formatINR(selectedDoctor.consultationFeeINR)})
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 4: PRODUCT CATALOG */}
            {activeScreen === "CATALOG" && (
              <div className="space-y-2.5">
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200 text-[10px] text-amber-900">
                  🛡 <strong className="font-bold">CDSCO 2026:</strong> Schedule H items require prescription.
                </div>

                {MOCK_PRODUCTS.slice(0, 4).map((prod) => {
                  const qty = cart[prod.id] || 0;
                  return (
                    <div
                      key={prod.id}
                      className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-start gap-2.5 shadow-2xs"
                    >
                      <img
                        src={prod.imageUrl}
                        alt={prod.brandName}
                        className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${
                            prod.prescriptionRequired
                              ? "bg-purple-100 text-purple-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}>
                            {prod.prescriptionRequired ? "Rx Required" : "CDSCO OTC"}
                          </span>
                          <span className="font-black text-slate-900 text-xs">
                            {formatINR(prod.sellingPriceINR)}
                          </span>
                        </div>

                        <p className="font-bold text-slate-900 text-xs mt-0.5 truncate">{prod.brandName}</p>
                        <p className="text-[10px] text-slate-500 truncate">{prod.genericComposition}</p>

                        <div className="mt-2 flex justify-end">
                          {qty === 0 ? (
                            <button
                              type="button"
                              onClick={() => addToCart(prod.id)}
                              className="bg-teal-50 text-teal-800 border border-teal-600 px-2 py-0.5 rounded font-bold text-[10px]"
                            >
                              + Add to Cart
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 bg-teal-50 border border-teal-600 rounded px-1.5 py-0.5 text-xs font-bold text-teal-900">
                              <button type="button" onClick={() => updateCartQty(prod.id, -1)}>−</button>
                              <span>{qty}</span>
                              <button type="button" onClick={() => updateCartQty(prod.id, 1)}>+</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* SCREEN 5: CHECKOUT / CART */}
            {activeScreen === "CHECKOUT" && (
              <div className="space-y-3">
                <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-2">
                  <p className="font-bold text-slate-900 text-xs">Dispense Cart ({totalCartCount} items)</p>

                  {Object.entries(cart).map(([id, qty]) => {
                    const prod = MOCK_PRODUCTS.find((p) => p.id === id);
                    if (!prod) return null;
                    return (
                      <div key={id} className="flex justify-between items-center py-1.5 border-b border-slate-100 text-[11px]">
                        <div>
                          <p className="font-bold text-slate-900">{prod.brandName}</p>
                          <p className="text-[10px] text-slate-500">{formatINR(prod.sellingPriceINR)} x {qty}</p>
                        </div>
                        <span className="font-black text-slate-900">
                          {formatINR(prod.sellingPriceINR * qty)}
                        </span>
                      </div>
                    );
                  })}

                  {/* GST Breakdown */}
                  <div className="pt-2 space-y-1 text-[10px] text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatINR(cartSubtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (12%)</span>
                      <span>{formatINR(cartSubtotal * 0.12)}</span>
                    </div>
                    <div className="flex justify-between font-black text-slate-900 text-xs pt-1 border-t border-slate-100">
                      <span>Total Payable</span>
                      <span className="text-teal-700">{formatINR(cartSubtotal * 1.12)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      alert("Order Placed! Token #DISP-2026-8941 generated for counter pickup.");
                      setCart({});
                      setActiveScreen("HOME");
                    }}
                    className="w-full bg-teal-600 text-white font-bold py-2 rounded-xl text-xs mt-2"
                  >
                    Confirm & Dispense ({formatINR(cartSubtotal * 1.12)})
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 6: PHARMACIST WORKSPACE */}
            {activeScreen === "PHARMACIST" && (
              <div className="space-y-3">
                <div className="bg-slate-900 text-white p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs">RPh. Clinical Console</p>
                    <p className="text-[9px] text-slate-400">Reg: DL-PH-2015-8812</p>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded text-[9px] font-bold">
                    ONLINE
                  </span>
                </div>

                {MOCK_INTAKES.slice(0, 2).map((intake) => (
                  <div key={intake.intakeId} className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                        intake.triageLevel === "RED" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {intake.triageLevel} TRIAGE
                      </span>
                      <span className="text-[10px] text-slate-400">{intake.timestamp}</span>
                    </div>

                    <p className="font-bold text-slate-900 text-xs">{intake.patient.name} ({intake.patient.age}y)</p>
                    <p className="text-[11px] text-slate-600 italic">&ldquo;{intake.chiefComplaint}&rdquo;</p>

                    <div className="bg-slate-50 p-2 rounded text-[10px] text-slate-700">
                      <p><strong className="text-teal-800">SBAR Assessment:</strong> {intake.sbarSummary.assessment}</p>
                    </div>

                    <div className="flex gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => alert(`OTC Dispensed for ${intake.patient.name}`)}
                        className="flex-1 bg-emerald-600 text-white py-1.5 rounded-lg text-[10px] font-bold text-center"
                      >
                        Dispense OTC
                      </button>
                      <button
                        type="button"
                        onClick={() => alert(`Teleconsult scheduled for ${intake.patient.name}`)}
                        className="flex-1 bg-teal-600 text-white py-1.5 rounded-lg text-[10px] font-bold text-center"
                      >
                        Refer Doctor
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Mobile Bottom Tab Bar */}
          <div className="bg-white border-t border-slate-200 py-2 px-3 flex items-center justify-around text-center">
            <button
              type="button"
              onClick={() => setActiveScreen("HOME")}
              className={`flex flex-col items-center ${activeScreen === "HOME" ? "text-teal-600 font-bold" : "text-slate-400"}`}
            >
              <span className="text-sm">🏠</span>
              <span className="text-[9px]">Home</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveScreen("DOCTORS")}
              className={`flex flex-col items-center ${activeScreen === "DOCTORS" || activeScreen === "DETAIL" ? "text-teal-600 font-bold" : "text-slate-400"}`}
            >
              <span className="text-sm">🩺</span>
              <span className="text-[9px]">Doctors</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveScreen("CATALOG")}
              className={`flex flex-col items-center ${activeScreen === "CATALOG" ? "text-teal-600 font-bold" : "text-slate-400"}`}
            >
              <span className="text-sm">💊</span>
              <span className="text-[9px]">Catalog</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveScreen("CHECKOUT")}
              className={`flex flex-col items-center relative ${activeScreen === "CHECKOUT" ? "text-teal-600 font-bold" : "text-slate-400"}`}
            >
              <span className="text-sm">🛒</span>
              <span className="text-[9px]">Cart</span>
              {totalCartCount > 0 && (
                <span className="absolute -top-1 right-1 bg-teal-600 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveScreen("PHARMACIST")}
              className={`flex flex-col items-center ${activeScreen === "PHARMACIST" ? "text-teal-600 font-bold" : "text-slate-400"}`}
            >
              <span className="text-sm">🏥</span>
              <span className="text-[9px]">Console</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
