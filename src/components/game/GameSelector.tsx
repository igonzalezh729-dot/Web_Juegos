'use client';

import { GameDefinition } from '@/core/types';
import { Card } from '@/components/ui/Card';

interface GameSelectorProps {
  games: GameDefinition[];
  selectedGameId: string | null;
  onSelect: (gameId: string) => void;
}

export function GameSelector({ games, selectedGameId, onSelect }: GameSelectorProps) {
  if (games.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No hay juegos disponibles
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {games.map((game) => (
        <Card
          key={game.id}
          className={`cursor-pointer transition-all duration-200 hover:border-indigo-500/50 ${
            selectedGameId === game.id
              ? 'border-indigo-500 bg-indigo-500/10'
              : ''
          }`}
          padding={false}
        >
          <button
            className="w-full p-4 text-left"
            onClick={() => onSelect(game.id)}
          >
            <h3 className="font-bold text-white text-lg">{game.name}</h3>
            <p className="text-sm text-gray-400 mt-1">{game.description}</p>
            <p className="text-xs text-gray-500 mt-2">
              {game.minPlayers}-{game.maxPlayers} jugadores
            </p>
          </button>
        </Card>
      ))}
    </div>
  );
}
