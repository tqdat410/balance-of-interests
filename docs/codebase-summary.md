# Codebase Summary

> **Last Updated:** 2026-01-15  
> **Total Files:** 35 source files  
> **Total LOC:** ~4,474

## Table of Contents

- [Directory Structure](#directory-structure)
- [File Inventory](#file-inventory)
- [Components](#components)
- [API Routes](#api-routes)
- [Configuration](#configuration)
- [Type Definitions](#type-definitions)
- [Database](#database)

---

## Directory Structure

```
balance/
├── app/                      # Next.js App Router
│   ├── api/                  # Edge Runtime API routes
│   │   ├── leaderboard/      # GET leaderboard data
│   │   └── submit-score/     # POST score submission
│   ├── components/           # React components (17 files)
│   ├── leaderboard/          # Standalone leaderboard page
│   ├── globals.css           # Tailwind + animations
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main game page
├── lib/                      # Shared utilities
│   ├── config/               # Game configuration
│   ├── hooks/                # Custom React hooks
│   ├── styles/               # CSS design tokens
│   ├── supabase/             # Supabase client
│   └── types/                # TypeScript types
├── supabase/                 # Database schema
├── public/                   # Static assets
└── [config files]            # package.json, tsconfig, etc.
```

---

## File Inventory

### App Directory

| File | LOC | Purpose |
|------|-----|---------|
| `app/page.tsx` | 145 | Main game entry, state orchestration |
| `app/layout.tsx` | ~30 | Root layout, font loading, metadata |
| `app/globals.css` | ~1200 | Tailwind imports, 30+ animations |
| `app/leaderboard/page.tsx` | 322 | Standalone leaderboard view |

### API Routes

| File | LOC | Runtime | Purpose |
|------|-----|---------|---------|
| `api/leaderboard/route.ts` | 70 | Edge | Paginated leaderboard RPC |
| `api/submit-score/route.ts` | 166 | Edge | HMAC-verified score submission |

### Components (17 total)

| File | LOC | Description |
|------|-----|-------------|
| `ClientLayout.tsx` | ~20 | Client-side wrapper for layout |
| `EventPopup.tsx` | 236 | Event modal with glass effects |
| `FAQPopup.tsx` | 90 | Help/rules modal |
| `GameActionButtons.tsx` | 195 | Action cards with hover animations |
| `GameControlButtons.tsx` | 190 | FAQ/Settings control buttons |
| `GameHeader.tsx` | 18 | Mobile header component |
| `GameOverScreen.tsx` | 80 | Failure end screen |
| `GamePlayArea.tsx` | 138 | Main gameplay container |
| `GameStatus.tsx` | 26 | Mobile status display |
| `GameStatusBars.tsx` | 133 | Vertical bars (legacy, desktop) |
| `LeaderboardTable.tsx` | ~150 | Leaderboard table component |
| `LoadingScreen.tsx` | 245 | Asset preloader with progress |
| `MainMenu.tsx` | 139 | Start screen / main menu |
| `SettingsPopup.tsx` | 122 | Audio controls modal |
| `StatusLineChart.tsx` | 589 | Recharts line chart visualization |
| `VictoryScreen.tsx` | 124 | Victory end screen |

### Library Files

| File | LOC | Purpose |
|------|-----|---------|
| `lib/hooks/useGameState.ts` | 467 | Core game state management |
| `lib/gameVerification.ts` | 167 | HMAC anti-cheat utilities |
| `lib/supabase/api.ts` | 50 | Supabase client configuration |
| `lib/config/actions.ts` | 193 | 36 game actions definition |
| `lib/config/events.ts` | 62 | 6 game events definition |
| `lib/config/game.ts` | 61 | GAME_CONFIG constants |
| `lib/config/profanity.ts` | 49 | Bad word filter |
| `lib/config/index.ts` | ~10 | Barrel exports |
| `lib/types/database.ts` | 98 | Supabase generated types |
| `lib/types/game.ts` | 73 | Game-specific types |
| `lib/types/index.ts` | ~10 | Barrel exports |

### Style Files

| File | Purpose |
|------|---------|
| `lib/styles/clay-tokens.css` | Design tokens (colors, shadows, radius) |
| `lib/styles/clay-components.css` | Claymorphism component classes |

### Database

| File | LOC | Purpose |
|------|-----|---------|
| `supabase/init-database.sql` | 191 | Schema, indexes, RLS, RPC functions |

### Static Assets

| Directory | Contents |
|-----------|----------|
| `public/background/` | 6 background images |
| `public/font/` | DFVN_Hogfish.otf custom font |
| `public/sound/` | 2 audio files (music, SFX) |

---

## Components

### Component Hierarchy

```
page.tsx
├── LoadingScreen
├── MainMenu
├── GamePlayArea
│   ├── GameHeader (mobile)
│   ├── GameStatus (mobile)
│   ├── GameStatusBars (legacy desktop)
│   ├── StatusLineChart (desktop)
│   ├── GameActionButtons
│   └── GameControlButtons
│       ├── FAQPopup
│       └── SettingsPopup
├── EventPopup
├── GameOverScreen
└── VictoryScreen
```

### Key Component Details

#### StatusLineChart (589 LOC)

Largest component. Uses Recharts for line chart visualization.

**Features:**
- Real-time bar value tracking
- Custom ClayDot tooltip markers
- Responsive sizing
- Animation on data update

**Props:**
```typescript
interface Props {
  history: { round: number; gov: number; bus: number; wor: number }[];
  currentRound: number;
}
```

#### useGameState Hook (467 LOC)

Core game state management. Single hook pattern.

**Exports:**
```typescript
interface GameState {
  // State
  gameState: 'menu' | 'playing' | 'gameOver' | 'victory';
  round: number;
  bars: Bars;
  currentEntity: Entity | null;
  history: LogEntry[];
  rerollCount: number; // New in Phase 1
  
  // Actions
  startGame: () => void;
  handleAction: (action: GameAction) => void;
  handleReroll: () => void; // New in Phase 1
  availableActions: GameAction[];
  
  // Events
  currentEvent: GameEvent | null;
  showEventPopup: boolean;
  handleEventContinue: () => void;
  handleEventSkip: () => void;
  handleEventAccept: () => void;
  handleEventExecute: () => void;
}
```

#### EventPopup (236 LOC)

Modal for special events. Glass morphism styling.

**Features:**
- Event description display
- Multiple choice buttons
- Animated entry/exit
- Backdrop blur effect

---

## API Routes

### GET /api/leaderboard

Fetches paginated leaderboard data.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Page number |
| pageSize | number | 10 | Items per page |

**Response:**
```typescript
{
  data: GameRecord[];
  total: number;
  page: number;
  pageSize: number;
}
```

### POST /api/submit-score

Submits game score with anti-cheat verification.

**Request Body:**
```typescript
{
  sessionId: string;
  name: string;
  finalRound: number;
  totalAction: number;
  govBar: number;
  busBar: number;
  worBar: number;
  startTime: string;
  endTime: string;
  ending: 'HARMONY' | 'SURVIVAL' | 'FAILED';
  signature: string;  // HMAC-SHA256
}
```

**Validation:**
1. HMAC signature verification
2. Profanity filter on name
3. Value range validation
4. Duration calculation

---

## Configuration

### GAME_CONFIG (`lib/config/game.ts`)

```typescript
const GAME_CONFIG = {
  MAX_ROUNDS: 30,
  INITIAL_BAR_VALUE: 50,
  MIN_BAR_VALUE: 0,
  MAX_BAR_VALUE: 100,
  ACTIONS_PER_CHOICE: 3,  // Reduced to 2 at rounds 21-30
  EVENT_ROUNDS: [5, 10, 15, 20, 25, 30],
  SPECIAL_EVENT_CHANCE: 0.1,
  DIFFICULTY_MODIFIERS: {
    NORMAL: { start: 1, end: 10, modifier: 0 },
    HARD: { start: 11, end: 20, modifier: -1 },
    EXTREME: { start: 21, end: 30, modifier: -2 }
  }
};
```

### Actions (`lib/config/actions.ts`)

36 total actions distributed:
- Government: 15 actions
- Businesses: 12 actions
- Workers: 9 actions

### Events (`lib/config/events.ts`)

6 predefined events for milestone rounds.

---

## Type Definitions

### Game Types (`lib/types/game.ts`)

```typescript
type EntityType = 'gov' | 'bus' | 'wor';
type GamePhase = 'menu' | 'playing' | 'paused' | 'victory' | 'defeat';
type Ending = 'HARMONY' | 'SURVIVAL' | 'FAILED';

interface GameAction {
  name: string;
  imageUrl: string;
  effects: ActionEffect;
}

type ActionEffect = Record<Entity, number>;

interface LogEntry {
  round: number;
  entity: Entity | "Event";
  action: string;
  effects: ActionEffect;
}

interface GameEvent {
  name: string;
  imageUrl?: string;
  effects?: ActionEffect;
  positiveEffects?: ActionEffect; // For special events
  negativeEffects?: ActionEffect; // For special events
  isSpecialEvent?: boolean;
  entity?: Entity;
  rerollReward?: boolean; // Grants reroll on completion
  isSkippable?: boolean;
}
```

### Database Types (`lib/types/database.ts`)

```typescript
interface GameRecord {
  id: number;
  session_id: string;
  name: string;
  final_round: number;
  total_action: number;
  gov_bar: number;
  bus_bar: number;
  wor_bar: number;
  start_time: string;
  end_time: string;
  duration: number;
  ending: Ending;
  created_at: string;
}
```

---

## Database

### Schema

**Table: `game_records`**

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGSERIAL | PK |
| session_id | UUID | NOT NULL |
| name | TEXT | 2-24 chars |
| final_round | SMALLINT | 0-30 |
| total_action | SMALLINT | 0-100 |
| gov_bar | SMALLINT | 0-100 |
| bus_bar | SMALLINT | 0-100 |
| wor_bar | SMALLINT | 0-100 |
| start_time | TIMESTAMPTZ | NOT NULL |
| end_time | TIMESTAMPTZ | NOT NULL |
| duration | SMALLINT | >= 0 |
| ending | VARCHAR(10) | HARMONY/SURVIVAL/FAILED |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

### Indexes

- `idx_game_records_session_id` on session_id
- `idx_game_records_ending` on ending
- `idx_game_records_created_at` on created_at

### RPC Function

**`get_grouped_leaderboard(page, pageSize)`**

Returns best record per session_id with ranking:
1. HARMONY > SURVIVAL > FAILED
2. Higher final_round
3. Lower duration
