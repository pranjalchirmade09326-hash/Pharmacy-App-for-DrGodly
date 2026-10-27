"use client";

import React from "react";
import { AlertTriangle, PhoneCall } from "lucide-react";

export function EmergencyBanner() {
  return (
    <div className="bg-red-600 text-white px-4 py-2 text-xs md:text-sm font-medium shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="font-bold tracking-wide uppercase text-[11px] bg-red-700/80 px-2 py-0.5 rounded">
            Emergency Triage Protocol
          </span>
          <span className="hidden sm:inline text-red-100">
            For crushing chest pain, acute breathlessness, or severe trauma:
          </span>
        </div>
        <a
          href="tel:108"
          className="inline-flex items-center gap-1.5 bg-white text-red-700 hover:bg-red-50 px-3 py-1 rounded-md font-bold text-xs shadow-xs transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call 108 (India Ambulance)</span>
        </a>
      </div>
    </div>
  );
}
