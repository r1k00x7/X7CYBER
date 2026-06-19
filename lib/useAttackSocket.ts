'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { AttackEvent } from './types';

// Subscribe to the Socket.IO stream of simulated attack events.
// `paused` stops accepting new events without disconnecting.
export function useAttackSocket(paused: boolean) {
  const [latest, setLatest] = useState<AttackEvent | null>(null);
  const pausedRef = useRef(paused);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const socket = io({ transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('attack', (event: AttackEvent) => {
      if (pausedRef.current) return;
      setLatest(event);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  return latest;
}
