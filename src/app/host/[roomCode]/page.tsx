'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/hooks/useRoom';
import { useGame } from '@/hooks/useGame';
import { RoomCode } from '@/components/room/RoomCode';
import { PlayerList } from '@/components/room/PlayerList';
import { GameSelector } from '@/components/game/GameSelector';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { QuickTapHost } from '@/games/quick-tap/QuickTapHost';
import { QuickTapHostState } from '@/games/quick-tap/types';

export default function HostPage() {
  const router = useRouter();
  
  const { room, availableGames, isConnected, leaveRoom, selectGame, startGame, endGame } = useRoom();
  const { gameState, isStarting, countdown, results } = useGame();

  useEffect(() => {
    if (isConnected && !room) {
      // Room was closed or we got disconnected
      router.push('/');
    }
  }, [isConnected, room, router]);

  const handleLeave = () => {
    leaveRoom();
    router.push('/');
  };

  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400">Cargando sala...</p>
      </div>
    );
  }

  // --- PLAYING STATE ---
  if (room.status === 'playing' || room.status === 'finished') {
    return (
      <div className="flex-1 flex flex-col bg-gray-950 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="bg-gray-800 px-4 py-2 rounded-full font-mono font-bold text-xl tracking-widest text-indigo-400 border border-indigo-500/30">
            {room.code}
          </div>
          <Button variant="danger" size="sm" onClick={endGame}>
            Finalizar Juego
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          {isStarting ? (
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">El juego empieza en...</h2>
              <p className="text-8xl font-black text-indigo-500 animate-pulse">{countdown}</p>
            </div>
          ) : room.currentGameId === 'quick-tap' && gameState ? (
            <QuickTapHost 
              state={gameState as QuickTapHostState} 
              results={results} 
            />
          ) : (
            <div className="text-gray-400">Juego en curso...</div>
          )}
        </div>
      </div>
    );
  }

  // --- WAITING LOBBY STATE ---
  return (
    <div className="flex-1 flex p-6 gap-6 bg-gray-950 h-screen overflow-hidden">
      {/* Sidebar: Room Info & Players */}
      <div className="w-80 flex flex-col gap-6">
        <Card>
          <RoomCode code={room.code} />
        </Card>

        <Card className="flex-1 overflow-y-auto" padding={false}>
          <div className="p-4 border-b border-gray-700/50 sticky top-0 bg-gray-800/90 backdrop-blur-sm z-10 flex justify-between items-center">
            <h3 className="font-bold text-white">Jugadores</h3>
            <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-1 rounded-full font-bold">
              {room.players.length} / {room.maxPlayers}
            </span>
          </div>
          <div className="p-4">
            <PlayerList players={room.players} showScores={true} />
          </div>
        </Card>

        <Button variant="danger" onClick={handleLeave}>
          Cerrar Sala
        </Button>
      </div>

      {/* Main Content: Game Selection */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col h-full">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Selecciona un juego</h2>
              <p className="text-gray-400 text-sm">Elige el minijuego al que queréis jugar.</p>
            </div>
            {room.currentGameId && room.players.length > 0 && (
              <Button size="lg" className="animate-pulse shadow-indigo-500/50 shadow-xl" onClick={() => startGame()}>
                ¡JUGAR AHORA! 🚀
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 pb-4">
            <GameSelector
              games={availableGames}
              selectedGameId={room.currentGameId}
              onSelect={selectGame}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
