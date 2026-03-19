import { useEffect, useState } from 'react';
import { subscribeToGameUpdates } from '@/lib/supabase';
import type { GameState } from '@/lib/types';

export function useRealtimeSync(
  roomId: string,
  onUpdate: (game: GameState) => void
) {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const subscription = subscribeToGameUpdates(roomId, (game) => {
      setIsConnected(true);
      onUpdate(game);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [roomId, onUpdate]);

  return { isConnected };
}