'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card as CardType, Difficulty, DIFFICULTY_CONFIGS } from '../lib/types';
import { generateDeck } from '../lib/deck';
import { formatTime } from '../lib/timer';
import { useTimer } from '../hooks/useTimer';
import Card from './Card';

interface GameBoardProps {
  difficulty: Difficulty;
  onGameComplete: (time: number) => void;
  onBack: () => void;
}

const GRID_COLS_CLASS: Record<Difficulty, string> = {
  easy: 'grid-cols-4',
  medium: 'grid-cols-4',
  hard: 'grid-cols-6',
};

export default function GameBoard({ difficulty, onGameComplete, onBack }: GameBoardProps) {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const [cards, setCards] = useState<CardType[]>(() => generateDeck(difficulty));
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const { seconds, isRunning, start, stop, reset } = useTimer();

  useEffect(() => {
    if (matchedPairs > 0 && matchedPairs === config.pairs) {
      stop();
      setGameWon(true);
      onGameComplete(seconds);
    }
  }, [matchedPairs, config.pairs, seconds, stop, onGameComplete]);

  const handleCardClick = useCallback(
    (id: number) => {
      if (isChecking || gameWon) return;
      const card = cards.find((c) => c.id === id);
      if (!card || card.isFlipped || card.isMatched) return;
      if (flippedIds.length >= 2) return;

      if (!isRunning && flippedIds.length === 0) {
        start();
      }

      const newFlipped = [...flippedIds, id];
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
      );
      setFlippedIds(newFlipped);

      if (newFlipped.length === 2) {
        setIsChecking(true);
        const [firstId, secondId] = newFlipped;
        const firstCard = cards.find((c) => c.id === firstId)!;
        const secondEmoji = card.emoji;
        const isMatch = firstCard.emoji === secondEmoji;

        if (isMatch) {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: true, isMatched: true }
                : c
            )
          );
          setFlippedIds([]);
          setMatchedPairs((p) => p + 1);
          setIsChecking(false);
        } else {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === firstId || c.id === secondId
                  ? { ...c, isFlipped: false }
                  : c
              )
            );
            setFlippedIds([]);
            setIsChecking(false);
          }, 1000);
        }
      }
    },
    [cards, flippedIds, isChecking, isRunning, gameWon, start]
  );

  const handleNewGame = useCallback(() => {
    reset();
    setCards(generateDeck(difficulty));
    setFlippedIds([]);
    setMatchedPairs(0);
    setIsChecking(false);
    setGameWon(false);
  }, [difficulty, reset]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto px-4">
      <div className="flex items-center justify-between w-full">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition-colors"
        >
          Back
        </button>

        <div className="text-center">
          <span className="text-lg font-semibold text-gray-700 capitalize">{difficulty}</span>
          <span className="ml-2 text-gray-400 text-sm">
            {config.rows} x {config.cols}
          </span>
        </div>

        <div className="flex items-center gap-2 text-lg font-mono font-bold text-indigo-600">
          <span>Timer:</span>
          <span>{formatTime(seconds)}</span>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        {matchedPairs} / {config.pairs} pairs matched
      </div>

      {gameWon && (
        <div className="w-full bg-green-100 border-2 border-green-400 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-green-700">You Won!</p>
          <p className="text-green-600 mt-1">
            Completed in <span className="font-semibold">{formatTime(seconds)}</span>
          </p>
        </div>
      )}

      <div className={"grid " + GRID_COLS_CLASS[difficulty] + " gap-2 w-full"}>
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onClick={handleCardClick}
            disabled={isChecking || gameWon || card.isMatched}
          />
        ))}
      </div>

      <button
        onClick={handleNewGame}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow transition-colors"
      >
        New Game
      </button>
    </div>
  );
}
