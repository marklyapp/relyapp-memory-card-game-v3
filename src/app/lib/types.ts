export type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export type Difficulty = 'easy' | 'medium' | 'hard';

export type DifficultyConfig = {
  rows: number;
  cols: number;
  pairs: number;
};

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: { rows: 3, cols: 4, pairs: 6 },
  medium: { rows: 4, cols: 4, pairs: 8 },
  hard: { rows: 5, cols: 6, pairs: 15 },
};
