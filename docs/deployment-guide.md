# Deployment Guide

## Prerequisites

- Node.js 20+
- npm/yarn/pnpm
- Git
- Supabase account
- Cloudflare account (for Pages deployment) or Vercel account

## Environment Setup

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GAME_VERIFICATION_SECRET` | Server-side secret for HMAC | `your-32-char-secret-key-here-!` |
| `NEXT_PUBLIC_GAME_SECRET` | Client-side secret for HMAC (same value) | `your-32-char-secret-key-here-!` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbG...` |

### Local Development

Create `.env.local`:

```env
# Anti-cheat HMAC secret (same value for client and server)
GAME_VERIFICATION_SECRET=dev-secret-key-for-local-testing
NEXT_PUBLIC_GAME_SECRET=dev-secret-key-for-local-testing

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Database Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note the project URL and anon key

### 2. Initialize Database

Run `supabase/init-database.sql` in Supabase SQL Editor. This single script creates:
- `game_records` table with data validation constraints
- Performance indexes for leaderboard queries
- RLS policies for public read/insert access
- `get_grouped_leaderboard()` function for paginated leaderboard

```sql
-- Copy and paste contents of supabase/init-database.sql
-- Or run via Supabase CLI:
-- supabase db push
```

## Deployment Options

### Option A: Cloudflare Pages

#### 1. Connect Repository

1. Go to Cloudflare Dashboard > Pages
2. Create new project
3. Connect GitHub repository
4. Select `balance` directory

#### 2. Build Settings

| Setting | Value |
|---------|-------|
| Framework preset | Next.js |
| Build command | `npm run build` |
| Build output | `.next` |
| Node version | 20 |

#### 3. Environment Variables

Add in Cloudflare Pages settings:

```
GAME_VERIFICATION_SECRET = (production secret)
NEXT_PUBLIC_GAME_SECRET = (same as above)
NEXT_PUBLIC_SUPABASE_URL = (your project URL)
NEXT_PUBLIC_SUPABASE_ANON_KEY = (your anon key)
```

#### 4. Deploy

Push to main branch triggers automatic deployment.

### Option B: Vercel

#### 1. Import Project

1. Go to [vercel.com](https://vercel.com)
2. Import Git repository
3. Select `balance` directory as root

#### 2. Environment Variables

Add in Vercel project settings:

```
GAME_VERIFICATION_SECRET
NEXT_PUBLIC_GAME_SECRET
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

#### 3. Deploy

```bash
npm install -g vercel
vercel
```

### Option C: Self-Hosted

#### 1. Build

```bash
npm run build
```

#### 2. Start Production Server

```bash
npm start
```

Or use PM2:

```bash
pm2 start npm --name "balance" -- start
```

#### 3. Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Production Checklist

### Security

- [ ] Generate strong `GAME_VERIFICATION_SECRET` (32+ chars)
- [ ] Enable Supabase RLS policies
- [ ] Verify env vars are not in client bundle
- [ ] Enable HTTPS

### Performance

- [ ] Enable gzip/brotli compression
- [ ] Configure CDN caching for static assets
- [ ] Verify Cloudinary image optimization

### Monitoring

- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure uptime monitoring
- [ ] Enable Supabase database alerts

### Testing

- [ ] Verify game token generation
- [ ] Test score submission flow
- [ ] Check leaderboard pagination
- [ ] Test on mobile devices

## Troubleshooting

### Common Issues

#### "Server configuration error" on score submit

**Cause:** Missing environment variables

**Solution:** Verify all env vars are set in deployment platform

#### Leaderboard shows empty

**Cause:** RPC function not created

**Solution:** Run `supabase/init-database.sql` in Supabase SQL Editor

#### Hash verification fails

**Cause:** Clock skew between client and server

**Solution:** 
- Verify server time is accurate
- Increase timestamp tolerance if needed

#### Images not loading

**Cause:** Cloudinary URL issues

**Solution:** 
- Verify Cloudinary account is active
- Check image IDs in action/event definitions

### Logs

#### Vercel

```bash
vercel logs
```

#### Cloudflare Pages

View in Cloudflare Dashboard > Pages > Deployments > Functions

#### Self-Hosted

```bash
pm2 logs balance
# or
journalctl -u balance
```

## Rollback

### Vercel

1. Go to Deployments
2. Find previous working deployment
3. Click "..." > "Promote to Production"

### Cloudflare Pages

1. Go to Deployments
2. Click previous deployment
3. Click "Rollback to this deployment"

### Git

```bash
git revert HEAD
git push origin main
```

## Maintenance

### Database Cleanup

Optional: Remove old records

```sql
-- Delete records older than 30 days
DELETE FROM game_records 
WHERE created_at < NOW() - INTERVAL '30 days';
```

### Monitor Table Size

```sql
SELECT 
  pg_size_pretty(pg_total_relation_size('game_records')) AS total_size,
  (SELECT COUNT(*) FROM game_records) AS row_count;
```
