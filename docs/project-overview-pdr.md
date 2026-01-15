# Project Overview & Product Development Requirements

> **Last Updated:** 2026-01-15  
> **Version:** 1.0.0  
> **Project:** Loi Ich (Balance of Interests)

## Table of Contents

- [Product Vision](#product-vision)
- [Target Audience](#target-audience)
- [Core Gameplay Mechanics](#core-gameplay-mechanics)
- [Technical Requirements](#technical-requirements)
- [Success Metrics](#success-metrics)
- [Acceptance Criteria](#acceptance-criteria)

---

## Product Vision

### Concept

**Loi Ich** (Vietnamese: Cân Cân Lợi Ích, displayed as "loi ⚖ ich") is a turn-based strategy game simulating socioeconomic balance between three stakeholders in society.

### Goals

| Goal | Description |
|------|-------------|
| Educational | Teach socioeconomic trade-offs between government, business, and labor |
| Strategic | Require thoughtful decision-making with long-term consequences |
| Accessible | Browser-based, mobile-friendly, no installation required |
| Competitive | Leaderboard system for replayability |

### Three Stakeholders

| Entity | Vietnamese | Symbol | Color | Actions |
|--------|------------|--------|-------|---------|
| Government | Nhà Nước | N | Red `#ef4444` | 15 |
| Businesses | Doanh Nghiệp | D | Blue `#3b82f6` | 12 |
| Workers | Người Lao Động | L | Green `#22c55e` | 9 |

---

## Target Audience

### Primary

- **Students** - FPT University MLN122 course participants
- **Age range** - 18-25 years
- **Platform** - Desktop browsers, mobile devices

### Secondary

- Strategy game enthusiasts
- Educators teaching economics/civics
- Casual browser gamers

### User Expectations

- Quick sessions (5-15 minutes per game)
- Intuitive UI with minimal learning curve
- Vietnamese language support
- Mobile-responsive design

---

## Core Gameplay Mechanics

### Objective

Maintain balance between all three entities for 30 rounds without any bar dropping to 0.

### Win Conditions

| Ending | Condition | Priority |
|--------|-----------|----------|
| **Harmony** | All 3 bars equal at round 30 | Highest |
| **Survival** | Complete 30 rounds, bars > 0, not equal | Medium |
| **Failed** | Any bar drops to 0 | Lose |

### Turn Structure

```
Each Round:
1. Government selects 1 action (from 3 choices)
2. Businesses selects 1 action (from 3 choices)
3. Workers selects 1 action (from 3 choices)
4. Effects applied, bars updated
5. Check for game over or event trigger
6. Advance to next round
```

### Difficulty Scaling

| Phase | Rounds | Effect Modifier | Choices |
|-------|--------|-----------------|---------|
| Normal | 1-10 | Base effects | 3 actions |
| Hard | 11-20 | All effects -1 | 3 actions |
| Extreme | 21-30 | All effects -2 | 2 actions |

### Action System

**Total: 36 actions**

Actions affect one or more bars with positive/negative values:

```typescript
interface Action {
  id: string;
  name: string;       // Vietnamese
  nameEn?: string;    // English
  description: string;
  effects: {
    gov: number;  // -10 to +10
    bus: number;
    wor: number;
  };
}
```

**Action Distribution:**

| Entity | Count | Examples |
|--------|-------|----------|
| Government | 15 | Tax policies, subsidies, regulations |
| Businesses | 12 | Hiring, investment, pricing |
| Workers | 9 | Strikes, productivity, training |

### Event System

Fixed events occur at rounds 5, 10, 15, 20, 25, 30.

| Rounds | Type | Description |
|--------|------|-------------|
| 10, 20, 30 | **Mandatory** | Unavoidable negative effects. Grants +1 Reroll reward. |
| 5, 15, 25 | **Special** | Choice-based (Skip vs Execute). High risk/reward. Execute grants +1 Reroll. |

**Event Count:** 6 predefined events

### Reroll Mechanics

- **Initial Count:** Player starts with 1 reroll.
- **Cost:** 1 reroll point per use.
- **Effect:** Refreshes the current selection of action cards.
- **Rewards:** Gained by completing specific events (indicated by an Amber "+" badge).
- **Visuals:** Reroll action triggers a grayscale shuffle animation.

### Bar Mechanics

- **Range:** 0-100 for each bar
- **Initial:** 50 for all bars (configurable in GAME_CONFIG)
- **Clamping:** Values auto-clamped to [0, 100]
- **Game Over:** Triggered when any bar = 0

---

## Technical Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Turn-based gameplay with 3 entities | P0 |
| FR-02 | 30 rounds per game | P0 |
| FR-03 | Dynamic bar visualization | P0 |
| FR-04 | Win/lose condition detection | P0 |
| FR-05 | Leaderboard with pagination | P1 |
| FR-06 | Score submission with anti-cheat | P1 |
| FR-07 | Audio system (music + SFX) | P2 |
| FR-08 | Settings persistence (localStorage) | P2 |
| FR-09 | Responsive design (mobile/tablet/desktop) | P1 |
| FR-10 | Event system at milestone rounds | P1 |

### Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | Initial load time | < 3s on 4G |
| NFR-02 | Time to interactive | < 2s |
| NFR-03 | Mobile responsiveness | 320px - 1920px |
| NFR-04 | Browser support | Chrome, Firefox, Safari, Edge (latest 2) |
| NFR-05 | Accessibility | Basic ARIA labels |
| NFR-06 | Edge Runtime compatible | Cloudflare Pages |

### Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 16 |
| UI Library | React | 19 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4 |
| Database | Supabase (PostgreSQL) | - |
| Charts | Recharts | - |
| Deployment | Cloudflare Pages | - |

### Security Requirements

| Requirement | Implementation |
|-------------|----------------|
| Anti-cheat | HMAC-SHA256 signature verification |
| Input validation | Profanity filter, length limits |
| RLS | Row-level security on game_records |
| Rate limiting | Supabase built-in limits |

---

## Success Metrics

### Quantitative

| Metric | Target | Measurement |
|--------|--------|-------------|
| Games completed | 100+ per week | Supabase analytics |
| Average session duration | 5-15 minutes | game_records.duration |
| Harmony ending rate | < 20% | ending = 'HARMONY' |
| Survival rate | 40-60% | ending != 'FAILED' |
| Leaderboard submissions | 50+ unique players | COUNT(DISTINCT session_id) |

### Qualitative

- Positive user feedback on game balance
- Intuitive UI requiring no tutorial
- Smooth animations (60 FPS)
- No critical bugs in production

---

## Acceptance Criteria

### MVP Checklist

- [x] 3-entity turn system functional
- [x] 30 rounds gameplay loop
- [x] Win/lose detection working
- [x] Visual feedback (bars, animations)
- [x] Leaderboard integration
- [x] Mobile responsive
- [x] Audio system
- [x] Anti-cheat protection

### Quality Gates

| Gate | Criteria |
|------|----------|
| Build | `npm run build` succeeds, no TypeScript errors |
| Lint | ESLint passes (warnings acceptable) |
| Performance | Lighthouse score > 80 |
| Security | HMAC verification working |
| UX | All screens functional on 375px width |

---

## Constraints & Dependencies

### External Dependencies

| Dependency | Purpose | Risk |
|------------|---------|------|
| Supabase | Database, auth | Service availability |
| Cloudflare Pages | Hosting | Build limits |
| Recharts | Visualization | Bundle size |

### Project Constraints

- Academic deadline (FPT MLN122 course)
- Single developer
- No budget for paid services
- Vietnamese as primary language

---

## Glossary

| Term | Definition |
|------|------------|
| Bar | Visual representation of entity's status (0-100) |
| Round | One complete turn cycle (all 3 entities act) |
| Harmony | Win condition where all bars are equal |
| HMAC | Hash-based Message Authentication Code |
| RLS | Row-Level Security (Supabase) |
| Edge Runtime | Cloudflare Workers-compatible runtime |
