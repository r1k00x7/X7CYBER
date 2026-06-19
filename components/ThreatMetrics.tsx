'use client';

import { useEffect, useState } from 'react';
import type { AttackEvent, AttackType } from '@/lib/types';
import { ATTACK_COLORS, THREAT_LEVEL_NAMES } from '@/lib/types';

interface Props {
  events: AttackEvent[];
}

export default function ThreatMetrics({ events }: Props) {
  const [metrics, setMetrics] = useState({
    avgThreatLevel: 0,
    recentAttackType: '',
    attacksPerSecond: 0,
    timeWindow: '1m',
  });

  useEffect(() => {
    if (events.length === 0) return;

    // Calculate average threat level
    const avgThreat = events.reduce((sum, e) => sum + e.threatLevel, 0) / events.length;

    // Most recent attack type
    const recentType = events[0]?.attackType || 'N/A';

    // Simulated attacks per second (based on feed)
    const aps = (events.length / 18).toFixed(1);

    setMetrics({
      avgThreatLevel: Math.round(avgThreat * 10) / 10,
      recentAttackType: recentType,
      attacksPerSecond: parseFloat(aps),
      timeWindow: '1m',
    });
  }, [events]);

  // Get color for threat level
  const getThreatColor = (level: number) => {
    if (level <= 1.5) return 'text-green-400';
    if (level <= 2.5) return 'text-yellow-400';
    if (level <= 3.5) return 'text-orange-400';
    return 'text-red-600';
  };

  return (
    <div className="pointer-events-auto absolute bottom-4 right-4 z-10 w-80 rounded-xl border border-threat-border bg-threat-panel p-4 backdrop-blur-md">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-threat-text">
          ⚠️ Threat Metrics
        </h2>
        <span className="text-[10px] text-threat-dim">Last {metrics.timeWindow}</span>
      </div>

      {/* Main Metrics */}
      <div className="space-y-3 mb-4 pb-4 border-b border-white/10">
        {/* Average Threat Level */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-semibold uppercase text-threat-dim">
              Avg Threat Level
            </span>
            <span className={`font-mono text-lg font-bold ${getThreatColor(metrics.avgThreatLevel)}`}>
              {metrics.avgThreatLevel.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded bg-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-600"
                style={{ width: `${(metrics.avgThreatLevel / 5) * 100}%` }}
              />
            </div>
            <span className="text-[8px] text-threat-dim">/ 5.0</span>
          </div>
        </div>

        {/* Attacks Per Second */}
        <MetricRow
          label="Attack Rate"
          value={`${metrics.attacksPerSecond}/sec`}
          unit="RPS"
          color="text-blue-400"
        />

        {/* Total Events */}
        <MetricRow
          label="Total Events"
          value={events.length.toLocaleString()}
          unit="events"
          color="text-cyan-400"
        />
      </div>

      {/* Recent Attack Info */}
      {events.length > 0 && (
        <div className="pb-4 border-b border-white/10 mb-4">
          <div className="text-[9px] font-semibold uppercase text-threat-dim mb-2">
            Latest Attack
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-threat-dim">Type:</span>
              <span className="font-mono text-threat-text">{events[0].attackType}</span>
            </div>
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-threat-dim">From:</span>
              <span className="font-mono text-red-400">{events[0].sourceCode}</span>
            </div>
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-threat-dim">To:</span>
              <span className="font-mono text-yellow-400">{events[0].targetCode}</span>
            </div>
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-threat-dim">Level:</span>
              <span className={`font-mono font-bold ${getThreatColor(events[0].threatLevel)}`}>
                {THREAT_LEVEL_NAMES[events[0].threatLevel]}
              </span>
            </div>
            <div className="flex items-center justify-between text-[9px]">
              <span className="text-threat-dim">Time:</span>
              <span className="font-mono text-threat-text">
                {new Date(events[0].time).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Threat Distribution Mini */}
      <div>
        <div className="text-[9px] font-semibold uppercase text-threat-dim mb-2">
          Threat Spread
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((level) => {
            const count = events.filter(e => e.threatLevel === level).length;
            const percentage = events.length > 0 ? (count / events.length) * 100 : 0;
            const colors = ['', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-red-900'];
            return (
              <div key={level} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-full h-8 ${colors[level]} rounded opacity-60 hover:opacity-100 transition`} />
                <span className="text-[7px] text-threat-dim">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MetricRow({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string;
  unit: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[9px] text-threat-dim">{label}</span>
      <div className="flex items-center gap-1">
        <span className={`font-mono font-semibold ${color}`}>{value}</span>
        <span className="text-[8px] text-threat-dim">{unit}</span>
      </div>
    </div>
  );
}
