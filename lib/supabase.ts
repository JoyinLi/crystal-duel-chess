import { createClient } from '@supabase/supabase-js';
import type { GameState } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getGameState(roomId: string): Promise<GameState | null> {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('room_id', roomId)
    .single();

  if (error) {
    console.error('Error fetching game state:', error);
    return null;
  }

  return data as GameState;
}

export async function updateGameState(
  roomId: string,
  updates: Partial<GameState>
): Promise<GameState | null> {
  const { data, error } = await supabase
    .from('games')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('room_id', roomId)
    .select()
    .single();

  if (error) {
    console.error('Error updating game state:', error);
    return null;
  }

  return data as GameState;
}

export async function initializeGame(roomId: string): Promise<GameState | null> {
  const { data, error } = await supabase
    .from('games')
    .insert({
      room_id: roomId,
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      pgn: '',
      current_turn: 'white',
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    console.error('Error initializing game:', error);
    return null;
  }

  return data as GameState;
}

export function subscribeToGameUpdates(
  roomId: string,
  callback: (game: GameState) => void
) {
  const subscription = supabase
    .channel(`game:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'games',
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        if (payload.new) {
          callback(payload.new as GameState);
        }
      }
    )
    .subscribe();

  return subscription;
}
