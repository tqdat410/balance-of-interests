# Phase 1: Pause Animation on Hover

## Objectives

- Ensure the idle breathing animation stops (pauses) when the user hovers over a card.
- Maintain the hover zoom effect without interference.

## Tasks

### Implementation
1. **Update `app/globals.css`**:
   - Add a rule to pause the animation on hover for `.animate-idleZoom`.
   ```css
   .animate-idleZoom:hover {
     animation-play-state: paused;
   }
   ```
2. **Verify `GameActionButtons.tsx`**:
   - Ensure the hover scale (`hover:scale-105`) works cleanly when animation is paused.

### Testing
1. Hover over a card.
2. Verify it stops "breathing" and stays at its current interpolated scale (or just pauses).
3. Verify the `hover:scale-105` takes over (transform might need `!important` or specific handling if animation uses transform, but `animation-play-state: paused` usually freezes the transform from the keyframe, so `hover:scale` adds on top or overrides depending on specificity).
   - Actually, if keyframe controls `transform: scale`, pausing it freezes `scale`.
   - `hover:scale-105` is a transition on the same property.
   - CSS Conflict: Animation vs Transition.
   - Better approach: Wrap the inner content or apply animation to a wrapper, and hover scale to the child? Or apply `animation: none` on hover?
   - If we use `animation-play-state: paused`, the scale freezes at say 1.02.
   - If we want to zoom to 1.05 on hover, we might need to stop the animation completely or ensure the hover transform overrides.
   - **Refined Plan**: On hover, set `animation: none` (or paused) and let `transition` take over to `scale(1.05)`. Since `transform` is managed by animation, removing animation might snap it back to 1 before zooming to 1.05.
   - ** smoothest way**: wrapper div has animation, inner div has hover effect? Or vice versa.
   - Let's try `animation-play-state: paused` first. If it conflicts with hover scale, we might need a wrapper.
   - Actually, the user requirement is just "not move anymore".
   - If I simply pause, it stops moving. The zoom effect (1.05) might not apply if animation has priority on transform.
   - Tailwind `hover:scale-105` uses CSS variables in v4 usually, but legacy transform uses explicit property.
   - Let's try adding the pause rule first.

### Code Review
1. Check for jumpiness when hovering/unhovering.
