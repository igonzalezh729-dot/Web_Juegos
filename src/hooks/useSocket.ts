'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@/core/types';

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function useSocket() {
  const socketRef = useRef<AppSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket: AppSocket = io({
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  const emit = useCallback(
    <E extends keyof ClientToServerEvents>(
      event: E,
      ...args: Parameters<ClientToServerEvents[E]>
    ) => {
      if (socketRef.current) {
        socketRef.current.emit(event, ...args);
      }
    },
    []
  );

  const on = useCallback(
    <E extends keyof ServerToClientEvents>(
      event: E,
      handler: ServerToClientEvents[E]
    ) => {
      if (socketRef.current) {
        const socket = socketRef.current as Socket;
        const eventName = String(event);
        socket.on(eventName, handler as (...args: unknown[]) => void);
        return () => {
          socket.off(eventName, handler as (...args: unknown[]) => void);
        };
      }
      return () => {};
    },
    []
  );

  return { isConnected, emit, on };
}
