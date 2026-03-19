import React from 'react';

interface GameControlsProps {
  onNewGame: () => void;
  disabled?: boolean;
}

export function GameControls({ onNewGame, disabled = false }: GameControlsProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onNewGame}
        disabled={disabled}
        className="w-full px-6 py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
      >
        New Game
      </button>
    </div>
  );
}
