import { GameHandler, GameInstance, GameConfig, GameResults } from '@/core/types';
import { PlayerInput } from '@/core/types';
import { Room } from '@/core/types';
import { QuickTapState, QuickTapHostState, QuickTapControllerState } from './types';

const QUICK_TAP_ROUNDS = 5;
const MIN_WAIT_MS = 2000;
const MAX_WAIT_MS = 6000;

function createInitialState(totalRounds: number): QuickTapState {
  return {
    phase: 'waiting',
    round: 1,
    totalRounds,
    targetTime: null,
    taps: {},
    roundResults: [],
    scores: {},
    currentMessage: '¡Prepárate!',
  };
}

function scheduleNextRound(state: QuickTapState): QuickTapState {
  const waitTime = MIN_WAIT_MS + Math.random() * (MAX_WAIT_MS - MIN_WAIT_MS);
  return {
    ...state,
    phase: 'ready',
    targetTime: Date.now() + waitTime,
    taps: {},
    currentMessage: 'Espera...',
  };
}

export const quickTapHandler: GameHandler = {
  definition: {
    id: 'quick-tap',
    name: 'Quick Tap',
    description: '¡Pulsa el botón lo más rápido posible cuando la pantalla cambie de color!',
    minPlayers: 1,
    maxPlayers: 8,
    thumbnail: '/games/quick-tap.png',
  },

  initialize(room: Room, config?: GameConfig): GameInstance {
    const rounds = (config?.rounds as number) || QUICK_TAP_ROUNDS;
    const state = createInitialState(rounds);

    // Initialize scores for all players
    for (const player of room.players.values()) {
      state.scores[player.id] = 0;
    }

    // Start first round
    const readyState = scheduleNextRound(state);

    return {
      gameId: 'quick-tap',
      state: readyState,
      config: { rounds },
      startedAt: Date.now(),
      round: 1,
      isFinished: false,
    };
  },

  handleInput(instance: GameInstance, input: PlayerInput, room: Room): GameInstance {
    const state = instance.state as QuickTapState;

    if (input.action !== 'tap') return instance;

    // Player already tapped this round
    if (state.taps[input.playerId] !== undefined) return instance;

    const now = input.timestamp;

    if (state.phase === 'ready' && state.targetTime) {
      // Tapped too early!
      if (now < state.targetTime) {
        state.taps[input.playerId] = -1; // Mark as too early
        return { ...instance, state: { ...state } };
      }

      // Valid tap in the 'tap' phase
      state.taps[input.playerId] = now - state.targetTime;

      // Check if this is the first valid tap (changes phase to 'tap')
      if (state.phase === 'ready') {
        state.phase = 'tap';
        state.currentMessage = '¡TAP!';
      }
    } else if (state.phase === 'tap' && state.targetTime) {
      // Valid tap
      state.taps[input.playerId] = now - state.targetTime;
    } else {
      return instance;
    }

    // Check if all players have tapped
    const allTapped = Array.from(room.players.keys()).every(
      (playerId) => state.taps[playerId] !== undefined
    );

    if (allTapped) {
      return resolveRound(instance, room);
    }

    return { ...instance, state: { ...state } };
  },

  tick(instance: GameInstance, room: Room): GameInstance {
    const state = instance.state as QuickTapState;

    if (state.phase === 'ready' && state.targetTime && Date.now() >= state.targetTime) {
      // Time to tap!
      return {
        ...instance,
        state: {
          ...state,
          phase: 'tap',
          currentMessage: '¡TAP!',
        },
      };
    }

    // Auto-resolve round after 5 seconds in tap phase
    if (state.phase === 'tap' && state.targetTime && Date.now() - state.targetTime > 5000) {
      return resolveRound(instance, room);
    }

    // Auto-advance from result phase after 3 seconds
    if (state.phase === 'result') {
      const lastResult = state.roundResults[state.roundResults.length - 1];
      if (lastResult && state.round <= state.totalRounds) {
        // Move to next round after showing results
        const nextState = scheduleNextRound({
          ...state,
          round: state.round,
        });
        return { ...instance, state: nextState, round: state.round };
      }
    }

    return instance;
  },

  getHostState(instance: GameInstance, room: Room): QuickTapHostState {
    const state = instance.state as QuickTapState;
    const playerNames: Record<string, string> = {};
    const playerColors: Record<string, string> = {};

    for (const player of room.players.values()) {
      playerNames[player.id] = player.name;
      playerColors[player.id] = player.color;
    }

    return {
      phase: state.phase,
      round: state.round,
      totalRounds: state.totalRounds,
      currentMessage: state.currentMessage,
      scores: state.scores,
      roundResults: state.roundResults,
      playerNames,
      playerColors,
    };
  },

  getControllerState(instance: GameInstance, playerId: string): QuickTapControllerState {
    const state = instance.state as QuickTapState;
    const hasTapped = state.taps[playerId] !== undefined;
    const lastResult = state.roundResults[state.roundResults.length - 1];
    const myLastReaction = lastResult?.rankings.find((r) => r.playerId === playerId);

    return {
      phase: state.phase,
      round: state.round,
      totalRounds: state.totalRounds,
      canTap: (state.phase === 'ready' || state.phase === 'tap') && !hasTapped,
      message: hasTapped ? '¡Esperando a los demás!' : state.currentMessage,
      myScore: state.scores[playerId] || 0,
      lastReactionTime: myLastReaction ? (myLastReaction.tooEarly ? -1 : myLastReaction.reactionTime) : null,
    };
  },

  isFinished(instance: GameInstance): boolean {
    return instance.isFinished;
  },

  getResults(instance: GameInstance, room: Room): GameResults {
    const state = instance.state as QuickTapState;

    const rankings = Object.entries(state.scores)
      .map(([playerId, score]) => {
        const player = room.players.get(playerId);
        return {
          playerId,
          playerName: player?.name || 'Unknown',
          score,
          position: 0,
        };
      })
      .sort((a, b) => b.score - a.score)
      .map((r, i) => ({ ...r, position: i + 1 }));

    return { rankings };
  },
};

function resolveRound(instance: GameInstance, room: Room): GameInstance {
  const state = instance.state as QuickTapState;

  // Build round rankings
  const roundRankings = Array.from(room.players.values())
    .map((player) => {
      const tapTime = state.taps[player.id];
      const tooEarly = tapTime === -1;
      const didntTap = tapTime === undefined;
      return {
        playerId: player.id,
        playerName: player.name,
        reactionTime: didntTap ? 9999 : tooEarly ? 9999 : tapTime,
        tooEarly,
      };
    })
    .sort((a, b) => a.reactionTime - b.reactionTime);

  // Award points (3 for 1st, 2 for 2nd, 1 for 3rd, 0 for rest)
  const pointsTable = [3, 2, 1];
  roundRankings.forEach((r, i) => {
    if (!r.tooEarly && r.reactionTime < 9999) {
      state.scores[r.playerId] = (state.scores[r.playerId] || 0) + (pointsTable[i] || 0);
    }
  });

  state.roundResults.push({
    round: state.round,
    rankings: roundRankings,
  });

  const nextRound = state.round + 1;
  const isFinished = nextRound > state.totalRounds;

  return {
    ...instance,
    state: {
      ...state,
      phase: isFinished ? 'final' : 'result',
      round: nextRound,
      currentMessage: isFinished ? '¡Juego terminado!' : `Ronda ${state.round} completada`,
    },
    round: nextRound,
    isFinished,
  };
}
