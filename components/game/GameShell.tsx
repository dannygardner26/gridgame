"use client";

import { useEffect, useState } from "react";
import { ResourceBar } from "./ResourceBar";
import { Grid } from "./Grid";
import { TabBar, TabProvider, useActiveTab } from "./TabBar";
import { BuildTab } from "./tabs/BuildTab";
import { RebirthTab } from "./tabs/RebirthTab";
import { SettingsTab } from "./tabs/SettingsTab";
import { useGameState, useGameDispatch } from "@/state/GameContext";
import { deleteSave } from "@/engine/save";
import { createInitialState } from "@/state/initialState";

function TabContent() {
  const { activeTab } = useActiveTab();

  switch (activeTab) {
    case "build":
      return <BuildTab />;
    case "rebirth":
      return <RebirthTab />;
    case "settings":
      return <SettingsTab />;
  }
}

function PlacementCancelHandler() {
  const { placementMode } = useGameState();
  const dispatch = useGameDispatch();

  useEffect(() => {
    if (!placementMode) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dispatch({ type: "CANCEL_PLACEMENT" });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [placementMode, dispatch]);

  return null;
}

function ResetButton() {
  const dispatch = useGameDispatch();
  const [confirmReset, setConfirmReset] = useState(false);

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
    <button
      onClick={handleReset}
      className={`
        rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap
        ${confirmReset
          ? "border-red-500/30 bg-red-500/15 text-red-400 hover:bg-red-500/25"
          : "border-white/8 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60"
        }
      `}
    >
      {confirmReset ? "Click to confirm" : "Reset All"}
    </button>
  );
}

export function GameShell() {
  return (
    <TabProvider>
      <PlacementCancelHandler />
      <div className="flex min-h-screen flex-col items-center gap-5 p-4 md:p-6">
        {/* Header */}
        <div className="flex w-full max-w-5xl items-center justify-between">
          <h1 className="text-lg font-bold tracking-tight text-white/90">
            Grid Empire
          </h1>
          <div className="flex items-center gap-2">
            <ResourceBar />
            <ResetButton />
          </div>
        </div>

        {/* Main area */}
        <div className="flex w-full max-w-5xl gap-5 flex-1">
          {/* Grid - centered */}
          <div className="flex-1 flex items-start justify-center pt-4">
            <div className="w-full max-w-[520px]">
              <Grid />
            </div>
          </div>

          {/* Right panel */}
          <div className="w-72 shrink-0 flex flex-col gap-4">
            <TabBar />
            <div className="flex-1 overflow-y-auto">
              <TabContent />
            </div>
          </div>
        </div>
      </div>
    </TabProvider>
  );
}
