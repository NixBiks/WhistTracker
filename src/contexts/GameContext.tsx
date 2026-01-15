'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppState, Player, GameNight, Round, TrumpType, SpecialBid } from '@/lib/types';
import { loadState, saveState } from '@/lib/storage';
import { calculateRoundPoints } from '@/lib/scoring';

type Action =
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'ADD_PLAYER'; payload: { name: string } }
  | { type: 'UPDATE_PLAYER'; payload: { id: string; name: string } }
  | { type: 'DELETE_PLAYER'; payload: { id: string } }
  | { type: 'CREATE_GAME_NIGHT'; payload: { playerIds: string[] } }
  | { type: 'END_GAME_NIGHT'; payload: { gameId: string } }
  | { type: 'DELETE_GAME_NIGHT'; payload: { gameId: string } }
  | {
      type: 'ADD_ROUND';
      payload: {
        gameId: string;
        bidder: string;
        partner: string | null;
        bidLevel: number;
        trumpType: TrumpType;
        vipCount: number | null;
        specialBid: SpecialBid | null;
        tricksWon: number;
      };
    }
  | { type: 'DELETE_ROUND'; payload: { gameId: string; roundId: string } }
  | { type: 'SET_ACTIVE_GAME'; payload: { gameId: string | null } };

const initialState: AppState = {
  players: [],
  gameNights: [],
  activeGameId: null,
};

function gameReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'ADD_PLAYER': {
      const newPlayer: Player = {
        id: uuidv4(),
        name: action.payload.name,
        createdAt: new Date().toISOString(),
      };
      return { ...state, players: [...state.players, newPlayer] };
    }

    case 'UPDATE_PLAYER': {
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.payload.id ? { ...p, name: action.payload.name } : p
        ),
      };
    }

    case 'DELETE_PLAYER': {
      return {
        ...state,
        players: state.players.filter((p) => p.id !== action.payload.id),
      };
    }

    case 'CREATE_GAME_NIGHT': {
      const newGame: GameNight = {
        id: uuidv4(),
        date: new Date().toISOString(),
        players: action.payload.playerIds,
        rounds: [],
        scores: action.payload.playerIds.reduce(
          (acc, id) => ({ ...acc, [id]: 0 }),
          {} as Record<string, number>
        ),
        isActive: true,
      };
      return {
        ...state,
        gameNights: [...state.gameNights, newGame],
        activeGameId: newGame.id,
      };
    }

    case 'END_GAME_NIGHT': {
      return {
        ...state,
        gameNights: state.gameNights.map((g) =>
          g.id === action.payload.gameId ? { ...g, isActive: false } : g
        ),
        activeGameId: state.activeGameId === action.payload.gameId ? null : state.activeGameId,
      };
    }

    case 'DELETE_GAME_NIGHT': {
      return {
        ...state,
        gameNights: state.gameNights.filter((g) => g.id !== action.payload.gameId),
        activeGameId:
          state.activeGameId === action.payload.gameId ? null : state.activeGameId,
      };
    }

    case 'ADD_ROUND': {
      const { gameId, bidder, partner, bidLevel, trumpType, vipCount, specialBid, tricksWon } =
        action.payload;

      const { success, points } = calculateRoundPoints({
        id: '',
        bidder,
        partner,
        bidLevel,
        trumpType,
        vipCount,
        specialBid,
        tricksWon,
      });

      const newRound: Round = {
        id: uuidv4(),
        bidder,
        partner,
        bidLevel,
        trumpType,
        vipCount,
        specialBid,
        tricksWon,
        success,
        points,
      };

      return {
        ...state,
        gameNights: state.gameNights.map((g) => {
          if (g.id !== gameId) return g;

          // Update scores: bidder and partner get points, opponents get opposite
          const newScores = { ...g.scores };
          const declaringTeam = partner ? [bidder, partner] : [bidder];
          const opponents = g.players.filter((p) => !declaringTeam.includes(p));

          // Declaring team gets the points (positive or negative)
          declaringTeam.forEach((playerId) => {
            newScores[playerId] = (newScores[playerId] || 0) + points;
          });

          // Opponents get the opposite
          opponents.forEach((playerId) => {
            newScores[playerId] = (newScores[playerId] || 0) - points;
          });

          return {
            ...g,
            rounds: [...g.rounds, newRound],
            scores: newScores,
          };
        }),
      };
    }

    case 'DELETE_ROUND': {
      return {
        ...state,
        gameNights: state.gameNights.map((g) => {
          if (g.id !== action.payload.gameId) return g;

          const roundToDelete = g.rounds.find((r) => r.id === action.payload.roundId);
          if (!roundToDelete) return g;

          // Reverse the score changes
          const newScores = { ...g.scores };
          const declaringTeam = roundToDelete.partner
            ? [roundToDelete.bidder, roundToDelete.partner]
            : [roundToDelete.bidder];
          const opponents = g.players.filter((p) => !declaringTeam.includes(p));

          declaringTeam.forEach((playerId) => {
            newScores[playerId] = (newScores[playerId] || 0) - roundToDelete.points;
          });

          opponents.forEach((playerId) => {
            newScores[playerId] = (newScores[playerId] || 0) + roundToDelete.points;
          });

          return {
            ...g,
            rounds: g.rounds.filter((r) => r.id !== action.payload.roundId),
            scores: newScores,
          };
        }),
      };
    }

    case 'SET_ACTIVE_GAME': {
      return { ...state, activeGameId: action.payload.gameId };
    }

    default:
      return state;
  }
}

interface GameContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  // Helper functions
  addPlayer: (name: string) => void;
  updatePlayer: (id: string, name: string) => void;
  deletePlayer: (id: string) => void;
  createGameNight: (playerIds: string[]) => void;
  endGameNight: (gameId: string) => void;
  deleteGameNight: (gameId: string) => void;
  addRound: (
    gameId: string,
    bidder: string,
    partner: string | null,
    bidLevel: number,
    trumpType: TrumpType,
    vipCount: number | null,
    specialBid: SpecialBid | null,
    tricksWon: number
  ) => void;
  deleteRound: (gameId: string, roundId: string) => void;
  getPlayerName: (id: string) => string;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = loadState();
    dispatch({ type: 'LOAD_STATE', payload: savedState });
  }, []);

  // Save state to localStorage on every change
  useEffect(() => {
    saveState(state);
  }, [state]);

  const addPlayer = (name: string) => dispatch({ type: 'ADD_PLAYER', payload: { name } });

  const updatePlayer = (id: string, name: string) =>
    dispatch({ type: 'UPDATE_PLAYER', payload: { id, name } });

  const deletePlayer = (id: string) => dispatch({ type: 'DELETE_PLAYER', payload: { id } });

  const createGameNight = (playerIds: string[]) =>
    dispatch({ type: 'CREATE_GAME_NIGHT', payload: { playerIds } });

  const endGameNight = (gameId: string) =>
    dispatch({ type: 'END_GAME_NIGHT', payload: { gameId } });

  const deleteGameNight = (gameId: string) =>
    dispatch({ type: 'DELETE_GAME_NIGHT', payload: { gameId } });

  const addRound = (
    gameId: string,
    bidder: string,
    partner: string | null,
    bidLevel: number,
    trumpType: TrumpType,
    vipCount: number | null,
    specialBid: SpecialBid | null,
    tricksWon: number
  ) =>
    dispatch({
      type: 'ADD_ROUND',
      payload: { gameId, bidder, partner, bidLevel, trumpType, vipCount, specialBid, tricksWon },
    });

  const deleteRound = (gameId: string, roundId: string) =>
    dispatch({ type: 'DELETE_ROUND', payload: { gameId, roundId } });

  const getPlayerName = (id: string) => {
    const player = state.players.find((p) => p.id === id);
    return player?.name || 'Ukendt';
  };

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        addPlayer,
        updatePlayer,
        deletePlayer,
        createGameNight,
        endGameNight,
        deleteGameNight,
        addRound,
        deleteRound,
        getPlayerName,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
