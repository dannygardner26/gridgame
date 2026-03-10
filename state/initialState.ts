import type { GameState, GridMap, GridTile } from "@/types/game";
import { tileKey } from "@/lib/utils";

function createInitialGrid(): GridMap {
  const grid: GridMap = {};
  const gridSize = 7;
  const center = 3;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const distFromCenter = Math.max(Math.abs(row - center), Math.abs(col - center));
      const key = tileKey(row, col);

      let tile: GridTile;
      if (distFromCenter <= 2) {
        tile = { row, col, status: "empty" };
      } else {
        const baseCost = 50;
        const unlockCost = baseCost * distFromCenter;
        tile = { row, col, status: "locked", unlockCost };
      }

      grid[key] = tile;
    }
  }

  return grid;
}

export function createInitialState(): GameState {
  return {
    grid: createInitialGrid(),
    gridSize: 7,
    buildings: [],
    resources: {
      coins: 100,
      wood: 0,
      stone: 0,
      tools: 0,
    },
    market: {
      wood: { basePrice: 10, currentPrice: 10, priceHistory: [10], velocity: 0 },
      stone: { basePrice: 15, currentPrice: 15, priceHistory: [15], velocity: 0 },
      tools: { basePrice: 40, currentPrice: 40, priceHistory: [40], velocity: 0 },
    },
    selectedTile: null,
    placementMode: null,
    freeBuildsUsed: [],
    tickCount: 0,
    lastTickTimestamp: Date.now(),
    lastSaveTimestamp: Date.now(),
  };
}
