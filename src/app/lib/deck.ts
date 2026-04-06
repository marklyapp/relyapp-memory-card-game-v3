import { Card, Difficulty, DIFFICULTY_CONFIGS } from './types';

const EMOJI_POOL: string[] = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🐨', '🐯', '🦁', '🐸', '🐵', '🐔', '🐧', '🐦',
  '🦆', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝',
  '🐛', '🦋', '🐌', '🐞', '🐜', '🦟',
];

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateDeck(difficulty: Difficulty): Card[] {
  const { pairs } = DIFFICULTY_CONFIGS[difficulty];

  if (pairs > EMOJI_POOL.length) {
    throw new Error(`Not enough emojis in pool for ${pairs} pairs`);
  }

  const selectedEmojis = shuffle(EMOJI_POOL).slice(0, pairs);

  const pairedEmojis = [...selectedEmojis, ...selectedEmojis];

  const shuffled = shuffle(pairedEmojis);

  return shuffled.map((emoji, index) => ({
    id: index,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
}
