import React from 'react';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
      <div
        className={`w-2.5 h-2.5 rounded-full animate-pulse ${
          isConnected ? 'bg-green-400' : 'bg-red-400'
        }`}
      />
      <span className={`text-sm font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
        {isConnected ? 'Connected' : 'Reconnecting...'}
      </span>
    </div>
  );
}
