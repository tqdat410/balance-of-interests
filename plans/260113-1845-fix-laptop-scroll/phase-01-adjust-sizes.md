# Phase 1: Adjust Card Sizes & Layout

## Objectives

- Eliminate vertical scrolling on laptop screens (approx 768px height).
- Ensure card effects are visible.

## Tasks

### Implementation
1. **Update `app/components/GameActionButtons.tsx`**:
   - Reduce card width for `md` and `lg`:
     - `w-[160px]` (base) -> `w-[130px]` (mobile/small).
     - `md:w-[150px]` (laptop).
     - `lg:w-[180px]` (desktop).
     - `xl:w-[200px]` (large desktop).
   - Adjust effect font size for smaller cards.
2. **Update `app/components/StatusLineChart.tsx`**:
   - Reduce `CHART_HEIGHT` from `280` to `240` or make it responsive (e.g., `h-[30vh]`).
   - Actually, fixed pixel might be safer, let's try `220px` on laptop? Or use a prop?
   - Easiest: Make chart container `h-[220px]` on `md`, `h-[280px]` on `xl`.
   - Wait, `StatusLineChart` has `const CHART_HEIGHT = 280`. I need to make this dynamic or smaller.
   - Refactor `StatusLineChart` to accept `height` prop or use responsive class.
3. **Update `app/components/GamePlayArea.tsx`**:
   - Adjust vertical gaps. `gap-4` -> `gap-2`.

### Testing
1. Emulate 1366x768 viewport.
2. Verify no scrollbar.
3. Verify effects visible.

### Code Review
1. Ensure chart still looks good at reduced height.
