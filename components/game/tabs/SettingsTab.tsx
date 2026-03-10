"use client";

import { Panel } from "@/components/ui/Panel";
import { useGameState, useGameDispatch } from "@/state/GameContext";
import { saveGame, deleteSave, exportSave } from "@/engine/save";
import { createInitialState } from "@/state/initialState";
import { useState } from "react";

export function SettingsTab() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSave = () => {
    saveGame(state);
    setSaveStatus("Saved!");
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const handleExport = () => {
    const encoded = exportSave(state);
    navigator.clipboard.writeText(encoded);
    setSaveStatus("Copied to clipboard!");
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
      return;
    }
    deleteSave();
    dispatch({ type: "LOAD_STATE", state: createInitialState() });
    setConfirmReset(false);
  };

  return (
    <div className="space-y-4">
      <Panel>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
          Save & Load
        </h3>
        <div className="space-y-2">
          <button
            onClick={handleSave}
            className="w-full text-left rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2.5 text-sm text-white/60 hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            Save Game
          </button>
          <button
            onClick={handleExport}
            className="w-full text-left rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2.5 text-sm text-white/60 hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            Export Save to Clipboard
          </button>
        </div>
        {saveStatus && (
          <p className="text-xs text-emerald-400/70 mt-2 text-center">{saveStatus}</p>
        )}
      </Panel>

      <Panel>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
          Stats
        </h3>
        <div className="space-y-1.5 text-xs text-white/50">
          <div className="flex justify-between">
            <span>Ticks elapsed</span>
            <span className="font-mono text-white/60">{state.tickCount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Buildings placed</span>
            <span className="font-mono text-white/60">{state.buildings.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Grid size</span>
            <span className="font-mono text-white/60">{state.gridSize}x{state.gridSize}</span>
          </div>
        </div>
      </Panel>

      <Panel>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-red-400/40 mb-3">
          Danger Zone
        </h3>
        <button
          onClick={handleReset}
          className={`
            w-full rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer
            ${confirmReset
              ? "border-red-500/30 bg-red-500/15 text-red-400 hover:bg-red-500/25"
              : "border-red-500/10 bg-red-500/5 text-red-400/60 hover:bg-red-500/10"
            }
          `}
        >
          {confirmReset ? "Click again to confirm reset" : "Reset All Progress"}
        </button>
      </Panel>

      <Panel className="text-center py-3">
        <p className="text-[11px] text-white/20">Grid Empire v0.1.0</p>
        <p className="text-[10px] text-white/10 mt-0.5">Auto-saves every 30s</p>
      </Panel>
    </div>
  );
}
