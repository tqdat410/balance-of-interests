# Phase 1: Project Setup & Dependencies

## Context
- [Plan Overview](./plan.md)
- CWD: C:\Users\Admin\Documents\FPT\MLN122\game\balance

## Overview

| Priority | Status | Effort |
|----------|--------|--------|
| P1 | Pending | 2h |

Setup new dependencies, file structure, and configuration for the refactoring project.

## Requirements

### Functional
- Install Supabase SDK packages
- Create directory structure for modular architecture
- Setup constants and config files
- Configure TypeScript paths

### Non-Functional
- No breaking changes to existing code
- Additive changes only in this phase

## Architecture

### New Directory Structure

```
balance/
├── app/
│   ├── api/
│   │   ├── leaderboard/route.ts
│   │   └── submit-score/route.ts
│   ├── components/          # UI components (existing)
│   ├── leaderboard/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx             # Will be refactored in Phase 3
├── lib/
│   ├── supabase/            # NEW: Supabase clients
│   │   ├── client.ts        # Browser client
│   │   ├── server.ts        # Server client
│   │   └── middleware.ts    # Auth middleware
│   ├── hooks/               # NEW: Custom React hooks
│   │   ├── use-game-state.ts
│   │   ├── use-game-actions.ts
│   │   ├── use-game-events.ts
│   │   └── use-game-session.ts
│   ├── config/              # NEW: Game constants
│   │   ├── game.ts          # Game settings (rounds, bars, etc)
│   │   ├── actions.ts       # Action definitions
│   │   └── events.ts        # Event definitions
│   ├── types/               # NEW: TypeScript types
│   │   ├── game.ts          # Game types
│   │   ├── database.ts      # Supabase generated types
│   │   └── index.ts         # Export barrel
│   └── gameVerification.ts  # Existing (simplified HMAC)
├── supabase/
│   └── ...
└── ...
```

## Related Code Files

### Files to Create

| File | Purpose |
|------|---------|
| `lib/supabase/client.ts` | Browser Supabase client |
| `lib/supabase/server.ts` | Server/API route client |
| `lib/config/game.ts` | Game constants |
| `lib/config/actions.ts` | Action definitions extracted from page.tsx |
| `lib/config/events.ts` | Event definitions |
| `lib/types/game.ts` | Game TypeScript types |
| `lib/types/index.ts` | Type exports |

### Files to Modify

| File | Change |
|------|--------|
| `package.json` | Add Supabase SDK dependencies |
| `tsconfig.json` | Add path aliases |

## Implementation Steps

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install -D supabase
```

### 2. Create Directory Structure

```bash
mkdir -p lib/supabase lib/hooks lib/config lib/types
```

### 3. Extract Game Constants (lib/config/game.ts)

```typescript
// Game configuration constants
export const GAME_CONFIG = {
  // Rounds
  TOTAL_ROUNDS: 30,
  INITIAL_BAR_VALUE: 20,
  MAX_BAR_VALUE: 50,
  MIN_BAR_VALUE: 0,
  
  // Round modifiers
  MODIFIER_PHASE_1_END: 10,   // Rounds 1-10: no modifier
  MODIFIER_PHASE_2_END: 20,   // Rounds 11-20: -1
  MODIFIER_PHASE_2_VALUE: 1,
  MODIFIER_PHASE_3_VALUE: 2,  // Rounds 21-30: -2
  
  // Actions per round
  ACTIONS_ROUNDS_1_20: 3,
  ACTIONS_ROUNDS_21_30: 2,
  
  // Event rounds
  EVENT_ROUNDS: [5, 10, 15, 20, 25, 30],
  SPECIAL_EVENT_ROUNDS: [5, 15, 25],
  REGULAR_EVENT_ROUNDS: [10, 20, 30],
  
  // Special event probability
  SPECIAL_EVENT_SUCCESS_RATE: 0.1, // 10%
  
  // Player name validation
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const;

export type Entity = 'Government' | 'Businesses' | 'Workers';
export const ENTITIES: Entity[] = ['Government', 'Businesses', 'Workers'];

export const ENTITY_LABELS: Record<Entity, string> = {
  Government: 'Nhà Nước',
  Businesses: 'Doanh Nghiệp',
  Workers: 'Người Lao Động',
};

export const ENTITY_SHORT_LABELS: Record<Entity, string> = {
  Government: 'N',
  Businesses: 'D',
  Workers: 'L',
};
```

### 4. Create Type Definitions (lib/types/game.ts)

```typescript
import type { Entity } from '@/lib/config/game';

export type GameState = 'menu' | 'playing' | 'gameOver' | 'victory';
export type EndingType = 'harmony' | 'survival' | 'failed' | null;

export interface ActionEffect {
  Government: number;
  Businesses: number;
  Workers: number;
}

export interface GameAction {
  name: string;
  imageUrl: string;
  effects: ActionEffect;
}

export interface GameEvent {
  name: string;
  imageUrl?: string;
  effects?: ActionEffect;
  positiveEffects?: ActionEffect;
  negativeEffects?: ActionEffect;
  isSpecialEvent?: boolean;
}

export interface LogEntry {
  round: number;
  entity: Entity | 'Event';
  action: string;
  effects: ActionEffect;
}

export interface Bars {
  Government: number;
  Businesses: number;
  Workers: number;
}

export interface GameSession {
  sessionId: string;
  gameSessionId: string;
  gameToken: string;
  playerName: string;
  startTime: Date;
}
```

### 5. Create Supabase Client (lib/supabase/client.ts)

```typescript
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/types/database';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### 6. Create Supabase Server Client (lib/supabase/server.ts)

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/types/database';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component - ignore
          }
        },
      },
    }
  );
}
```

### 7. Update tsconfig.json Paths

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/lib/*": ["./lib/*"],
      "@/components/*": ["./app/components/*"]
    }
  }
}
```

### 8. Update Environment Variables

Rename `.env.local` variables for public access:

```env
# Existing (keep for API routes)
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
GAME_VERIFICATION_SECRET=...

# NEW (for client-side SDK)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Todo List

- [ ] Install @supabase/supabase-js and @supabase/ssr
- [ ] Install supabase CLI as dev dependency
- [ ] Create lib/supabase/ directory with client.ts and server.ts
- [ ] Create lib/config/game.ts with extracted constants
- [ ] Create lib/types/game.ts with TypeScript interfaces
- [ ] Create lib/types/index.ts barrel export
- [ ] Update tsconfig.json with path aliases
- [ ] Update .env.local with NEXT_PUBLIC_ prefixed variables
- [ ] Verify existing functionality still works

## Success Criteria

- [ ] All new directories created
- [ ] Dependencies installed without errors
- [ ] TypeScript compiles without errors
- [ ] Existing game functionality unchanged
- [ ] No build warnings

## Next Steps

→ [Phase 2: Supabase Modernization](./phase-02-supabase-modernization.md)
