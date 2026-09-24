'use client';

import { GameResults } from '@/core/types';
import { Card } from '@/components/ui/Card';

interface ScoreBoardProps {
  results: GameResults;
}

const medals = ['🥇', '🥈', '🥉'];

export function ScoreBoard({ results }: ScoreBoardProps) {
  return (
    <Card>
      <h2 className="text-2xl font-bold text-white text-center mb-6">🏆 Resultados</h2>
      <div className="space-y-3">
        {results.rankings.map((ranking) => (
          <div
            key={ranking.playerId}
            className={`
              flex items-center gap-3 p-3 rounded-xl
              ${ranking.position === 1 ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-gray-800/50'}
            `}
          >
            <span className="text-2xl w-10 text-center">
              {medals[ranking.position - 1] || ranking.position}
            </span>
            <span className="flex-1 font-medium text-white">{ranking.playerName}</span>
            <span className="text-xl font-bold text-indigo-400">{ranking.score} pts</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
