"use client";

import { useState, createContext, useContext, type ReactNode } from "react";

export type TabId = "build" | "rebirth" | "settings";

interface Tab {
  id: TabId;
  label: string;
  icon: ReactNode;
}

const TABS: Tab[] = [
  {
    id: "build",
    label: "Build",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: "rebirth",
    label: "Rebirth",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
        <path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
];

const TabContext = createContext<{ activeTab: TabId; setActiveTab: (t: TabId) => void }>({
  activeTab: "build",
  setActiveTab: () => {},
});

export function useActiveTab() {
  return useContext(TabContext);
}

export function TabProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabId>("build");
  return (
    <TabContext value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext>
  );
}

export function TabBar() {
  const { activeTab, setActiveTab } = useActiveTab();

  return (
    <div className="flex gap-1 rounded-xl border border-white/8 bg-white/[0.03] p-1">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`
            flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium
            transition-all duration-150 cursor-pointer
            ${activeTab === tab.id
              ? "bg-white/10 text-white shadow-sm"
              : "text-white/40 hover:text-white/60 hover:bg-white/5"
            }
          `}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
