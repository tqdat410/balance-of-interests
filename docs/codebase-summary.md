# Codebase Summary

## File Structure

```
balance/                           # ~4,400 total LOC
├── app/
│   ├── api/
│   │   ├── game-token/
│   │   │   └── route.ts          # 45 lines - Token generation
│   │   ├── leaderboard/
│   │   │   └── route.ts          # 83 lines - Paginated fetch
│   │   └── submit-score/
│   │       └── route.ts          # 189 lines - Score submission
│   ├── components/
│   │   ├── AudioManager.tsx      # 187 lines - Music/SFX
│   │   ├── ClientLayout.tsx      # 17 lines - Client wrapper
│   │   ├── EventPopup.tsx        # 163 lines - Event modals
│   │   ├── GameActionButtons.tsx # 191 lines - Action cards
│   │   ├── GameHistory.tsx       # 196 lines - Action log
│   │   ├── GameIllustration.tsx  # 278 lines - Character animations
│   │   └── GameStatusBars.tsx    # 132 lines - Status bars
│   ├── leaderboard/
│   │   └── page.tsx              # 288 lines - Leaderboard UI
│   ├── globals.css               # Styles with animations
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # 1289 lines - Main game logic
├── lib/
│   └── gameVerification.ts       # 152 lines - Hash verification
├── supabase/
│   ├── create_leaderboard_function.sql  # 101 lines
│   └── functions/get-leaderboard/index.ts.md
├── public/
│   ├── animation/                # 9 character images
│   ├── font/DFVN_Hogfish.otf     # Vietnamese display font
│   └── sound/                    # 2 audio files
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.ts
└── README.md
```

## Component Hierarchy

```
layout.tsx
└── ClientLayout.tsx
    ├── AudioManager.tsx (global)
    └── page.tsx (BalanceOfInterests)
        ├── FAQPopup (inline)
        ├── GameStatusBars
        ├── GameIllustration
        ├── GameActionButtons
        ├── GameHistory
        └── EventPopup (conditional)

leaderboard/page.tsx
└── LeaderboardPage (standalone)
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                        │
├─────────────────────────────────────────────────────────────────┤
│  page.tsx (State Management)                                    │
│  ├── gameState: "menu" | "playing" | "gameOver" | "victory"    │
│  ├── round: 1-30                                                │
│  ├── bars: { Government, Businesses, Workers }                  │
│  ├── turnOrder, turnIndex, currentEntity                        │
│  ├── history: LogEntry[]                                        │
│  └── playerName, sessionId, gameSessionId, gameToken            │
│                                                                  │
│  Actions Flow:                                                   │
│  handleAction() -> applyEffects() -> checkGameOver()            │
│                         │                    │                   │
│                         v                    v                   │
│                    setBars()          submitScore()              │
│                         │                    │                   │
│                         v                    │                   │
│           CustomEvent('gameActionEffect')    │                   │
│                         │                    │                   │
│                         v                    │                   │
│           GameIllustration (animations)      │                   │
└─────────────────────────────────────────────|───────────────────┘
                                              │
                                              v
┌─────────────────────────────────────────────────────────────────┐
│                      API ROUTES (Edge Runtime)                  │
├─────────────────────────────────────────────────────────────────┤
│  /api/game-token                                                │
│  ├── Input: { game_session_id }                                 │
│  ├── Process: generateSessionToken(id, secret)                  │
│  └── Output: { token }                                          │
│                                                                  │
│  /api/submit-score                                              │
│  ├── Input: { session_id, game_session_id, name, stats, hash } │
│  ├── Verify: timestamp, hash, game progression                  │
│  └── Insert: game_records table                                 │
│                                                                  │
│  /api/leaderboard                                               │
│  ├── Input: { page_number, page_size }                          │
│  ├── Call: get_grouped_leaderboard RPC                          │
│  └── Output: { data, pagination }                               │
└─────────────────────────────────────────────────────────────────┘
                                              │
                                              v
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE (PostgreSQL)                      │
├─────────────────────────────────────────────────────────────────┤
│  Table: game_records                                            │
│  ├── id (bigint, PK)                                            │
│  ├── session_id (UUID) - groups records by user                 │
│  ├── name (text)                                                │
│  ├── final_round (int2)                                         │
│  ├── total_action (int2)                                        │
│  ├── gov_bar, bus_bar, wor_bar (int2)                          │
│  ├── start_time, end_time (timestamptz)                         │
│  ├── duration (int2)                                            │
│  ├── ending (varchar) - 'harmony'|'survival'|'failed'          │
│  └── created_at (timestamptz)                                   │
│                                                                  │
│  Function: get_grouped_leaderboard(page, size)                  │
│  └── Returns best record per session, ranked by:                │
│      1. ending (harmony > survival > failed)                    │
│      2. final_round DESC                                        │
│      3. duration ASC                                            │
│      4. total_action DESC                                       │
└─────────────────────────────────────────────────────────────────┘
```

## Key Types and Interfaces

### Core Game Types (page.tsx)

```typescript
type Entity = "Government" | "Businesses" | "Workers";

type ActionEffect = Record<Entity, number>;

interface GameAction {
  name: string;
  imageUrl: string;
  effects: ActionEffect;
}

interface GameEvent {
  name: string;
  imageUrl?: string;
  effects?: ActionEffect;            // Forced events
  positiveEffects?: ActionEffect;    // Special events (10% win)
  negativeEffects?: ActionEffect;    // Special events (90% lose)
  isSpecialEvent?: boolean;
  entity?: Entity;
}

interface LogEntry {
  round: number;
  entity: Entity | "Event";
  action: string;
  effects: ActionEffect;
}

type Bars = Record<Entity, number>;

type GameState = "menu" | "playing" | "gameOver" | "victory";

type EndingType = "harmony" | "survival" | null;
```

### Verification Types (lib/gameVerification.ts)

```typescript
interface GameHashData {
  game_session_id: string;
  final_round: number;
  gov_bar: number;
  bus_bar: number;
  wor_bar: number;
  duration: number;
  ending: string;
  timestamp: number;
  token: string;
}

interface ProgressionData {
  final_round: number;
  total_action: number;
  duration: number;
  gov_bar: number;
  bus_bar: number;
  wor_bar: number;
  ending: string;
}
```

### API Payload Types

```typescript
// POST /api/submit-score
interface SubmitScorePayload {
  session_id: string;        // User session (grouping)
  game_session_id: string;   // Game session (anti-cheat)
  name: string;
  final_round: number;
  total_action: number;
  gov_bar: number;
  bus_bar: number;
  wor_bar: number;
  start_time: string;        // ISO 8601
  end_time: string;          // ISO 8601
  duration: number;          // seconds
  ending: "harmony" | "survival" | "failed";
  timestamp: number;         // Unix ms
  verification_hash: string; // SHA-256
}

// POST /api/leaderboard
interface LeaderboardRequest {
  page_number: number;
  page_size: number;  // max 100
}

interface LeaderboardResponse {
  success: boolean;
  data: GameRecord[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}
```

## Event Communication

Components communicate via CustomEvents on `window`:

```typescript
// Turn change notification
window.dispatchEvent(new CustomEvent("gameTurnChange", {
  detail: { currentEntity: Entity }
}));

// Action effect for animations
window.dispatchEvent(new CustomEvent("gameActionEffect", {
  detail: { effects: ActionEffect, currentEntity: Entity | "Event" }
}));

// Special event notification
window.dispatchEvent(new CustomEvent("specialEvent", {
  detail: { eventName: string, round: number }
}));

// Game state change (for audio)
window.dispatchEvent(new CustomEvent("gameStateChange", {
  detail: { state: "playing" | "gameOver" | "victory" }
}));

// Audio controls
window.dispatchEvent(new CustomEvent("playSound", {
  detail: { type: "positive" | "negative" | "event" }
}));
```

## External Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.0.0 | React framework |
| react | 19.2.0 | UI library |
| react-dom | 19.2.0 | React DOM |
| tailwindcss | ^4 | Styling |
| typescript | ^5 | Type safety |

## External Services

| Service | Purpose |
|---------|---------|
| Cloudinary | Image hosting (action/event images) |
| Supabase | Database + Auth |
| Cloudflare Pages | Deployment target |
