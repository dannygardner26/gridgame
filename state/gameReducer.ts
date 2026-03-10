import type { GameState, BuildingInstance, GridMap, ResourceInventory, AutoSellConfig, MarketResourceType } from "@/types/game";
import type { GameAction } from "./actions";
import { BUILDINGS } from "@/data/buildings";
import { tileKey, generateId, parseTileKey } from "@/lib/utils";
import { tickProduction } from "@/engine/production";
import { tickMarket } from "@/engine/market";

function getBankBonus(buildings: BuildingInstance[]): number {
  let bonus = 0;
  for (const b of buildings) {
    if (b.type === "bank") bonus += 0.02 * b.level;
  }
  return bonus;
}

function canAfford(resources: ResourceInventory, cost: { coins: number; wood?: number; stone?: number; tools?: number }): boolean {
  if (resources.coins < cost.coins) return false;
  if (cost.wood && resources.wood < cost.wood) return false;
  if (cost.stone && resources.stone < cost.stone) return false;
  if (cost.tools && resources.tools < cost.tools) return false;
  return true;
}

function deductCost(resources: ResourceInventory, cost: { coins: number; wood?: number; stone?: number; tools?: number }): ResourceInventory {
  return {
    coins: resources.coins - cost.coins,
    wood: resources.wood - (cost.wood ?? 0),
    stone: resources.stone - (cost.stone ?? 0),
    tools: resources.tools - (cost.tools ?? 0),
  };
}

function getUpgradeCost(building: BuildingInstance): { coins: number; wood?: number; stone?: number; tools?: number } {
  const def = BUILDINGS[building.type];
  const scale = Math.pow(def.costScaling, building.level);
  return {
    coins: Math.round(def.baseCost.coins * scale),
    wood: def.baseCost.wood ? Math.round(def.baseCost.wood * scale) : undefined,
    stone: def.baseCost.stone ? Math.round(def.baseCost.stone * scale) : undefined,
    tools: def.baseCost.tools ? Math.round(def.baseCost.tools * scale) : undefined,
  };
}

const FREE_FIRST_BUILD_TYPES: string[] = ["woods", "mountain"];

function getPlacementCost(state: GameState): { coins: number; wood?: number; stone?: number; tools?: number } | null {
  if (!state.placementMode) return null;
  const def = BUILDINGS[state.placementMode.buildingType];
  if (!def) return null;

  // Only woods and mountain get a free first build
  if (FREE_FIRST_BUILD_TYPES.includes(state.placementMode.buildingType) &&
      !state.freeBuildsUsed.includes(state.placementMode.buildingType)) {
    return { coins: 0 };
  }

  return def.baseCost;
}

function expandGridIfNeeded(grid: GridMap, gridSize: number, row: number, col: number): { grid: GridMap; gridSize: number } {
  const center = Math.floor(gridSize / 2);
  const maxDist = Math.max(Math.abs(row - center), Math.abs(col - center));

  if (maxDist < Math.floor(gridSize / 2)) {
    return { grid, gridSize };
  }

  const newSize = gridSize + 2;
  const newGrid: GridMap = {};
  const newCenter = Math.floor(newSize / 2);
  const offset = 1;

  for (const [key, tile] of Object.entries(grid)) {
    const [r, c] = parseTileKey(key);
    const newKey = tileKey(r + offset, c + offset);
    newGrid[newKey] = { ...tile, row: r + offset, col: c + offset };
  }

  for (let r = 0; r < newSize; r++) {
    for (let c = 0; c < newSize; c++) {
      const key = tileKey(r, c);
      if (!newGrid[key]) {
        const dist = Math.max(Math.abs(r - newCenter), Math.abs(c - newCenter));
        const unlockCost = 50 * dist;
        newGrid[key] = { row: r, col: c, status: "locked", unlockCost };
      }
    }
  }

  return { grid: newGrid, gridSize: newSize };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "TICK": {
      const resources = tickProduction(state.buildings, state.resources, state.market);
      const market = tickMarket(state.market);
      return {
        ...state,
        resources,
        market,
        tickCount: state.tickCount + 1,
        lastTickTimestamp: Date.now(),
      };
    }

    case "SELECT_TILE": {
      // If in placement mode, don't change selection
      if (state.placementMode) return state;
      return {
        ...state,
        selectedTile: action.key === state.selectedTile ? null : action.key,
      };
    }

    case "START_PLACEMENT": {
      // Toggle off if same building type
      if (state.placementMode?.buildingType === action.buildingType) {
        return { ...state, placementMode: null };
      }
      return {
        ...state,
        placementMode: { buildingType: action.buildingType },
        selectedTile: null,
      };
    }

    case "CANCEL_PLACEMENT": {
      return { ...state, placementMode: null };
    }

    case "PLACE_BUILDING": {
      if (!state.placementMode) return state;
      const tile = state.grid[action.tileKey];
      if (!tile || tile.status !== "empty") return state;

      const buildingType = state.placementMode.buildingType;
      const def = BUILDINGS[buildingType];
      if (!def) return state;

      const isFree = FREE_FIRST_BUILD_TYPES.includes(buildingType) &&
                     !state.freeBuildsUsed.includes(buildingType);
      const cost = isFree ? { coins: 0 } : def.baseCost;

      if (!canAfford(state.resources, cost)) return state;

      const [row, col] = parseTileKey(action.tileKey);

      // Marketplace gets auto-sell config
      const autoSell: AutoSellConfig[] | undefined = buildingType === "marketplace"
        ? [
            { resource: "wood" as MarketResourceType, enabled: false },
            { resource: "stone" as MarketResourceType, enabled: false },
            { resource: "tools" as MarketResourceType, enabled: false },
          ]
        : undefined;

      const building: BuildingInstance = {
        id: generateId(),
        type: buildingType,
        row,
        col,
        level: 1,
        ...(autoSell ? { autoSell } : {}),
      };

      const newGrid = {
        ...state.grid,
        [action.tileKey]: { ...tile, status: "occupied" as const, buildingId: building.id },
      };

      return {
        ...state,
        grid: newGrid,
        buildings: [...state.buildings, building],
        resources: deductCost(state.resources, cost),
        freeBuildsUsed: isFree ? [...state.freeBuildsUsed, buildingType] : state.freeBuildsUsed,
        placementMode: null,
        selectedTile: action.tileKey,
      };
    }

    case "UPGRADE_BUILDING": {
      const building = state.buildings.find((b) => b.id === action.buildingId);
      if (!building) return state;

      const cost = getUpgradeCost(building);
      if (!canAfford(state.resources, cost)) return state;

      return {
        ...state,
        buildings: state.buildings.map((b) =>
          b.id === action.buildingId ? { ...b, level: b.level + 1 } : b
        ),
        resources: deductCost(state.resources, cost),
      };
    }

    case "SELL_RESOURCE": {
      if (state.resources[action.resource] < action.amount) return state;

      const price = state.market[action.resource].currentPrice;
      const bankBonus = getBankBonus(state.buildings);
      const effectivePrice = Math.round(price * (1 + bankBonus));
      const revenue = effectivePrice * action.amount;

      return {
        ...state,
        resources: {
          ...state.resources,
          [action.resource]: state.resources[action.resource] - action.amount,
          coins: state.resources.coins + revenue,
        },
      };
    }

    case "TOGGLE_AUTO_SELL": {
      return {
        ...state,
        buildings: state.buildings.map((b) => {
          if (b.id !== action.buildingId || b.type !== "marketplace" || !b.autoSell) return b;
          return {
            ...b,
            autoSell: b.autoSell.map((a) =>
              a.resource === action.resource ? { ...a, enabled: !a.enabled } : a
            ),
          };
        }),
      };
    }

    case "DEMOLISH_BUILDING": {
      const tile = state.grid[action.tileKey];
      if (!tile || tile.status !== "occupied" || !tile.buildingId) return state;

      return {
        ...state,
        grid: {
          ...state.grid,
          [action.tileKey]: { ...tile, status: "empty" as const, buildingId: undefined },
        },
        buildings: state.buildings.filter((b) => b.id !== tile.buildingId),
        selectedTile: null,
      };
    }

    case "BUY_TILE": {
      const tile = state.grid[action.tileKey];
      if (!tile || tile.status !== "locked" || !tile.unlockCost) return state;
      if (state.resources.coins < tile.unlockCost) return state;

      const newResources = {
        ...state.resources,
        coins: state.resources.coins - tile.unlockCost,
      };

      const newGrid = {
        ...state.grid,
        [action.tileKey]: { ...tile, status: "empty" as const, unlockCost: undefined },
      };

      const [row, col] = parseTileKey(action.tileKey);
      const expanded = expandGridIfNeeded(newGrid, state.gridSize, row, col);

      let buildings = state.buildings;
      if (expanded.gridSize !== state.gridSize) {
        const offset = (expanded.gridSize - state.gridSize) / 2;
        buildings = buildings.map((b) => ({
          ...b,
          row: b.row + offset,
          col: b.col + offset,
        }));
      }

      return {
        ...state,
        grid: expanded.grid,
        gridSize: expanded.gridSize,
        buildings,
        resources: newResources,
        selectedTile: expanded.gridSize !== state.gridSize
          ? tileKey(row + (expanded.gridSize - state.gridSize) / 2, col + (expanded.gridSize - state.gridSize) / 2)
          : action.tileKey,
      };
    }

    case "LOAD_STATE": {
      return action.state;
    }

    default:
      return state;
  }
}

export { getUpgradeCost, getPlacementCost, canAfford, getBankBonus, FREE_FIRST_BUILD_TYPES };
