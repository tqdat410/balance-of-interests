---
title: "Fix Card Style and Layout"
description: "Remove card borders, move effects overlay to bottom-inside image, adjust size for laptop"
status: pending
priority: P1
effort: 0.5h
issue: null
branch: fix/card-style-layout
tags: [ui, css, layout]
created: 2026-01-13
---

# Fix Card Style and Layout

## Overview

User feedback:
1. "Bỏ các border": Remove borders from cards.
2. "Các effect di chuyển lại nằm phía trên ảnh (lệch xuống dưới)": Move effects back *overlaying* the image, but positioned at the bottom (inside the image area).
3. "Với kích thước hợp lý": Reasonable size.
4. "Responsive với laptop... nhưng vẫn đảm bảo kích thước 9:16": Previously I separated effects below image which increased height. Now user wants them back inside (overlay at bottom) to save height and maintain 9:16 aspect ratio for the *whole card*.
5. Laptop fit: Ensure it fits 15.6" screen without scroll.

## Phases

| # | Phase | Status | Effort | Priority | Link |
|---|-------|--------|--------|----------|------|
| 1 | Update Card Style & Overlay | Completed | 0.5h | P1 | [phase-01](./phase-01-update-style.md) |

## Dependencies

- `app/components/GameActionButtons.tsx`

## Technical Details

- **Border**: Remove `border-*` or check if `rounded` implies border. Ensure no border line.
- **Effects**: Move the `div` containing effects *inside* the `relative` image container, positioned `absolute bottom-0`.
- **Sizing**:
  - Keep `aspect-[9/16]`.
  - Content is Image + Overlay.
  - Since effects are overlay, the total height is just the image height.
  - This saves the vertical space previously used by the external effects div.
  - Sizing logic from previous step (`w-[160px]`, `md:w-[150px]`) should work even better now as height will be strictly defined by width * aspect ratio.

## Strategy
- Revert the structure to `relative container (9:16) > img + absolute overlay (effects)`.
- Ensure overlay is readable (maybe subtle gradient or background blur). User previously asked to remove gradient, but "tách các effect ra nằm phía dưới ảnh" (separate effects below image) was the *previous* instruction. Now "di chuyển lại nằm phía trên ảnh (lệch xuống dưới)" means move *back* to overlay at bottom.
- I will add a subtle background to the effects row so it's readable.
