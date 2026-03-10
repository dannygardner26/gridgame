import type { BuildingType, MarketResourceType } from "@/types/game";

export type GameAction =
  | { type: "TICK" }
  | { type: "SELECT_TILE"; key: string | null }
  | { type: "START_PLACEMENT"; buildingType: BuildingType }
  | { type: "CANCEL_PLACEMENT" }
  | { type: "PLACE_BUILDING"; tileKey: string }
  | { type: "UPGRADE_BUILDING"; buildingId: string }
  | { type: "SELL_RESOURCE"; resource: MarketResourceType; amount: number }
  | { type: "TOGGLE_AUTO_SELL"; buildingId: string; resource: MarketResourceType }
  | { type: "DEMOLISH_BUILDING"; tileKey: string }
  | { type: "BUY_TILE"; tileKey: string }
  | { type: "LOAD_STATE"; state: import("@/types/game").GameState };
