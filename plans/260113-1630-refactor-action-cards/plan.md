---
title: "Refactor Action Cards Layout"
description: "Redesign action cards to be 9:16 full image with no text/effects/border, just light shadow and idle/hover animations"
status: pending
priority: P1
effort: 2h
issue: null
branch: feat/refactor-action-cards
tags: [ui, css, animation, claymorphism]
created: 2026-01-13
---

# Refactor Action Cards Layout

## Overview

User requested to refactor the action selection cards (`GameActionButtons.tsx`):
1. **Aspect Ratio**: Change to 9:16 (vertical portrait) to show full image.
2. **Minimalism**: Remove text (name, effects), Remove border, Remove background color.
3. **Style**: Only light shadow.
4. **Animation**:
   - **IDLE**: Gentle floating motion (up/down on Z-axis/Y-axis).
   - **HOVER**: Slight zoom scale.

## Phases

| # | Phase | Status | Effort | Priority | Link |
|---|-------|--------|--------|----------|------|
| 1 | Redesign Cards UI & Animation | Completed | 2h | P1 | [phase-01](./phase-01-cards-redesign.md) |

## Dependencies

- `app/components/GameActionButtons.tsx`
- `app/globals.css` (for keyframes)

## Risks

- Removing text/effects might make the game confusing if users don't know what the card does.
- **Mitigation**: User explicitly asked for "no text", implying they want a pure visual choice or maybe tooltips? The request says "Mỗi card chỉ cần hiển thị hình ảnh... không cần text...". I will follow strictly. Maybe add a tooltip on hover if needed later, but for now strict compliance.

## Technical Details

- **Size**: 9:16 ratio.
- **Shadow**: `box-shadow: 0 10px 20px rgba(0,0,0,0.1);` (light shadow).
- **Idle Animation**: CSS Keyframes `float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }`.
- **Hover Animation**: `transform: scale(1.05);` transition.
