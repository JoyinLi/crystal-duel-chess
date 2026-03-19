export type GameStatus = 'active' | 'checkmate' | 'draw' | 'stalemate' | 'check';

export interface GameState {
  id: string;
  room_id: string;
  fen: string;
  pgn: string;
  current_turn: 'white' | 'black';
  status: GameStatus;
  created_at: string;
  updated_at: string;
}

export type PlayerSide = 'white' | 'black';

export interface MoveResult {
  success: boolean;
  error?: string;
  newFen?: string;
  newPgn?: string;
  newStatus?: GameStatus;
}
