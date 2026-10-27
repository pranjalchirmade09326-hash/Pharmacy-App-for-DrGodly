"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Clock, Check } from "lucide-react";

export interface SlotChipProps {
  time: string;
  period?: "morning" | "afternoon" | "evening";
  isSelected: boolean;
  isBooked: boolean;
  onSelect: () => void;
}

export function SlotChip({
  time,
  isSelected,
  isBooked,
  onSelect,
}: SlotChipProps) {
  if (isBooked) {
    return (
      <button
        type="button"
        disabled
        className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-slate-100 text-slate-400 line-through cursor-not-allowed select-none"
        title="This slot is already booked"
      >
        <Clock className="w-3.5 h-3.5 opacity-50" />
        <span>{time}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500",
        isSelected
          ? "border-teal-600 bg-teal-50 text-teal-900 shadow-xs ring-2 ring-teal-500/30 scale-[1.02]"
          : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-slate-50"
      )}
    >
      {isSelected ? (
        <Check className="w-3.5 h-3.5 text-teal-600 stroke-[2.5]" />
      ) : (
        <Clock className="w-3.5 h-3.5 text-slate-400" />
      )}
      <span>{time}</span>
    </button>
  );
}
