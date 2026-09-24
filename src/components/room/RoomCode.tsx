'use client';

interface RoomCodeProps {
  code: string;
}

export function RoomCode({ code }: RoomCodeProps) {
  return (
    <div className="text-center">
      <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Código de sala</p>
      <div className="flex justify-center gap-2">
        {code.split('').map((char, i) => (
          <span
            key={i}
            className="
              w-14 h-16 flex items-center justify-center
              bg-gray-800 border-2 border-indigo-500/50
              rounded-xl text-3xl font-bold text-white
              shadow-lg shadow-indigo-500/10
            "
          >
            {char}
          </span>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3">Comparte este código con los jugadores</p>
    </div>
  );
}
