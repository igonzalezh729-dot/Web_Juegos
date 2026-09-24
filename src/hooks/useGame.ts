'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';
import { GameResults } from '@/core/types';

export function useGame<TState = unknown>() {
  const { on, emit } = useSocket();
  const [gameState, setGameState] = useState<TState | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [results, setResults] = useState<GameResults | null>(null);

  useEffect(() => {
    const cleanups = [
      on('game:starting', (data) => {
        setIsStarting(true);
        setResults(null);
        setCountdown(data.countdown);

        // Countdown timer
        let remaining = data.countdown;
        const interval = setInterval(() => {
          remaining--;
          setCountdown(remaining);
          if (remaining <= 0) {
            clearInterval(interval);
            setIsStarting(false);
            setCountdown(null);
          }
        }, 1000);
      }),
      on('game:state', (state) => {
        setGameState(state as TState);
      }),
      on('game:finished', (gameResults) => {
        setResults(gameResults);
      }),
    ];

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [on]);

  const sendInput = useCallback(
    (action: string, data?: unknown) => {
      emit('game:input', { action, data });
    },
    [emit]
  );

  return {
    gameState,
    isStarting,
    countdown,
    results,
    sendInput,
  };
}
