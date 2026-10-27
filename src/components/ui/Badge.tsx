import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "red" | "orange" | "yellow" | "green" | "blue" | "purple" | "slate";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "slate",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    red: "bg-red-50 text-red-700 border-red-200 ring-red-500/10",
    orange: "bg-orange-50 text-orange-700 border-orange-200 ring-orange-500/10",
    yellow: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10",
    blue: "bg-sky-50 text-sky-700 border-sky-200 ring-sky-500/10",
    purple: "bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/10",
    slate: "bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/10",
  }[variant];

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-xs font-semibold",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border ring-1",
        variantStyles,
        sizeStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
