import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from '@/core/types';
import { roomManager } from './room-manager';
import { gameManager } from './game-manager';
import { sanitizeName } from '@/core/utils';

type IOServer = Server<ClientToServerEvents, ServerToClientEvents>;
type IOSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export function registerSocketHandlers(io: IOServer): void {
  io.on('connection', (socket: IOSocket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    // Create room
    socket.on('room:create', (data, callback) => {
      const name = sanitizeName(data.playerName);
      if (!name) {
        callback({ success: false, error: 'Nombre inválido' });
        return;
      }

      const room = roomManager.createRoom(socket.id);
      socket.join(room.code);

      // Send available games to host
      const games = gameManager.getAvailableGames();
      socket.emit('game:available', games);

      callback({ success: true, roomCode: room.code });
      console.log(`[Room] Created: ${room.code} by ${name}`);
    });

    // Join room
    socket.on('room:join', (data, callback) => {
      const name = sanitizeName(data.playerName);
      const roomCode = data.roomCode.toUpperCase().trim();

      if (!name) {
        callback({ success: false, error: 'Nombre inválido' });
        return;
      }

      const result = roomManager.joinRoom(roomCode, name, socket.id);
      if (!result) {
        callback({ success: false, error: 'No se pudo unir a la sala' });
        return;
      }

      const { room, player } = result;
      socket.join(roomCode);

      // Notify all in room
      io.to(roomCode).emit('room:updated', roomManager.toPublic(room));
      io.to(roomCode).emit('player:joined', { playerId: player.id, playerName: player.name });

      callback({ success: true, playerId: player.id });
      console.log(`[Room] ${name} joined ${roomCode}`);
    });

    // Leave room
    socket.on('room:leave', () => {
      handleDisconnect(io, socket);
    });

    // Select game
    socket.on('game:select', (data) => {
      const room = roomManager.getRoomBySocket(socket.id);
      if (!room || room.hostSocketId !== socket.id) return;

      room.currentGameId = data.gameId;
      io.to(room.code).emit('room:updated', roomManager.toPublic(room));
    });

    // Start game
    socket.on('game:start', (data) => {
      const room = roomManager.getRoomBySocket(socket.id);
      if (!room || room.hostSocketId !== socket.id) return;
      if (!room.currentGameId) return;

      const instance = gameManager.startGame(room.code, room.currentGameId, room, data?.config);
      if (!instance) {
        socket.emit('error', { message: 'No se pudo iniciar el juego' });
        return;
      }

      roomManager.setRoomStatus(room.code, 'playing');

      // Send starting event with countdown
      io.to(room.code).emit('game:starting', { gameId: room.currentGameId, countdown: 3 });

      // After countdown, send initial state
      setTimeout(() => {
        // Send host state
        const hostState = gameManager.getHostState(room.code, room);
        io.to(room.hostSocketId).emit('game:state', hostState);

        // Send controller state to each player
        for (const player of room.players.values()) {
          const controllerState = gameManager.getControllerState(room.code, player.id, room);
          io.to(player.socketId).emit('game:state', controllerState);
        }

        io.to(room.code).emit('room:updated', roomManager.toPublic(room));
      }, 3000);

      console.log(`[Game] Started ${room.currentGameId} in ${room.code}`);
    });

    // Game input
    socket.on('game:input', (data) => {
      const room = roomManager.getRoomBySocket(socket.id);
      if (!room || room.status !== 'playing') return;

      const player = roomManager.getPlayerBySocket(socket.id);
      if (!player) return;

      const instance = gameManager.handleInput(
        room.code,
        {
          playerId: player.id,
          action: data.action,
          data: data.data,
          timestamp: Date.now(),
        },
        room
      );

      if (instance) {
        // Send updated state to host
        const hostState = gameManager.getHostState(room.code, room);
        io.to(room.hostSocketId).emit('game:state', hostState);

        // Send updated controller state to each player
        for (const p of room.players.values()) {
          const controllerState = gameManager.getControllerState(room.code, p.id, room);
          io.to(p.socketId).emit('game:state', controllerState);
        }

        // Check if game is finished
        if (instance.isFinished) {
          const results = gameManager.getResults(room.code, room);
          if (results) {
            // Update player scores
            for (const ranking of results.rankings) {
              const p = room.players.get(ranking.playerId);
              if (p) p.score += ranking.score;
            }

            io.to(room.code).emit('game:finished', results);
            roomManager.setRoomStatus(room.code, 'finished');
            io.to(room.code).emit('room:updated', roomManager.toPublic(room));
          }
          gameManager.endGame(room.code);
        }
      }
    });

    // End game (host action)
    socket.on('game:end', () => {
      const room = roomManager.getRoomBySocket(socket.id);
      if (!room || room.hostSocketId !== socket.id) return;

      gameManager.endGame(room.code);
      roomManager.setRoomStatus(room.code, 'waiting');
      room.currentGameId = null;
      io.to(room.code).emit('room:updated', roomManager.toPublic(room));

      console.log(`[Game] Ended in ${room.code}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      handleDisconnect(io, socket);
      console.log(`[Socket] Disconnected: ${socket.id}`);
    });
  });
}

function handleDisconnect(io: IOServer, socket: IOSocket): void {
  const result = roomManager.leaveRoom(socket.id);
  if (!result) return;

  const { room, player, wasHost } = result;

  if (wasHost) {
    // Notify all players that the room was closed
    io.to(room.code).emit('room:closed', { reason: 'El host ha cerrado la sala' });
    gameManager.endGame(room.code);
    console.log(`[Room] Closed: ${room.code} (host left)`);
  } else if (player) {
    io.to(room.code).emit('player:left', { playerId: player.id, playerName: player.name });
    io.to(room.code).emit('room:updated', roomManager.toPublic(room));
  }

  socket.leave(room.code);
}
