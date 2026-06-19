'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Globe from './Globe';
import Starfield from './Starfield';
import AttackBeam from './AttackBeam';
import Counters from './Counters';
import EventFeed from './EventFeed';
import { useAttackStream } from '@/lib/useAttackStream';
import type { AttackEvent } from '@/lib/types';

const MAX_FEED = 18;
const MAX_BEAMS = 40;

export default function ThreatMap() {
  const [paused, setPaused] = useState(false);

  const [beams, setBeams] = useState<AttackEvent[]>([]);
  const [feed, setFeed] = useState<AttackEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [sources, setSources] = useState<Set<string>>(new Set());
  const [targets, setTargets] = useState<Set<string>>(new Set());

  const latest = useAttackStream(paused);

  useEffect(() => {
    if (!latest) return;

    setBeams((prev) => [...prev.slice(-(MAX_BEAMS - 1)), latest]);
    setFeed((prev) => [latest, ...prev].slice(0, MAX_FEED));
    setTotal((t) => t + 1);
    setSources((prev) => {
      const next = new Set(prev);
      next.add(latest.sourceCode);
      return next;
    });
    setTargets((prev) => {
      const next = new Set(prev);
      next.add(latest.targetCode);
      return next;
    });
  }, [latest]);

  const removeBeam = useCallback((id: string) => {
    setBeams((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const beamEls = useMemo(
    () =>
      beams.map((e) => (
        <AttackBeam key={e.id} event={e} paused={paused} onDone={removeBeam} />
      )),
    [beams, paused, removeBeam]
  );

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <Starfield />
          <Globe autoRotate={!paused} />
          {beamEls}
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={3}
          maxDistance={12}
          rotateSpeed={0.6}
          zoomSpeed={0.8}
          autoRotate={false}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-0">
        <button
          onClick={() => setPaused((p) => !p)}
          className="pointer-events-auto absolute right-4 top-4 z-10 rounded-md border border-threat-border bg-threat-panel px-4 py-1.5 text-xs text-threat-text backdrop-blur-md transition hover:bg-white/5"
        >
          {paused ? 'Resume' : 'Pause'}
        </button>
        <EventFeed events={feed} />
        <Counters
          totalEvents={total}
          sourceCountries={sources.size}
          targetCountries={targets.size}
        />
      </div>
    </div>
  );
}
