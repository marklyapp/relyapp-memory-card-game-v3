import { Difficulty } from './types';

export type LeaderboardEntry = {
  name: string;
  time: number;
  date: string;
};

const MAX_ENTRIES = 10;

function getStorageKey(difficulty: Difficulty): string {
  return `memory-game-leaderboard-${difficulty}`;
}

export function getLeaderboard(difficulty: Difficulty): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(getStorageKey(difficulty));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as LeaderboardEntry[];
  } catch {
    return [];
  }
}

export function addEntry(difficulty: Difficulty, entry: LeaderboardEntry): LeaderboardEntry[] {
  const current = getLeaderboard(difficulty);
  const updated = [...current, entry]
    .sort((a, b) => a.time - b.time)
    .slice(0, MAX_ENTRIES);

  localStorage.setItem(getStorageKey(difficulty), JSON.stringify(updated));
  return updated;
}

export function isTopScore(difficulty: Difficulty, time: number): boolean {
  const board = getLeaderboard(difficulty);
  if (board.length < MAX_ENTRIES) return true;
  return time < board[board.length - 1].time;
}

export function clearLeaderboard(difficulty: Difficulty): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(getStorageKey(difficulty));
}
