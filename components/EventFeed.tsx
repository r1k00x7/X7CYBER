'use client';

import type { AttackEvent } from '@/lib/types';

const TYPE_COLOR: Record<string, string> = {
  'Web Attackers': '#ff8a3b',
  'DDoS Attackers': '#ff3b4e',
  Intruders: '#d65bff',
  Scanners: '#3aa0ff',
  Anonymizers: '#39d98a',
};

export default function EventFeed({ events }: { events: AttackEvent[] }) {
  return (
    <div className="panel-scroll pointer-events-auto absolute bottom-4 left-4 z-10 max-h-72 w-80 overflow-hidden rounded-md border border-threat-border bg-threat-panel p-3 backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-threat-dim">
          Live Attack Report
        </h2>
        <span className="flex items-center gap-1 text-[10px] text-threat-dim">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-threat-source" />
          LIVE
        </span>
      </div>

      <div className="flex flex-col">
        {events.length === 0 && (
          <div className="py-4 text-center text-[11px] text-threat-dim">
            Waiting for attacks…
          </div>
        )}
        {events.map((e) => (
          <div
            key={e.id}
            className="flex items-start gap-2 border-b border-white/5 py-1.5 last:border-0"
          >
            <span className="font-mono text-[10px] leading-4 text-threat-dim">
              {new Date(e.time).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs leading-4">
                <span className="text-threat-source">{e.sourceCode}</span>
                <span className="mx-1 text-threat-dim">&rarr;</span>
                <span className="text-threat-target">{e.targetCode}</span>
                <span className="ml-1 text-threat-dim">
                  {e.sourceCountry} to {e.targetCountry}
                </span>
              </div>
              <div
                className="text-[10px] leading-4"
                style={{ color: TYPE_COLOR[e.attackType] ?? '#7c8aa5' }}
              >
                {e.attackType}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
