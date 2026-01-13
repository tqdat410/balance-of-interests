---
title: "Fullstack Refactor + Claymorphism UI Redesign"
description: "Optimize FE structure, modernize Supabase integration, implement Claymorphism design system"
status: pending
priority: P1
effort: 32h
issue: null
branch: feat/fullstack-refactor-claymorphism
tags: [frontend, backend, database, ui-ux, refactor]
created: 2026-01-13
---

# Fullstack Refactor + Claymorphism UI Redesign

## Overview

Complete refactoring of the "Cán cân Lợi ích" (Balance of Interests) game covering:
1. **FE Architecture** - Extract 1289-line page.tsx into modular hooks/components
2. **Supabase Integration** - Modernize from raw REST to official SDK with RLS
3. **UI Redesign** - Implement Claymorphism design system with bold vibrant style
4. **Anti-Cheat Simplification** - HMAC-based verification, eliminate token API
5. **Code Quality** - Add type safety, constants, proper error handling

## Current State Analysis

| Area | Current | Target |
|------|---------|--------|
| **FE Structure** | 1289-line monolithic page.tsx, 20+ useState | Custom hooks, modular components |
| **Supabase** | Direct REST fetch(), no RLS, manual types | @supabase/ssr, RLS policies, generated types |
| **UI Style** | Glassmorphism with rgba() overlays | Claymorphism with bold shadows, vibrant colors |
| **Anti-Cheat** | Token API + SHA-256 hash | Single HMAC signature, no token API |
| **Constants** | Magic numbers scattered | Centralized config file |
| **Types** | Inline interfaces | Dedicated types/ directory |

## Phases

| # | Phase | Status | Effort | Priority | Link |
|---|-------|--------|--------|----------|------|
| 1 | Project Setup & Dependencies | Pending | 2h | P1 | [phase-01](./phase-01-project-setup.md) |
| 2 | Supabase Modernization | Pending | 6h | P1 | [phase-02](./phase-02-supabase-modernization.md) |
| 3 | FE Architecture Refactor | Pending | 8h | P1 | [phase-03](./phase-03-fe-architecture.md) |
| 4 | Claymorphism Design System | Pending | 10h | P1 | [phase-04](./phase-04-claymorphism-ui.md) |
| 5 | Component UI Migration | Pending | 4h | P2 | [phase-05](./phase-05-component-migration.md) |
| 6 | Testing & Validation | Pending | 2h | P2 | [phase-06](./phase-06-testing.md) |

## Dependencies

- Supabase project (new or existing)
- Supabase CLI for type generation
- Tailwind CSS v4 (already installed)

## Assumptions Made

Since user didn't specify:
- **Supabase**: Create new project OR redesign existing schema
- **Claymorphism**: Bold Clay style (vibrant, playful - fits game theme)
- **Entity Colors**: Keep Red-Blue-Green with Claymorphism adaptation
- **Anti-Cheat**: Simplified HMAC approach, remove token API round-trip
- **Deploy**: Vercel (Next.js native support)
- **No new features** this iteration - focus on refactoring

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Breaking game logic during refactor | Phase 3 extracts logic without changing behavior |
| Claymorphism accessibility | Maintain WCAG contrast ratios |
| Supabase migration downtime | Use feature flags, deploy during low traffic |

## Success Criteria

- [ ] page.tsx reduced to <200 lines (orchestration only)
- [ ] Supabase SDK with generated types
- [ ] RLS policies protecting game_records
- [ ] Claymorphism applied to all components
- [ ] HMAC-based anti-cheat (no token API)
- [ ] All existing functionality preserved
- [ ] Build passes, no type errors
