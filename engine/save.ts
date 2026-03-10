import type { GameState } from "@/types/game";

const SAVE_KEY = "gridempire_save";
const SAVE_VERSION = 1;

interface SaveData {
  version: number;
  state: GameState;
}

export function saveGame(state: GameState): void {
  try {
    const data: SaveData = {
      version: SAVE_VERSION,
      state: { ...state, lastSaveTimestamp: Date.now() },
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    // localStorage might be full or unavailable
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;

    const data: SaveData = JSON.parse(raw);
    if (data.version !== SAVE_VERSION) return null;

    return data.state;
  } catch {
    return null;
  }
}

export function deleteSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // ignore
  }
}

export function exportSave(state: GameState): string {
  const data: SaveData = { version: SAVE_VERSION, state };
  return btoa(JSON.stringify(data));
}

export function importSave(encoded: string): GameState | null {
  try {
    const data: SaveData = JSON.parse(atob(encoded));
    if (data.version !== SAVE_VERSION) return null;
    return data.state;
  } catch {
    return null;
  }
}
