import type { Dispatch } from "react";
import type { GameAction } from "@/state/actions";

const TICK_INTERVAL = 1000; // 1 second

export function startGameLoop(dispatch: Dispatch<GameAction>): () => void {
  const id = setInterval(() => {
    dispatch({ type: "TICK" });
  }, TICK_INTERVAL);

  return () => clearInterval(id);
}

export const MAX_OFFLINE_SECONDS = 8 * 60 * 60; // 8 hours
