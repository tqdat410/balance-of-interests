---
title: "Card UI Refinements"
description: "Remove remaining card shadows and simplify effect display format"
status: pending
priority: P1
effort: 0.5h
issue: null
branch: fix/card-ui-refinements
tags: [ui, css, style]
created: 2026-01-13
---

# Card UI Refinements

## Overview

User requested:
1. **Remove Shadows**: "bỏ các hiệu ứng shadow" (remove shadow effects) from cards.
2. **Simplify Effect Display**: "bỏ dấu +/-" (remove +/- signs), just color the number (red/green). Format: `Entity:Number` (e.g., `N:7`). Only the number should be colored red/green.

## Phases

| # | Phase | Status | Effort | Priority | Link |
|---|-------|--------|--------|----------|------|
| 1 | Remove Shadows & Update Effect Format | Completed | 0.5h | P1 | [phase-01](./phase-01-ui-updates.md) |

## Dependencies

- `app/components/GameActionButtons.tsx`

## Technical Details

- **Shadows**: Ensure `shadow-*` classes are removed from the card container and hover states if user wants completely flat.
- **Effect Format**:
  - Current: `+7` or `-5`.
  - New: `7` or `5`.
  - Color: Apply text color class to the number span only.
  - Label: `N:`, `D:`, `L:`.
