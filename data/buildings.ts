import type { BuildingDefinition } from "@/types/game";

export const BUILDINGS: Record<string, BuildingDefinition> = {
  woods: {
    type: "woods",
    name: "Woods",
    description: "A dense patch of trees. Produces wood each tick.",
    emoji: "",
    size: [1, 1],
    baseCost: { coins: 25 },
    costScaling: 1.4,
    produces: { resource: "wood", amount: 1 },
  },
  mountain: {
    type: "mountain",
    name: "Mountain",
    description: "A rocky quarry. Produces stone each tick.",
    emoji: "",
    size: [1, 1],
    baseCost: { coins: 40 },
    costScaling: 1.4,
    produces: { resource: "stone", amount: 1 },
  },
  marketplace: {
    type: "marketplace",
    name: "Marketplace",
    description: "Auto-sells resources for coins each tick. Upgrade to increase sell rate.",
    emoji: "",
    size: [1, 1],
    baseCost: { coins: 100 },
    costScaling: 1.5,
    special: "Auto-sells resources",
  },
  bank: {
    type: "bank",
    name: "Bank",
    description: "Boosts all sell prices by +2% per level.",
    emoji: "",
    size: [1, 1],
    baseCost: { coins: 200, wood: 50, stone: 50 },
    costScaling: 1.6,
    special: "+2% sell price per level",
  },
  toolshop: {
    type: "toolshop",
    name: "Tool Shop",
    description: "Consumes wood and stone to produce valuable tools.",
    emoji: "",
    size: [1, 1],
    baseCost: { coins: 150, wood: 30, stone: 30 },
    costScaling: 1.5,
    produces: { resource: "tools", amount: 1 },
    consumes: [
      { resource: "wood", amount: 1 },
      { resource: "stone", amount: 1 },
    ],
  },
};

export const BUILDING_LIST = Object.values(BUILDINGS);

/** Base sell rate per marketplace level per tick */
export const MARKETPLACE_SELL_RATE = 2;
