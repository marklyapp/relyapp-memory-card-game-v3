"use client";

import { Card as CardType } from "../lib/types";

interface CardProps {
  card: CardType;
  onClick: (id: number) => void;
  disabled: boolean;
}

export default function Card({ card, onClick, disabled }: CardProps) {
  const isInteractive = !disabled && !card.isFlipped && !card.isMatched;

  const handleClick = () => {
    if (isInteractive) {
      onClick(card.id);
    }
  };

  return (
    <div className="card-container w-full aspect-square">
      <div
        className={`card-inner w-full h-full relative transition-transform duration-500 ${
          card.isFlipped || card.isMatched ? "card-flipped" : ""
        }`}
      >
        {/* Card Back */}
        <button
          onClick={handleClick}
          disabled={!isInteractive}
          aria-label="Flip card"
          className={`card-face card-back absolute inset-0 w-full h-full flex items-center justify-center rounded-xl text-4xl
            bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md
            ${isInteractive ? "cursor-pointer hover:brightness-110 hover:scale-105 transition-transform" : "cursor-default"}
          `}
        >
          ❓
        </button>

        {/* Card Front */}
        <div
          className={`card-face card-front absolute inset-0 w-full h-full flex items-center justify-center rounded-xl text-4xl shadow-md
            ${card.isMatched
              ? "bg-green-100 border-2 border-green-400 opacity-80"
              : "bg-white border-2 border-indigo-200"
            }
          `}
        >
          {card.emoji}
        </div>
      </div>
    </div>
  );
}
