# Phase 1: Update Animation Keyframes

## Objectives

- Replace `idleFloat` (translateY) with `idleZoom` (scale) in `app/globals.css`.
- Update `GameActionButtons.tsx` to use the new animation class.

## Tasks

### Implementation
1. **Update `app/globals.css`**:
   - Modify `@keyframes idleFloat` to use `scale()` instead of `translateY()`.
   - Rename to `idleZoom` for clarity (optional, or just update existing keyframe content).
2. **Update `app/components/GameActionButtons.tsx`**:
   - Ensure the class name matches (if renamed).

### Testing
1. Verify cards now "breathe" (zoom in/out) instead of floating up/down.
2. Verify staggered timing still looks good with scaling.

### Code Review
1. Ensure the scale factor is subtle (1.02 - 1.05) so it's not distracting.
