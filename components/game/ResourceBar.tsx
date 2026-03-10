"use client";

import { useGameState } from "@/state/GameContext";
import { RESOURCE_ICONS } from "@/components/ui/Icons";
import { formatNumber } from "@/lib/utils";

const DISPLAY_ORDER = ["coins", "wood", "stone", "tools"] as const;

export function ResourceBar() {
  const { resources } = useGameState();

  return (
    <div className="flex items-center gap-1">
      {DISPLAY_ORDER.map((type) => {
        const Icon = RESOURCE_ICONS[type];
        return (
          <div
            key={type}
            className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/5 px-3 py-2"
          >
            <Icon size={18} />
            <div className="flex flex-col leading-none">
              <span className="text-[10px] uppercase tracking-wider text-white/40">
                {type}
              </span>
              <span className="font-mono text-sm font-semibold text-white">
                {formatNumber(resources[type])}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
