import { useEffect, useState, useCallback } from 'react';
import { getGameState, updateGameState, initializeGame } from '@/lib/supabase';
import { validateAndMakeMove, getCurrentTurn } from '@/lib/chess-engine';
import type { GameState, PlayerSide } from '@/lib/types';

export function useGameState(roomId: string, playerSide: PlayerSide) {
  const [game, setGame] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial game state
  useEffect(() => {
    const loadGame = async () => {
      setLoading(true);
      let gameState = await getGameState(roomId);

      if (!gameState) {
        gameState = await initializeGame(roomId);
      }

      if (gameState) {
        setGame(gameState);
        setError(null);
      } else {
        setError('Failed to load game');
      }
      setLoading(false);
    };

    loadGame();
  }, [roomId]);

  const makeMove = useCallback(
    async (from: string, to: string, promotion?: string) => {
      if (!game) return false;

      const currentTurn = getCurrentTurn(game.fen);
      if (currentTurn !== playerSide) {
        setError('Not your turn');
        return false;
      }

      const result = validateAndMakeMove(game.fen, from, to, promotion);

      if (!result.success) {
        setError(result.error || 'Invalid move');
        return false;
      }

      // Optimistic update
      const updatedGame: GameState = {
        ...game,
        fen: result.newFen!,
        pgn: result.newPgn!,
        current_turn: currentTurn === 'white' ? 'black' : 'white',
        status: result.newStatus!,
      };
      setGame(updatedGame);
      setError(null);

      // Persist to database
      const persisted = await updateGameState(roomId, {
        fen: result.newFen!,
        pgn: result.newPgn!,
        current_turn: currentTurn === 'white' ? 'black' : 'white',
        status: result.newStatus!,
      });

      if (!persisted) {
        setError('Failed to save move');
        return false;
      }

      return true;
    },
    [game, playerSide, roomId]
  );

  const resetGame = useCallback(async () => {
    const initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const updated = await updateGameState(roomId, {
      fen: initialFen,
      pgn: '',
      current_turn: 'white',
      status: 'active',
    });

    if (updated) {
      setGame(updated);
      setError(null);
    }
  }, [roomId]);

  return { game, loading, error, makeMove, resetGame, setGame };
}
