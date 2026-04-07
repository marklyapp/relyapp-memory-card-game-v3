'use client';

import { useState } from 'react';
import DifficultySelector from './components/DifficultySelector';
import GameBoard from './components/GameBoard';
import WinScreen from './components/WinScreen';
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
        <WinScreen
          difficulty={gameState.difficulty}
          time={gameState.time}
          onPlayAgain={() =>
            setGameState({ screen: 'playing', difficulty: gameState.difficulty })
          }
          onChangeDifficulty={handleBack}
        />
      )}
    </main>
  );
}
