import { useEffect, useState, useCallback } from 'react';
import { supabase, subscribeToGameUpdates } from '@/lib/supabase';
import type { GameState } from '@/lib/types';

export function useRealtimeSync(roomId: string, onUpdate: (game: GameState) => void) {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const subscription = subscribeToGameUpdates(roomId, (game) => {
      setIsConnected(true);
      onUpdate(game);
    });

    const handleConnectionChange = (state: any) => {
      setIsConnected(state === 'SUBSCRIBED');
    };

    subscription.on('subscribe', () => handleConnectionChange('SUBSCRIBED'));
    subscription.on('error', () => handleConnectionChange('ERROR'));

    return () => {
      subscription.unsubscribe();
    };
  }, [roomId, onUpdate]);

  return { isConnected };
}
