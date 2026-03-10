import type { MarketState, MarketResourceType } from "@/types/game";

const THETA = 0.15; // mean reversion speed
const SIGMA = 0.04; // volatility
const BOUND = 0.20; // ±20% from base price
const MAX_HISTORY = 60; // keep 60 ticks of history

function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function stepMarketPrice(
  basePrice: number,
  currentPrice: number,
  velocity: number
): { price: number; velocity: number } {
  const normalizedPrice = currentPrice / basePrice;
  const mean = 1.0;

  // Ornstein-Uhlenbeck step
  const drift = THETA * (mean - normalizedPrice);
  const diffusion = SIGMA * gaussianRandom();
  const newVelocity = drift + diffusion;
  let newNormalized = normalizedPrice + newVelocity;

  // Clamp to bounds
  const lower = 1.0 - BOUND;
  const upper = 1.0 + BOUND;
  newNormalized = Math.max(lower, Math.min(upper, newNormalized));

  const newPrice = Math.max(1, Math.round(newNormalized * basePrice));

  return { price: newPrice, velocity: newVelocity };
}

export function tickMarket(market: MarketState): MarketState {
  const resources: MarketResourceType[] = ["wood", "stone", "tools"];
  const next = { ...market };

  for (const res of resources) {
    const m = market[res];
    const { price, velocity } = stepMarketPrice(m.basePrice, m.currentPrice, m.velocity);
    const history = [...m.priceHistory, price];
    if (history.length > MAX_HISTORY) history.shift();

    next[res] = {
      ...m,
      currentPrice: price,
      velocity,
      priceHistory: history,
    };
  }

  return next;
}
