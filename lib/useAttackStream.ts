'use client';

import { useEffect, useRef, useState } from 'react';
import type { AttackEvent } from './types';

// Subscribe to the SSE stream of simulated attack events.
// EventSource auto-reconnects when the bounded server stream ends.
export function useAttackStream(paused: boolean) {
  const [latest, setLatest] = useState<AttackEvent | null>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const source = new EventSource('/api/attacks');

    source.onmessage = (e) => {
      if (pausedRef.current) return;
      try {
        setLatest(JSON.parse(e.data) as AttackEvent);
      } catch {
        // ignore malformed payloads
      }
    };

    source.onerror = () => {
      // EventSource will attempt to reconnect automatically.
    };

    return () => source.close();
  }, []);

  return latest;
}
