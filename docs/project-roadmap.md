# Project Roadmap

> **Last Updated:** 2026-01-15  
> **Status:** MVP Complete

## Table of Contents

- [Current State](#current-state)
- [Known Issues](#known-issues)
- [Technical Debt](#technical-debt)
- [Future Improvements](#future-improvements)
- [Phase Recommendations](#phase-recommendations)

---

## Current State

### Completed Features

| Feature | Status | Notes |
|---------|--------|-------|
| Core gameplay loop | ✅ Complete | 30 rounds, 3 entities |
| Action system | ✅ Complete | 36 actions |
| Event system | ✅ Complete | 6 milestone events |
| Difficulty scaling | ✅ Complete | 3 phases |
| Bar visualization | ✅ Complete | Line chart |
| Leaderboard | ✅ Complete | Paginated, RPC |
| Anti-cheat | ✅ Complete | HMAC-SHA256 |
| Reroll functionality | ✅ Complete | Shuffle actions, event rewards |
| Audio system | ✅ Complete | Music + SFX |
| Responsive design | ✅ Complete | Mobile/tablet/desktop |
| Claymorphism UI | ✅ Complete | Custom design system |

### Metrics

| Metric | Value |
|--------|-------|
| Source files | 35 |
| Total LOC | ~4,474 |
| Components | 17 |
| API routes | 2 |
| Animations | 30+ |

---

## Known Issues

### Critical

None identified.

### High Priority

| Issue | File | Description | Impact |
|-------|------|-------------|--------|
| `any` type usage | StatusLineChart.tsx | ClayDot props typed as `any` | Type safety |
| Large CSS file | globals.css | ~1200 LOC, hard to maintain | Maintainability |

### Medium Priority

| Issue | File | Description | Impact |
|-------|------|-------------|--------|
| Possibly unused component | GameStatusBars.tsx | May be replaced by StatusLineChart | Dead code |
| No error boundaries | app/ | React errors crash entire app | UX |
| No loading states | Various | Missing skeletons/spinners | UX |

### Low Priority

| Issue | Description |
|-------|-------------|
| No i18n | Hardcoded Vietnamese text |
| No dark mode | Single theme only |
| No keyboard shortcuts | Mouse/touch only |
| No offline support | Requires network |

---

## Technical Debt

### Code Quality

| Debt Item | Effort | Priority |
|-----------|--------|----------|
| Add ClayDot interface types | Low | High |
| Split globals.css into modules | Medium | Medium |
| Remove GameStatusBars if unused | Low | Low |
| Add JSDoc comments to hooks | Medium | Low |

### Testing

| Debt Item | Effort | Priority |
|-----------|--------|----------|
| Add unit tests for useGameState | High | High |
| Add E2E tests with Playwright | High | Medium |
| Add API route tests | Medium | Medium |
| Add component snapshot tests | Medium | Low |

### Infrastructure

| Debt Item | Effort | Priority |
|-----------|--------|----------|
| Add error monitoring (Sentry) | Low | High |
| Add performance monitoring | Medium | Medium |
| Add database backups | Low | High |
| Add CI/CD pipeline | Medium | Medium |

---

## Future Improvements

### Short-term (1-2 weeks)

| Feature | Description | Effort |
|---------|-------------|--------|
| Error boundaries | Graceful error handling | Low |
| Loading skeletons | Better perceived performance | Low |
| Type fixes | Eliminate `any` types | Low |
| CSS modularization | Split globals.css | Medium |

### Medium-term (1-2 months)

| Feature | Description | Effort |
|---------|-------------|--------|
| Multiplayer mode | Real-time PvP | High |
| Achievement system | Unlock badges | Medium |
| Tutorial mode | Interactive onboarding | Medium |
| Replay system | Watch past games | High |
| Analytics dashboard | Game statistics | Medium |

### Long-term (3+ months)

| Feature | Description | Effort |
|---------|-------------|--------|
| Mobile app | React Native port | Very High |
| Custom scenarios | User-created content | High |
| AI opponents | Single-player challenges | High |
| Localization | English, other languages | Medium |
| Accessibility | Screen reader support | Medium |

---

## Phase Recommendations

### Phase 1: Stabilization (Week 1-2)

**Goal:** Production-ready quality

```
Priority Tasks:
1. [ ] Add React Error Boundaries
2. [ ] Fix TypeScript `any` types
3. [ ] Add error monitoring (Sentry)
4. [ ] Add database backup strategy
5. [ ] Write useGameState unit tests
```

**Success Criteria:**
- No `any` types in codebase
- Error boundaries on all screens
- 80%+ test coverage on hooks

### Phase 2: Polish (Week 3-4)

**Goal:** Enhanced user experience

```
Priority Tasks:
1. [ ] Add loading skeletons
2. [ ] Split globals.css into modules
3. [ ] Add keyboard shortcuts
4. [ ] Improve mobile UX
5. [ ] Add sound effect variety
```

**Success Criteria:**
- Lighthouse score > 90
- No CSS file > 300 LOC
- Full keyboard navigation

### Phase 3: Features (Month 2)

**Goal:** Increased engagement

```
Priority Tasks:
1. [ ] Achievement system
2. [ ] Tutorial mode
3. [ ] Daily challenges
4. [ ] Social sharing
5. [ ] Analytics dashboard
```

**Success Criteria:**
- 5+ achievements
- 50%+ tutorial completion
- 10%+ social shares

### Phase 4: Scale (Month 3+)

**Goal:** Platform expansion

```
Priority Tasks:
1. [ ] Multiplayer infrastructure
2. [ ] Mobile app development
3. [ ] Localization system
4. [ ] Custom scenario editor
5. [ ] AI opponent development
```

**Success Criteria:**
- Multiplayer beta launch
- iOS/Android app in stores
- 3+ language support

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Supabase rate limits | Low | High | Implement caching |
| Bundle size growth | Medium | Medium | Code splitting, tree shaking |
| Database scaling | Low | High | Index optimization, archiving |
| Security vulnerabilities | Low | Critical | Regular audits, updates |
| Developer availability | Medium | Medium | Documentation, onboarding |

---

## Resource Requirements

### Phase 1-2 (Solo Developer)

- 20-40 hours total
- No additional infrastructure cost

### Phase 3 (Small Team)

- 1 frontend developer
- 1 designer (part-time)
- ~80 hours total

### Phase 4 (Full Team)

- 2 developers
- 1 designer
- 1 QA
- Additional Supabase tier may be needed
- ~200+ hours

---

## Success Metrics

### Current Targets

| Metric | Current | Target |
|--------|---------|--------|
| Weekly active users | Unknown | 100+ |
| Games completed/week | Unknown | 500+ |
| Leaderboard submissions | Unknown | 50+ unique |
| Average session time | Unknown | 10 min |
| Survival rate | Unknown | 50% |

### Future Targets (Post-Phase 3)

| Metric | Target |
|--------|--------|
| Daily active users | 200+ |
| Achievement unlock rate | 30%+ |
| Tutorial completion | 50%+ |
| Returning users (7-day) | 20%+ |

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-15 | 1.1.0 | Added Reroll system (Phase 1 & 2) |
| 2026-01-15 | 1.0.0 | Initial MVP release |
