---
title: "Card Layout Optimization"
description: "Remove gradient overlay, move effects below image, resize cards for responsive laptop fit"
status: pending
priority: P1
effort: 1h
issue: null
branch: fix/card-layout-optimization
tags: [ui, css, responsive, layout]
created: 2026-01-13
---

# Card Layout Optimization

## Overview

User requested:
1. **Remove Gradient Overlay**: "bỏ hiệu ứng màu tối dần xuống dưới" (remove the darkening gradient at the bottom of the card image).
2. **Move Effects**: "Tách các effect ra nằm phía dưới ảnh" (Separate effects to be *below* the image, not overlaying it).
3. **Responsive Sizing**: "Điều chỉnh lại min kích thước card... vừa khít với laptop... đảm bảo kích thước 9:16" (Adjust min card size to fit responsive laptop screens, currently too tight, while maintaining 9:16 ratio for the image part or card total).

## Phases

| # | Phase | Status | Effort | Priority | Link |
|---|-------|--------|--------|----------|------|
| 1 | Layout Restructuring | Completed | 1h | P1 | [phase-01](./phase-01-layout-restructure.md) |

## Dependencies

- `app/components/GameActionButtons.tsx`

## Technical Details

- **Structure Change**:
  - Current: `Button > Image (absolute) + Gradient (absolute) + Effects (absolute bottom)`
  - New: `Button (flex col) > Image Container (9:16 aspect) > Effects Container (below image)`
  - OR: Keep the button as the container, but image takes up top X% and effects take bottom space.
  - Since user insisted on 9:16 for the *image* ("các hành động thì kích thước 9:16" in previous prompts, but here says "vẫn đảm bảo kích thước 9:16" likely referring to the image or the card).
  - "Điều chỉnh lại min kích thước card (ảnh) để vừa và responsive... nhưng vẫn đảm bảo kích thước 9:16": This implies the **IMAGE** should remain 9:16. The card itself will grow taller to accommodate effects below.
  - Wait, if the card becomes taller, it might overflow laptop screens.
  - Solution: Scale down the 9:16 image slightly so the total card (Image + Effects) fits.
  - New Card Layout:
    - Top: Image (AspectRatio 9/16, rounded).
    - Bottom: Effects Row (Text/Icons).
    - The whole card might not be 9:16 anymore, but the *image* is.
    - Or, the *card* is 9:16 and image fills most of it?
    - "Tách các effect ra nằm phía dưới ảnh": implies distinct separate area.
    - I will make the *Image* 9:16. The effects will sit below it.
    - I will adjust `min-w` and `w` to be smaller on laptops so it fits 3 cards side-by-side (or 2) without scrolling.

## Sizing Strategy
- Current: `w-[200px] h-[355px]` (approx 9:16).
- New:
  - Image: Aspect Ratio 9/16.
  - Container: Flex Column.
  - Sizing: Responsive width (e.g., `w-[160px]` to `w-[200px]`) so height reduces proportionally, leaving room for effects.
