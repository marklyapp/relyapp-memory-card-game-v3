'use client';

import { useState } from 'react';
import DifficultySelector from './components/DifficultySelector';
import GameBoard from './components/GameBoard';
import { Difficulty } from './lib/types';

type GameState =
  | { screen: 'select' }
  | { screen: 'playing'; difficulty: Difficulty }
  | { screen: 'complete'; difficulty: Difficulty; time: number };

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({ screen: 'select' });

  const handleSelectDifficulty = (difficulty: Difficulty) => {
    setGameState({ screen: 'playing', difficulty });
  };

  const handleGameComplete = (time: number) => {
    if (gameState.screen === 'playing') {
      setGameState({ screen: 'complete', difficulty: gameState.difficulty, time });
    }
  };

  const handleBack = () => {
    setGameState({ screen: 'select' });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Memory Card Game</h1>

      {gameState.screen === 'select' && (
        <DifficultySelector onSelect={handleSelectDifficulty} />
      )}

      {gameState.screen === 'playing' && (
        <GameBoard
          difficulty={gameState.difficulty}
          onGameComplete={handleGameComplete}
          onBack={handleBack}
        />
      )}

      {gameState.screen === 'complete' && (
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="text-2xl font-bold text-green-700">Congratulations!</p>
          <p className="text-gray-600">
            You completed the{' '}
            <span className="font-semibold capitalize">{gameState.difficulty}</span> game!
          </p>
          <div className="flex gap-4">
            <button
              onClick={() =>
                setGameState({ screen: 'playing', difficulty: gameState.difficulty })
              }
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl shadow transition-colors"
            >
              Change Difficulty
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
