'use client';

import { useState } from 'react';
import type { AttackType } from '@/lib/types';
import { ATTACK_TYPES } from '@/lib/types';

interface Props {
  paused: boolean;
  onPauseToggle: () => void;
  autoRotate: boolean;
  onAutoRotateToggle: () => void;
}

export default function TopBar({
  paused,
  onPauseToggle,
  autoRotate,
  onAutoRotateToggle,
}: Props) {
  const [activeFilters, setActiveFilters] = useState<Set<AttackType>>(
    new Set(ATTACK_TYPES)
  );
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilter = (type: AttackType) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(type)) {
      newFilters.delete(type);
    } else {
      newFilters.add(type);
    }
    setActiveFilters(newFilters);
  };

  return (
    <div className="pointer-events-auto absolute top-4 left-4 z-20 space-y-3">
      {/* Main Control Panel */}
      <div className="rounded-xl border border-threat-border bg-threat-panel p-4 backdrop-blur-md w-72">
        {/* Title */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-threat-text">
            🎮 Controls
          </h2>
          <span className="text-[10px] text-threat-dim">v1.0</span>
        </div>

        {/* Control Buttons */}
        <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
          <button
            onClick={onPauseToggle}
            className={`w-full rounded px-3 py-2 text-xs font-semibold uppercase transition-all ${
              paused
                ? 'border border-green-500/50 bg-green-900/20 text-green-400 hover:bg-green-900/30'
                : 'border border-red-500/50 bg-red-900/20 text-red-400 hover:bg-red-900/30'
            }`}
          >
            {paused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
          <button
            onClick={onAutoRotateToggle}
            className={`w-full rounded px-3 py-2 text-xs font-semibold uppercase transition-all ${
              autoRotate
                ? 'border border-blue-500/50 bg-blue-900/20 text-blue-400 hover:bg-blue-900/30'
                : 'border border-white/20 bg-white/5 text-threat-text hover:bg-white/10'
            }`}
          >
            {autoRotate ? '🔄 Auto Rotate: ON' : '🔄 Auto Rotate: OFF'}
          </button>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full rounded border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold uppercase text-threat-text transition hover:bg-white/10"
        >
          {showFilters ? '▼ Hide Filters' : '▶ Show Filters'}
        </button>

        {/* Attack Type Filters */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
            <div className="text-[9px] font-semibold uppercase text-threat-dim mb-2">
              Attack Types ({activeFilters.size}/{ATTACK_TYPES.length})
            </div>
            <div className="grid grid-cols-2 gap-1">
              {ATTACK_TYPES.slice(0, 8).map((type) => (
                <label
                  key={type}
                  className="flex cursor-pointer items-center gap-1.5 text-[8px]"
                >
                  <input
                    type="checkbox"
                    checked={activeFilters.has(type)}
                    onChange={() => toggleFilter(type)}
                    className="h-3 w-3 accent-blue-500"
                  />
                  <span className="truncate text-threat-text">{type}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Indicator */}
      <div className="rounded-lg border border-threat-border bg-threat-panel/80 p-2 backdrop-blur-sm w-72">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${paused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
          <span className="text-[9px] text-threat-dim">
            {paused ? 'PAUSED' : 'LIVE STREAM ACTIVE'}
          </span>
        </div>
      </div>
    </div>
  );
}
