---
title: "Remove Card Shadows"
description: "Remove shadows from action cards as requested"
status: pending
priority: P1
effort: 0.5h
issue: null
branch: fix/remove-card-shadows
tags: [ui, css, style]
created: 2026-01-13
---

# Remove Card Shadows

## Overview

User feedback: "bỏ shadow cho của các card" (remove shadow for the cards).

Currently, `GameActionButtons.tsx` has `shadow-[0_10px_20px_rgba(0,0,0,0.15)]`.
The user wants this removed. Since the background is pure white and cards are images, removing shadows might make them look flat, but this is the request.

## Phases

| # | Phase | Status | Effort | Priority | Link |
|---|-------|--------|--------|----------|------|
| 1 | Remove Shadow Class | Completed | 0.5h | P1 | [phase-01](./phase-01-remove-shadow.md) |

## Dependencies

- `app/components/GameActionButtons.tsx`

## Technical Details

- Remove `shadow-[0_10px_20px_rgba(0,0,0,0.15)]` from the button class string.
- Check if hover needs shadow? Usually "bỏ shadow" implies all states or at least idle state. I'll remove it from idle. If hover still needs it to pop, I might keep `hover:shadow-lg`, but usually clean design means clean. I will assume remove ALL shadows unless user specified otherwise. But often hover lift implies shadow. I'll remove the static shadow first.
- Actually, the user just said "bỏ shadow". I'll remove the main shadow class.
