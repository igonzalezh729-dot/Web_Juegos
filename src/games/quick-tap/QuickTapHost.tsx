'use client';

import { QuickTapHostState } from './types';
import { GameResults } from '@/core/types';
import { ScoreBoard } from '@/components/game/ScoreBoard';

interface QuickTapHostProps {
  state: QuickTapHostState;
  results: GameResults | null;
}

export function QuickTapHost({ state, results }: QuickTapHostProps) {
  if (state.phase === 'final' && results) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <ScoreBoard results={results} />
      </div>
    );
  }

  const bgColor = state.phase === 'tap' ? 'bg-green-500' : 
                  state.phase === 'result' ? 'bg-indigo-900' : 'bg-gray-900';

  return (
    <div className={`w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl transition-colors duration-200 ${bgColor} aspect-video flex flex-col relative`}>
      {/* Top Bar - Round & Scores */}
      <div className="bg-black/40 backdrop-blur-md p-4 flex justify-between items-center">
        <div className="bg-white/20 px-4 py-1 rounded-full font-bold text-white">
          Ronda {state.round} / {state.totalRounds}
        </div>
        
        {/* Compact scores */}
        <div className="flex gap-2">
          {Object.entries(state.scores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5) // Show top 5
            .map(([playerId, score]) => (
              <div 
                key={playerId} 
                className="flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full"
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: state.playerColors[playerId] }} 
                />
                <span className="text-white font-bold text-sm">{score}</span>
              </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        {state.phase === 'result' ? (
          <div className="w-full max-w-lg">
            <h2 className="text-4xl font-black text-white mb-8">{state.currentMessage}</h2>
            
            <div className="space-y-3">
              {state.roundResults[state.roundResults.length - 1]?.rankings.map((r, i) => (
                <div 
                  key={r.playerId}
                  className="flex items-center gap-4 bg-white/10 p-3 rounded-xl border border-white/5"
                >
                  <span className="text-2xl font-bold text-white/50 w-8">{i + 1}</span>
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: state.playerColors[r.playerId] }} 
                  />
                  <span className="flex-1 text-left font-bold text-white text-lg">{r.playerName}</span>
                  
                  {r.tooEarly ? (
                    <span className="text-red-400 font-bold bg-red-400/10 px-3 py-1 rounded-lg">¡Falso inicio!</span>
                  ) : r.reactionTime >= 9999 ? (
                    <span className="text-gray-400 font-medium bg-gray-400/10 px-3 py-1 rounded-lg">No pulsó</span>
                  ) : (
                    <span className="text-green-400 font-mono font-bold text-xl bg-green-400/10 px-3 py-1 rounded-lg">
                      {r.reactionTime}ms
                    </span>
                  )}
                  
                  <span className="text-yellow-400 font-bold w-8 text-right">
                    {i === 0 && !r.tooEarly && r.reactionTime < 9999 ? '+3' : 
                     i === 1 && !r.tooEarly && r.reactionTime < 9999 ? '+2' : 
                     i === 2 && !r.tooEarly && r.reactionTime < 9999 ? '+1' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <h1 className={`text-6xl md:text-8xl font-black text-white uppercase tracking-wider
            ${state.phase === 'tap' ? 'animate-pulse' : ''}
          `}>
            {state.currentMessage}
          </h1>
        )}
      </div>
    </div>
  );
}
