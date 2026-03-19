# Crystal Duel Chess - Visual Architecture Guide

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         VERCEL (Deployment)                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Next.js Application                         │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  Browser A (White Player)                          │  │   │
│  │  │  - ChessBoard component                            │  │   │
│  │  │  - useGameState hook                               │  │   │
│  │  │  - useRealtimeSync hook                            │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                        ↕ (realtime)                       │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  Browser B (Black Player)                          │  │   │
│  │  │  - ChessBoard component                            │  │   │
│  │  │  - useGameState hook                               │  │   │
│  │  │  - useRealtimeSync hook                            │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕ (HTTPS)
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE (Backend)                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PostgreSQL Database                                     │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  games table                                       │  │   │
│  │  │  - id (UUID)                                       │  │   │
│  │  │  - room_id = "crystal-duel"                        │  │   │
│  │  │  - fen (current board state)                       │  │   │
│  │  │  - pgn (move history)                              │  │   │
│  │  │  - current_turn ("white" or "black")               │  │   │
│  │  │  - status ("active", "checkmate", etc)             │  │   │
│  │  │  - created_at, updated_at                          │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Realtime Subscriptions                                  │   │
│  │  - Both clients subscribe to games table changes         │   │
│  │  - Instant updates when FEN/turn/status changes          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Move Flow Diagram

```
Player A makes move (drag piece)
    ↓
ChessBoard.onPieceDrop() triggered
    ↓
useGameState.makeMove() called
    ↓
chess-engine.validateAndMakeMove()
    ├─ Create Chess instance from current FEN
    ├─ Attempt move with chess.js
    ├─ If valid: return new FEN, PGN, status
    └─ If invalid: return error
    ↓
If valid:
    ├─ Optimistic update: setGame() with new state
    ├─ Send to Supabase: updateGameState()
    └─ Supabase updates games table
    ↓
Supabase triggers realtime event
    ↓
Both clients receive update via subscription
    ↓
useRealtimeSync.onUpdate() called
    ├─ setGame() with new state
    └─ ChessBoard re-renders with new FEN
    ↓
Both boards show the move instantly
```

## Component Hierarchy

```
app/layout.tsx (Root)
    ↓
app/page.tsx (Home)
    ├─ Link to /room/crystal-duel?side=white
    └─ Link to /room/crystal-duel?side=black
    ↓
app/room/[roomId]/page.tsx (Main Game)
    ├─ Header
    │   ├─ Title "Crystal Duel Chess"
    │   ├─ Player side display
    │   └─ ConnectionStatus
    ├─ Main Content
    │   ├─ ChessBoard
    │   │   └─ CrystalPiece (x12 per side)
    │   └─ Sidebar
    │       ├─ GameStatus
    │       ├─ GameControls
    │       ├─ Error message (if any)
    │       └─ Move history
    └─ Footer
        └─ Share instructions
```

## Data Flow: Move Validation

```
Current FEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
Player: White
Move: e2 → e4

    ↓
chess.js.move({ from: "e2", to: "e4" })
    ├─ Check if piece exists at e2
    ├─ Check if piece is white (current turn)
    ├─ Check if move is legal for that piece
    ├─ Check if move doesn't leave king in check
    └─ If all valid: return move object
    ↓
New FEN: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
New PGN: "1. e4"
New Status: "active"
New Turn: "black"
    ↓
Update Supabase
    ↓
Realtime event
    ↓
Both clients sync
```

## Realtime Sync Flow

```
Supabase Realtime Subscription:
    ↓
supabase
  .channel("game:crystal-duel")
  .on("postgres_changes", {
    event: "*",
    schema: "public",
    table: "games",
    filter: "room_id=eq.crystal-duel"
  }, (payload) => {
    callback(payload.new)
  })
  .subscribe()
    ↓
When games table is updated:
    ├─ Supabase detects change
    ├─ Sends event to all subscribed clients
    ├─ Payload contains new game state
    └─ Callback updates local state
    ↓
useRealtimeSync hook:
    ├─ Receives updated game
    ├─ Calls setGame(updatedGame)
    ├─ ChessBoard re-renders with new FEN
    └─ UI updates instantly
```

## State Management

```
useGameState Hook:
    ├─ game: GameState | null
    │   ├─ id, room_id, fen, pgn
    │   ├─ current_turn, status
    │   └─ created_at, updated_at
    ├─ loading: boolean
    ├─ error: string | null
    ├─ makeMove(from, to): Promise<boolean>
    ├─ resetGame(): Promise<void>
    └─ setGame(game): void

useRealtimeSync Hook:
    ├─ isConnected: boolean
    └─ Subscribes to Supabase realtime
```

## File Dependencies

```
app/room/[roomId]/page.tsx
    ├─ components/ChessBoard.tsx
    │   ├─ components/CrystalPiece.tsx
    │   └─ lib/types.ts
    ├─ components/GameStatus.tsx
    │   └─ lib/types.ts
    ├─ components/GameControls.tsx
    ├─ components/ConnectionStatus.tsx
    ├─ hooks/useGameState.ts
    │   ├─ lib/supabase.ts
    │   ├─ lib/chess-engine.ts
    │   └─ lib/types.ts
    └─ hooks/useRealtimeSync.ts
        ├─ lib/supabase.ts
        └─ lib/types.ts

lib/supabase.ts
    └─ @supabase/supabase-js

lib/chess-engine.ts
    └─ chess.js

components/ChessBoard.tsx
    ├─ react-chessboard
    └─ components/CrystalPiece.tsx
```

## Deployment Architecture

```
Local Development:
    npm run dev
    ↓
    http://localhost:3000
    ↓
    .env.local (Supabase credentials)

Production (Vercel):
    GitHub Repository
    ↓
    Vercel Import
    ↓
    Environment Variables (Vercel Settings)
    ├─ NEXT_PUBLIC_SUPABASE_URL
    └─ NEXT_PUBLIC_SUPABASE_ANON_KEY
    ↓
    npm run build
    ↓
    npm run start
    ↓
    https://your-project.vercel.app
    ↓
    Supabase (same project as local)
```

## Crystal Piece Rendering

```
CrystalPiece Component:
    ├─ Props: piece (P/N/B/R/Q/K), isDark, size
    ├─ Determine color:
    │   ├─ White pieces: #F6B7D2 (pink)
    │   └─ Black pieces: #AEEFD8 (mint)
    ├─ Render SVG:
    │   ├─ Radial gradient for glow
    │   ├─ Shape based on piece type
    │   ├─ Highlight circle for shine
    │   └─ Drop shadow for depth
    └─ Apply CSS filter:
        └─ drop-shadow(0 0 8px rgba(color, 0.4))
```

## Error Handling Flow

```
Move attempt
    ↓
Try to validate with chess.js
    ├─ Success: proceed with update
    └─ Error: catch exception
        ↓
        setError("Invalid move")
        ↓
        Display error in UI
        ↓
        Auto-clear after 3 seconds

Database update
    ├─ Success: optimistic update confirmed
    └─ Error: catch error
        ↓
        setError("Failed to save move")
        ↓
        Revert optimistic update
        ↓
        Display error in UI

Realtime sync
    ├─ Connected: show green indicator
    └─ Disconnected: show red indicator
        ↓
        Disable move input
        ↓
        Show "Reconnecting..." message
```

---

This architecture is designed for:
- ✓ Simplicity (no complex state management)
- ✓ Reliability (chess.js validation)
- ✓ Performance (optimistic updates)
- ✓ Scalability (Supabase handles realtime)
- ✓ Maintainability (clear separation of concerns)
