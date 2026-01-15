# Plan: Reroll Feature

**Date:** 2026-01-15  
**Status:** In Progress  
**Complexity:** Medium  
**Estimated Phases:** 2

---

## Overview

Add reroll functionality to refresh action cards during gameplay. Players start with 1 reroll and earn more through event interactions.

---

## Requirements

| Requirement | Description |
|-------------|-------------|
| Initial rerolls | Start with 1 |
| Max limit | No limit (unlimited accumulation) |
| Reroll behavior | Re-shuffle actions, MAY include same cards (no exclusion) |
| Event rewards | 6 events grant +1 reroll under specific conditions |

### Reroll Acquisition Rules

| Event Round | Event Type | Current Behavior | New Behavior |
|-------------|------------|------------------|--------------|
| 5, 15, 25 | Special (choice) | Execute/Skip | Execute = +1 reroll, Skip = 0 |
| 10, 20, 30 | Auto-apply | Auto-apply effects | Add Accept/Skip choice. Accept = effects + reroll, Skip = nothing |

---

## Technical Analysis

### Current State

**`useGameState.ts`:**
- `availableActions` is computed via `useMemo` based on `currentEntity` and `round`
- Shuffled on every re-render when dependencies change
- No mechanism to manually trigger re-shuffle

**`events.ts`:**
- Events 10, 20, 30 have `effects` (auto-apply)
- Events 5, 15, 25 have `isSpecialEvent: true`, `positiveEffects`, `negativeEffects`

**`EventPopup.tsx`:**
- Special events: Execute/Skip buttons
- Regular events: "Chap nhan!" (Continue) button only

### Key Changes Needed

1. **State**: Add `rerollCount` state, `rerollTrigger` for forcing re-computation
2. **Logic**: Add `handleReroll()`, modify event handlers for reroll rewards
3. **Config**: Add `rerollReward` and `isSkippable` flags to events
4. **UI**: Add reroll button near action cards, update EventPopup for Accept/Skip on regular events

---

## Phases

### Phase 1: Core Logic & State (Completed)
**File:** `phase-01-core-logic.md`

- Update `GameEvent` type with `rerollReward?: boolean`, `isSkippable?: boolean`
- Update `events.ts` config
- Add `rerollCount` state to `useGameState`
- Add `rerollTrigger` state to force `availableActions` recomputation
- Implement `handleReroll()` function
- Update `handleEventExecute()` for special events (+1 reroll)
- Add `handleEventAccept()` for skippable events (10, 20, 30)
- Update `handleEventSkip()` for skippable events
- Export new state/handlers

### Phase 2: UI Components (In Progress)
**File:** `phase-02-ui-components.md`

- Add reroll button to `GameActionButtons.tsx` (or create separate component)
- Show reroll counter badge
- Disable button when `rerollCount === 0`
- Add reroll animation/feedback
- Update `EventPopup.tsx`:
  - Show Accept/Skip for events with `isSkippable: true`
  - Show reroll indicator for events with `rerollReward: true`

---

## File Changes Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `lib/types/game.ts` | Modify | Add `rerollReward`, `isSkippable` to GameEvent |
| `lib/config/events.ts` | Modify | Add flags to all 6 events |
| `lib/hooks/useGameState.ts` | Modify | Add reroll state, handlers, update event logic |
| `app/components/GameActionButtons.tsx` | Modify | Add reroll button + counter |
| `app/components/EventPopup.tsx` | Modify | Add Accept/Skip for skippable events, reroll indicator |

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| `availableActions` useMemo not recomputing | Add `rerollTrigger` dependency to force update |
| Breaking existing event flow | Separate handlers for different event types |
| UI clutter with reroll button | Keep button minimal, show only during action selection |

---

## Success Criteria

- [ ] Game starts with 1 reroll
- [ ] Reroll button visible and functional during action selection
- [ ] Clicking reroll: decrements counter, shuffles cards (may repeat)
- [ ] Events 5, 15, 25: Execute grants +1 reroll
- [ ] Events 10, 20, 30: Accept grants +1 reroll, Skip does nothing
- [ ] Reroll counter persists across rounds
- [ ] No regressions in existing gameplay
