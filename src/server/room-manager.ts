import { Room, RoomPublic, Player, RoomStatus } from '@/core/types';
import { generateRoomCode, generatePlayerId } from '@/core/utils';
import { MAX_PLAYERS_DEFAULT, PLAYER_COLORS, ROOM_EXPIRY_MS } from '@/core/constants';

class RoomManager {
  private rooms: Map<string, Room> = new Map();
  private socketToRoom: Map<string, string> = new Map();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.startCleanup();
  }

  createRoom(hostSocketId: string): Room {
    let code = generateRoomCode();
    while (this.rooms.has(code)) {
      code = generateRoomCode();
    }

    const room: Room = {
      code,
      hostSocketId,
      players: new Map(),
      status: 'waiting',
      currentGameId: null,
      gameState: null,
      createdAt: Date.now(),
      maxPlayers: MAX_PLAYERS_DEFAULT,
    };

    this.rooms.set(code, room);
    this.socketToRoom.set(hostSocketId, code);
    return room;
  }

  joinRoom(roomCode: string, playerName: string, socketId: string): { room: Room; player: Player } | null {
    const room = this.rooms.get(roomCode);
    if (!room) return null;
    if (room.status !== 'waiting') return null;
    if (room.players.size >= room.maxPlayers) return null;

    const playerId = generatePlayerId();
    const colorIndex = room.players.size % PLAYER_COLORS.length;

    const player: Player = {
      id: playerId,
      socketId,
      name: playerName,
      color: PLAYER_COLORS[colorIndex],
      score: 0,
      isConnected: true,
    };

    room.players.set(playerId, player);
    this.socketToRoom.set(socketId, roomCode);

    return { room, player };
  }

  leaveRoom(socketId: string): { room: Room; player?: Player; wasHost: boolean } | null {
    const roomCode = this.socketToRoom.get(socketId);
    if (!roomCode) return null;

    const room = this.rooms.get(roomCode);
    if (!room) return null;

    this.socketToRoom.delete(socketId);

    // Check if this was the host
    if (room.hostSocketId === socketId) {
      // Close the room
      this.closeRoom(roomCode);
      return { room, wasHost: true };
    }

    // Find and remove the player
    let removedPlayer: Player | undefined;
    for (const [playerId, player] of room.players) {
      if (player.socketId === socketId) {
        removedPlayer = player;
        room.players.delete(playerId);
        break;
      }
    }

    return { room, player: removedPlayer, wasHost: false };
  }

  closeRoom(roomCode: string): void {
    const room = this.rooms.get(roomCode);
    if (!room) return;

    // Remove all socket mappings
    this.socketToRoom.delete(room.hostSocketId);
    for (const player of room.players.values()) {
      this.socketToRoom.delete(player.socketId);
    }

    this.rooms.delete(roomCode);
  }

  getRoom(roomCode: string): Room | undefined {
    return this.rooms.get(roomCode);
  }

  getRoomBySocket(socketId: string): Room | undefined {
    const roomCode = this.socketToRoom.get(socketId);
    if (!roomCode) return undefined;
    return this.rooms.get(roomCode);
  }

  isHost(socketId: string, roomCode: string): boolean {
    const room = this.rooms.get(roomCode);
    return room?.hostSocketId === socketId;
  }

  getPlayerBySocket(socketId: string): Player | undefined {
    const room = this.getRoomBySocket(socketId);
    if (!room) return undefined;
    for (const player of room.players.values()) {
      if (player.socketId === socketId) return player;
    }
    return undefined;
  }

  setRoomStatus(roomCode: string, status: RoomStatus): void {
    const room = this.rooms.get(roomCode);
    if (room) {
      room.status = status;
    }
  }

  updateGameState(roomCode: string, state: unknown): void {
    const room = this.rooms.get(roomCode);
    if (room) {
      room.gameState = state;
    }
  }

  toPublic(room: Room): RoomPublic {
    return {
      code: room.code,
      players: Array.from(room.players.values()).map((p) => ({
        id: p.id,
        name: p.name,
        color: p.color,
        score: p.score,
        isConnected: p.isConnected,
      })),
      status: room.status,
      currentGameId: room.currentGameId,
      maxPlayers: room.maxPlayers,
    };
  }

  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [code, room] of this.rooms) {
        if (now - room.createdAt > ROOM_EXPIRY_MS) {
          this.closeRoom(code);
        }
      }
    }, 60000); // Check every minute
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

export const roomManager = new RoomManager();
