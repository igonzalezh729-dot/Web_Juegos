import { PlayerInput } from './player';
import { Room } from './room';

export interface GameDefinition {
  id: string;
  name: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  thumbnail: string;
}

export interface GameConfig {
  rounds?: number;
  timeLimit?: number;
  [key: string]: unknown;
}

export interface GameInstance {
  gameId: string;
  state: unknown;
  config: GameConfig;
  startedAt: number;
  round: number;
  isFinished: boolean;
}

export interface GameHandler {
  definition: GameDefinition;
  initialize(room: Room, config?: GameConfig): GameInstance;
  handleInput(instance: GameInstance, input: PlayerInput, room: Room): GameInstance;
  tick?(instance: GameInstance, room: Room): GameInstance;
  getHostState(instance: GameInstance, room: Room): unknown;
  getControllerState(instance: GameInstance, playerId: string, room: Room): unknown;
  isFinished(instance: GameInstance): boolean;
  getResults(instance: GameInstance, room: Room): GameResults;
}

export interface GameResults {
  rankings: Array<{
    playerId: string;
    playerName: string;
    score: number;
    position: number;
  }>;
  stats?: Record<string, unknown>;
}
