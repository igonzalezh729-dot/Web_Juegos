'use client';

import { QuickTapControllerState } from './types';

interface QuickTapControllerProps {
  state: QuickTapControllerState;
  onAction: (action: string, data?: unknown) => void;
  color: string;
}

export function QuickTapController({ state, onAction, color }: QuickTapControllerProps) {
  const handleTap = (e: React.TouchEvent | React.MouseEvent) => {
    // Prevent default to avoid double-firing on touch devices
    e.preventDefault(); 
    
    if (state.canTap) {
      onAction('tap');
    }
  };

  // Determine button state/color based on game phase
  let buttonClass = 'bg-gray-800 border-gray-700 text-gray-500';
  let isInteractive = false;
  
  if (state.phase === 'waiting' || state.phase === 'result' || state.phase === 'final') {
    buttonClass = 'bg-indigo-900/50 border-indigo-800 text-indigo-300';
  } else if (!state.canTap) {
    buttonClass = 'bg-gray-800 border-gray-700 text-gray-500'; // Already tapped
  } else if (state.phase === 'ready') {
    buttonClass = 'bg-red-600 active:bg-red-700 border-red-500 text-white shadow-xl shadow-red-900/50';
    isInteractive = true;
  } else if (state.phase === 'tap') {
    buttonClass = 'bg-green-500 active:bg-green-600 border-green-400 text-white shadow-2xl shadow-green-900/50 scale-[1.02]';
    isInteractive = true;
  }

  return (
    <div className="flex-1 flex flex-col h-full w-full">
      {/* Top info bar */}
      <div className="bg-gray-900 p-4 flex justify-between items-center border-b border-gray-800">
        <div className="text-gray-400 text-sm font-medium">
          Ronda {state.round}/{state.totalRounds}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Puntos:</span>
          <span className="text-white font-bold text-lg bg-gray-800 px-3 py-0.5 rounded-full border" style={{ borderColor: color }}>
            {state.myScore}
          </span>
        </div>
      </div>

      {/* Main button area */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center relative">
        <button
          onTouchStart={isInteractive ? handleTap : undefined}
          onMouseDown={isInteractive ? handleTap : undefined}
          disabled={!isInteractive}
          className={`
            w-full max-w-[90vw] aspect-square rounded-full flex flex-col items-center justify-center
            border-4 transition-all duration-100 select-none touch-none
            ${buttonClass}
            ${isInteractive ? 'active:scale-95' : ''}
          `}
        >
          <span className="text-3xl font-black uppercase tracking-wider px-4 text-center">
            {state.message}
          </span>
          
          {state.phase === 'tap' && state.canTap && (
            <span className="text-white/70 text-sm mt-4 font-bold">¡AHORA!</span>
          )}
        </button>

        {/* Reaction time feedback */}
        {state.phase === 'result' && state.lastReactionTime !== null && (
          <div className={`
            absolute top-[15%] left-1/2 -translate-x-1/2 
            px-6 py-3 rounded-full font-bold text-xl shadow-2xl whitespace-nowrap
            animate-bounce
            ${state.lastReactionTime === -1 ? 'bg-red-500 text-white' : 'bg-white text-black'}
          `}>
            {state.lastReactionTime === -1 ? '¡Falso inicio!' : `${state.lastReactionTime} ms`}
          </div>
        )}
      </div>
    </div>
  );
}
