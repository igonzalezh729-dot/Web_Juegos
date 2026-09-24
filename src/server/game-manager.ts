import { GameHandler, GameInstance, GameConfig, GameResults } from '@/core/types';
import { Room } from '@/core/types';
import { PlayerInput } from '@/core/types';

class GameManager {
  private handlers: Map<string, GameHandler> = new Map();
  private instances: Map<string, GameInstance> = new Map(); // roomCode -> instance
  private tickIntervals: Map<string, ReturnType<typeof setInterval>> = new Map();

  registerGame(handler: GameHandler): void {
    this.handlers.set(handler.definition.id, handler);
  }

  getAvailableGames() {
    return Array.from(this.handlers.values()).map((h) => h.definition);
  }

  getHandler(gameId: string): GameHandler | undefined {
    return this.handlers.get(gameId);
  }

  startGame(roomCode: string, gameId: string, room: Room, config?: GameConfig): GameInstance | null {
    const handler = this.handlers.get(gameId);
    if (!handler) return null;

    const playerCount = room.players.size;
    if (playerCount < handler.definition.minPlayers || playerCount > handler.definition.maxPlayers) {
      return null;
    }

    const instance = handler.initialize(room, config);
    this.instances.set(roomCode, instance);

    // Start tick loop if handler has tick method
    if (handler.tick) {
      const tickHandler = handler.tick.bind(handler);
      const interval = setInterval(() => {
        const currentInstance = this.instances.get(roomCode);
        if (!currentInstance || currentInstance.isFinished) {
          this.stopTick(roomCode);
          return;
        }
        const updated = tickHandler(currentInstance, room);
        this.instances.set(roomCode, updated);
      }, 100); // 10 ticks per second
      this.tickIntervals.set(roomCode, interval);
    }

    return instance;
  }

  handleInput(roomCode: string, input: PlayerInput, room: Room): GameInstance | null {
    const instance = this.instances.get(roomCode);
    if (!instance || instance.isFinished) return null;

    const handler = this.handlers.get(instance.gameId);
    if (!handler) return null;

    const updated = handler.handleInput(instance, input, room);
    this.instances.set(roomCode, updated);
    return updated;
  }

  getHostState(roomCode: string, room: Room): unknown | null {
    const instance = this.instances.get(roomCode);
    if (!instance) return null;

    const handler = this.handlers.get(instance.gameId);
    if (!handler) return null;

    return handler.getHostState(instance, room);
  }

  getControllerState(roomCode: string, playerId: string, room: Room): unknown | null {
    const instance = this.instances.get(roomCode);
    if (!instance) return null;

    const handler = this.handlers.get(instance.gameId);
    if (!handler) return null;

    return handler.getControllerState(instance, playerId, room);
  }

  getInstance(roomCode: string): GameInstance | undefined {
    return this.instances.get(roomCode);
  }

  getResults(roomCode: string, room: Room): GameResults | null {
    const instance = this.instances.get(roomCode);
    if (!instance) return null;

    const handler = this.handlers.get(instance.gameId);
    if (!handler) return null;

    return handler.getResults(instance, room);
  }

  endGame(roomCode: string): void {
    this.stopTick(roomCode);
    this.instances.delete(roomCode);
  }

  private stopTick(roomCode: string): void {
    const interval = this.tickIntervals.get(roomCode);
    if (interval) {
      clearInterval(interval);
      this.tickIntervals.delete(roomCode);
    }
  }
}

export const gameManager = new GameManager();
