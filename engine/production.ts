import type { BuildingInstance, ResourceInventory, MarketState, MarketResourceType } from "@/types/game";
import { BUILDINGS, MARKETPLACE_SELL_RATE } from "@/data/buildings";

function getBankBonus(buildings: BuildingInstance[]): number {
  let bonus = 0;
  for (const b of buildings) {
    if (b.type === "bank") bonus += 0.02 * b.level;
  }
  return bonus;
}

export function tickProduction(
  buildings: BuildingInstance[],
  resources: ResourceInventory,
  market: MarketState
): ResourceInventory {
  const next = { ...resources };
  const bankBonus = getBankBonus(buildings);

  for (const building of buildings) {
    const def = BUILDINGS[building.type];
    if (!def) continue;

    // Marketplace auto-sell
    if (building.type === "marketplace" && building.autoSell) {
      const sellRate = MARKETPLACE_SELL_RATE * building.level;
      for (const config of building.autoSell) {
        if (!config.enabled) continue;
        const res = config.resource as MarketResourceType;
        const available = next[res];
        const toSell = Math.min(available, sellRate);
        if (toSell > 0) {
          const price = market[res].currentPrice;
          const effectivePrice = Math.round(price * (1 + bankBonus));
          next[res] -= toSell;
          next.coins += toSell * effectivePrice;
        }
      }
      continue;
    }

    // Check if building consumes resources
    if (def.consumes) {
      let canProduce = true;
      for (const input of def.consumes) {
        const needed = input.amount * building.level;
        if (next[input.resource] < needed) {
          canProduce = false;
          break;
        }
      }
      if (!canProduce) continue;

      for (const input of def.consumes) {
        next[input.resource] -= input.amount * building.level;
      }
    }

    // Produce resources
    if (def.produces) {
      next[def.produces.resource] += def.produces.amount * building.level;
    }
  }

  return next;
}
