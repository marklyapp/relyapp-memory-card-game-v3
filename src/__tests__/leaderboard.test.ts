import {
  getLeaderboard,
  addEntry,
  isTopScore,
  clearLeaderboard,
  LeaderboardEntry,
} from '../app/lib/leaderboard';

beforeEach(() => {
  localStorage.clear();
});

const makeEntry = (time: number, name = 'Player'): LeaderboardEntry => ({
  name,
  time,
  date: '2026-04-06',
});

describe('getLeaderboard', () => {
  it('returns empty array when no entries exist', () => {
    expect(getLeaderboard('easy')).toEqual([]);
  });

  it('returns empty array for corrupt JSON in storage', () => {
    localStorage.setItem('memory-game-leaderboard-easy', '{not valid json}');
    expect(getLeaderboard('easy')).toEqual([]);
    // should not throw
  });

  it('returns empty array when stored value is not an array', () => {
    localStorage.setItem('memory-game-leaderboard-easy', JSON.stringify({ foo: 'bar' }));
    expect(getLeaderboard('easy')).toEqual([]);
  });
});

describe('addEntry', () => {
  it('adds and retrieves entries', () => {
    const entry = makeEntry(30);
    addEntry('easy', entry);
    expect(getLeaderboard('easy')).toEqual([entry]);
  });

  it('sorts entries by time ascending (fastest first)', () => {
    addEntry('easy', makeEntry(50, 'Slow'));
    addEntry('easy', makeEntry(20, 'Fast'));
    addEntry('easy', makeEntry(35, 'Mid'));

    const board = getLeaderboard('easy');
    expect(board[0].time).toBe(20);
    expect(board[1].time).toBe(35);
    expect(board[2].time).toBe(50);
  });

  it('caps at 10 entries and drops the slowest', () => {
    for (let i = 1; i <= 10; i++) {
      addEntry('easy', makeEntry(i * 10, `Player${i}`));
    }
    // Board is full: times 10, 20, ..., 100

    // Add an 11th entry that is the slowest (110s) — should be dropped
    addEntry('easy', makeEntry(110, 'Slowest'));
    const board = getLeaderboard('easy');
    expect(board).toHaveLength(10);
    expect(board.map(e => e.time)).not.toContain(110);

    // Add an 11th entry that is faster (5s) — should displace the slowest (100s)
    addEntry('easy', makeEntry(5, 'Fastest'));
    const board2 = getLeaderboard('easy');
    expect(board2).toHaveLength(10);
    expect(board2[0].time).toBe(5);
    expect(board2.map(e => e.time)).not.toContain(100);
  });
});

describe('per-difficulty isolation', () => {
  it('keeps easy and medium leaderboards separate', () => {
    addEntry('easy', makeEntry(30, 'EasyPlayer'));
    addEntry('medium', makeEntry(60, 'MediumPlayer'));

    const easyBoard = getLeaderboard('easy');
    const mediumBoard = getLeaderboard('medium');

    expect(easyBoard).toHaveLength(1);
    expect(easyBoard[0].name).toBe('EasyPlayer');
    expect(mediumBoard).toHaveLength(1);
    expect(mediumBoard[0].name).toBe('MediumPlayer');
  });
});

describe('isTopScore', () => {
  it('returns true when the board is empty', () => {
    expect(isTopScore('easy', 999)).toBe(true);
  });

  it('returns true when board has fewer than 10 entries', () => {
    addEntry('easy', makeEntry(50));
    expect(isTopScore('easy', 999)).toBe(true);
  });

  it('returns true when time beats the worst score on a full board', () => {
    for (let i = 1; i <= 10; i++) {
      addEntry('easy', makeEntry(i * 10));
    }
    // Worst time is 100; beating it
    expect(isTopScore('easy', 99)).toBe(true);
  });

  it('returns false when time does not beat the worst score on a full board', () => {
    for (let i = 1; i <= 10; i++) {
      addEntry('easy', makeEntry(i * 10));
    }
    expect(isTopScore('easy', 100)).toBe(false);
    expect(isTopScore('easy', 200)).toBe(false);
  });
});

describe('clearLeaderboard', () => {
  it('clears the leaderboard for a given difficulty', () => {
    addEntry('easy', makeEntry(30));
    expect(getLeaderboard('easy')).toHaveLength(1);

    clearLeaderboard('easy');
    expect(getLeaderboard('easy')).toEqual([]);
  });

  it('does not affect other difficulties when clearing', () => {
    addEntry('easy', makeEntry(30));
    addEntry('hard', makeEntry(120));

    clearLeaderboard('easy');

    expect(getLeaderboard('easy')).toEqual([]);
    expect(getLeaderboard('hard')).toHaveLength(1);
  });
});
