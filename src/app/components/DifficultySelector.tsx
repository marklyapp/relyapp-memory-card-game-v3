'use client';

import { Difficulty, DIFFICULTY_CONFIGS } from '../lib/types';

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: 'bg-green-500 hover:bg-green-400 focus:ring-green-400',
  medium: 'bg-yellow-500 hover:bg-yellow-400 focus:ring-yellow-400',
  hard: 'bg-red-500 hover:bg-red-400 focus:ring-red-400',
};

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export default function DifficultySelector({ onSelect }: DifficultySelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Select Difficulty</h2>
        <p className="text-gray-500">Choose how challenging you want the game to be</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
        {DIFFICULTIES.map((difficulty) => {
          const config = DIFFICULTY_CONFIGS[difficulty];
          return (
            <button
              key={difficulty}
              onClick={() => onSelect(difficulty)}
              className={`
                flex-1 flex flex-col items-center justify-center gap-2
                px-6 py-8 rounded-2xl text-white font-semibold
                shadow-lg transition-all duration-200
                focus:outline-none focus:ring-4 focus:ring-offset-2
                active:scale-95 cursor-pointer
                ${DIFFICULTY_COLORS[difficulty]}
              `}
            >
              <span className="text-2xl font-bold">{DIFFICULTY_LABELS[difficulty]}</span>
              <span className="text-sm font-medium opacity-90">
                {config.rows} × {config.cols} grid
              </span>
              <span className="text-xs opacity-75">
                {config.pairs} pairs
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
