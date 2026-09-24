import { RoomPublic } from './room';
import { GameDefinition, GameResults } from './game';

// Client -> Server events
export interface ClientToServerEvents {
  'room:create': (data: { playerName: string }, callback: (response: { success: boolean; roomCode?: string; error?: string }) => void) => void;
  'room:join': (data: { roomCode: string; playerName: string }, callback: (response: { success: boolean; playerId?: string; error?: string }) => void) => void;
  'room:leave': () => void;
  'game:select': (data: { gameId: string }) => void;
  'game:start': (data?: { config?: Record<string, unknown> }) => void;
  'game:input': (data: { action: string; data?: unknown }) => void;
  'game:end': () => void;
}

// Server -> Client events
export interface ServerToClientEvents {
  'room:updated': (room: RoomPublic) => void;
  'room:closed': (data: { reason: string }) => void;
  'player:joined': (data: { playerId: string; playerName: string }) => void;
  'player:left': (data: { playerId: string; playerName: string }) => void;
  'game:available': (games: GameDefinition[]) => void;
  'game:starting': (data: { gameId: string; countdown: number }) => void;
  'game:state': (state: unknown) => void;
  'game:finished': (results: GameResults) => void;
  'error': (data: { message: string }) => void;
}
