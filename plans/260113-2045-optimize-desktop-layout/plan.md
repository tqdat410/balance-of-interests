---
title: "Optimize Desktop Layout"
description: "Fix large empty space on large screens (27 inch), ensure tight layout between chart and cards"
status: pending
priority: P1
effort: 0.5h
issue: null
branch: fix/desktop-layout-gap
tags: [ui, css, layout, responsive]
created: 2026-01-13
---

# Optimize Desktop Layout

## Overview

User feedback: "@app\page.tsx có vẽ chưa tối ưu về layout. tôi thấy phần phía dưới đang còn trống và trống rất lơn với màn hình 27 inch. hiện layout mới này tôi chỉ muốn: phần phía trên chart, phần phía dưới là phần section chọn card, giữa 2 phần này chỉ cần 1 phần nhỏ để hiện thị một số text. hãy tối ưu"

(The layout is not optimized. There is a huge empty space at the bottom on a 27-inch screen. I only want: Chart at top, Card section at bottom, with a small text section in between.)

## Phases

| # | Phase | Status | Effort | Priority | Link |
|---|-------|--------|--------|----------|------|
| 1 | Layout Restructuring & Flex Optimization | Completed | 0.5h | P1 | [phase-01](./phase-01-layout-fix.md) |

## Dependencies

- `app/components/GamePlayArea.tsx`

## Technical Details

- **Current Layout**:
  - `flex-col` with `flex-1` on the bottom section, which might be stretching too much or distributing space unevenly.
  - The card container is centered vertically in `flex-1`, causing gaps if the screen is tall.
- **Solution**:
  - Remove `flex-1` spacer if it causes excessive gap.
  - Structure:
    1. Chart (Top)
    2. Info Text (Middle, minimal margin)
    3. Cards (Bottom, taking remaining space but aligned top-center or just below text, not pushed to bottom).
    - Actually, user said "giữa 2 phần này chỉ cần 1 phần nhỏ".
    - So the layout should be compact towards the center or top, not spreading out to fill 27" height.
  - However, `GamePlayArea` uses `h-full`.
  - On large screens, we should probably center the entire content block vertically or allow it to be compact.
  - Let's make the container `flex flex-col h-full items-center justify-center` (or `justify-start` with specific spacing).
  - User implies the cards are too far from the chart?
  - "phần phía trên chart, phần phía dưới là phần section chọn card, giữa 2 phần này chỉ cần 1 phần nhỏ".
  - I will reduce the gap between Chart and Cards.
  - I will ensure the cards section expands to fill available width but doesn't push itself away from the chart.

## Strategy
- In `GamePlayArea.tsx`:
  - Review flex properties.
  - Ensure Chart is fixed height (done, 220px).
  - Text section is small.
  - Card section should be immediately below text.
  - The main container shouldn't force `justify-between` or large gaps.
