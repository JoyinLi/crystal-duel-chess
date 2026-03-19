import { Chess } from 'chess.js';
import type { GameStatus, MoveResult } from './types';

export function createChessGame(fen?: string): Chess {
  return new Chess(fen);
}

export function validateAndMakeMove(
  currentFen: string,
  from: string,
  to: string,
  promotion?: string
): MoveResult {
  const game = new Chess(currentFen);

  try {
    const move = game.move(
      { from: from as any, to: to as any, promotion: promotion as any },
      { sloppy: false }
    );

    if (!move) {
      return { success: false, error: 'Illegal move' };
    }

    const newFen = game.fen();
    const newPgn = game.pgn();
    const newStatus = getGameStatus(game);

    return {
      success: true,
      newFen,
      newPgn,
      newStatus,
    };
  } catch (error) {
    return { success: false, error: 'Invalid move' };
  }
}

export function getGameStatus(game: Chess): GameStatus {
  if (game.isCheckmate()) return 'checkmate';
  if (game.isDraw()) return 'draw';
  if (game.isStalemate()) return 'stalemate';
  if (game.isCheck()) return 'check';
  return 'active';
}

export function getCurrentTurn(fen: string): 'white' | 'black' {
  const parts = fen.split(' ');
  return parts[1] === 'w' ? 'white' : 'black';
}

export function isLegalMove(
  currentFen: string,
  from: string,
  to: string
): boolean {
  const game = new Chess(currentFen);
  const moves = game.moves({ square: from as any, verbose: true });
  return moves.some((m) => m.to === to);
}

export function getPieceColor(piece: string): 'white' | 'black' {
  return piece === piece.toUpperCase() ? 'white' : 'black';
}

export function getLegalMoves(fen: string, square: string): string[] {
  const game = new Chess(fen);
  const moves = game.moves({ square: square as any, verbose: true });
  return moves.map((m) => m.to);
}
