---
title: "Slow Down Card Animations"
description: "Increase animation duration for action cards to create a slower, more relaxed breathing effect"
status: pending
priority: P1
effort: 0.5h
issue: null
branch: fix/slow-down-cards
tags: [ui, css, animation]
created: 2026-01-13
---

# Slow Down Card Animations

## Overview

User feedback: "tăng thời gian chuyển động của các card để cảm giác các card chuyển động CHậm, hiện đang khá nhanh" (Increase movement time of cards to make them move SLOWER, currently too fast).

Current duration: Random `3s - 4s`.
Target duration: Random `6s - 8s` (double the time for a very slow breath).

## Phases

| # | Phase | Status | Effort | Priority | Link |
|---|-------|--------|--------|----------|------|
| 1 | Adjust Animation Duration | Completed | 0.5h | P1 | [phase-01](./phase-01-duration.md) |

## Dependencies

- `app/components/GameActionButtons.tsx` (where inline style `animationDuration` is set)
- `app/globals.css` (base duration is `4s` in class `.animate-idleZoom`, but overridden by inline styles)

## Technical Details

- **Current**: `animationDuration: ${3 + Math.random()}s` (3s to 4s)
- **New**: `animationDuration: ${6 + Math.random() * 2}s` (6s to 8s)
- **Base CSS**: Update `.animate-idleZoom` default from `4s` to `7s` just in case inline styles fail or for consistency.
