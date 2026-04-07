'use client';

import { useState, useEffect } from 'react';
import { Difficulty } from '../lib/types';
import { LeaderboardEntry, getLeaderboard } from '../lib/leaderboard';
import { formatTime } from '../lib/timer';

interface LeaderboardProps {
  difficulty: Difficulty;
  highlightEntry?: LeaderboardEntry | null;
}

export default function Leaderboard({ difficulty, highlightEntry }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setEntries(getLeaderboard(difficulty));
  }, [difficulty, highlightEntry]);

  if (entries.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-8">
        <p className="text-gray-400 italic text-lg">No scores yet — be the first!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-lg font-bold text-gray-700 mb-3 text-center capitalize">
        {difficulty} Leaderboard
      </h3>
      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-indigo-50 text-indigo-700 uppercase text-xs font-semibold">
              <th className="py-3 px-4 text-left">Rank</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-right">Time</th>
              <th className="py-3 px-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const isHighlighted =
                highlightEntry != null &&
                entry.name === highlightEntry.name &&
                entry.time === highlightEntry.time &&
                entry.date === highlightEntry.date;

              return (
                <tr
                  key={index}
                  className={
                    isHighlighted
                      ? 'bg-yellow-50 border-l-4 border-yellow-400 font-semibold'
                      : index % 2 === 0
                      ? 'bg-white'
                      : 'bg-gray-50'
                  }
                >
                  <td className="py-3 px-4 text-gray-500">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </td>
                  <td className="py-3 px-4 text-gray-800">{entry.name}</td>
                  <td className="py-3 px-4 text-right font-mono text-indigo-600">
                    {formatTime(entry.time)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-400">{entry.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
