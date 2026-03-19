# Crystal Duel Chess - Getting Started Checklist

## Pre-Setup (5 minutes)

- [ ] You have a Supabase account (free tier is fine)
- [ ] You have a Vercel account (free tier is fine)
- [ ] You have Node.js 18+ installed (`node --version`)
- [ ] You have npm installed (`npm --version`)
- [ ] You have git installed (`git --version`)

## Step 1: Supabase Setup (10 minutes)

- [ ] Create new Supabase project at https://supabase.com
- [ ] Wait for project to initialize (~2 minutes)
- [ ] Go to SQL Editor
- [ ] Copy entire contents of `supabase-schema.sql`
- [ ] Paste into SQL Editor and click Run
- [ ] Verify "Success" message appears
- [ ] Go to Settings → API
- [ ] Copy Project URL (looks like `https://xxxxx.supabase.co`)
- [ ] Copy anon public key (long string starting with `eyJ...`)
- [ ] Save these credentials somewhere safe

## Step 2: Local Setup (5 minutes)

- [ ] Navigate to project: `cd crystal-duel-chess`
- [ ] Install dependencies: `npm install`
- [ ] Copy env template: `cp .env.local.example .env.local`
- [ ] Edit `.env.local` with your Supabase credentials:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
  ```
- [ ] Save `.env.local`

## Step 3: Test Locally (10 minutes)

- [ ] Start dev server: `npm run dev`
- [ ] Wait for "Local: http://localhost:3000" message
- [ ] Open http://localhost:3000 in browser
- [ ] Click "Play as White"
- [ ] Verify board loads with starting position
- [ ] Try dragging a piece (e.g., pawn from e2 to e4)
- [ ] Verify move is valid and board updates
- [ ] Open http://localhost:3000 in second browser window
- [ ] Click "Play as Black" in second window
- [ ] Make a move in first window (White)
- [ ] Verify move appears instantly in second window
- [ ] Make a move in second window (Black)
- [ ] Verify move appears instantly in first window
- [ ] Click "Start New Game" button
- [ ] Verify board resets to starting position in both windows

## Step 4: Deploy to Vercel (15 minutes)

### Option A: GitHub + Vercel (Recommended)

- [ ] Initialize git: `git init`
- [ ] Add all files: `git add .`
- [ ] Create commit: `git commit -m "Initial commit: Crystal Duel Chess MVP"`
- [ ] Rename branch: `git branch -M main`
- [ ] Create GitHub repository at https://github.com/new
- [ ] Add remote: `git remote add origin https://github.com/YOUR_USERNAME/crystal-duel-chess.git`
- [ ] Push to GitHub: `git push -u origin main`
- [ ] Go to https://vercel.com/new
- [ ] Click "Import Git Repository"
- [ ] Select your GitHub repo
- [ ] Click "Import"
- [ ] In "Environment Variables" section, add:
  - [ ] Name: `NEXT_PUBLIC_SUPABASE_URL` → Value: your Supabase URL
  - [ ] Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Value: your Supabase key
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete (~2 minutes)
- [ ] Click "Visit" to see your live app
- [ ] Copy the URL (e.g., `https://crystal-duel-chess.vercel.app`)

### Option B: Vercel CLI

- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Run: `vercel`
- [ ] Follow prompts to link account and deploy
- [ ] Add environment variables when prompted
- [ ] Wait for deployment to complete

## Step 5: Share with Opponent (2 minutes)

- [ ] Get your Vercel URL (e.g., `https://crystal-duel-chess.vercel.app`)
- [ ] Create White link: `https://your-url.vercel.app/room/crystal-duel?side=white`
- [ ] Create Black link: `https://your-url.vercel.app/room/crystal-duel?side=black`
- [ ] Send White link to one player
- [ ] Send Black link to other player
- [ ] Both players open their links
- [ ] Play chess!

## Step 6: Verify Everything Works (5 minutes)

- [ ] Both players can see the board
- [ ] Both players see the same board state
- [ ] White player can move white pieces
- [ ] Black player can move black pieces
- [ ] Moves sync instantly between players
- [ ] Connection status shows "Connected"
- [ ] Game status shows whose turn it is
- [ ] "Start New Game" button resets the board
- [ ] Refreshing page restores game state
- [ ] Move history displays correctly

## Troubleshooting Checklist

### "Failed to load game"
- [ ] Check `.env.local` has correct Supabase URL
- [ ] Check `.env.local` has correct Supabase key
- [ ] Verify `games` table exists in Supabase
- [ ] Check browser console (F12) for error details
- [ ] Try refreshing the page

### Moves not syncing
- [ ] Verify both players are on the same room URL
- [ ] Check connection status indicator (should be green)
- [ ] Verify realtime is enabled in Supabase (run SQL again if needed)
- [ ] Try refreshing both pages
- [ ] Check browser console for errors

### Pieces not rendering
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Run `npm install` again
- [ ] Restart dev server (`npm run dev`)
- [ ] Check browser console for errors

### Deployment fails
- [ ] Check Vercel dashboard for build logs
- [ ] Verify environment variables are set in Vercel
- [ ] Try running `npm run build` locally to test
- [ ] Check for TypeScript errors: `npm run build`

## Optional: Customize

### Change Colors
Edit `tailwind.config.ts`:
```ts
colors: {
  crystal: {
    pink: '#YOUR_COLOR',
    'pink-light': '#YOUR_LIGHT_COLOR',
    mint: '#YOUR_COLOR',
    'mint-light': '#YOUR_LIGHT_COLOR',
  },
}
```

### Change Room Name
Edit `app/room/[roomId]/page.tsx`:
```ts
const roomId = 'your-room-name'; // Change from 'crystal-duel'
```

### Change Board Size
Edit `components/ChessBoard.tsx`:
```ts
boardWidth={500} // Change to desired size
```

## Next Steps

1. **Play!** - Enjoy your private chess app
2. **Invite friends** - Share the links
3. **Enhance** - Add features from the optional enhancements list
4. **Deploy** - Your app is already live on Vercel!

## Support Resources

- **Setup issues?** → Read SETUP.md
- **Architecture questions?** → Read ARCHITECTURE_VISUAL.md
- **Code questions?** → Check comments in source files
- **Supabase help?** → https://supabase.com/docs
- **Next.js help?** → https://nextjs.org/docs
- **chess.js help?** → https://github.com/jhlywa/chess.js

## Success Indicators

✓ You can make moves locally
✓ Moves sync between two browser windows
✓ App is deployed to Vercel
✓ You can play with opponent on different devices
✓ Game state persists after refresh
✓ Connection status shows green
✓ No errors in browser console

---

**You're all set! Enjoy Crystal Duel Chess! ♟️✨**
