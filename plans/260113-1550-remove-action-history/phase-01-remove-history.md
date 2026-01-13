# Phase 1: Remove Action History UI

## Objectives

- Remove `GameHistory` component from the codebase.
- Remove its instantiation in `app/page.tsx`.
- Verify `StatusLineChart` still works (since it likely uses the same `history` data).

## Tasks

### Implementation
1. Analyze `app/page.tsx` to identify `GameHistory` usage.
2. Analyze usage of `history` state.
3. Remove `GameHistory` usage from `app/page.tsx`.
4. Delete `app/components/GameHistory.tsx`.
5. Check if `history` state is used by other components (e.g. `StatusLineChart`).
   - If used, keep the state.
   - If not used, remove the state and update `useGameState` hook (if exists) or state logic.
   - *Self-correction*: `StatusLineChart` definitely uses history for the graph. So we MUST keep the `history` state.

### Testing
1. Verify the game loads without error.
2. Verify "Action History" section is gone.
3. Verify Chart still updates correctly (proving history state is still active).

### Code Review
1. Ensure no unused imports remain.
2. Ensure layout is not broken by removal (flex gaps, etc).
