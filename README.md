# Crystal Duel Chess - Setup & Deployment Guide

## Quick Start

### 1. Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account (free tier works)
- Vercel account (for deployment)

### 2. Local Development

#### Clone and Install
```bash
cd crystal-duel-chess
npm install
```

#### Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. In your project, go to SQL Editor and run this SQL to create the games table:

```sql
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

CREATE INDEX idx_games_room_id ON games(room_id);

-- Enable realtime for the games table
ALTER PUBLICATION supabase_realtime ADD TABLE games;
```

3. Get your Supabase credentials:
   - Go to Settings → API
   - Copy `Project URL` and `anon public` key

4. Create `.env.local` in the project root:
```bash
cp .env.local.example .env.local
```

5. Fill in your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### Run Locally
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 3. Testing Locally

1. Open two browser windows/tabs
2. Go to http://localhost:3000
3. Click "Play as White" in one window
4. Click "Play as Black" in the other window
5. Make moves and verify they sync in real time

### 4. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
npm install -g vercel
vercel
```

#### Option B: Using GitHub
1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy

#### After Deployment
- Your app will be live at `your-project.vercel.app`
- Share the links with your opponent:
  - White: `https://your-project.vercel.app/room/crystal-duel?side=white`
  - Black: `https://your-project.vercel.app/room/crystal-duel?side=black`

## Architecture

### Data Flow
1. Player makes move on client
2. chess.js validates the move
3. Move is sent to Supabase
4. Supabase updates the game state (FEN, PGN, turn)
5. Realtime subscription notifies both clients
6. Both boards update instantly

### Key Files
- `app/room/[roomId]/page.tsx` - Main game page
- `components/ChessBoard.tsx` - Board UI with react-chessboard
- `components/CrystalPiece.tsx` - Custom SVG crystal pieces
- `lib/chess-engine.ts` - chess.js wrapper
- `lib/supabase.ts` - Supabase client and queries
- `hooks/useGameState.ts` - Game state management
- `hooks/useRealtimeSync.ts` - Realtime sync

## Troubleshooting

### "Failed to load game"
- Check Supabase credentials in `.env.local`
- Verify the `games` table exists in Supabase
- Check browser console for errors

### Moves not syncing
- Verify realtime is enabled on the `games` table
- Check network tab in browser DevTools
- Ensure both players are on the same room URL

### Pieces not rendering
- Clear browser cache
- Check that `react-chessboard` is installed
- Verify SVG rendering in browser console

## Production Notes

- The app is designed for exactly 2 players
- The room ID is hardcoded as "crystal-duel"
- No authentication is needed (URL-based access)
- Supabase free tier supports this use case
- Vercel free tier is sufficient for deployment

## Future Enhancements (Optional)

- Add move timer/clock
- Add chat between players
- Add game replay/analysis
- Add multiple rooms
- Add user authentication
- Add ELO rating system
