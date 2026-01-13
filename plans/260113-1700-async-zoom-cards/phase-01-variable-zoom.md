# Phase 1: Variable Zoom Scales

## Objectives

- Modify `@keyframes idleZoom` to use a CSS variable `--idle-scale` for the target scale.
- Update `GameActionButtons.tsx` to inject random `--idle-scale` and `animationDelay` values via inline styles.

## Tasks

### Implementation
1. **Update `app/globals.css`**:
   - Change `idleZoom` keyframe:
     ```css
     @keyframes idleZoom {
       0% { transform: scale(1); }
       50% { transform: scale(var(--idle-scale, 1.03)); }
       100% { transform: scale(1); }
     }
     ```
2. **Update `app/components/GameActionButtons.tsx`**:
   - In the map loop, calculate a random scale (e.g., between 1.02 and 1.05).
   - Pass it to `style`.
   - Keep the staggered delay.
   - Maybe randomize duration slightly too? (e.g., 3s, 3.5s, 4s) for more async feel.

### Testing
1. Verify cards breathe at different depths.
2. Verify cards breathe at different speeds/times.

### Code Review
1. Ensure TypeScript accepts custom CSS properties (cast to `React.CSSProperties` if needed).
