---
title: "Async Zoom for Action Cards"
description: "Implement variable zoom scales and timings for action cards to create an asynchronous breathing effect"
status: pending
priority: P1
effort: 0.5h
issue: null
branch: feat/async-zoom-cards
tags: [ui, css, animation]
created: 2026-01-13
---

# Async Zoom for Action Cards

## Overview

User requested: "làm cho mức độ zoom của các card khi idle là khác nhau tạo cảm giác bất đồng bộ" (Make the zoom level of the cards when idle different to create an asynchronous feel).

Currently, we have staggered `animationDelay`, but the **zoom intensity** (scale factor) is uniform (1.03). The user wants the scale factor itself to also vary (e.g., one card zooms to 1.02, another to 1.04, etc.) in addition to the timing.

## Phases

| # | Phase | Status | Effort | Priority | Link |
|---|-------|--------|--------|----------|------|
| 1 | Variable Zoom Scales | Completed | 0.5h | P1 | [phase-01](./phase-01-variable-zoom.md) |

## Dependencies

- `app/components/GameActionButtons.tsx`
- `app/globals.css` (potentially multiple keyframes or CSS variable approach)

## Technical Details

**Strategy**:
Instead of hardcoding the scale in keyframes, we can use a CSS variable for the max scale, or define multiple keyframes.
A cleaner approach for randomizing *per instance* without 10 keyframes:
Use a CSS variable `--idle-scale` in the keyframe?
Actually, standard CSS keyframes don't animate custom properties well in all browsers unless registered (Houdini), but `transform: scale(var(--target-scale))` works if the variable itself isn't animated but the keyframe uses it.
However, keyframes are defined globally.
`@keyframes idleZoom { 0%, 100% { transform: scale(1); } 50% { transform: scale(var(--idle-scale, 1.03)); } }`

Then in React:
`style={{ "--idle-scale": 1.02 + Math.random() * 0.03, animationDelay: ... }}`

This is the most flexible way.

**Fallback**: If CSS variables in `transform` keyframes are flaky in some environments (usually fine in modern ones), we can define `idleZoom1`, `idleZoom2`, `idleZoom3` etc. But CSS var is preferred.
Next.js 16 supports modern CSS.

**Randomization**:
In `GameActionButtons.tsx`, generate random scale and delay for each card.
