import { Player } from './player';

export type RoomStatus = 'waiting' | 'playing' | 'finished';

export interface Room {
  code: string;
  hostSocketId: string;
  players: Map<string, Player>;
  status: RoomStatus;
  currentGameId: string | null;
  gameState: unknown;
  createdAt: number;
  maxPlayers: number;
}

export interface RoomPublic {
  code: string;
  players: Array<{
    id: string;
    name: string;
    color: string;
    score: number;
    isConnected: boolean;
  }>;
  status: RoomStatus;
  currentGameId: string | null;
  maxPlayers: number;
}
