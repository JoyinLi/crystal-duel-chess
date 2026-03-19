# Crystal Duel Chess - Complete Setup Guide

## Project Overview

**Crystal Duel Chess** is a production-quality, private two-player online chess web app built with:
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- chess.js (move validation)
- react-chessboard (UI)
- Supabase (realtime sync + persistence)
- Vercel (deployment)

The app features custom SVG crystal pieces (pink for white, mint-green for black) and a minimal, elegant dark UI.

---

## Step 1: Supabase Setup

### Create Supabase Project
1. Go to https://supabase.com and sign up/log in
2. Click "New Project"
3. Choose a name (e.g., "crystal-duel-chess")
4. Set a strong database password
5. Choose your region (closest to you)
6. Wait for the project to initialize (~2 minutes)

### Create Games Table
1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Paste this SQL:

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

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE games;
```

4. Click **Run**
5. You should see "Success" message

### Get API Credentials
1. Go to **Settings** → **API** (left sidebar)
2. Under "Project API keys", copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
3. Save these for the next step

---

## Step 2: Local Development Setup

### Install Dependencies
```bash
cd crystal-duel-chess
npm install
```

This installs:
- Next.js, React, TypeScript
- Tailwind CSS
- chess.js, react-chessboard
- Supabase client

### Configure Environment
1. Copy the example env file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and paste your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Run Development Server
```bash
npm run dev
```

You should see:
```
> crystal-duel-chess@1.0.0 dev
> next dev

  ▲ Next.js 15.0.0
  - Local:        http://localhost:3000
```

Open http://localhost:3000 in your browser.

---

## Step 3: Test Locally

### Single Player Test
1. Open http://localhost:3000
2. Click "Play as White"
3. Make a move (drag a piece)
4. Verify the move is valid and the board updates

### Two Player Test (Same Machine)
1. Open http://localhost:3000 in **Browser A**
2. Click "Play as White"
3. Open http://localhost:3000 in **Browser B** (or incognito window)
4. Click "Play as Black"
5. In Browser A, make a move
6. Verify it appears instantly in Browser B
7. In Browser B, make a move
8. Verify it appears instantly in Browser A

### Two Player Test (Different Machines)
1. Get your local IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)
2. On Machine A: Open `http://YOUR_IP:3000?side=white`
3. On Machine B: Open `http://YOUR_IP:3000?side=black`
4. Play and verify realtime sync

---

## Step 4: Deploy to Vercel

### Option A: Deploy via GitHub (Recommended)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit: Crystal Duel Chess MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/crystal-duel-chess.git
git push -u origin main
```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your GitHub repo
   - Click "Import"

3. **Add Environment Variables**
   - In the "Environment Variables" section, add:
     - Name: `NEXT_PUBLIC_SUPABASE_URL` → Value: your Supabase URL
     - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Value: your Supabase key
   - Click "Deploy"

4. **Wait for Deployment**
   - Vercel will build and deploy automatically
   - You'll get a URL like `https://crystal-duel-chess.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Follow the prompts**
   - Link to your Vercel account
   - Select project settings
   - Add environment variables when prompted

---

## Step 5: Share with Your Opponent

Once deployed, share these links:

**White Player:**
```
https://your-project.vercel.app/room/crystal-duel?side=white
```

**Black Player:**
```
https://your-project.vercel.app/room/crystal-duel?side=black
```

Both players open their respective links and can play in real time.

---

## Architecture Summary

### Data Flow
```
Player A makes move
    ↓
chess.js validates
    ↓
Client sends to Supabase
    ↓
Supabase updates FEN/PGN/turn
    ↓
Realtime event fires
    ↓
Both clients receive update
    ↓
Both boards sync instantly
```

### Key Components
- **ChessBoard.tsx** - react-chessboard wrapper with custom pieces
- **CrystalPiece.tsx** - SVG crystal piece renderer (pink/mint)
- **useGameState.ts** - Game state management (moves, reset)
- **useRealtimeSync.ts** - Realtime subscription handler
- **chess-engine.ts** - chess.js wrapper for validation
- **supabase.ts** - Database queries and subscriptions

### Database Schema
```
games table:
- id (UUID, primary key)
- room_id (TEXT, unique) = "crystal-duel"
- fen (TEXT) = current board state
- pgn (TEXT) = move history
- current_turn (TEXT) = "white" or "black"
- status (TEXT) = "active", "checkmate", "draw", "stalemate", "check"
- created_at, updated_at (timestamps)
```

---

## Troubleshooting

### "Failed to load game"
**Cause:** Supabase credentials are wrong or table doesn't exist
**Fix:**
1. Verify `.env.local` has correct credentials
2. Check Supabase project → SQL Editor → verify `games` table exists
3. Check browser console (F12) for error details

### Moves not syncing between players
**Cause:** Realtime not enabled on table
**Fix:**
1. Go to Supabase → SQL Editor
2. Run: `ALTER PUBLICATION supabase_realtime ADD TABLE games;`
3. Refresh both browser windows

### Pieces not rendering
**Cause:** react-chessboard not installed or SVG issue
**Fix:**
1. Run `npm install` again
2. Clear browser cache (Ctrl+Shift+Delete)
3. Check browser console for errors

### "Illegal move" error
**Cause:** Trying to move opponent's pieces or invalid move
**Fix:**
1. Only move your own color pieces
2. Only move when it's your turn
3. Follow chess rules (pieces can only move legally)

### Deployment fails on Vercel
**Cause:** Missing environment variables or build error
**Fix:**
1. Check Vercel dashboard → Deployments → click failed deployment
2. Verify environment variables are set correctly
3. Check build logs for TypeScript or dependency errors
4. Run `npm run build` locally to test

---

## Production Checklist

- [x] Two-player only (no matchmaking needed)
- [x] Realtime sync (Supabase subscriptions)
- [x] Move validation (chess.js)
- [x] Persistent state (Supabase database)
- [x] Custom crystal pieces (SVG)
- [x] Elegant dark UI (Tailwind)
- [x] Responsive design (mobile + desktop)
- [x] Connection status indicator
- [x] Game reset button
- [x] Move history display
- [x] Deployable to Vercel

---

## Next Steps (Optional Enhancements)

1. **Add move timer** - Use `setInterval` to track time per player
2. **Add chat** - Supabase realtime messages table
3. **Add game replay** - Parse PGN and replay moves
4. **Add multiple rooms** - Dynamic room creation
5. **Add authentication** - Supabase Auth for user accounts
6. **Add ELO rating** - Track player ratings across games

---

## Support

For issues:
1. Check the Troubleshooting section above
2. Check browser console (F12 → Console tab)
3. Check Supabase logs (Project → Logs)
4. Check Vercel deployment logs (Vercel dashboard)

Good luck playing! 🎮♟️
