'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/hooks/useRoom';
import { useGame } from '@/hooks/useGame';
import { Button } from '@/components/ui/Button';
import { QuickTapController } from '@/games/quick-tap/QuickTapController';
import { QuickTapControllerState } from '@/games/quick-tap/types';

export default function ControllerPage() {
  const router = useRouter();
  
  const { room, playerId, leaveRoom, error } = useRoom();
  const { gameState, isStarting, countdown, sendInput } = useGame();
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // If we're not connected or don't have a room/playerId after a short delay, redirect home
    const timeout = setTimeout(() => {
      if (!room || !playerId) {
        router.push('/');
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [room, playerId, router]);

  // Prevent sleep on mobile devices
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;
    
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator && hasInteracted) {
        try {
          wakeLock = await navigator.wakeLock.request('screen');
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error(`${err.name}, ${err.message}`);
          }
        }
      }
    };
    
    requestWakeLock();
    
    const handleVisibilityChange = () => {
      if (wakeLock !== null && document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock !== null) {
        wakeLock.release().catch(console.error);
      }
    };
  }, [hasInteracted]);

  const handleLeave = () => {
    leaveRoom();
    router.push('/');
  };

  const handleInteraction = () => {
    if (!hasInteracted) setHasInteracted(true);
  };

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-950">
        <p className="text-red-400 mb-4 text-center">{error}</p>
        <Button onClick={() => router.push('/')}>Volver al inicio</Button>
      </div>
    );
  }

  if (!room || !playerId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-950">
        <p className="text-gray-400 animate-pulse">Conectando a la sala...</p>
      </div>
    );
  }

  const myPlayer = room.players.find(p => p.id === playerId);

  // --- PLAYING STATE ---
  if (room.status === 'playing') {
    return (
      <div 
        className="flex-1 flex flex-col h-full bg-gray-950 select-none overflow-hidden touch-none"
        onClick={handleInteraction}
      >
        {isStarting ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-white mb-2">¡Prepárate!</h2>
            <p className="text-6xl font-black text-indigo-500 animate-pulse">{countdown}</p>
          </div>
        ) : room.currentGameId === 'quick-tap' && gameState ? (
          <QuickTapController 
            state={gameState as QuickTapControllerState} 
            onAction={(action, data) => sendInput(action, data)}
            color={myPlayer?.color || '#fff'}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400">Juego en curso...</p>
          </div>
        )}
      </div>
    );
  }

  // --- WAITING LOBBY STATE ---
  return (
    <div 
      className="flex-1 flex flex-col bg-gray-950 p-6 h-screen"
      onClick={handleInteraction}
    >
      <div className="flex justify-between items-center mb-8">
        <div className="bg-gray-800 px-4 py-1.5 rounded-full font-mono font-bold tracking-widest text-indigo-400 border border-indigo-500/30 text-sm">
          {room.code}
        </div>
        <button 
          onClick={handleLeave}
          className="text-gray-500 hover:text-red-400 text-sm font-medium"
        >
          Salir
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto w-full gap-8">
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold mb-2 shadow-2xl"
          style={{ 
            backgroundColor: myPlayer?.color,
            boxShadow: `0 10px 40px -10px ${myPlayer?.color}`
          }}
        >
          {myPlayer?.name.charAt(0).toUpperCase()}
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            ¡Hola, {myPlayer?.name}!
          </h2>
          <p className="text-gray-400">Estás en la sala</p>
        </div>

        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 w-full">
          {room.status === 'finished' ? (
            <>
              <p className="text-3xl mb-2">🏆</p>
              <p className="text-white font-medium mb-1">¡Partida terminada!</p>
              <p className="text-sm text-gray-400">Mira los resultados en la pantalla principal.</p>
            </>
          ) : (
            <>
              <p className="text-3xl mb-2 animate-bounce">👀</p>
              <p className="text-white font-medium mb-1">Mira a la pantalla principal</p>
              <p className="text-sm text-gray-400">El host seleccionará el juego pronto.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
