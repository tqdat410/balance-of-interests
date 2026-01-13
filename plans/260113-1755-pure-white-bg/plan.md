---
title: "Update Background to Pure White"
description: "Change the page background to pure white #ffffff as strictly requested"
status: pending
priority: P1
effort: 0.5h
issue: null
branch: fix/pure-white-bg
tags: [ui, css, color]
created: 2026-01-13
---

# Update Background to Pure White

## Overview

User feedback: "tôi muốn nó màu trắng tinh" (I want it **pure white**).

Current: `#f0f4f8` (Standard Clay Blue-Grey).
Target: `#ffffff` (Pure White).

**Challenge**: If background is `#ffffff` and cards are `#ffffff` (as set in previous step), cards will blend in completely unless shadows are strong enough.
**Mitigation**: Ensure shadows (`--clay-shadow-out`) provide enough contrast to define the cards against the pure white background.

## Phases

| # | Phase | Status | Effort | Priority | Link |
|---|-------|--------|--------|----------|------|
| 1 | Set Background to Pure White | Completed | 0.5h | P1 | [phase-01](./phase-01-pure-white.md) |

## Dependencies

- `lib/styles/clay-tokens.css`

## Technical Details

- Update `--clay-bg` to `#ffffff`.
- Check if `--clay-surface` needs adjustment. If it's also `#ffffff`, it's fine as long as shadows work.
