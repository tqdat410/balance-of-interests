# Loi Ich (Balance of Interests)

**Vietnamese:** Can Can Loi Ich - displayed as "loi ⚖ ich"

A turn-based strategy game simulating socioeconomic balance between three stakeholders: Government, Businesses, and Workers.

## Tech Stack

- **Framework:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS v4, Custom CSS animations
- **Backend:** Supabase (PostgreSQL), Edge Runtime
- **Deployment:** Cloudflare Pages compatible

## Quick Start

### Prerequisites

- Node.js 20+
- npm/yarn/pnpm

### Installation

```bash
npm install
```

### Environment Setup

Create `.env.local` with:

```env
# Anti-cheat HMAC secret (same value for client and server)
GAME_VERIFICATION_SECRET=your_secret_key_here
NEXT_PUBLIC_GAME_SECRET=your_secret_key_here

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Game Overview

**Objective:** Maintain balance between three entities for 30 rounds

- **Win:** Survive all 30 rounds (no bar = 0)
- **Lose:** Any bar drops to 0
- **Harmony Ending:** All 3 bars equal at round 30

**Entities:**
| Entity | Vietnamese | Symbol | Color |
|--------|------------|--------|-------|
| Government | Nha Nuoc | N | Red |
| Businesses | Doanh Nghiep | D | Blue |
| Workers | Nguoi Lao Dong | L | Green |

## Project Structure

```
balance/
├── app/
│   ├── api/              # API routes (Edge Runtime)
│   │   ├── leaderboard/  # Paginated leaderboard
│   │   └── submit-score/ # Score submission with HMAC verification
│   ├── components/       # React components
│   ├── leaderboard/      # Leaderboard page
│   └── page.tsx          # Main game logic
├── lib/
│   └── gameVerification.ts  # HMAC signature utilities
├── supabase/             # Database schema/functions
└── public/               # Static assets (fonts, sounds, images)
```

## Key Features

- **Turn-based gameplay** - 3 entities take turns per round
- **36 unique actions** - Government (15), Businesses (12), Workers (9)
- **6 special events** - At rounds 5, 10, 15, 20, 25, 30
- **Difficulty scaling** - Effect modifiers at rounds 11-20 and 21-30
- **Anti-cheat system** - HMAC-SHA256 signature verification
- **Responsive design** - Desktop, tablet, mobile layouts
- **Audio system** - Background music and sound effects

## Documentation

- [Project Overview](./docs/project-overview-pdr.md) - Full requirements and specs
- [Codebase Summary](./docs/codebase-summary.md) - File listing and architecture
- [Code Standards](./docs/code-standards.md) - Coding conventions
- [System Architecture](./docs/system-architecture.md) - Technical architecture
- [Project Roadmap](./docs/project-roadmap.md) - Future improvements
- [Deployment Guide](./docs/deployment-guide.md) - Deployment instructions

## License

Private project for FPT University - MLN122 course.

## Contact

Feedback/bugs: tqdat410@gmail.com
