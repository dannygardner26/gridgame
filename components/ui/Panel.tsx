"use client";

import type { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  className?: string;
}

export function Panel({ children, className = "" }: PanelProps) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}
