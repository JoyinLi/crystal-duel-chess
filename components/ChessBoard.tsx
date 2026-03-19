'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { CrystalPiece } from './CrystalPiece';
import { getLegalMoves } from '@/lib/chess-engine';
import type { PlayerSide } from '@/lib/types';
import { Chess } from 'chess.js';

interface ChessBoardProps {
  fen: string;
  onMove: (from: string, to: string) => Promise<boolean>;
  playerSide: PlayerSide;
  currentTurn: 'white' | 'black';
  disabled?: boolean;
}

export function ChessBoard({
  fen,
  onMove,
  playerSide,
  currentTurn,
  disabled = false,
}: ChessBoardProps) {
  const isPlayerTurn = currentTurn === playerSide;
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);

  const handleSquareClick = useCallback(
    async (square: string) => {
      if (disabled || !isPlayerTurn) return;

      const game = new Chess(fen);
      const piece = game.get(square as any);

      if (!selectedSquare) {
        if (piece && piece.color === (playerSide === 'white' ? 'w' : 'b')) {
          setSelectedSquare(square);
          setLegalMoves(getLegalMoves(fen, square));
        }
        return;
      }

      if (square === selectedSquare) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      if (piece && piece.color === (playerSide === 'white' ? 'w' : 'b')) {
        setSelectedSquare(square);
        setLegalMoves(getLegalMoves(fen, square));
        return;
      }

      if (legalMoves.includes(square)) {
        const success = await onMove(selectedSquare, square);
        if (success) {
          setSelectedSquare(null);
          setLegalMoves([]);
        }
      }
    },
    [disabled, fen, isPlayerTurn, legalMoves, onMove, playerSide, selectedSquare]
  );

  const highlightStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    if (selectedSquare) {
      styles[selectedSquare] = {
        boxShadow: 'inset 0 0 0 4px rgba(255, 214, 102, 0.95)',
      };
    }

    legalMoves.forEach((square) => {
      styles[square] = {
        ...styles[square],
        backgroundImage:
          'radial-gradient(circle, rgba(44, 62, 80, 0.28) 0%, rgba(44, 62, 80, 0.28) 22%, transparent 24%)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '34% 34%',
      };
    });

    return styles;
  }, [selectedSquare, legalMoves]);

  const customPieces = {
    wP: () => <CrystalPiece piece="P" />,
    wN: () => <CrystalPiece piece="N" />,
    wB: () => <CrystalPiece piece="B" />,
    wR: () => <CrystalPiece piece="R" />,
    wQ: () => <CrystalPiece piece="Q" />,
    wK: () => <CrystalPiece piece="K" />,
    bP: () => <CrystalPiece piece="p" />,
    bN: () => <CrystalPiece piece="n" />,
    bB: () => <CrystalPiece piece="b" />,
    bR: () => <CrystalPiece piece="r" />,
    bQ: () => <CrystalPiece piece="q" />,
    bK: () => <CrystalPiece piece="k" />,
  };

  return (
    <div className="chessboard-container">
      <Chessboard
        id="CrystalBoard"
        position={fen}
        onSquareClick={handleSquareClick}
        boardWidth={480}
        customPieces={customPieces}
        boardOrientation={playerSide === 'black' ? 'black' : 'white'}
        arePiecesDraggable={false}
        customBoardStyle={{
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.35)',
        }}
        customLightSquareStyle={{
          backgroundColor: '#f6f3f8',
        }}
        customDarkSquareStyle={{
          backgroundColor: '#d8e3ef',
        }}
        customSquareStyles={highlightStyles}
      />
    </div>
  );
}