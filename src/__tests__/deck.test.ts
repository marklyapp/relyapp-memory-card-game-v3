import { generateDeck, shuffle } from '../app/lib/deck';
import { DIFFICULTY_CONFIGS, Difficulty } from '../app/lib/types';

describe('generateDeck', () => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  test.each(difficulties)(
    'returns correct number of cards for %s difficulty',
    (difficulty) => {
      const { pairs } = DIFFICULTY_CONFIGS[difficulty];
      const deck = generateDeck(difficulty);
      expect(deck.length).toBe(pairs * 2);
    }
  );

  test('easy: returns 12 cards', () => {
    const deck = generateDeck('easy');
    expect(deck.length).toBe(12);
  });

  test('medium: returns 16 cards', () => {
    const deck = generateDeck('medium');
    expect(deck.length).toBe(16);
  });

  test('hard: returns 30 cards', () => {
    const deck = generateDeck('hard');
    expect(deck.length).toBe(30);
  });

  test('every emoji appears exactly twice', () => {
    const deck = generateDeck('medium');
    const counts: Record<string, number> = {};
    for (const card of deck) {
      counts[card.emoji] = (counts[card.emoji] || 0) + 1;
    }
    for (const count of Object.values(counts)) {
      expect(count).toBe(2);
    }
  });

  test('all cards start with isFlipped: false and isMatched: false', () => {
    const deck = generateDeck('easy');
    for (const card of deck) {
      expect(card.isFlipped).toBe(false);
      expect(card.isMatched).toBe(false);
    }
  });

  test('all card ids are unique', () => {
    const deck = generateDeck('hard');
    const ids = deck.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(deck.length);
  });

  test('shuffle produces different orderings (statistical)', () => {
    const results = new Set<string>();
    for (let i = 0; i < 10; i++) {
      const deck = generateDeck('easy');
      results.add(deck.map((c) => c.emoji).join(','));
    }
    // With 12 cards, the chance all 10 runs produce the same order is astronomically small
    expect(results.size).toBeGreaterThan(1);
  });
});

describe('shuffle', () => {
  test('returns array of same length', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffle(arr).length).toBe(arr.length);
  });

  test('contains same elements', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffle(arr).sort()).toEqual([...arr].sort());
  });

  test('does not mutate original array', () => {
    const arr = [1, 2, 3, 4, 5];
    shuffle(arr);
    expect(arr).toEqual([1, 2, 3, 4, 5]);
  });
});
