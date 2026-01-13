---
title: "Update Background to White Clay"
description: "Change the page background to a standard white/off-white color suitable for Claymorphism as requested"
status: pending
priority: P1
effort: 0.5h
issue: null
branch: fix/white-clay-bg
tags: [ui, css, claymorphism]
created: 2026-01-13
---

# Update Background to White Clay

## Overview

User requested: "tôi muốn background của page màu trắng chuẩn Claymorphism" (I want the page background to be standard white Claymorphism).

Current: `var(--clay-bg)` which is `#fdf6e3` (creamy/solarized light).
Target: A lighter, more neutral off-white (e.g., `#f3f4f6` or `#f8fafc` or pure `#ffffff` with subtle shadows) that is considered "standard Claymorphism". Usually Claymorphism uses a very light pastel or off-white background to make the white cards pop with shadows.

## Phases

| # | Phase | Status | Effort | Priority | Link |
|---|-------|--------|--------|----------|------|
| 1 | Update Background Color Token | Completed | 0.5h | P1 | [phase-01](./phase-01-update-bg.md) |

## Dependencies

- `lib/styles/clay-tokens.css`

## Technical Details

- Update `--clay-bg` in `lib/styles/clay-tokens.css`.
- Suggest using a very light gray-blue or warm white instead of the current yellow-cream, as "standard" often implies a cleaner look.
- **Proposed Value**: `#f0f4f8` (Alice Blue-ish) or `#fdfdfd` (Near White).
- User said "white", so maybe just `#f8faff` or similar.
- I will change `--clay-bg` to `#f3f4f6` (Tailwind slate-100) or similar standard clay base.
