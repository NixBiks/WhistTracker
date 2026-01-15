import { AppState, Player, GameNight } from './types';

const STORAGE_KEY = 'whist-tracker-data';

const DEFAULT_STATE: AppState = {
  players: [],
  gameNights: [],
  activeGameId: null,
};

export function loadState(): AppState {
  if (typeof window === 'undefined') {
    return DEFAULT_STATE;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as AppState;
    }
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
  }

  return DEFAULT_STATE;
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

export function exportData(): string {
  const state = loadState();
  return JSON.stringify(state, null, 2);
}

export function importData(jsonString: string): AppState | null {
  try {
    const data = JSON.parse(jsonString) as AppState;
    // Validate structure
    if (!Array.isArray(data.players) || !Array.isArray(data.gameNights)) {
      throw new Error('Invalid data structure');
    }
    saveState(data);
    return data;
  } catch (error) {
    console.error('Failed to import data:', error);
    return null;
  }
}

// Helper functions for common operations
export function getPlayerById(state: AppState, id: string): Player | undefined {
  return state.players.find((p) => p.id === id);
}

export function getGameNightById(state: AppState, id: string): GameNight | undefined {
  return state.gameNights.find((g) => g.id === id);
}

export function getActiveGame(state: AppState): GameNight | undefined {
  if (!state.activeGameId) return undefined;
  return getGameNightById(state, state.activeGameId);
}
