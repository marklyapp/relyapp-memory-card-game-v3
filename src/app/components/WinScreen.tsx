'use client';

import { useState } from 'react';
import { Difficulty } from '../lib/types';
import { LeaderboardEntry, addEntry, isTopScore } from '../lib/leaderboard';
import { formatTime } from '../lib/timer';
import Leaderboard from './Leaderboard';

interface WinScreenProps {
  difficulty: Difficulty;
  time: number;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
}

export default function WinScreen({
  difficulty,
  time,
  onPlayAgain,
  onChangeDifficulty,
}: WinScreenProps) {
  const qualifies = isTopScore(difficulty, time);
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [savedEntry, setSavedEntry] = useState<LeaderboardEntry | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const date = new Date().toLocaleDateString();
    const entry: LeaderboardEntry = { name: trimmed, time, date };
    addEntry(difficulty, entry);
    setSavedEntry(entry);
    setSubmitted(true);
  };

  const showLeaderboard = submitted || !qualifies;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto text-center">
      {/* Header */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-5xl">🎉</div>
        <h2 className="text-3xl font-bold text-green-700">Congratulations!</h2>
        <p className="text-gray-600 text-lg">
          You finished the{' '}
          <span className="font-semibold capitalize">{difficulty}</span> game in{' '}
          <span className="font-mono font-bold text-indigo-600">{formatTime(time)}</span>!
        </p>
      </div>

      {/* Name entry or result */}
      {!submitted && qualifies && (
        <div className="w-full bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6">
          <p className="text-yellow-800 font-bold text-lg mb-1">🏆 Top Score!</p>
          <p className="text-yellow-700 text-sm mb-4">Your time qualifies for the leaderboard!</p>
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              className="w-full px-4 py-3 border border-yellow-300 rounded-xl text-center text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              autoFocus
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 text-white font-semibold rounded-xl shadow transition-colors w-full"
            >
              Save Score
            </button>
          </form>
        </div>
      )}

      {!qualifies && !submitted && (
        <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5">
          <p className="text-gray-500 text-sm">Not a top 10 score — keep practicing! 💪</p>
        </div>
      )}

      {submitted && (
        <p className="text-green-600 font-semibold">✅ Score saved! Check the leaderboard below.</p>
      )}

      {/* Leaderboard */}
      {showLeaderboard && (
        <div className="w-full">
          <Leaderboard difficulty={difficulty} highlightEntry={savedEntry} />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-4 mt-2">
        <button
          onClick={onPlayAgain}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow transition-colors"
        >
          Play Again
        </button>
        <button
          onClick={onChangeDifficulty}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl shadow transition-colors"
        >
          Change Difficulty
        </button>
      </div>
    </div>
  );
}
