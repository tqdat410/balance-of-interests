# Phase 6: Testing & Validation

## Context
- [Plan Overview](./plan.md)
- [Phase 5: Component Migration](./phase-05-component-migration.md)
- CWD: C:\Users\Admin\Documents\FPT\MLN122\game\balance

## Overview

| Priority | Status | Effort |
|----------|--------|--------|
| P2 | Pending | 2h |

Verify all refactored code works correctly with comprehensive testing.

## Testing Strategy

### 1. Build Validation

```bash
# Ensure no TypeScript errors
npm run build

# Check for lint issues
npm run lint
```

**Expected:** Zero errors, zero warnings

### 2. Manual Gameplay Testing

#### Test Scenario 1: Full Game (Victory - Survival)
1. Start game with valid name
2. Play through 30 rounds
3. Maintain all bars > 0
4. Verify score submission
5. Check leaderboard displays new entry

#### Test Scenario 2: Full Game (Victory - Harmony)
1. Play through 30 rounds
2. End with all bars equal
3. Verify "harmony" ending displays
4. Verify score saved with ending="harmony"

#### Test Scenario 3: Game Over
1. Play until any bar reaches 0
2. Verify game over screen
3. Verify score submission with ending="failed"

#### Test Scenario 4: Special Events
1. Play to round 5 (special event)
2. Test "Skip" button
3. Play to round 15
4. Test "Execute" button
5. Verify 10% success rate over multiple attempts

#### Test Scenario 5: Regular Events
1. Play to round 10
2. Verify forced event effects apply
3. Continue to round 20, 30

### 3. API Testing

#### /api/game-token
```bash
curl -X POST http://localhost:3000/api/game-token \
  -H "Content-Type: application/json" \
  -d '{"game_session_id": "test-uuid-123"}'

# Expected: { "success": true, "token": "..." }
```

#### /api/leaderboard
```bash
curl -X POST http://localhost:3000/api/leaderboard \
  -H "Content-Type: application/json" \
  -d '{"page_number": 1, "page_size": 10}'

# Expected: { "success": true, "data": [...], "pagination": {...} }
```

#### /api/submit-score
Test with valid game session (requires actual gameplay token)

### 4. UI/UX Verification

#### Claymorphism Visual Check
| Element | Expected |
|---------|----------|
| Background | Warm cream gradient |
| Cards | Visible depth, rounded corners |
| Buttons | Press effect with shadow |
| Status bars | Clay-like fill |
| Entity colors | Vibrant red/blue/green |
| Modals | Frosted overlay, clay card |

#### Responsive Check
| Breakpoint | Expected |
|------------|----------|
| Desktop (>1180px) | Full layout, side panels |
| Tablet (768-1180px) | Scaled components |
| Mobile (<768px) | Stacked layout, horizontal cards |
| Small mobile (<480px) | Compact cards, smaller fonts |

#### Animation Check
| Animation | Component | Works |
|-----------|-----------|-------|
| fadeIn | All screens | ☐ |
| buttonClick | Buttons | ☐ |
| actionPulse | Status bars | ☐ |
| popupScaleIn | Event popup | ☐ |
| jello-vertical | FAQ button | ☐ |

### 5. Supabase Integration

#### Check RLS Policies
```sql
-- In Supabase SQL Editor
-- Should return TRUE
SELECT auth.role();

-- Test read access (should work)
SELECT * FROM game_records LIMIT 1;

-- Test insert (should work from API with valid data)
```

#### Check Function
```sql
SELECT * FROM get_grouped_leaderboard(1, 10);
```

### 6. Performance Check

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| Bundle size | No significant increase |

### 7. Edge Cases

| Case | Test |
|------|------|
| Empty player name | Should show validation error |
| Name too long (>50 chars) | Should truncate or reject |
| Network failure during submit | Should show error message |
| Leaderboard empty | Should show empty state |
| Browser refresh during game | Should reset to menu |

## Todo List

- [ ] Run `npm run build` - verify zero errors
- [ ] Run `npm run lint` - verify zero warnings
- [ ] Test full game to victory (survival)
- [ ] Test full game to victory (harmony)
- [ ] Test game over scenario
- [ ] Test all 6 event rounds
- [ ] Test special event skip/execute
- [ ] Test leaderboard pagination
- [ ] Verify score submission flow
- [ ] Check Claymorphism on all components
- [ ] Test responsive at all breakpoints
- [ ] Verify all animations work
- [ ] Check Supabase RLS policies
- [ ] Test API endpoints manually
- [ ] Performance audit with Lighthouse

## Success Criteria

- [ ] Build passes with zero errors
- [ ] Lint passes with zero warnings
- [ ] All gameplay scenarios work correctly
- [ ] Score submission and leaderboard function
- [ ] Claymorphism UI applied consistently
- [ ] Responsive layout works at all sizes
- [ ] All animations function correctly
- [ ] No regressions from original functionality

## Known Issues / Risks

| Issue | Impact | Mitigation |
|-------|--------|------------|
| Custom event dispatch | May break if refactored wrong | Keep exact event names |
| Edge Runtime compatibility | SDK may not work | Test thoroughly, fallback to fetch if needed |
| CSS specificity | Old styles may conflict | Remove all glass3d classes first |

## Rollback Plan

If critical issues found:
1. Revert to previous commit
2. Document issue in GitHub issues
3. Fix in isolated branch before re-merging

## Post-Deployment Monitoring

After deployment:
- Monitor Supabase logs for errors
- Check Vercel analytics for client errors
- Verify leaderboard is populating correctly
- Watch for user reports

## Documentation Updates

After successful testing:
- [ ] Update README.md with new architecture
- [ ] Update docs/system-architecture.md
- [ ] Update docs/codebase-summary.md
- [ ] Add Claymorphism to docs/design-guidelines.md
