---
title: "Fix Card Animations"
description: "Correct the idle animation from vertical float (Y-axis) to scale pulse (Z-axis zoom) as requested"
status: pending
priority: P1
effort: 0.5h
issue: null
branch: fix/card-animations
tags: [ui, css, animation]
created: 2026-01-13
---

# Fix Card Animations

## Overview

User feedback: "hiệu ứng idle của các card là zoom to zoom nhỏ theo chiều Z chứ không phải lên xuống theo X" (Note: User likely meant "up down along Y" when saying "X" or just meant general movement, but explicitly asked for **Z-axis zoom**).

Current implementation: `translateY` (floating up/down).
Requested implementation: `scale` (zooming in/out gently).

## Phases

| # | Phase | Status | Effort | Priority | Link |
|---|-------|--------|--------|----------|------|
| 1 | Update Animation Keyframes | Completed | 0.5h | P1 | [phase-01](./phase-01-update-keyframes.md) |

## Dependencies

- `app/globals.css`

## Technical Details

- **Old Animation**: `transform: translateY(-10px)`
- **New Animation**: `transform: scale(1.02)` (gentle pulse) or `translateZ` if using 3D perspective, but `scale` is safer for 2D context to simulate Z-axis breathing.
- **Keyframes**:
  ```css
  @keyframes idleZoom {
    0% { transform: scale(1); }
    50% { transform: scale(1.03); } /* Subtle zoom */
    100% { transform: scale(1); }
  }
  ```
