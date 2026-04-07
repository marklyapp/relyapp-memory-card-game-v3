'use client';

import { useState } from 'react';
import DifficultySelector from './components/DifficultySelector';
import { Difficulty } from './lib/types';

export default function Home() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  const handleSelectDifficulty = (difficulty: Difficulty) => {
    console.log('Selected difficulty:', difficulty);
    setSelectedDifficulty(difficulty);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Memory Card Game</h1>

      {selectedDifficulty ? (
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">
            Starting <span className="font-semibold capitalize">{selectedDifficulty}</span> game...
          </p>
          <button
            onClick={() => setSelectedDifficulty(null)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition-colors"
          >
            ← Back to difficulty select
          </button>
        </div>
      ) : (
        <DifficultySelector onSelect={handleSelectDifficulty} />
      )}
    </main>
  );
}
