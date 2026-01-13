# Phase 2: Supabase Modernization

## Context
- [Plan Overview](./plan.md)
- [Phase 1: Project Setup](./phase-01-project-setup.md)
- CWD: C:\Users\Admin\Documents\FPT\MLN122\game\balance

## Overview

| Priority | Status | Effort |
|----------|--------|--------|
| P1 | Pending | 6h |

Modernize Supabase integration from raw REST API calls to official SDK with proper RLS policies and type generation.

## Current Issues

| Issue | Impact |
|-------|--------|
| Direct fetch() to REST API | No type safety, verbose code |
| No RLS policies | Anyone with anon key can insert/read all data |
| Manual type definitions | Types may drift from actual schema |
| Hardcoded API key in headers | Repetitive, error-prone |

## Requirements

### Functional
- Replace direct fetch() with Supabase SDK
- Implement RLS policies for game_records table
- Generate TypeScript types from database schema
- Maintain Edge Runtime compatibility

### Non-Functional
- Type-safe database operations
- Secure data access (authenticated only for writes)
- Zero downtime migration

## Database Schema

### Existing Table: game_records

```sql
CREATE TABLE game_records (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL,
  name TEXT NOT NULL,
  final_round SMALLINT NOT NULL,
  total_action SMALLINT NOT NULL,
  gov_bar SMALLINT NOT NULL,
  bus_bar SMALLINT NOT NULL,
  wor_bar SMALLINT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration SMALLINT NOT NULL,
  ending VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for leaderboard queries
CREATE INDEX idx_game_records_session_id ON game_records(session_id);
CREATE INDEX idx_game_records_ending ON game_records(ending);
CREATE INDEX idx_game_records_final_round ON game_records(final_round DESC);
```

### RLS Policies

```sql
-- Enable RLS
ALTER TABLE game_records ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read (leaderboard is public)
CREATE POLICY "Public read access" ON game_records
  FOR SELECT
  USING (true);

-- Policy: Anonymous inserts allowed (game doesn't require auth)
-- But we validate server-side with verification hash
CREATE POLICY "Verified insert access" ON game_records
  FOR INSERT
  WITH CHECK (true);

-- Policy: No updates allowed (immutable records)
CREATE POLICY "No updates" ON game_records
  FOR UPDATE
  USING (false);

-- Policy: No deletes allowed (immutable records)
CREATE POLICY "No deletes" ON game_records
  FOR DELETE
  USING (false);
```

### Updated Leaderboard Function

Keep existing function but ensure it works with RLS:

```sql
-- Function runs with SECURITY DEFINER to bypass RLS for aggregation
CREATE OR REPLACE FUNCTION get_grouped_leaderboard(page_number INT, page_size INT)
RETURNS TABLE (
  id INT8,
  session_id UUID,
  name TEXT,
  final_round INT2,
  total_action INT2,
  gov_bar INT2,
  bus_bar INT2,
  wor_bar INT2,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  duration INT2,
  ending VARCHAR,
  created_at TIMESTAMPTZ,
  total_count BIGINT
) 
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
-- ... existing function body unchanged
$$;
```

## Related Code Files

### Files to Create

| File | Purpose |
|------|---------|
| `lib/types/database.ts` | Generated Supabase types |
| `supabase/migrations/001_add_rls_policies.sql` | RLS migration |

### Files to Modify

| File | Change |
|------|--------|
| `app/api/submit-score/route.ts` | Use Supabase SDK |
| `app/api/leaderboard/route.ts` | Use Supabase SDK |
| `app/api/game-token/route.ts` | Minor cleanup |

## Implementation Steps

### 1. Generate Database Types

```bash
# Login to Supabase CLI
npx supabase login

# Generate types from remote database
npx supabase gen types typescript --project-id <project-id> > lib/types/database.ts
```

Or create manually based on schema:

```typescript
// lib/types/database.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      game_records: {
        Row: {
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
          ending: string;
          created_at: string;
        };
        Insert: {
          id?: number;
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
          ending: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          session_id?: string;
          name?: string;
          final_round?: number;
          total_action?: number;
          gov_bar?: number;
          bus_bar?: number;
          wor_bar?: number;
          start_time?: string;
          end_time?: string;
          duration?: number;
          ending?: string;
          created_at?: string;
        };
      };
    };
    Functions: {
      get_grouped_leaderboard: {
        Args: {
          page_number: number;
          page_size: number;
        };
        Returns: {
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
          ending: string;
          created_at: string;
          total_count: number;
        }[];
      };
    };
  };
}
```

### 2. Create API Route Client (lib/supabase/api.ts)

For Edge Runtime API routes (can't use cookies):

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types/database';

export function createAPIClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient<Database>(supabaseUrl, supabaseKey);
}
```

### 3. Refactor submit-score/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createAPIClient } from '@/lib/supabase/api';
import {
  verifyGameHash,
  validateGameProgression,
  validateTimestamp,
  generateSessionToken,
} from '@/lib/gameVerification';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // ... existing validation (steps 1-4 unchanged) ...

    // ===== 5. INSERT TO DATABASE (REFACTORED) =====
    const supabase = createAPIClient();

    const { data, error } = await supabase
      .from('game_records')
      .insert({
        session_id: payload.session_id,
        name: payload.name.trim(),
        final_round: payload.final_round,
        total_action: payload.total_action,
        gov_bar: payload.gov_bar,
        bus_bar: payload.bus_bar,
        wor_bar: payload.wor_bar,
        start_time: payload.start_time,
        end_time: payload.end_time,
        duration: payload.duration,
        ending: payload.ending,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save score' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        message: 'Score submitted successfully',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 4. Refactor leaderboard/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createAPIClient } from '@/lib/supabase/api';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { page_number, page_size } = await request.json();

    // Validate pagination
    if (!page_number || !page_size || page_number < 1 || page_size < 1 || page_size > 100) {
      return NextResponse.json(
        { success: false, error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    const supabase = createAPIClient();

    const { data, error } = await supabase
      .rpc('get_grouped_leaderboard', {
        page_number,
        page_size,
      });

    if (error) {
      console.error('Supabase RPC error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch leaderboard' },
        { status: 500 }
      );
    }

    const totalCount = data && data.length > 0 ? data[0].total_count : 0;

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page: page_number,
        pageSize: page_size,
        totalCount,
        totalPages: Math.ceil(totalCount / page_size),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 5. Apply RLS Policies in Supabase Dashboard

Run in SQL Editor:

```sql
-- Enable RLS
ALTER TABLE game_records ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read access" ON game_records
  FOR SELECT USING (true);

-- Verified insert
CREATE POLICY "Verified insert access" ON game_records
  FOR INSERT WITH CHECK (true);

-- No updates
CREATE POLICY "No updates" ON game_records
  FOR UPDATE USING (false);

-- No deletes
CREATE POLICY "No deletes" ON game_records
  FOR DELETE USING (false);

-- Update function to SECURITY DEFINER
DROP FUNCTION IF EXISTS get_grouped_leaderboard(INT, INT);
-- Recreate with SECURITY DEFINER (paste full function)
```

## Todo List

- [ ] Generate lib/types/database.ts from Supabase schema
- [ ] Create lib/supabase/api.ts for Edge Runtime routes
- [ ] Refactor app/api/submit-score/route.ts to use SDK
- [ ] Refactor app/api/leaderboard/route.ts to use SDK
- [ ] Apply RLS policies in Supabase Dashboard
- [ ] Update get_grouped_leaderboard to SECURITY DEFINER
- [ ] Test all API endpoints
- [ ] Verify Edge Runtime compatibility

## Success Criteria

- [ ] All API routes use Supabase SDK
- [ ] Database operations are type-safe
- [ ] RLS policies are active
- [ ] Leaderboard and score submission work correctly
- [ ] No TypeScript errors

## Security Considerations

- RLS allows public reads (leaderboard must be public)
- Writes are allowed but validated server-side with hash verification
- No user authentication required (anonymous game)
- SECURITY DEFINER on function bypasses RLS safely

## Anti-Cheat Simplification

### Current Implementation (Already Done)

The anti-cheat has been simplified from the original Token + SHA-256 approach to a single HMAC-based flow.

| Aspect | Before | After (Current) |
|--------|--------|-----------------|
| API calls per game | 2 (token + submit) | 1 (submit only) |
| Token endpoint | `/api/game-token` | **Deleted** |
| Hash method | SHA-256 concatenation | HMAC-SHA256 |
| Secrets | 2 secrets (client + server) | 1 secret (`GAME_VERIFICATION_SECRET`) |
| Timestamp validation | 60s strict window | Duration-based (10% tolerance) |

### Implementation Details (lib/gameVerification.ts)

```typescript
// Key functions:
- hmacSha256(key, message)         // Web Crypto API HMAC
- generateGameSignature(data, secret)  // Client + Server use same function
- verifyGameSignature(data, signature, secret)  // Server verification
- validateGameProgression(data)    // Logic validation (bars, endings)
- validateTimestamp(start, end, duration)  // Duration sanity check
```

### Validation Flow (submit-score/route.ts)

```
1. Basic field validation (session_id, game_session_id, name, etc.)
2. HMAC signature verification ← Anti-tampering
3. Timestamp/duration validation ← Anti-speedhack
4. Game progression logic check ← Anti-impossible-scores
5. Insert to Supabase
```

### Environment Variable

```env
# Single secret for both client and server
GAME_VERIFICATION_SECRET=your_secret_here
```

**Note**: Client uses `NEXT_PUBLIC_GAME_VERIFICATION_SECRET` to generate signature.
Server uses `GAME_VERIFICATION_SECRET` to verify.

### Security Trade-offs (Acknowledged)

| Trade-off | Mitigation |
|-----------|------------|
| Client secret is extractable | `validateGameProgression` catches impossible scores |
| No session token binding | `game_session_id` acts as nonce (unique per game) |
| Duration can be faked | Minimum 10s, maximum 2h sanity bounds |

**Design Decision**: For an anonymous game without user accounts, logic validation is the primary defense. HMAC prevents casual tampering but won't stop determined attackers. This is acceptable for the use case.

### Migration Checklist (Already Complete)

- [x] Simplified lib/gameVerification.ts with HMAC functions
- [x] Deleted app/api/game-token/route.ts
- [x] Updated app/api/submit-score/route.ts to use signature
- [x] Changed payload field from `verification_hash` to `signature`
- [x] Removed timestamp field from signature (not needed)
- [ ] Update app/page.tsx to use new generateGameSignature
- [ ] Update useGameSession hook (remove token fetch)

## Next Steps

→ [Phase 3: FE Architecture Refactor](./phase-03-fe-architecture.md)
