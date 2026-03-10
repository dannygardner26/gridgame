export function tileKey(row: number, col: number): string {
  return `${row},${col}`;
}

export function parseTileKey(key: string): [number, number] {
  const [r, c] = key.split(",").map(Number);
  return [r, c];
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 10_000) return (n / 1_000).toFixed(1) + "K";
  return Math.floor(n).toLocaleString();
}

let nextId = 0;
export function generateId(): string {
  return `b_${Date.now()}_${nextId++}`;
}
