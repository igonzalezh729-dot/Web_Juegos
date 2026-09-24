'use client';

interface PlayerData {
  id: string;
  name: string;
  color: string;
  score: number;
  isConnected: boolean;
}

interface PlayerListProps {
  players: PlayerData[];
  showScores?: boolean;
}

export function PlayerList({ players, showScores = false }: PlayerListProps) {
  if (players.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-4xl mb-2">👥</p>
        <p>Esperando jugadores...</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {players.map((player) => (
        <div
          key={player.id}
          className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
            style={{ backgroundColor: player.color }}
          >
            {player.name.charAt(0).toUpperCase()}
          </div>
          <span className="flex-1 font-medium text-white">
            {player.name}
            {!player.isConnected && (
              <span className="text-xs text-red-400 ml-2">(desconectado)</span>
            )}
          </span>
          {showScores && (
            <span className="text-lg font-bold text-indigo-400">{player.score}</span>
          )}
        </div>
      ))}
    </div>
  );
}
