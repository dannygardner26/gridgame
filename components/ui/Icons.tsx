"use client";

import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

export function CoinIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9.5" fill="#EAB308" />
      <circle cx="12" cy="12" r="7" fill="#CA8A04" />
      <circle cx="12" cy="12" r="6.5" fill="#EAB308" />
      <text x="12" y="16.5" textAnchor="middle" fontSize="12" fontWeight="700" fill="#713F12" fontFamily="serif">$</text>
    </svg>
  );
}

export function WoodIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="7" width="18" height="5" rx="2.5" fill="#854D0E" />
      <line x1="6" y1="8.5" x2="6" y2="10.5" stroke="#713F12" strokeWidth="0.6" opacity="0.3" />
      <line x1="10" y1="8" x2="10" y2="11" stroke="#713F12" strokeWidth="0.6" opacity="0.3" />
      <rect x="5" y="13" width="16" height="5" rx="2.5" fill="#A16207" />
      <line x1="9" y1="14" x2="9" y2="17" stroke="#854D0E" strokeWidth="0.6" opacity="0.3" />
      <line x1="15" y1="14.5" x2="15" y2="16.5" stroke="#854D0E" strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

export function StoneIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 17L4 12L7 8L13 7L18 9L20 14L17 18H8Z" fill="#6B7280" />
      <path d="M8 15L7 12L10 10L14 10L16 13L14 16H9Z" fill="#9CA3AF" />
    </svg>
  );
}

export function ToolsIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Wrench */}
      <path d="M6.5 3.5C4.5 3.5 3 5.2 3 7c0 1.2.6 2.2 1.5 2.8L12 17.5l1.5-1.5L6 8.5c-.3-.3-.5-.7-.5-1.2 0-.8.7-1.5 1.5-1.5.4 0 .8.2 1.1.4l1.4-1.4C8.8 4 7.7 3.5 6.5 3.5Z" fill="#9CA3AF" />
      {/* Hammer */}
      <path d="M14 6l4 4-7.5 7.5-1.5-1.5L14 11l-2-2 2-3Z" fill="#6B7280" />
      <rect x="9" y="16" width="2.5" height="5" rx="0.5" fill="#854D0E" transform="rotate(-45 10 18)" />
    </svg>
  );
}

export function LockIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor" opacity="0.3" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
    </svg>
  );
}

export function TreeIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      {/* Tree layers */}
      <polygon points="16,4 22,13 10,13" fill="#22C55E" />
      <polygon points="16,8 24,18 8,18" fill="#16A34A" />
      <polygon points="16,12 26,24 6,24" fill="#15803D" />
      {/* Trunk */}
      <rect x="14" y="24" width="4" height="5" rx="0.5" fill="#854D0E" />
    </svg>
  );
}

export function MountainIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      {/* Back mountain */}
      <polygon points="22,8 30,27 14,27" fill="#6B7280" />
      {/* Front mountain */}
      <polygon points="12,6 24,27 0,27" fill="#9CA3AF" />
      {/* Snow cap */}
      <polygon points="12,6 15,12 9,12" fill="#F1F5F9" />
    </svg>
  );
}

export function MarketIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      {/* Roof */}
      <path d="M3 14L16 5L29 14H3Z" fill="#DC2626" />
      {/* Awning scallops */}
      <path d="M5 14Q8 17 11 14Q14 17 17 14Q20 17 23 14Q26 17 29 14" fill="#EF4444" />
      {/* Building body */}
      <rect x="6" y="14" width="20" height="14" fill="#F59E0B" />
      {/* Door */}
      <rect x="13" y="20" width="6" height="8" rx="1" fill="#92400E" />
      {/* Window left */}
      <rect x="8" y="17" width="3" height="3" rx="0.5" fill="#FDE68A" />
      {/* Window right */}
      <rect x="21" y="17" width="3" height="3" rx="0.5" fill="#FDE68A" />
    </svg>
  );
}

export function BankIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      {/* Pediment */}
      <polygon points="16,4 29,12 3,12" fill="#E5E7EB" />
      {/* Entablature */}
      <rect x="3" y="12" width="26" height="2" fill="#D1D5DB" />
      {/* Columns */}
      <rect x="7" y="14" width="2.5" height="11" fill="#F3F4F6" />
      <rect x="14.75" y="14" width="2.5" height="11" fill="#F3F4F6" />
      <rect x="22.5" y="14" width="2.5" height="11" fill="#F3F4F6" />
      {/* Base */}
      <rect x="3" y="25" width="26" height="3" rx="0.5" fill="#D1D5DB" />
    </svg>
  );
}

export function HammerIcon({ className = "", size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      {/* Anvil base */}
      <path d="M6 22C6 22 8 18 16 18C24 18 26 22 26 22V26H6V22Z" fill="#4B5563" />
      <rect x="10" y="16" width="12" height="3" rx="0.5" fill="#6B7280" />
      {/* Hammer */}
      <rect x="14.5" y="4" width="3" height="11" rx="1" fill="#92400E" />
      <rect x="10" y="3" width="12" height="5" rx="1.5" fill="#9CA3AF" />
    </svg>
  );
}

export const RESOURCE_ICONS: Record<string, (props: IconProps) => React.ReactNode> = {
  coins: CoinIcon,
  wood: WoodIcon,
  stone: StoneIcon,
  tools: ToolsIcon,
};

export const BUILDING_ICONS: Record<string, (props: IconProps) => React.ReactNode> = {
  woods: TreeIcon,
  mountain: MountainIcon,
  marketplace: MarketIcon,
  bank: BankIcon,
  toolshop: HammerIcon,
};
