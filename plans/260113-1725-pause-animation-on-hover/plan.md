---
title: "Pause Animation on Hover"
description: "Pause the idle animation when the card is hovered to prevent jittery zoom effect"
status: pending
priority: P1
effort: 0.5h
issue: null
branch: fix/pause-anim-on-hover
tags: [ui, css, animation]
created: 2026-01-13
---

# Pause Animation on Hover

## Overview

User feedback: "card đang hover thì không chuyển động nữa" (When card is hovered, it should not move/animate anymore).

Currently, the `animate-idleZoom` continues running even on hover, which conflicts with the `hover:scale-105` transform, causing potential jitter or weird compounded scaling.

## Phases

| # | Phase | Status | Effort | Priority | Link |
|---|-------|--------|--------|----------|------|
| 1 | Pause Animation on Hover | Completed | 0.5h | P1 | [phase-01](./phase-01-pause-hover.md) |

## Dependencies

- `app/globals.css` (add utility class)
- `app/components/GameActionButtons.tsx` (apply utility class)

## Technical Details

- **Solution**: Use `animation-play-state: paused` on hover.
- **Implementation**: Add `hover:pause-animation` or just explicit CSS rule `.animate-idleZoom:hover { animation-play-state: paused; }`.
- **Note**: Tailwind v4 usually has `hover:animate-none` which removes animation, but `paused` keeps it at current frame which is smoother than snapping back.
