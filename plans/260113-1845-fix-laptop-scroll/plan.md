---
title: "Fix Laptop Scroll and Overflow"
description: "Fix vertical scrolling and overflow issues on laptop screens by adjusting layout and card sizes"
status: pending
priority: P1
effort: 0.5h
issue: null
branch: fix/laptop-layout-overflow
tags: [ui, css, responsive, layout]
created: 2026-01-13
---

# Fix Laptop Scroll and Overflow

## Overview

User feedback: "Desktop thì không được Scroll, trên Laptop tôi hiện tại (15,6 inch) effect của card đang bị khuất phía dưới và Scroll đang available" (Desktop should NOT scroll. On my 15.6 inch laptop, card effects are cut off at the bottom and scrolling is available).

The goal is to fit everything on a 15.6" laptop screen (likely 1366x768 or 1920x1080 scaled) without vertical scrolling.

## Phases

| # | Phase | Status | Effort | Priority | Link |
|---|-------|--------|--------|----------|------|
| 1 | Adjust Card Sizes & Layout | Completed | 0.5h | P1 | [phase-01](./phase-01-adjust-sizes.md) |

## Dependencies

- `app/components/GameActionButtons.tsx`
- `app/components/GamePlayArea.tsx`

## Technical Details

- **Problem**: Cards are too tall or vertical spacing is too loose, causing the main container to overflow the viewport height (`h-screen`).
- **Solution**:
  1. Reduce card size further on laptops (`md` breakpoint).
  2. Optimize vertical gaps (`gap-4` -> `gap-2`?).
  3. Ensure `h-screen` container has `overflow-hidden` properly set or content fits within.
  4. Current card width on `md` is `180px`. With 9:16 aspect + effects, height is approx `180 * (16/9) + 40 = 360px`.
  5. Chart takes `280px` + header `~60px` + padding `~20px`. Total `~720px`.
  6. On 768px height screen, `720px` is very tight.
  7. Need to shrink chart or cards on smaller vertical screens.

## Strategy
- Use `max-h` or `vh` based sizing for cards?
- Or just reduce fixed pixel sizes.
- Reduce Chart height on laptop?
- Reduce Card width on laptop -> `w-[140px]`.
