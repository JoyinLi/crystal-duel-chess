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

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

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
          const moves = getLegalMoves(fen, square);
          setLegalMoves(moves);
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
        const moves = getLegalMoves(fen, square);
        setLegalMoves(moves);
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
    [fen, selectedSquare, legalMoves, onMove, playerSide, disabled, isPlayerTurn]
  );

  const customSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    for (let rankIndex = 0; rankIndex < RANKS.length; rankIndex += 1) {
      for (let fileIndex = 0; fileIndex < FILES.length; fileIndex += 1) {
        const square = `${FILES[fileIndex]}${RANKS[rankIndex]}`;
        const isLightSquare = (rankIndex + fileIndex) % 2 === 0;

        styles[square] = {
          backgroundColor: isLightSquare ? '#f7f4fa' : '#d8e3ef',
          transition: 'all 0.18s ease',
        };
      }
    }

    if (selectedSquare) {
      styles[selectedSquare] = {
        ...styles[selectedSquare],
        boxShadow: 'inset 0 0 0 4px rgba(255, 210, 84, 0.95)',
      };
    }

    legalMoves.forEach((move) => {
      styles[move] = {
        ...styles[move],
        backgroundImage:
          'radial-gradient(circle, rgba(46, 54, 74, 0.28) 0%, rgba(46, 54, 74, 0.28) 18%, transparent 20%)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '38% 38%',
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
          borderRadius: '12px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
        }}
        customSquareStyles={customSquareStyles}
      />
    </div>
  );
}