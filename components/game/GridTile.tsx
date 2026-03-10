"use client";

import type { GridTile as GridTileType } from "@/types/game";
import { useGameState } from "@/state/GameContext";
import { tileKey } from "@/lib/utils";
import { BUILDINGS } from "@/data/buildings";
import { LockIcon, BUILDING_ICONS, CoinIcon, RESOURCE_ICONS } from "@/components/ui/Icons";

interface GridTileProps {
  tile: GridTileType;
  isHovered: boolean;
  onHover: (key: string | null) => void;
  onClick: (key: string) => void;
}

function ProductionBadge({ building }: { building: { type: string; level: number } }) {
  const def = BUILDINGS[building.type];
  if (!def) return null;

  // Marketplace - show sell icon
  if (building.type === "marketplace") {
    return (
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 rounded-full bg-amber-500/20 border border-amber-500/25 px-1.5 py-0.5 z-10">
        <CoinIcon size={7} />
        <span className="text-[7px] font-bold text-amber-400/80">SELL</span>
      </div>
    );
  }

  // Bank - show bonus
  if (building.type === "bank") {
    return (
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 rounded-full bg-amber-500/20 border border-amber-500/25 px-1.5 py-0.5 z-10">
        <span className="text-[7px] font-bold text-amber-400/80">+{building.level * 2}%</span>
      </div>
    );
  }

  // Producers - show output
  if (def.produces) {
    const Icon = RESOURCE_ICONS[def.produces.resource];
    const amount = def.produces.amount * building.level;
    return (
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/25 px-1.5 py-0.5 z-10">
        <span className="text-[7px] font-bold text-emerald-400/90">+{amount}</span>
        {Icon && <Icon size={7} />}
      </div>
    );
  }

  return null;
}

export function GridTile({ tile, isHovered, onHover, onClick }: GridTileProps) {
  const { selectedTile, buildings, placementMode } = useGameState();

  const key = tileKey(tile.row, tile.col);
  const isSelected = selectedTile === key;
  const building = tile.buildingId
    ? buildings.find((b) => b.id === tile.buildingId)
    : null;
  const def = building ? BUILDINGS[building.type] : null;

  const inPlacementMode = !!placementMode;
  const isValidPlacement = inPlacementMode && tile.status === "empty";
  const showBlueprint = isValidPlacement && isHovered;
  const blueprintDef = placementMode ? BUILDINGS[placementMode.buildingType] : null;
  const BlueprintIcon = blueprintDef ? BUILDING_ICONS[blueprintDef.type] : null;

  // Locked tile
  if (tile.status === "locked") {
    return (
      <button
        onClick={() => onClick(key)}
        onMouseEnter={() => onHover(key)}
        onMouseLeave={() => onHover(null)}
        className={`
          group relative flex aspect-square cursor-pointer items-center justify-center
          rounded-xl border-2 border-dashed
          transition-all duration-200
          ${isSelected
            ? "border-amber-400/50 bg-amber-950/25"
            : "border-white/6 bg-white/[0.015] hover:border-white/12 hover:bg-white/[0.03]"
          }
        `}
      >
        <div className="flex flex-col items-center gap-1 opacity-25 group-hover:opacity-50 transition-opacity">
          <LockIcon size={12} className="text-white/50" />
          <div className="flex items-center gap-0.5">
            <CoinIcon size={8} />
            <span className="text-[9px] font-mono text-white/40">
              {tile.unlockCost}
            </span>
          </div>
        </div>
      </button>
    );
  }

  // Occupied tile
  if (tile.status === "occupied" && def && building) {
    const BuildingIcon = BUILDING_ICONS[def.type];
    return (
      <button
        onClick={() => onClick(key)}
        onMouseEnter={() => onHover(key)}
        onMouseLeave={() => onHover(null)}
        className={`
          group relative flex aspect-square cursor-pointer items-center justify-center
          rounded-xl border-2 transition-all duration-200
          ${isSelected
            ? "border-amber-400/80 bg-gradient-to-b from-amber-900/30 to-amber-950/40 shadow-[0_0_20px_rgba(251,191,36,0.12)]"
            : "border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.03] hover:border-white/20 hover:from-white/[0.08] hover:to-white/[0.05] hover:shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
          }
        `}
      >
        {/* Production badge */}
        <ProductionBadge building={building} />

        {/* Level badge */}
        {building.level > 1 && (
          <div className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500/80 text-[8px] font-bold text-amber-950">
            {building.level}
          </div>
        )}
        <div className="flex flex-col items-center gap-0.5">
          {BuildingIcon && <BuildingIcon size={28} />}
          <span className="text-[8px] font-semibold text-white/50 leading-none tracking-wide uppercase">
            {def.name}
          </span>
        </div>
      </button>
    );
  }

  // Empty tile
  return (
    <button
      onClick={() => onClick(key)}
      onMouseEnter={() => onHover(key)}
      onMouseLeave={() => onHover(null)}
      className={`
        group relative flex aspect-square cursor-pointer items-center justify-center
        rounded-xl border-2 transition-all duration-200
        ${showBlueprint
          ? "border-cyan-400/60 bg-cyan-950/25 shadow-[0_0_16px_rgba(34,211,238,0.08)]"
          : isSelected
            ? "border-emerald-400/70 bg-emerald-950/25 shadow-[0_0_16px_rgba(52,211,153,0.08)]"
            : isValidPlacement
              ? "border-white/8 bg-white/[0.02] hover:border-cyan-400/30 hover:bg-cyan-950/15"
              : "border-white/6 bg-white/[0.02] hover:border-emerald-500/25 hover:bg-emerald-950/10"
        }
      `}
    >
      {showBlueprint && BlueprintIcon ? (
        <div className="flex flex-col items-center gap-0.5 animate-pulse">
          <div className="opacity-50">
            <BlueprintIcon size={26} />
          </div>
          <span className="text-[8px] font-semibold text-cyan-400/50 leading-none tracking-wide uppercase">
            {blueprintDef?.name}
          </span>
        </div>
      ) : (
        <span className={`
          text-xl font-light transition-all duration-200
          ${isSelected
            ? "text-emerald-400/50"
            : "text-white/0 group-hover:text-white/15"
          }
        `}>
          +
        </span>
      )}
    </button>
  );
}
