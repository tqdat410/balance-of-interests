# System Architecture

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Next.js App (React 19)                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │   │
│  │  │  Game UI     │  │  Leaderboard │  │  Components              │  │   │
│  │  │  (page.tsx)  │  │  (page.tsx)  │  │  - GameStatusBars        │  │   │
│  │  │              │  │              │  │  - GameActionButtons     │  │   │
│  │  │  State Mgmt  │  │  Pagination  │  │  - GameHistory           │  │   │
│  │  │  Game Logic  │  │  Display     │  │  - EventPopup            │  │   │
│  │  │  Events      │  │              │  │  - GameIllustration      │  │   │
│  │  └──────────────┘  └──────────────┘  │  - AudioManager          │  │   │
│  │                                       └──────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────|─────────────────────────────────────────┘
                                    │ HTTP/HTTPS
                                    v
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER (Edge Runtime)                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │ /api/game-token │  │ /api/leaderboard│  │ /api/submit-score          │ │
│  │                 │  │                 │  │                             │ │
│  │ Token Generation│  │ Paginated Fetch │  │ Verification Pipeline:      │ │
│  │ SHA-256 Hash    │  │ RPC Call        │  │ 1. Field validation         │ │
│  │                 │  │                 │  │ 2. Timestamp check          │ │
│  └─────────────────┘  └─────────────────┘  │ 3. Hash verification        │ │
│                                             │ 4. Game logic validation    │ │
│                                             │ 5. Database insert          │ │
│                                             └─────────────────────────────┘ │
└───────────────────────────────────|─────────────────────────────────────────┘
                                    │ REST API
                                    v
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER (Supabase)                          │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                         PostgreSQL                                  │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │ game_records                                                 │   │    │
│  │  │ - id (PK), session_id, name                                 │   │    │
│  │  │ - final_round, total_action                                 │   │    │
│  │  │ - gov_bar, bus_bar, wor_bar                                 │   │    │
│  │  │ - start_time, end_time, duration                            │   │    │
│  │  │ - ending, created_at                                        │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │ get_grouped_leaderboard(page, size)                         │   │    │
│  │  │ - Returns best record per session                           │   │    │
│  │  │ - Ranked by ending > round > duration > actions             │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  └────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## API Design

### Endpoints

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/game-token` | POST | Generate anti-cheat token | None |
| `/api/leaderboard` | POST | Fetch paginated leaderboard | None |
| `/api/submit-score` | POST | Submit verified game score | Token + Hash |

### /api/game-token

**Request:**
```json
{
  "game_session_id": "uuid-v4"
}
```

**Response:**
```json
{
  "success": true,
  "token": "32-character-hex-string"
}
```

**Implementation:**
```typescript
token = SHA256(GAME_VERIFICATION_SECRET + "|" + game_session_id).substring(0, 32)
```

### /api/leaderboard

**Request:**
```json
{
  "page_number": 1,
  "page_size": 20
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "session_id": "uuid",
      "name": "Player",
      "final_round": 30,
      "total_action": 90,
      "gov_bar": 25,
      "bus_bar": 25,
      "wor_bar": 25,
      "duration": 300,
      "ending": "harmony",
      "total_count": 150
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 150,
    "totalPages": 8
  }
}
```

### /api/submit-score

**Request:**
```json
{
  "session_id": "user-session-uuid",
  "game_session_id": "game-session-uuid",
  "name": "Player Name",
  "final_round": 30,
  "total_action": 90,
  "gov_bar": 25,
  "bus_bar": 25,
  "wor_bar": 25,
  "start_time": "2024-01-01T00:00:00.000Z",
  "end_time": "2024-01-01T00:05:00.000Z",
  "duration": 300,
  "ending": "harmony",
  "timestamp": 1704067200000,
  "verification_hash": "sha256-hex-64-chars"
}
```

**Verification Pipeline:**
1. Field validation (all required fields present)
2. Timestamp validation (within 60 seconds)
3. Hash verification (regenerate and compare)
4. Game logic validation (bar ranges, ending conditions)
5. Database insert

## Database Schema

### game_records Table

```sql
CREATE TABLE game_records (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL,           -- User session grouping
  name TEXT NOT NULL,
  final_round SMALLINT NOT NULL,
  total_action SMALLINT NOT NULL,
  gov_bar SMALLINT NOT NULL,
  bus_bar SMALLINT NOT NULL,
  wor_bar SMALLINT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration SMALLINT NOT NULL,
  ending VARCHAR(20) NOT NULL,        -- 'harmony', 'survival', 'failed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for leaderboard queries
CREATE INDEX idx_game_records_session_ending 
ON game_records(session_id, ending, final_round DESC);
```

### get_grouped_leaderboard Function

```sql
CREATE FUNCTION get_grouped_leaderboard(page_number INT, page_size INT)
RETURNS TABLE (
  id INT8, session_id UUID, name TEXT,
  final_round INT2, total_action INT2,
  gov_bar INT2, bus_bar INT2, wor_bar INT2,
  start_time TIMESTAMPTZ, end_time TIMESTAMPTZ,
  duration INT2, ending VARCHAR, created_at TIMESTAMPTZ,
  total_count BIGINT
)

-- Ranking Logic:
-- 1. Best record per session (PARTITION BY session_id)
-- 2. Global ranking:
--    a. ending: harmony(1) > survival(2) > failed(3)
--    b. final_round DESC
--    c. duration ASC
--    d. total_action DESC
--    e. start_time ASC (tiebreaker)
```

## Security Implementation

### Anti-Cheat System

```
┌─────────────────────────────────────────────────────────────────┐
│                     ANTI-CHEAT FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Game Start                                                   │
│     ├── Client generates game_session_id (UUID)                  │
│     ├── Client requests token from /api/game-token               │
│     └── Server returns SHA256(secret|session_id)[0:32]          │
│                                                                  │
│  2. Game End                                                     │
│     ├── Client generates hash:                                   │
│     │   SHA256(session|round|gov|bus|wor|dur|end|time|token)    │
│     └── Client submits score + hash + timestamp                  │
│                                                                  │
│  3. Server Verification                                          │
│     ├── Validate timestamp (within 60s)                          │
│     ├── Regenerate token from game_session_id + secret           │
│     ├── Regenerate expected hash                                 │
│     ├── Compare hashes (timing-safe)                             │
│     ├── Validate game logic                                      │
│     │   ├── Bar values 0-50                                      │
│     │   ├── Harmony: round=30, all bars equal                    │
│     │   ├── Failed: at least one bar = 0                         │
│     │   └── Survival: round=30, all bars > 0                     │
│     └── Insert if all checks pass                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `GAME_VERIFICATION_SECRET` | Token/hash generation | Yes |
| `SUPABASE_URL` | Database connection | Yes |
| `SUPABASE_ANON_KEY` | Database authentication | Yes |

### Security Measures

| Threat | Mitigation |
|--------|------------|
| Score manipulation | SHA-256 hash verification |
| Replay attacks | 60-second timestamp window |
| Token theft | Per-game session tokens |
| Invalid game states | Server-side logic validation |
| SQL injection | Parameterized Supabase queries |
| Credential exposure | Server-only env variables |

## External Services

### Cloudinary (Image CDN)

**Usage:** All action and event images
**URL Pattern:** `https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/{image_id}.png`

**Features Used:**
- Automatic format selection (`f_auto`)
- Quality optimization (`q_auto`)
- Width resizing (`w_300`)

### Supabase

**Services Used:**
- PostgreSQL database
- REST API (via PostgREST)
- RPC functions

**Connection:** Direct REST calls with API key authentication

### Cloudflare Pages (Deployment)

**Compatibility:**
- Edge Runtime for all API routes
- Web Crypto API for SHA-256
- No Node.js-specific dependencies

## Performance Considerations

### Client-Side

- `useMemo` for action filtering per round
- `useCallback` for stable event handlers
- Cloudinary optimized images
- CSS animations (GPU accelerated)

### Server-Side

- Edge Runtime (low latency)
- Minimal validation overhead
- Indexed database queries
- Paginated leaderboard

### Database

- `session_id` grouping reduces data volume
- Composite index on ranking columns
- PL/pgSQL function for complex leaderboard logic
