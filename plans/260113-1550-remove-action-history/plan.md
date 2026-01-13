---
title: "Remove Action History Feature"
description: "Remove the Action History component and logic from the game as per user request"
status: pending
priority: P2
effort: 1h
issue: null
branch: chore/remove-action-history
tags: [ui, cleanup]
created: 2026-01-13
---

# Remove Action History Feature

## Overview

User requested to remove the "Action History" (Lịch sử hành động) section from the screen and game logic because it is rarely used.

## Scope

- Remove `GameHistory` component.
- Remove usage of `GameHistory` in `app/page.tsx` or other parent components.
- Clean up any state or logic solely dedicated to tracking history for display, IF it is not used for game logic (e.g. calculation).
  - Note: Game logic might need history for other reasons (e.g. undo, end game summary). If so, keep the logic, just remove the UI.
  - Requirement says "bỏ ... ra khỏi màn hình và game". "Game" might imply logic too.
  - However, safely, we should first remove UI.
  - Check if `history` state is used for `StatusLineChart`?
  - `StatusLineChart` uses `history`. So we CANNOT remove the `history` state. We only remove the `GameHistory` UI component.

## Phases

| # | Phase | Status | Effort | Priority | Link |
|---|-------|--------|--------|----------|------|
| 1 | Remove Action History UI | Completed | 1h | P1 | [phase-01](./phase-01-remove-history.md) |

## Dependencies

- None

## Risks

- Removing `history` state might break `StatusLineChart`.
- **Mitigation**: Only remove the *UI component* `GameHistory`, keep the data tracking if other components need it.
