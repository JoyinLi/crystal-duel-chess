'use client';

import React, { useCallback, useState } from 'react';
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

      // If no piece selected yet
      if (!selectedSquare) {
        // Check if clicked square has own piece
        if (piece && piece.color === (playerSide === 'white' ? 'w' : 'b')) {
          setSelectedSquare(square);
          const moves = getLegalMoves(fen, square);
          setLegalMoves(moves);
        }
        return;
      }

      // If already have selected piece
      if (square === selectedSquare) {
        // Deselect
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      // Check if clicked square has own piece (switch selection)
      if (piece && piece.color === (playerSide === 'white' ? 'w' : 'b')) {
        setSelectedSquare(square);
        const moves = getLegalMoves(fen, square);
        setLegalMoves(moves);
        return;
      }

      // Check if legal move
      if (legalMoves.includes(square)) {
        const success = await onMove(selectedSquare, square);
        if (success) {
          setSelectedSquare(null);
          setLegalMoves([]);
        }
      }
    },
    [fen, selectedSquare, legalMoves, onMove, playerSide, disabled, isPlayerTurn]
  );

  const customSquareStyles: Record<string, React.CSSProperties> = {};

  // Highlight selected square
  if (selectedSquare) {
    customSquareStyles[selectedSquare] = {
      backgroundColor: 'rgba(255, 255, 0, 0.4)',
    };
  }

  // Highlight legal moves
  legalMoves.forEach((move) => {
    customSquareStyles[move] = {
      background: 'radial-gradient(circle, rgba(0,0,0,0.2) 25%, transparent 25%)',
    };
  });

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
        position={fen}
        onSquareClick={handleSquareClick}
        boardWidth={480}
        customPieces={customPieces}
        boardOrientation={playerSide === 'black' ? 'black' : 'white'}
        arePiecesDraggable={false}
        customBoardStyle={{
          borderRadius: '12px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)',
        }}
        customLightSquareStyle={{ backgroundColor: '#f2f2f2' }}
customDarkSquareStyle={{ backgroundColor: '#404244' }}
customSquareStyles={customSquareStyles}
        
      />
    </div>
  );
}
