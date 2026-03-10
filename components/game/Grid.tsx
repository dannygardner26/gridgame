"use client";

import { useState, useCallback } from "react";
import { useGameState, useGameDispatch } from "@/state/GameContext";
import { GridTile } from "./GridTile";
import { tileKey } from "@/lib/utils";

export function Grid() {
  const { grid, gridSize, placementMode } = useGameState();
  const dispatch = useGameDispatch();
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);

  const handleTileHover = useCallback((key: string | null) => {
    setHoveredTile(key);
  }, []);

  const handleTileClick = useCallback((key: string) => {
    if (placementMode) {
      const tile = grid[key];
      if (tile?.status === "empty") {
        dispatch({ type: "PLACE_BUILDING", tileKey: key });
      }
    } else {
      dispatch({ type: "SELECT_TILE", key });
    }
  }, [placementMode, grid, dispatch]);

  // Handle right-click or Escape to cancel placement
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (placementMode) {
      e.preventDefault();
      dispatch({ type: "CANCEL_PLACEMENT" });
    }
  }, [placementMode, dispatch]);

  const rows = Array.from({ length: gridSize }, (_, i) => i);
  const cols = Array.from({ length: gridSize }, (_, i) => i);

  return (
    <div
      className={`grid gap-1.5 ${placementMode ? "cursor-crosshair" : ""}`}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
      }}
      onContextMenu={handleContextMenu}
    >
      {rows.map((row) =>
        cols.map((col) => {
          const key = tileKey(row, col);
          const tile = grid[key];
          if (!tile) return null;
          return (
            <GridTile
              key={key}
              tile={tile}
              isHovered={hoveredTile === key}
              onHover={handleTileHover}
              onClick={handleTileClick}
            />
          );
        })
      )}
    </div>
  );
}
