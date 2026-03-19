-- Crystal Duel Chess - Supabase Schema
-- Run this in Supabase SQL Editor to set up the database

-- Create games table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id TEXT UNIQUE NOT NULL,
  fen TEXT NOT NULL DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  pgn TEXT DEFAULT '',
  current_turn TEXT NOT NULL DEFAULT 'white',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast room lookups
CREATE INDEX idx_games_room_id ON games(room_id);

-- Enable realtime for the games table
ALTER PUBLICATION supabase_realtime ADD TABLE games;

-- Optional: Create a trigger to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial game state for crystal-duel room
INSERT INTO games (room_id, fen, pgn, current_turn, status)
VALUES (
  'crystal-duel',
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  '',
  'white',
  'active'
)
ON CONFLICT (room_id) DO NOTHING;
