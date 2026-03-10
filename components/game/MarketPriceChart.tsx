"use client";

interface MarketPriceChartProps {
  history: number[];
  basePrice: number;
  width?: number;
  height?: number;
}

export function MarketPriceChart({
  history,
  basePrice,
  width = 100,
  height = 32,
}: MarketPriceChartProps) {
  if (history.length < 2) return null;

  const padding = 2;
  const w = width - padding * 2;
  const h = height - padding * 2;

  const min = basePrice * 0.78;
  const max = basePrice * 1.22;
  const range = max - min;

  const points = history.map((price, i) => {
    const x = padding + (i / (history.length - 1)) * w;
    const y = padding + h - ((price - min) / range) * h;
    return `${x},${y}`;
  });

  const lastPrice = history[history.length - 1];
  const isUp = lastPrice >= basePrice;

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Base price line */}
      <line
        x1={padding}
        y1={padding + h - ((basePrice - min) / range) * h}
        x2={padding + w}
        y2={padding + h - ((basePrice - min) / range) * h}
        stroke="white"
        strokeOpacity={0.1}
        strokeDasharray="2,2"
      />
      {/* Price line */}
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={isUp ? "#34d399" : "#f87171"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
