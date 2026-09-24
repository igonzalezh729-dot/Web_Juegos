export const ROOM_CODE_LENGTH = 4;
export const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excludes confusing chars: I, O, 0, 1
export const MAX_PLAYERS_DEFAULT = 8;
export const ROOM_EXPIRY_MS = 2 * 60 * 60 * 1000; // 2 hours
export const PLAYER_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Salmon
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#82E0AA', // Green
];

export const SOCKET_EVENTS = {
  ROOM_CREATE: 'room:create',
  ROOM_JOIN: 'room:join',
  ROOM_LEAVE: 'room:leave',
  ROOM_UPDATED: 'room:updated',
  ROOM_CLOSED: 'room:closed',
  PLAYER_JOINED: 'player:joined',
  PLAYER_LEFT: 'player:left',
  GAME_SELECT: 'game:select',
  GAME_START: 'game:start',
  GAME_INPUT: 'game:input',
  GAME_STATE: 'game:state',
  GAME_STARTING: 'game:starting',
  GAME_FINISHED: 'game:finished',
  GAME_END: 'game:end',
  GAME_AVAILABLE: 'game:available',
  ERROR: 'error',
} as const;
