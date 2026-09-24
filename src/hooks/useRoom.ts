'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';
import { RoomPublic, GameDefinition } from '@/core/types';

export function useRoom() {
  const { isConnected, emit, on } = useSocket();
  const [room, setRoom] = useState<RoomPublic | null>(null);
  const [availableGames, setAvailableGames] = useState<GameDefinition[]>([]);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cleanups = [
      on('room:updated', (roomData) => {
        setRoom(roomData);
      }),
      on('room:closed', (data) => {
        setRoom(null);
        setError(data.reason);
      }),
      on('game:available', (games) => {
        setAvailableGames(games);
      }),
      on('error', (data) => {
        setError(data.message);
      }),
    ];

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [on]);

  const createRoom = useCallback(
    (playerName: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        emit('room:create', { playerName }, (response) => {
          if (response.success && response.roomCode) {
            resolve(response.roomCode);
          } else {
            const err = response.error || 'Error al crear la sala';
            setError(err);
            reject(new Error(err));
          }
        });
      });
    },
    [emit]
  );

  const joinRoom = useCallback(
    (roomCode: string, playerName: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        emit('room:join', { roomCode, playerName }, (response) => {
          if (response.success && response.playerId) {
            setPlayerId(response.playerId);
            resolve(response.playerId);
          } else {
            const err = response.error || 'Error al unirse';
            setError(err);
            reject(new Error(err));
          }
        });
      });
    },
    [emit]
  );

  const leaveRoom = useCallback(() => {
    emit('room:leave');
    setRoom(null);
    setPlayerId(null);
  }, [emit]);

  const selectGame = useCallback(
    (gameId: string) => {
      emit('game:select', { gameId });
    },
    [emit]
  );

  const startGame = useCallback(
    (config?: Record<string, unknown>) => {
      emit('game:start', config ? { config } : undefined);
    },
    [emit]
  );

  const endGame = useCallback(() => {
    emit('game:end');
  }, [emit]);

  const clearError = useCallback(() => setError(null), []);

  return {
    isConnected,
    room,
    availableGames,
    playerId,
    error,
    createRoom,
    joinRoom,
    leaveRoom,
    selectGame,
    startGame,
    endGame,
    clearError,
  };
}
