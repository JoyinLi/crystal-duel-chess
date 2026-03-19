import React from 'react';

interface CrystalPieceProps {
  piece: string;
  size?: number;
}

export function CrystalPiece({ piece, size = 45 }: CrystalPieceProps) {
  const isWhite = piece === piece.toUpperCase();
  const fillColor = isWhite ? '#FDABD1' : '#358AF5';
  const darkColor = isWhite ? '#F08FB8' : '#1E5FD8';
  const lightColor = isWhite ? '#FEC5E0' : '#5BA3FF';

  const renderPiece = () => {
    const type = piece.toLowerCase();

    switch (type) {
      // 兵 - Pawn: 最简单的形状
      case 'p':
        return (
          <g>
            <defs>
              <radialGradient id={`pawn-grad-${isWhite}`} cx="35%" cy="35%">
                <stop offset="0%" stopColor={lightColor} />
                <stop offset="100%" stopColor={darkColor} />
              </radialGradient>
            </defs>
            {/* 头部 */}
            <circle cx="22.5" cy="11" r="5.5" fill={`url(#pawn-grad-${isWhite})`} />
            {/* 颈部 */}
            <ellipse cx="22.5" cy="17" rx="4" ry="3" fill={fillColor} />
            {/* 身体 */}
            <path d="M 18 20 L 17 30 Q 17 34 22.5 35 Q 28 34 28 30 L 27 20 Z" fill={fillColor} />
            {/* 底座 */}
            <ellipse cx="22.5" cy="35" rx="9" ry="2.5" fill={darkColor} opacity="0.4" />
          </g>
        );

      // 马 - Knight: 真实象棋的马头形状
      case 'n':
        return (
          <g>
            <defs>
              <radialGradient id={`knight-grad-${isWhite}`} cx="40%" cy="40%">
                <stop offset="0%" stopColor={lightColor} />
                <stop offset="100%" stopColor={darkColor} />
              </radialGradient>
            </defs>
            {/* 马头主体 */}
            <path d="M 18 14 Q 16 16 16 20 Q 16 24 18 26 L 20 28 Q 20 30 22.5 31 Q 25 30 25 28 L 27 26 Q 29 24 29 20 Q 29 16 27 14 Q 25 12 22.5 12 Q 20 12 18 14 Z" fill={`url(#knight-grad-${isWhite})`} />
            {/* 马的鼻子/嘴 */}
            <ellipse cx="16.5" cy="20" rx="2" ry="2.5" fill={darkColor} opacity="0.6" />
            {/* 马的眼睛 */}
            <circle cx="20" cy="16" r="1.5" fill={darkColor} opacity="0.7" />
            {/* 左耳 */}
            <path d="M 19 13 Q 18 10 20 9 Q 21 10 20 13" fill={fillColor} />
            {/* 右耳 */}
            <path d="M 26 13 Q 27 10 25 9 Q 24 10 25 13" fill={fillColor} />
            {/* 颈部 */}
            <ellipse cx="22.5" cy="30" rx="5.5" ry="4" fill={fillColor} />
            {/* 底座 */}
            <ellipse cx="22.5" cy="35" rx="9" ry="2.5" fill={darkColor} opacity="0.4" />
          </g>
        );

      // 象 - Bishop: 尖顶形状
      case 'b':
        return (
          <g>
            <defs>
              <radialGradient id={`bishop-grad-${isWhite}`} cx="35%" cy="35%">
                <stop offset="0%" stopColor={lightColor} />
                <stop offset="100%" stopColor={darkColor} />
              </radialGradient>
            </defs>
            {/* 顶部尖角 */}
            <polygon points="22.5,8 25,14 20,14" fill={`url(#bishop-grad-${isWhite})`} />
            {/* 中间球体 */}
            <circle cx="22.5" cy="20" r="6" fill={fillColor} />
            {/* 下部 */}
            <path d="M 17 26 L 16 32 Q 16 35 22.5 36 Q 29 35 29 32 L 28 26 Z" fill={fillColor} />
            {/* 底座 */}
            <ellipse cx="22.5" cy="36" rx="9.5" ry="2.5" fill={darkColor} opacity="0.4" />
          </g>
        );

      // 车 - Rook: 城堡形状
      case 'r':
        return (
          <g>
            <defs>
              <radialGradient id={`rook-grad-${isWhite}`} cx="35%" cy="35%">
                <stop offset="0%" stopColor={lightColor} />
                <stop offset="100%" stopColor={darkColor} />
              </radialGradient>
            </defs>
            {/* 顶部城垛 */}
            <rect x="16" y="9" width="13" height="4" fill={`url(#rook-grad-${isWhite})`} />
            <rect x="15" y="12" width="2" height="2" fill={fillColor} />
            <rect x="28" y="12" width="2" height="2" fill={fillColor} />
            {/* 主体 */}
            <rect x="17" y="13" width="11" height="16" fill={fillColor} />
            {/* 下部 */}
            <path d="M 16 29 L 15 33 Q 15 36 22.5 37 Q 30 36 30 33 L 29 29 Z" fill={fillColor} />
            {/* 底座 */}
            <ellipse cx="22.5" cy="37" rx="10" ry="2.5" fill={darkColor} opacity="0.4" />
          </g>
        );

      // 王后 - Queen: 皇冠形状
      case 'q':
        return (
          <g>
            <defs>
              <radialGradient id={`queen-grad-${isWhite}`} cx="35%" cy="35%">
                <stop offset="0%" stopColor={lightColor} />
                <stop offset="100%" stopColor={darkColor} />
              </radialGradient>
            </defs>
            {/* 顶部球 */}
            <circle cx="22.5" cy="9" r="3" fill={`url(#queen-grad-${isWhite})`} />
            {/* 左球 */}
            <circle cx="16" cy="16" r="4.5" fill={fillColor} />
            {/* 中球 */}
            <circle cx="22.5" cy="17" r="5.5" fill={fillColor} />
            {/* 右球 */}
            <circle cx="29" cy="16" r="4.5" fill={fillColor} />
            {/* 下部 */}
            <path d="M 16 22 L 15 31 Q 15 35 22.5 36 Q 30 35 30 31 L 29 22 Z" fill={fillColor} />
            {/* 底座 */}
            <ellipse cx="22.5" cy="36" rx="10" ry="2.5" fill={darkColor} opacity="0.4" />
          </g>
        );

      // 王 - King: 十字皇冠
      case 'k':
        return (
          <g>
            <defs>
              <radialGradient id={`king-grad-${isWhite}`} cx="35%" cy="35%">
                <stop offset="0%" stopColor={lightColor} />
                <stop offset="100%" stopColor={darkColor} />
              </radialGradient>
            </defs>
            {/* 顶部十字 */}
            <rect x="21" y="6" width="3" height="6" fill={`url(#king-grad-${isWhite})`} />
            <rect x="18" y="9" width="9" height="2" fill={fillColor} />
            {/* 中球 */}
            <circle cx="22.5" cy="18" r="6" fill={fillColor} />
            {/* 下部 */}
            <path d="M 16 24 L 15 32 Q 15 36 22.5 37 Q 30 36 30 32 L 29 24 Z" fill={fillColor} />
            {/* 底座 */}
            <ellipse cx="22.5" cy="37" rx="10.5" ry="2.5" fill={darkColor} opacity="0.4" />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 45 45"
      style={{
        filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.25))`,
      }}
    >
      {/* 棋子主体 */}
      {renderPiece()}
    </svg>
  );
}
