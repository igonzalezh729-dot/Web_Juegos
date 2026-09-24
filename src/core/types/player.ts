export interface Player {
  id: string;
  socketId: string;
  name: string;
  color: string;
  score: number;
  isConnected: boolean;
}

export interface PlayerInput {
  playerId: string;
  action: string;
  data?: unknown;
  timestamp: number;
}
