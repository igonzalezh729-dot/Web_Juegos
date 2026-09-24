'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface JoinFormProps {
  onCreateRoom: (name: string) => void;
  onJoinRoom: (code: string, name: string) => void;
  isConnected: boolean;
  error?: string | null;
}

export function JoinForm({ onCreateRoom, onJoinRoom, isConnected, error }: JoinFormProps) {
  const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');

  const handleCreate = () => {
    if (name.trim()) onCreateRoom(name.trim());
  };

  const handleJoin = () => {
    if (name.trim() && roomCode.trim()) onJoinRoom(roomCode.trim(), name.trim());
  };

  if (mode === 'select') {
    return (
      <div className="space-y-4 w-full max-w-sm mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-2">🎮 Party Games</h1>
        <p className="text-gray-400 text-center mb-8">
          Juega con amigos usando tu móvil como mando
        </p>

        {!isConnected && (
          <div className="text-center text-yellow-400 text-sm mb-4">
            ⏳ Conectando al servidor...
          </div>
        )}

        <Button
          fullWidth
          size="lg"
          onClick={() => setMode('create')}
          disabled={!isConnected}
        >
          🖥️ Crear Sala
        </Button>
        <Button
          fullWidth
          size="lg"
          variant="secondary"
          onClick={() => setMode('join')}
          disabled={!isConnected}
        >
          📱 Unirse a Sala
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <h2 className="text-xl font-bold text-white mb-4">
        {mode === 'create' ? '🖥️ Crear Sala' : '📱 Unirse a Sala'}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Tu nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Introduce tu nombre"
            maxLength={20}
            className="
              w-full px-4 py-3 rounded-xl
              bg-gray-900 border border-gray-700
              text-white placeholder-gray-500
              focus:outline-none focus:border-indigo-500
              transition-colors
            "
            autoFocus
          />
        </div>

        {mode === 'join' && (
          <div>
            <label className="block text-sm text-gray-400 mb-1">Código de sala</label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="ABCD"
              maxLength={4}
              className="
                w-full px-4 py-3 rounded-xl
                bg-gray-900 border border-gray-700
                text-white placeholder-gray-500 text-center text-2xl tracking-widest
                focus:outline-none focus:border-indigo-500
                transition-colors uppercase
              "
            />
          </div>
        )}

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setMode('select')}>
            ← Volver
          </Button>
          <Button
            fullWidth
            onClick={mode === 'create' ? handleCreate : handleJoin}
            disabled={!name.trim() || (mode === 'join' && !roomCode.trim())}
          >
            {mode === 'create' ? 'Crear' : 'Unirse'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
