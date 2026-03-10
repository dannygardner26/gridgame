// ── Resource Types ──────────────────────────────────────────────
export type ResourceType = "coins" | "wood" | "stone" | "tools";

export interface ResourceInventory {
  coins: number;
  wood: number;
  stone: number;
  tools: number;
}

// ── Grid Types ─────────────────────────────────────────────────
export type TileStatus = "locked" | "empty" | "occupied";

export interface GridTile {
  row: number;
  col: number;
  status: TileStatus;
  buildingId?: string;
  unlockCost?: number;
}

/** Keyed by "row,col" */
export type GridMap = Record<string, GridTile>;

// ── Building Types ─────────────────────────────────────────────
export type BuildingType = "woods" | "mountain" | "marketplace" | "bank" | "toolshop";

export interface BuildingCost {
  coins: number;
  wood?: number;
  stone?: number;
  tools?: number;
}

export interface ProductionOutput {
  resource: ResourceType;
  amount: number;
}

export interface ProductionInput {
  resource: ResourceType;
  amount: number;
}

export interface AutoSellConfig {
  resource: MarketResourceType;
  enabled: boolean;
}

export interface BuildingDefinition {
  type: BuildingType;
  name: string;
  description: string;
  emoji: string;
  size: [number, number]; // [rows, cols]
  baseCost: BuildingCost;
  costScaling: number; // multiplier per level
  produces?: ProductionOutput;
  consumes?: ProductionInput[];
  special?: string;
}

export interface BuildingInstance {
  id: string;
  type: BuildingType;
  row: number;
  col: number;
  level: number;
  autoSell?: AutoSellConfig[]; // marketplace only
}

// ── Market Types ───────────────────────────────────────────────
export type MarketResourceType = Exclude<ResourceType, "coins">;

export interface MarketResource {
  basePrice: number;
  currentPrice: number;
  priceHistory: number[];
  velocity: number;
}

export type MarketState = Record<MarketResourceType, MarketResource>;

// ── Placement Mode ─────────────────────────────────────────────
export interface PlacementMode {
  buildingType: BuildingType;
}

// ── Game State ─────────────────────────────────────────────────
export interface GameState {
  grid: GridMap;
  gridSize: number;
  buildings: BuildingInstance[];
  resources: ResourceInventory;
  market: MarketState;
  selectedTile: string | null;
  placementMode: PlacementMode | null;
  /** Track which building types have been placed for free */
  freeBuildsUsed: BuildingType[];
  tickCount: number;
  lastTickTimestamp: number;
  lastSaveTimestamp: number;
}
