"use client";

import { Panel } from "@/components/ui/Panel";
import { useGameState } from "@/state/GameContext";
import { formatNumber } from "@/lib/utils";

const REBIRTH_THRESHOLD = 10_000;

export function RebirthTab() {
  const { resources } = useGameState();
  const progress = Math.min(resources.coins / REBIRTH_THRESHOLD, 1);
  const canRebirth = resources.coins >= REBIRTH_THRESHOLD;

  return (
    <div className="space-y-4">
      <Panel className="text-center py-8">
        <div className="space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-500/10 border border-purple-500/20">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-purple-400">
              <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/70">Rebirth</h3>
            <p className="text-xs text-white/40 max-w-[220px] mx-auto mt-1">
              Reset your empire for permanent bonuses that carry over between runs.
            </p>
          </div>
        </div>
      </Panel>

      <Panel>
        <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">
          Progress to Rebirth
        </p>
        <div className="flex items-center gap-3">
          <div className="h-2 flex-1 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-white/40 shrink-0">
            {formatNumber(resources.coins)} / {formatNumber(REBIRTH_THRESHOLD)}
          </span>
        </div>
      </Panel>

      <Panel>
        <p className="text-[10px] uppercase tracking-wider text-white/30 mb-2">
          Rebirth Bonuses
        </p>
        <div className="space-y-2 text-xs text-white/40">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400/50" />
            +10% production speed per rebirth
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400/50" />
            Start with bonus coins
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400/50" />
            Unlock new building types
          </div>
        </div>
      </Panel>

      <button
        disabled={!canRebirth}
        className={`
          w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all cursor-pointer
          ${canRebirth
            ? "bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
            : "bg-white/[0.03] border border-white/5 text-white/15 cursor-not-allowed"
          }
        `}
      >
        {canRebirth ? "Rebirth Now" : `Need ${formatNumber(REBIRTH_THRESHOLD)} coins`}
      </button>
    </div>
  );
}
