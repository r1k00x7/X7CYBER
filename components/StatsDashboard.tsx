'use client';

import { useEffect, useState } from 'react';
import type { AttackEvent, AttackType } from '@/lib/types';
import { ATTACK_TYPES, THREAT_LEVEL_NAMES } from '@/lib/types';

interface StatsProps {
  events: AttackEvent[];
}

export default function StatsDashboard({ events }: StatsProps) {
  const [stats, setStats] = useState({
    totalEvents: 0,
    sourceCountries: new Set<string>(),
    targetCountries: new Set<string>(),
    attacksByType: {} as Record<AttackType, number>,
    threatLevelDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>,
    highestThreatCount: 0,
    mostActiveAttacker: '',
    mostTargetedCountry: '',
  });

  useEffect(() => {
    const sourceCountries = new Set<string>();
    const targetCountries = new Set<string>();
    const attacksByType: Record<string, number> = {};
    const threatLevelDist: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const targetCountCounts: Record<string, number> = {};
    const attackerCountCounts: Record<string, number> = {};

    events.forEach((event) => {
      sourceCountries.add(event.sourceCode);
      targetCountries.add(event.targetCode);
      attacksByType[event.attackType] = (attacksByType[event.attackType] || 0) + 1;
      threatLevelDist[event.threatLevel]++;
      targetCountCounts[event.targetCode] = (targetCountCounts[event.targetCode] || 0) + 1;
      attackerCountCounts[event.sourceCode] = (attackerCountCounts[event.sourceCode] || 0) + 1;
    });

    const mostActiveAttacker = Object.entries(attackerCountCounts).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0] || '-';

    const mostTargetedCountry = Object.entries(targetCountCounts).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0] || '-';

    const highestThreatCount = threatLevelDist[5];

    setStats({
      totalEvents: events.length,
      sourceCountries,
      targetCountries,
      attacksByType: attacksByType as Record<AttackType, number>,
      threatLevelDistribution: threatLevelDist,
      highestThreatCount,
      mostActiveAttacker,
      mostTargetedCountry,
    });
  }, [events]);

  return (
    <div className="pointer-events-auto absolute top-4 right-4 z-10 w-96 rounded-xl border border-threat-border bg-threat-panel p-4 backdrop-blur-md">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-threat-text">
          📊 Global Statistics
        </h2>
        <span className="text-[10px] text-threat-dim">Real-time Data</span>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard 
          label="Total Events" 
          value={stats.totalEvents.toLocaleString()} 
          color="text-blue-400"
        />
        <StatCard 
          label="Source Countries" 
          value={stats.sourceCountries.size.toString()} 
          color="text-red-400"
        />
        <StatCard 
          label="Target Countries" 
          value={stats.targetCountries.size.toString()} 
          color="text-yellow-400"
        />
        <StatCard 
          label="Critical+ Threats" 
          value={stats.highestThreatCount.toString()} 
          color="text-red-600"
          highlight
        />
      </div>

      {/* Top Threats */}
      <div className="mb-4 pb-4 border-b border-white/10">
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-threat-dim mb-2">
          Top Attack Types
        </h3>
        <div className="space-y-1">
          {Object.entries(stats.attacksByType)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 4)
            .map(([type, count]) => (
              <div key={type} className="flex items-center justify-between text-[9px]">
                <span className="text-threat-text truncate">{type}</span>
                <span className="font-mono text-blue-400">{count}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Threat Level Distribution */}
      <div className="mb-4 pb-4 border-b border-white/10">
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-threat-dim mb-2">
          Threat Levels
        </h3>
        <div className="space-y-1">
          {(Object.entries(stats.threatLevelDistribution) as Array<[string, number]>).map(
            ([level, count]) => {
              const levelNum = parseInt(level) as 1 | 2 | 3 | 4 | 5;
              const levelName = THREAT_LEVEL_NAMES[levelNum];
              const colors = ['', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-red-900'];
              const percentage = stats.totalEvents > 0 ? (count / stats.totalEvents) * 100 : 0;
              return (
                <div key={level} className="space-y-0.5">
                  <div className="flex justify-between text-[9px]">
                    <span className="text-threat-dim">{levelName}</span>
                    <span className="font-mono text-threat-text">{count}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded overflow-hidden">
                    <div
                      className={`h-full ${colors[levelNum]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Key Info */}
      <div className="space-y-1">
        <InfoRow 
          label="Most Active Attacker" 
          value={stats.mostActiveAttacker} 
        />
        <InfoRow 
          label="Most Targeted" 
          value={stats.mostTargetedCountry} 
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  highlight,
}: {
  label: string;
  value: string;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div className={`p-2 rounded border ${highlight ? 'border-red-600/50 bg-red-900/10' : 'border-threat-border bg-white/5'}`}>
      <div className={`font-mono text-lg font-bold ${color}`}>{value}</div>
      <div className="text-[8px] uppercase tracking-wider text-threat-dim">{label}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[9px]">
      <span className="text-threat-dim">{label}:</span>
      <span className="font-mono text-threat-text font-semibold">{value}</span>
    </div>
  );
}
