"use client";

import { useGameState, useGameDispatch } from "@/state/GameContext";
import { parseTileKey } from "@/lib/utils";
import { Panel } from "@/components/ui/Panel";
import { BUILDING_ICONS, LockIcon, CoinIcon, WoodIcon, StoneIcon, ToolsIcon, RESOURCE_ICONS } from "@/components/ui/Icons";
import { BUILDING_LIST, BUILDINGS, MARKETPLACE_SELL_RATE } from "@/data/buildings";
import { getUpgradeCost, getPlacementCost, canAfford, getBankBonus, FREE_FIRST_BUILD_TYPES } from "@/state/gameReducer";
import { MarketPriceChart } from "@/components/game/MarketPriceChart";
import type { BuildingCost, BuildingType, MarketResourceType } from "@/types/game";
import { formatNumber } from "@/lib/utils";

function CostDisplay({ cost, compact }: { cost: BuildingCost; compact?: boolean }) {
  if (cost.coins === 0 && !cost.wood && !cost.stone && !cost.tools) {
    return <span className="text-xs font-medium text-emerald-400">FREE</span>;
  }
  return (
    <div className={`flex flex-wrap gap-1.5 text-[11px] ${compact ? "" : ""}`}>
      {cost.coins > 0 && (
        <span className="flex items-center gap-0.5 text-amber-400/80">
          <CoinIcon size={10} /> <span className="font-mono">{cost.coins}</span>
        </span>
      )}
      {cost.wood ? (
        <span className="flex items-center gap-0.5 text-amber-700/80">
          <WoodIcon size={10} /> <span className="font-mono">{cost.wood}</span>
        </span>
      ) : null}
      {cost.stone ? (
        <span className="flex items-center gap-0.5 text-gray-400/80">
          <StoneIcon size={10} /> <span className="font-mono">{cost.stone}</span>
        </span>
      ) : null}
      {cost.tools ? (
        <span className="flex items-center gap-0.5 text-gray-500/80">
          <ToolsIcon size={10} /> <span className="font-mono">{cost.tools}</span>
        </span>
      ) : null}
    </div>
  );
}

function MarketplacePanel({ buildingId }: { buildingId: string }) {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const building = state.buildings.find((b) => b.id === buildingId);
  if (!building || building.type !== "marketplace" || !building.autoSell) return null;

  const sellRate = MARKETPLACE_SELL_RATE * building.level;
  const bankBonus = getBankBonus(state.buildings);
  const resources: MarketResourceType[] = ["wood", "stone", "tools"];

  return (
    <Panel>
      <h4 className="text-[10px] uppercase tracking-wider text-white/30 mb-2">
        Auto-Sell ({sellRate}/tick per resource)
      </h4>
      <div className="space-y-2">
        {resources.map((res) => {
          const config = building.autoSell!.find((a) => a.resource === res);
          const enabled = config?.enabled ?? false;
          const marketData = state.market[res];
          const effectivePrice = Math.round(marketData.currentPrice * (1 + bankBonus));
          const Icon = RESOURCE_ICONS[res];

          return (
            <div key={res} className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5">
                  <Icon size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-white/70 capitalize">{res}</p>
                  <p className="text-[10px] text-white/30">
                    Held: <span className="font-mono text-white/50">{formatNumber(state.resources[res])}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-0.5 justify-end">
                    <CoinIcon size={10} />
                    <span className="font-mono text-xs font-semibold text-white">{effectivePrice}</span>
                  </div>
                  {(() => {
                    const pct = ((marketData.currentPrice - marketData.basePrice) / marketData.basePrice) * 100;
                    return (
                      <p className={`text-[9px] font-mono ${pct >= 0 ? "text-emerald-400/50" : "text-red-400/50"}`}>
                        {pct >= 0 ? "+" : ""}{pct.toFixed(1)}%
                      </p>
                    );
                  })()}
                </div>
              </div>

              <div className="mb-2 rounded-md bg-black/20 p-1">
                <MarketPriceChart
                  history={marketData.priceHistory}
                  basePrice={marketData.basePrice}
                  width={200}
                  height={28}
                />
              </div>

              <div className="flex gap-1.5">
                <button
                  onClick={() => dispatch({ type: "TOGGLE_AUTO_SELL", buildingId, resource: res })}
                  className={`
                    flex-1 rounded-md py-1.5 text-[11px] font-medium transition-all cursor-pointer
                    ${enabled
                      ? "bg-emerald-500/15 border border-emerald-500/25 text-emerald-400"
                      : "bg-white/5 border border-white/8 text-white/40 hover:bg-white/8"
                    }
                  `}
                >
                  {enabled ? "Auto: ON" : "Auto: OFF"}
                </button>
                <button
                  onClick={() => {
                    const amt = state.resources[res];
                    if (amt > 0) dispatch({ type: "SELL_RESOURCE", resource: res, amount: amt });
                  }}
                  disabled={state.resources[res] === 0}
                  className={`
                    flex-1 rounded-md py-1.5 text-[11px] font-medium transition-all cursor-pointer
                    ${state.resources[res] > 0
                      ? "bg-amber-500/10 border border-amber-500/15 text-amber-400/80 hover:bg-amber-500/20"
                      : "bg-white/[0.02] border border-white/5 text-white/15 cursor-not-allowed"
                    }
                  `}
                >
                  Sell All
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

export function BuildTab() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const { selectedTile, grid, resources, buildings, placementMode, freeBuildsUsed } = state;

  const tile = selectedTile ? grid[selectedTile] : null;
  const building = tile?.buildingId ? buildings.find((b) => b.id === tile.buildingId) : null;
  const buildingDef = building ? BUILDINGS[building.type] : null;

  return (
    <div className="space-y-4">
      {/* ── Building selector ── */}
      <Panel>
        <h3 className="text-[10px] uppercase tracking-wider text-white/30 mb-2.5">
          {placementMode ? "Placing..." : "Select a building"}
        </h3>
        <div className="grid grid-cols-3 gap-1.5">
          {BUILDING_LIST.map((b) => {
            const Icon = BUILDING_ICONS[b.type];
            const isFree = FREE_FIRST_BUILD_TYPES.includes(b.type) && !freeBuildsUsed.includes(b.type);
            const cost = isFree ? { coins: 0 } : b.baseCost;
            const affordable = canAfford(resources, cost);
            const isActive = placementMode?.buildingType === b.type;

            return (
              <button
                key={b.type}
                onClick={() => {
                  if (affordable || isFree) {
                    dispatch({ type: "START_PLACEMENT", buildingType: b.type as BuildingType });
                  }
                }}
                disabled={!affordable && !isFree}
                className={`
                  flex flex-col items-center gap-1 rounded-xl border p-2.5 transition-all cursor-pointer
                  ${isActive
                    ? "border-cyan-400/50 bg-cyan-950/30 shadow-[0_0_12px_rgba(34,211,238,0.08)]"
                    : affordable || isFree
                      ? "border-white/6 bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.05]"
                      : "border-white/4 bg-white/[0.01] opacity-35 cursor-not-allowed"
                  }
                `}
              >
                <div className="h-7 flex items-center justify-center">
                  {Icon && <Icon size={22} />}
                </div>
                <span className="text-[9px] font-semibold text-white/50 leading-none">{b.name}</span>
                {isFree && (
                  <span className="text-[8px] font-bold text-emerald-400 leading-none">FREE</span>
                )}
              </button>
            );
          })}
        </div>

        {placementMode && (
          <div className="mt-2.5 flex items-center justify-between rounded-lg bg-cyan-950/20 border border-cyan-400/15 px-3 py-2">
            <div>
              <p className="text-[11px] text-cyan-400/80 font-medium">
                Click an empty tile to place
              </p>
              <p className="text-[9px] text-cyan-400/40">Right-click to cancel</p>
            </div>
            <button
              onClick={() => dispatch({ type: "CANCEL_PLACEMENT" })}
              className="text-[10px] text-white/40 hover:text-white/60 cursor-pointer px-2 py-1 rounded-md hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        )}
      </Panel>

      {/* ── Selected tile info ── */}
      {tile?.status === "locked" && selectedTile && (() => {
        const [row, col] = parseTileKey(selectedTile);
        const canBuy = resources.coins >= (tile.unlockCost ?? Infinity);
        return (
          <Panel>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white/80">Tile ({row}, {col})</h3>
              <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/10 text-red-400/60">
                locked
              </span>
            </div>
            <p className="text-xs text-white/40 mb-3">Purchase to expand your empire.</p>
            <button
              onClick={() => dispatch({ type: "BUY_TILE", tileKey: selectedTile! })}
              disabled={!canBuy}
              className={`
                w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium
                transition-colors cursor-pointer
                ${canBuy
                  ? "bg-amber-500/15 border border-amber-500/25 text-amber-400 hover:bg-amber-500/25"
                  : "bg-white/5 border border-white/5 text-white/20 cursor-not-allowed"
                }
              `}
            >
              <LockIcon size={14} className={canBuy ? "text-amber-400" : "text-white/20"} />
              Unlock for {tile.unlockCost} coins
            </button>
          </Panel>
        );
      })()}

      {/* ── Building info + upgrade ── */}
      {tile?.status === "occupied" && building && buildingDef && selectedTile && (() => {
        const [row, col] = parseTileKey(selectedTile);
        const upgradeCost = getUpgradeCost(building);
        const canUpgrade = canAfford(resources, upgradeCost);
        const Icon = BUILDING_ICONS[building.type];

        return (
          <>
            <Panel>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/8">
                  {Icon && <Icon size={28} />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white/90">{buildingDef.name}</h3>
                  <p className="text-[10px] text-white/35">Lv.{building.level} &middot; ({row}, {col})</p>
                </div>
              </div>

              <p className="text-[11px] text-white/45 mb-3">{buildingDef.description}</p>

              {buildingDef.produces && (
                <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-2.5 mb-2">
                  <p className="text-[9px] uppercase tracking-wider text-emerald-400/40 mb-0.5">Produces / tick</p>
                  <p className="text-sm text-emerald-400/80 font-mono">
                    +{buildingDef.produces.amount * building.level} {buildingDef.produces.resource}
                  </p>
                </div>
              )}

              {buildingDef.consumes && (
                <div className="rounded-lg bg-red-500/5 border border-red-500/10 p-2.5 mb-2">
                  <p className="text-[9px] uppercase tracking-wider text-red-400/40 mb-0.5">Consumes / tick</p>
                  {buildingDef.consumes.map((c) => (
                    <p key={c.resource} className="text-sm text-red-400/60 font-mono">
                      -{c.amount * building.level} {c.resource}
                    </p>
                  ))}
                </div>
              )}

              {buildingDef.special && building.type !== "marketplace" && (
                <div className="rounded-lg bg-amber-500/5 border border-amber-500/10 p-2.5 mb-2">
                  <p className="text-[11px] text-amber-400/60">{buildingDef.special}</p>
                  {building.type === "bank" && (
                    <p className="text-xs text-amber-400/80 font-mono mt-1">Current: +{(building.level * 2)}%</p>
                  )}
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] uppercase tracking-wider text-white/25">
                    Upgrade to Lv.{building.level + 1}
                  </p>
                </div>
                <CostDisplay cost={upgradeCost} />
                <button
                  onClick={() => dispatch({ type: "UPGRADE_BUILDING", buildingId: building.id })}
                  disabled={!canUpgrade}
                  className={`
                    w-full mt-2 rounded-lg px-4 py-2 text-xs font-medium
                    transition-colors cursor-pointer
                    ${canUpgrade
                      ? "bg-amber-500/15 border border-amber-500/25 text-amber-400 hover:bg-amber-500/25"
                      : "bg-white/[0.03] border border-white/5 text-white/15 cursor-not-allowed"
                    }
                  `}
                >
                  Upgrade
                </button>
              </div>
            </Panel>

            {building.type === "marketplace" && (
              <MarketplacePanel buildingId={building.id} />
            )}

            <Panel>
              <button
                onClick={() => dispatch({ type: "DEMOLISH_BUILDING", tileKey: selectedTile! })}
                className="w-full rounded-lg border border-red-500/15 bg-red-500/5 px-4 py-2 text-xs font-medium text-red-400/60 hover:bg-red-500/15 hover:text-red-400 transition-colors cursor-pointer"
              >
                Demolish Building
              </button>
            </Panel>
          </>
        );
      })()}

      {/* ── No selection ── */}
      {!selectedTile && !placementMode && (
        <Panel className="text-center py-6 text-white/25">
          <p className="text-xs">Select a building above, then click a tile</p>
          <p className="text-[10px] mt-1">or click a placed building for details</p>
        </Panel>
      )}
    </div>
  );
}
