import React from 'react';
import type { GameStatus } from '@/lib/types';

interface GameStatusProps {
  status: GameStatus;
  currentTurn: 'white' | 'black';
  playerSide: 'white' | 'black';
}

export function GameStatus({ status, currentTurn, playerSide }: GameStatusProps) {
  const isYourTurn = currentTurn === playerSide;
  const turnText = isYourTurn ? 'Your Turn' : "Opponent's Turn";
  const turnColor = isYourTurn ? 'text-pink-400' : 'text-blue-400';

  let statusText = '';
  let statusColor = '';

  switch (status) {
    case 'checkmate':
      statusText = isYourTurn ? 'Checkmate - You Lost' : 'Checkmate - You Won!';
      statusColor = isYourTurn ? 'text-red-400' : 'text-green-400';
      break;
    case 'check':
      statusText = isYourTurn ? 'You are in Check' : 'Opponent is in Check';
      statusColor = 'text-yellow-400';
      break;
    case 'draw':
      statusText = 'Draw';
      statusColor = 'text-gray-400';
      break;
    case 'stalemate':
      statusText = 'Stalemate';
      statusColor = 'text-gray-400';
      break;
    default:
      statusText = '';
  }

  return (
    <div className="space-y-3">
      <div className={`text-lg font-semibold ${turnColor}`}>{turnText}</div>
      {statusText && <div className={`text-sm font-medium ${statusColor}`}>{statusText}</div>}
    </div>
  );
}
