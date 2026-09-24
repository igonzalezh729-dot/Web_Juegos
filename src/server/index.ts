import { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from '@/core/types';
import { registerSocketHandlers } from './socket-handlers';
import { registerGames } from '@/games/registry';

export function initializeSocketServer(httpServer: HTTPServer) {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    pingInterval: 10000,
    pingTimeout: 5000,
  });

  // Register all available games
  registerGames();

  // Register socket event handlers
  registerSocketHandlers(io);

  console.log('[Socket.IO] Server initialized');

  return io;
}
