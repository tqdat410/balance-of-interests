---
title: "Refactor Project Structure & UI Layout"
description: "Refactor monolithic page.tsx, optimize images, update card UI, improve responsive design, and refine Claymorphism theme."
status: pending
priority: P1
effort: 8h
issue: null
branch: refactor/structure-and-layout
tags: [refactor, ui, ux, responsive, claymorphism]
created: 2026-01-13
---

# Refactor Project Structure & UI Layout

## Overview

The goal is to refactor the current monolithic `app/page.tsx` into a maintainable structure with separate hooks and components, while simultaneously overhauling the UI to meet specific Claymorphism standards and responsive requirements.

## Requirements

1.  **Optimize Image URLs**: High quality. Action cards: 9:16. Event cards: 16:9.
2.  **Modularize `app/page.tsx`**: Extract logic and split UI into best-practice components.
3.  **Card UI Update**:
    *   Show effects persistently (above or below).
    *   Show Name only on hover.
4.  **Responsive Design**: Optimize specifically for Laptop -> PC screens.
5.  **Visual Theme**:
    *   Background: Pure White (`#ffffff`).
    *   Accents: Red, Green, Blue.
    *   Style: Strict Claymorphism.

## Phases

| # | Phase | Status | Effort | Priority | Link |
|---|-------|--------|--------|----------|------|
| 1 | Structure Refactor & Modularization | Completed | 4h | P1 | [phase-01](./phase-01-structure-refactor.md) |
| 2 | UI Redesign & Optimization | Completed | 4h | P1 | [phase-02](./phase-02-ui-redesign.md) |

## Dependencies

- `app/page.tsx`
- `app/components/`
- `lib/` (create if missing for hooks/constants)

## Success Criteria

- [ ] `app/page.tsx` is clean and acts as a composition layer.
- [ ] Game logic is encapsulated in `useGameLogic` (or similar).
- [ ] Action Cards display full images (9:16) with effects visible and name on hover.
- [ ] Layout looks good on PC/Laptop.
- [ ] Theme is pure white Claymorphism with correct accents.
