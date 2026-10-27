"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ShieldAlert, 
  CheckCircle, 
  MapPin, 
  FileText 
} from "lucide-react";
import { 
  getCartItems, 
  updateCartQuantity, 
  removeFromCart, 
  clearCart, 
  CartItem 
} from "@/lib/cartStore";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatINR } from "@/lib/utils";

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [patientName, setPatientName] = useState("Rahul Sharma");
  const [patientPhone, setPatientPhone] = useState("+91 98765 43210");
  const [patientAge, setPatientAge] = useState("34");
  const [patientGender, setPatientGender] = useState("MALE");
  const [pickupMode, setPickupMode] = useState<"STORE" | "DELIVERY">("STORE");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [prescriptionAttached, setPrescriptionAttached] = useState(false);

  useEffect(() => {
    function refresh() {
      setItems(getCartItems());
    }
    refresh();
    window.addEventListener("drgodly_cart_updated", refresh);
    return () => window.removeEventListener("drgodly_cart_updated", refresh);
  }, []);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotalINR = items.reduce((sum, i) => sum + i.unitPriceINR * i.quantity, 0);
  const cgstINR = Math.round(subtotalINR * 0.06 * 100) / 100;
  const sgstINR = Math.round(subtotalINR * 0.06 * 100) / 100;
  const totalAmountINR = Math.round((subtotalINR + cgstINR + sgstINR) * 100) / 100;

  const hasScheduleH = items.some((i) => i.prescriptionRequired);

  const handlePlaceOrder = () => {
    if (hasScheduleH && !prescriptionAttached) {
      alert("Please upload an authentic doctor prescription for Schedule H medicines.");
      return;
    }
    setIsSuccessModalOpen(true);
  };

  if (items.length === 0) {
    return (
      <div className="flex-1 bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Your cart is empty</h2>
          <p className="text-xs text-slate-500">
            Browse our CDSCO-compliant OTC supplements or consult a tele-doctor for prescriptions.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/catalog"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
            >
              Browse OTC Catalog
            </Link>
            <Link
              href="/doctors"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors"
            >
              Consult an RMP Tele-Doctor
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Dispense & Checkout</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Review Cart & Dispense Authorization
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Cart Items & Rx Gate */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-sm text-slate-800">
                  Cart Items ({cartCount})
                </span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-red-600 hover:text-red-800 font-bold"
                >
                  Clear Cart
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex items-start gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.brandName}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-900 truncate">
                          {item.brandName}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-500 truncate">
                        {item.genericComposition}
                      </p>

                      {item.prescriptionRequired && (
                        <div className="mt-1">
                          <Badge variant="purple" size="sm">
                            Schedule H • Prescription Mandatory
                          </Badge>
                        </div>
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-black text-slate-900 text-sm">
                          {formatINR(item.unitPriceINR * item.quantity)}
                        </span>

                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="p-1 hover:text-teal-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="p-1 hover:text-teal-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prescription Gate Banner */}
            {hasScheduleH && (
              <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 text-xs space-y-3">
                <div className="flex items-center gap-2 text-purple-900 font-bold">
                  <ShieldAlert className="w-5 h-5 text-purple-600" />
                  <span>CDSCO Schedule H Prescription Verification Gate</span>
                </div>
                <p className="text-purple-800 text-[11px] leading-relaxed">
                  Your cart contains Schedule H restricted medications. Under Indian law, these cannot be dispensed without an authentic Registered Medical Practitioner (RMP) prescription.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setPrescriptionAttached(!prescriptionAttached)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs border transition-colors ${
                      prescriptionAttached
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-purple-800 border-purple-300 hover:bg-purple-50"
                    }`}
                  >
                    {prescriptionAttached ? "✓ Prescription Attached (Ref: RX-2026-NMC-719)" : "📎 Attach Doctor Prescription"}
                  </button>
                  <Link
                    href="/doctors"
                    className="text-purple-700 underline font-bold hover:text-purple-900"
                  >
                    Consult Tele-Doctor for Instant Prescription &rarr;
                  </Link>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Patient Details & Tax Invoice */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Patient Form Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
                Patient Details for Dispense Record
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">WhatsApp / Mobile (+91)</label>
                  <input
                    type="text"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Age (Years)</label>
                    <input
                      type="number"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Gender</label>
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Fulfillment Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPickupMode("STORE")}
                      className={`p-2 rounded-lg border text-center font-bold transition-colors ${
                        pickupMode === "STORE"
                          ? "bg-teal-50 border-teal-600 text-teal-800"
                          : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      Counter Pickup
                    </button>
                    <button
                      type="button"
                      onClick={() => setPickupMode("DELIVERY")}
                      className={`p-2 rounded-lg border text-center font-bold transition-colors ${
                        pickupMode === "DELIVERY"
                          ? "bg-teal-50 border-teal-600 text-teal-800"
                          : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      Local Delivery
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* GST Invoice Breakdown Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
                Pharmacy GST 12% Invoice
              </h3>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">{formatINR(subtotalINR)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Central GST (CGST @ 6%)</span>
                  <span>{formatINR(cgstINR)}</span>
                </div>
                <div className="flex justify-between">
                  <span>State GST (SGST @ 6%)</span>
                  <span>{formatINR(sgstINR)}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Payable Amount</span>
                  <span className="text-teal-700">{formatINR(totalAmountINR)}</span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                variant="primary"
                size="lg"
                className="w-full"
              >
                Confirm & Dispense ({formatINR(totalAmountINR)})
              </Button>
            </div>

          </div>

        </div>

      </div>

      {/* Order Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Dispense Order Placed!"
        description="Your token is ready for pharmacy counter verification."
      >
        <div className="space-y-4 text-xs">
          <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl text-center space-y-1">
            <p className="text-xs font-bold text-teal-800 uppercase">Pickup Reference Token</p>
            <p className="text-2xl font-black text-teal-900 tracking-wider">#DISP-2026-8941</p>
          </div>

          <div className="space-y-2 text-slate-600">
            <p><strong className="text-slate-800">Patient:</strong> {patientName} ({patientAge}y)</p>
            <p><strong className="text-slate-800">Phone:</strong> {patientPhone}</p>
            <p><strong className="text-slate-800">Store:</strong> Apollo Pharmacy, Connaught Place</p>
            <p><strong className="text-slate-800">Total Paid:</strong> {formatINR(totalAmountINR)}</p>
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            Digital GST receipt and medication instructions have been dispatched to your WhatsApp.
          </p>

          <Button
            onClick={() => {
              setIsSuccessModalOpen(false);
              clearCart();
            }}
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
