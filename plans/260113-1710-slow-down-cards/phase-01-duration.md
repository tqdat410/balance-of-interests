# Phase 1: Adjust Animation Duration

## Objectives

- Slow down the breathing animation significantly to create a relaxed "idle" feel.
- Update both CSS default and React inline random generation.

## Tasks

### Implementation
1. **Update `app/components/GameActionButtons.tsx`**:
   - Change random duration formula from `3 + Math.random()` to `5 + Math.random() * 3` (Range: 5s - 8s).
   - This provides a very slow, deep breath effect.
2. **Update `app/globals.css`**:
   - Change `.animate-idleZoom` default duration from `4s` to `6s`.

### Testing
1. Verify cards move very slowly.
2. Ensure the movement is smooth and not jerky (60fps transition).

### Code Review
1. Check if `animationDelay` needs adjustment (current 0-2s is fine, maybe extend to 0-3s for wider spread).
