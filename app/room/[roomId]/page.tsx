'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChessBoard } from '@/components/ChessBoard';
import { GameStatus } from '@/components/GameStatus';
import { GameControls } from '@/components/GameControls';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { useGameState } from '@/hooks/useGameState';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import type { PlayerSide } from '@/lib/types';

export default function RoomPage() {
  const searchParams = useSearchParams();
  const side = (searchParams.get('side') as PlayerSide) || 'white';
  const roomId = 'crystal-duel';

  const { game, loading, error, makeMove, resetGame, setGame } = useGameState(roomId, side);
  const { isConnected } = useRealtimeSync(roomId, (updatedGame) => {
    setGame(updatedGame);
  });

  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setLocalError(error);
      const timer = setTimeout(() => setLocalError(null), 3000);
      return () => clearTimeout(timer);
    }
    return;
  }, [error]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-crystal-pink border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Loading game...</p>
        </div>
      </main>
    );
  }

  if (!game) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400">Failed to load game</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center" style={{ paddingLeft: '64px', paddingRight: '16px', paddingTop: '64px', paddingBottom: '64px' }}>
      {/* 顶部信息 */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-3">
          Not Chess
        </h1>
        <div className="flex items-center justify-center gap-6">
          <div>
            <p className="text-sm text-gray-400">
              Playing as{' '}
              <span className={side === 'white' ? 'text-pink-400' : 'text-blue-400'}>
                {side === 'white' ? 'Pink' : 'Blue'}
              </span>
            </p>
          </div>
          <ConnectionStatus isConnected={isConnected} />
        </div>
      </div>

      {/* 主内容 - 棋盘和侧边栏 */}
      <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
        {/* Board - Center */}
        <div className="flex-shrink-0">
          <ChessBoard
            fen={game.fen}
            onMove={makeMove}
            playerSide={side}
            currentTurn={game.current_turn}
            disabled={!isConnected}
          />
        </div>

        {/* Sidebar - Right */}
        <div className="flex flex-col gap-4 w-full lg:w-64">
          {/* Game Status */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg">
            <GameStatus
              status={game.status}
              currentTurn={game.current_turn}
              playerSide={side}
            />
          </div>

          {/* Controls */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg">
            <GameControls onNewGame={resetGame} disabled={!isConnected} />
          </div>

          {/* Error Message */}
          {localError && (
            <div className="bg-red-500/20 backdrop-blur-md border border-red-500/40 rounded-2xl p-4 text-red-300 text-sm font-medium shadow-lg">
              {localError}
            </div>
          )}

          {/* Move History */}
          {game.pgn && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg">
              <h3 className="text-sm font-semibold text-gray-200 mb-3">Move History</h3>
              <p className="text-xs text-gray-300 font-mono break-words">{game.pgn}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
