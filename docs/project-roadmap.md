# Project Roadmap

## Current State

### Completed Features

| Feature | Status | Notes |
|---------|--------|-------|
| Core gameplay loop | Done | 30 rounds, 3 entities |
| Action system | Done | 36 unique actions |
| Event system | Done | 6 events (3 forced, 3 special) |
| Leaderboard | Done | Paginated, best-per-session |
| Anti-cheat | Done | Hash verification |
| Responsive UI | Done | Desktop + mobile layouts |
| Audio system | Done | BGM + SFX |

### Code Metrics

| Metric | Value | Target |
|--------|-------|--------|
| Total LOC | ~4,400 | - |
| Main page.tsx | 1,289 | <500 |
| Components | 7 | - |
| Test coverage | 0% | 80%+ |
| TypeScript strict | Yes | Yes |

## Improvement Opportunities

### High Priority

#### 1. Refactor Main Page (Tech Debt)

**Problem:** `page.tsx` is 1,289 lines - too large for maintainability

**Solution:** Extract to custom hooks

```typescript
// Proposed structure
app/
├── hooks/
│   ├── useGameState.ts      // Core state management
│   ├── useGameActions.ts    // Action handling
│   ├── useGameEvents.ts     // Event system
│   ├── useScoreSubmission.ts // Anti-cheat + API
│   └── useAudioEvents.ts    // Audio coordination
├── page.tsx                 // <200 lines
```

**Estimated effort:** 4-6 hours

#### 2. Extract Game Data to Config

**Problem:** Actions and events are hardcoded in component

**Solution:**
```typescript
// lib/gameConfig.ts
export const ACTIONS: ActionPool = { ... };
export const EVENTS: Record<number, GameEvent> = { ... };
export const GAME_CONSTANTS = {
  INITIAL_BARS: { Government: 20, Businesses: 20, Workers: 20 },
  MAX_BAR: 50,
  TOTAL_ROUNDS: 30,
  ROUND_MODIFIERS: { 11: -1, 21: -2 },
};
```

**Estimated effort:** 2 hours

#### 3. Add Unit Tests

**Problem:** No test coverage

**Solution:**
```typescript
// __tests__/
├── gameVerification.test.ts  // Hash/validation
├── gameLogic.test.ts         // Win/lose conditions
└── components/
    └── GameStatusBars.test.tsx
```

**Frameworks:** Vitest + React Testing Library

**Estimated effort:** 8-12 hours

### Medium Priority

#### 4. Replace Magic Numbers

```typescript
// Before
if (round >= 11 && round <= 20) { modifiedEffects[entity] -= 1; }

// After
const { PHASE_2_START, PHASE_2_MODIFIER } = GAME_CONSTANTS;
if (round >= PHASE_2_START) { modifiedEffects[entity] += PHASE_2_MODIFIER; }
```

#### 5. Error Boundary

```tsx
// app/components/ErrorBoundary.tsx
export default function ErrorBoundary({ children }) {
  return (
    <ErrorBoundaryComponent
      fallback={<GameErrorFallback />}
    >
      {children}
    </ErrorBoundaryComponent>
  );
}
```

#### 6. Loading States

- Skeleton UI for leaderboard
- Loading indicator for score submission
- Optimistic updates

### Low Priority

#### 7. Accessibility Improvements

- ARIA labels on action buttons
- Keyboard navigation for actions
- Screen reader announcements for turn changes
- High contrast mode

#### 8. Analytics Integration

```typescript
// Track game events
trackEvent('game_start', { player_name });
trackEvent('round_complete', { round, bars });
trackEvent('game_end', { ending, duration });
```

#### 9. Offline Support

- Service worker for static assets
- IndexedDB for pending score submissions
- Retry queue for failed API calls

## Future Features

### Phase 2: Enhanced Gameplay

| Feature | Description | Priority |
|---------|-------------|----------|
| Difficulty levels | Easy/Normal/Hard bar ranges | Medium |
| Daily challenges | Fixed seed games | Low |
| Achievements | Track milestones | Low |
| Replay system | Watch previous games | Low |

### Phase 3: Social Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Share results | Social media cards | Medium |
| Session comparison | Compare with friends | Low |
| Multiplayer mode | Real-time competition | Low |

### Phase 4: Content Expansion

| Feature | Description | Priority |
|---------|-------------|----------|
| More actions | Expand pool per entity | Medium |
| New events | Additional special events | Medium |
| Localization | English translation | Low |
| Tutorial mode | Guided first game | Medium |

## Technical Debt

### Current Issues

| Issue | Impact | Effort |
|-------|--------|--------|
| Large page.tsx | Hard to maintain | High |
| No tests | Risk of regression | High |
| Magic numbers | Hard to tune | Low |
| Hardcoded data | Config changes need deploy | Low |
| No error boundary | Crashes show blank page | Medium |

### Recommended Order

1. Extract hooks (unlocks easier testing)
2. Add unit tests for verification
3. Extract game config
4. Add error boundary
5. Replace magic numbers

## Performance Optimization

### Current Performance

| Metric | Current | Target |
|--------|---------|--------|
| FCP | ~1.5s | <1s |
| LCP | ~2.0s | <1.5s |
| Bundle size | ~150KB | <100KB |

### Optimizations

1. **Image Optimization**
   - Already using Cloudinary
   - Consider responsive srcsets

2. **Code Splitting**
   - Lazy load leaderboard page
   - Dynamic import for AudioManager

3. **Font Loading**
   - Subset Vietnamese characters
   - Font-display: swap

## Milestones

### v1.0 (Current)
- Core gameplay
- Leaderboard
- Anti-cheat
- Responsive UI

### v1.1 (Proposed)
- [ ] Refactor page.tsx to hooks
- [ ] Extract game config
- [ ] Add 50%+ test coverage
- [ ] Error boundary

### v1.2 (Future)
- [ ] Difficulty levels
- [ ] Tutorial mode
- [ ] Share results
- [ ] Accessibility audit

### v2.0 (Long-term)
- [ ] Multiplayer mode
- [ ] Extended action pool
- [ ] Achievement system
