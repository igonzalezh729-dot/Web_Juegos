export interface QuickTapState {
  phase: 'waiting' | 'ready' | 'tap' | 'result' | 'final';
  round: number;
  totalRounds: number;
  targetTime: number | null; // When players should tap
  taps: Record<string, number>; // playerId -> tap timestamp
  roundResults: Array<{
    round: number;
    rankings: Array<{
      playerId: string;
      playerName: string;
      reactionTime: number;
      tooEarly: boolean;
    }>;
  }>;
  scores: Record<string, number>; // playerId -> total score
  currentMessage: string;
}

export interface QuickTapHostState {
  phase: QuickTapState['phase'];
  round: number;
  totalRounds: number;
  currentMessage: string;
  scores: Record<string, number>;
  roundResults: QuickTapState['roundResults'];
  playerNames: Record<string, string>;
  playerColors: Record<string, string>;
}

export interface QuickTapControllerState {
  phase: QuickTapState['phase'];
  round: number;
  totalRounds: number;
  canTap: boolean;
  message: string;
  myScore: number;
  lastReactionTime: number | null;
}
