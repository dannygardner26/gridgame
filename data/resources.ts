import type { MarketResourceType } from "@/types/game";

export interface ResourceDefinition {
  type: MarketResourceType;
  name: string;
  emoji: string;
  basePrice: number;
}

export const RESOURCES: ResourceDefinition[] = [
  { type: "wood", name: "Wood", emoji: "\uD83E\uDEB5", basePrice: 10 },
  { type: "stone", name: "Stone", emoji: "\uD83E\uDEA8", basePrice: 15 },
  { type: "tools", name: "Tools", emoji: "\uD83D\uDD27", basePrice: 40 },
];

export const RESOURCE_EMOJI: Record<string, string> = {
  coins: "\uD83E\uDE99",
  wood: "\uD83E\uDEB5",
  stone: "\uD83E\uDEA8",
  tools: "\uD83D\uDD27",
};
