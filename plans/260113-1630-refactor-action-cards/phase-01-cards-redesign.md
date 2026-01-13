# Phase 1: Redesign Cards UI & Animation

## Objectives

- Update `GameActionButtons.tsx` to render cards as 9:16 images only.
- Remove name, effects, borders, and background colors.
- Add CSS animations for Idle (floating) and Hover (zoom).

## Tasks

### Implementation
1. **Update `GameActionButtons.tsx`**:
   - Remove rendering of `action.name` and `effects`.
   - Change container to `aspect-[9/16]` or fixed dimensions matching that ratio.
   - Remove `clay-card-*` classes and borders.
   - Ensure image covers the full card (`object-cover w-full h-full`).
2. **Add Animations in `app/globals.css`**:
   - Define `@keyframes idleFloat`.
   - Create utility class `.animate-idleFloat`.
   - Add hover transition classes.
3. **Staggered Animation**:
   - Apply different animation delays to cards so they don't float in sync (random or indexed delay).

### Testing
1. Verify cards are 9:16.
2. Verify no text is visible.
3. Verify animations (float and zoom).
4. Verify click still works.

### Code Review
1. Clean up unused props/types if necessary (though logic might still need them, just UI hides them).
