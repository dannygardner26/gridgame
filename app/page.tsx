"use client";

import { GameProvider } from "@/state/GameContext";
import { GameShell } from "@/components/game/GameShell";

export default function Home() {
  return (
    <GameProvider>
      <GameShell />
    </GameProvider>
  );
}
