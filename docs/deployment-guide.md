# Deployment Guide

> **Last Updated:** 2026-01-15  
> **Target Platform:** Cloudflare Pages

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Database Setup](#database-setup)
- [Build & Deploy](#build--deploy)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 20+ | Runtime |
| npm/yarn/pnpm | Latest | Package manager |
| Git | Latest | Version control |

### Accounts Required

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| [Supabase](https://supabase.com) | Database | Yes (500MB) |
| [Cloudflare](https://pages.cloudflare.com) | Hosting | Yes |

---

## Environment Variables

### Required Variables

Create `.env.local` file:

```env
# Anti-cheat HMAC (must match on client and server)
GAME_VERIFICATION_SECRET=your_secret_key_here
NEXT_PUBLIC_GAME_SECRET=your_secret_key_here

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

### Variable Details

| Variable | Scope | Description |
|----------|-------|-------------|
| `GAME_VERIFICATION_SECRET` | Server | HMAC secret for API verification |
| `NEXT_PUBLIC_GAME_SECRET` | Client | Same value, exposed to client |
| `SUPABASE_URL` | Server | Supabase project URL |
| `SUPABASE_ANON_KEY` | Server | Supabase anonymous key |

### Generate HMAC Secret

```bash
# Generate secure random secret
openssl rand -hex 32
```

**Important:** Both `GAME_VERIFICATION_SECRET` and `NEXT_PUBLIC_GAME_SECRET` must have the same value.

---

## Local Development

### Installation

```bash
# Clone repository
git clone <repository-url>
cd balance

# Install dependencies
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build Locally

```bash
npm run build
npm start
```

---

## Database Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note the project URL and anon key

### 2. Run Database Schema

1. Open Supabase SQL Editor
2. Copy contents of `supabase/init-database.sql`
3. Run the script

**Schema includes:**
- `game_records` table
- Performance indexes
- Row-level security policies
- `get_grouped_leaderboard` RPC function

### 3. Verify Setup

```sql
-- Test table exists
SELECT COUNT(*) FROM game_records;

-- Test RPC function
SELECT * FROM get_grouped_leaderboard(1, 10);
```

---

## Build & Deploy

### Cloudflare Pages

#### Option A: Git Integration

1. Push code to GitHub/GitLab
2. Go to [Cloudflare Pages](https://pages.cloudflare.com)
3. Create new project, connect repository
4. Configure build settings:

| Setting | Value |
|---------|-------|
| Framework preset | Next.js |
| Build command | `npm run build` |
| Build output | `.next` |
| Node version | 20 |

5. Add environment variables in Settings
6. Deploy

#### Option B: Direct Upload

```bash
# Build locally
npm run build

# Install Wrangler
npm install -g wrangler

# Deploy
wrangler pages deploy .next
```

### Environment Variables in Cloudflare

1. Go to Pages project → Settings → Environment variables
2. Add all variables from `.env.local`
3. Set for both Production and Preview

| Variable | Production | Preview |
|----------|------------|---------|
| GAME_VERIFICATION_SECRET | ✅ | ✅ |
| NEXT_PUBLIC_GAME_SECRET | ✅ | ✅ |
| SUPABASE_URL | ✅ | ✅ |
| SUPABASE_ANON_KEY | ✅ | ✅ |

---

## Troubleshooting

### Common Issues

#### Build Fails

```
Error: Cannot find module '...'
```

**Solution:** Clear node_modules and reinstall:
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

#### API Returns 500

**Check:**
1. Environment variables set correctly
2. Supabase project is active
3. Database schema initialized

```bash
# Verify env vars
echo $SUPABASE_URL
```

#### HMAC Verification Fails

**Cause:** Client and server secrets don't match.

**Solution:** Ensure both variables have identical values:
```env
GAME_VERIFICATION_SECRET=abc123...
NEXT_PUBLIC_GAME_SECRET=abc123...  # Same value!
```

#### Leaderboard Empty

**Check:**
1. RPC function exists: `SELECT * FROM get_grouped_leaderboard(1, 10);`
2. Table has data: `SELECT COUNT(*) FROM game_records;`

#### Edge Runtime Errors

```
Error: Dynamic server usage: ...
```

**Solution:** Ensure no Node.js-specific APIs in API routes. Edge Runtime doesn't support:
- `fs` module
- `path` module
- Node.js crypto (use Web Crypto API)

---

## Production Checklist

### Pre-Deploy

- [ ] All environment variables configured
- [ ] Database schema initialized
- [ ] HMAC secrets match client/server
- [ ] Build succeeds locally
- [ ] No TypeScript errors

### Post-Deploy

- [ ] Homepage loads
- [ ] Game starts correctly
- [ ] Leaderboard displays
- [ ] Score submission works
- [ ] Audio plays
- [ ] Mobile responsive

### Monitoring

| Check | Frequency |
|-------|-----------|
| Uptime | Continuous (Cloudflare) |
| Error rate | Daily review |
| Database size | Weekly |
| API response time | Weekly |

---

## Rollback

### Cloudflare Pages

1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Rollback to this deployment"

### Database

If schema migration fails:
1. Backup current data: `pg_dump`
2. Drop and recreate tables
3. Restore from backup if needed

---

## Costs

### Free Tier Limits

| Service | Limit | Usage |
|---------|-------|-------|
| Cloudflare Pages | 500 builds/month | Low |
| Cloudflare Pages | Unlimited bandwidth | - |
| Supabase | 500MB database | ~1MB expected |
| Supabase | 2GB bandwidth | Low |

### Scaling

If limits exceeded:
- Supabase Pro: $25/month
- Cloudflare Pro: $20/month
