"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
  type Dispatch,
  type ReactNode,
} from "react";
import type { GameState } from "@/types/game";
import type { GameAction } from "./actions";
import { gameReducer } from "./gameReducer";
import { createInitialState } from "./initialState";
import { startGameLoop, MAX_OFFLINE_SECONDS } from "@/engine/gameLoop";
import { saveGame, loadGame } from "@/engine/save";

const GameStateContext = createContext<GameState | null>(null);
const GameDispatchContext = createContext<Dispatch<GameAction> | null>(null);

const AUTO_SAVE_INTERVAL = 30_000; // 30 seconds

function initState(): GameState {
  if (typeof window === "undefined") return createInitialState();

  const saved = loadGame();
  if (!saved) return createInitialState();

  // Migrate old saves
  if (!saved.placementMode) saved.placementMode = null;
  if (!saved.freeBuildsUsed) saved.freeBuildsUsed = [];

  // Calculate offline progress
  const now = Date.now();
  const elapsed = Math.floor((now - saved.lastTickTimestamp) / 1000);
  const offlineTicks = Math.min(elapsed, MAX_OFFLINE_SECONDS);

  if (offlineTicks <= 0) return saved;

  // Run offline ticks through reducer
  let state = saved;
  // Batch offline ticks - run them but cap at a reasonable number for perf
  const batchSize = Math.min(offlineTicks, MAX_OFFLINE_SECONDS);
  for (let i = 0; i < batchSize; i++) {
    state = gameReducer(state, { type: "TICK" });
  }

  return state;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, null, initState);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Game loop
  useEffect(() => {
    const stop = startGameLoop(dispatch);
    return stop;
  }, [dispatch]);

  // Auto-save
  useEffect(() => {
    const id = setInterval(() => {
      saveGame(stateRef.current);
    }, AUTO_SAVE_INTERVAL);

    // Save on page unload
    const handleUnload = () => saveGame(stateRef.current);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearInterval(id);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return (
    <GameStateContext value={state}>
      <GameDispatchContext value={dispatch}>
        {children}
      </GameDispatchContext>
    </GameStateContext>
  );
}

export function useGameState(): GameState {
  const ctx = useContext(GameStateContext);
  if (!ctx) throw new Error("useGameState must be used within GameProvider");
  return ctx;
}

export function useGameDispatch(): Dispatch<GameAction> {
  const ctx = useContext(GameDispatchContext);
  if (!ctx) throw new Error("useGameDispatch must be used within GameProvider");
  return ctx;
}

export function useSaveGame() {
  const state = useGameState();
  return useCallback(() => saveGame(state), [state]);
}
