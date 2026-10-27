"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Cross, 
  MapPin, 
  ShoppingCart, 
  Stethoscope, 
  Pill, 
  Activity, 
  Menu, 
  X,
  QrCode
} from "lucide-react";
import { getCartItems } from "@/lib/cartStore";

const PHARMACY_STORES = [
  { id: "PHARM-DEL-041", name: "Apollo Pharmacy — Connaught Place, New Delhi" },
  { id: "PHARM-BLR-012", name: "MedPlus — Indiranagar, Bengaluru" },
  { id: "PHARM-MUM-088", name: "Wellness Forever — Andheri West, Mumbai" },
];

export function Navbar() {
  const pathname = usePathname();
  const [selectedStore, setSelectedStore] = useState(PHARMACY_STORES[0].id);
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    function refreshCart() {
      const items = getCartItems();
      const total = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    }

    refreshCart();
    window.addEventListener("drgodly_cart_updated", refreshCart);
    return () => window.removeEventListener("drgodly_cart_updated", refreshCart);
  }, []);

  const navLinks = [
    { href: "/", label: "Counter QR", icon: QrCode },
    { href: "/doctors", label: "Consult Doctors", icon: Stethoscope },
    { href: "/catalog", label: "OTC Catalog", icon: Pill },
    { href: "/checkout", label: "Checkout", icon: ShoppingCart },
    { href: "/pharmacy/workspace", label: "Pharmacist Console", icon: Activity, badge: "RPh" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm group-hover:bg-teal-700 transition-colors">
              <Cross className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                  DrGodly
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded border border-teal-200">
                  Pharmacy Assist
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                AI Intake & Clinical Care Navigation
              </p>
            </div>
          </Link>

          {/* Store Switcher */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 max-w-xs">
            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="bg-transparent text-slate-800 font-medium truncate outline-none cursor-pointer"
            >
              {PHARMACY_STORES.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-teal-50 text-teal-800 border border-teal-200 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-teal-600" : "text-slate-400"}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] uppercase font-bold bg-teal-600 text-white px-1.5 py-0.2 rounded">
                      {link.badge}
                    </span>
                  )}
                  {link.href === "/checkout" && cartCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[11px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Cart Icon Quick Trigger (Mobile & Tablet) */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/checkout"
              className="relative p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <div className="py-2 mb-2 border-b border-slate-100">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Active Pharmacy Counter
            </label>
            <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200">
              <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="bg-transparent font-medium w-full outline-none"
              >
                {PHARMACY_STORES.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  isActive
                    ? "bg-teal-50 text-teal-800 border border-teal-200"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-teal-600" : "text-slate-400"}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] uppercase font-bold bg-teal-600 text-white px-1.5 py-0.2 rounded">
                    {link.badge}
                  </span>
                )}
                {link.href === "/checkout" && cartCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[11px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
