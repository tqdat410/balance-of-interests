# Phase 1: Layout Restructuring & Flex Optimization

## Objectives

- Reduce the vertical gap between the Chart and the Action Cards on large screens.
- Ensure the layout remains compact and doesn't spread out unnecessarily on 27" monitors.

## Tasks

### Implementation
1. **Update `app/components/GamePlayArea.tsx`**:
   - Change the Desktop Layout container.
   - Currently: `hidden md:flex w-full h-full flex-col p-2 pt-1 gap-1`.
   - The card section uses `flex-1 flex flex-col h-full justify-start`.
   - Check if `justify-start` is effectively pushing content.
   - Verify if `GameActionButtons` container has internal spacing causing issues.
   - **Fix**:
     - Keep Chart at top.
     - Reduce gap between Chart and Text.
     - Reduce gap between Text and Cards.
     - Ensure the container allows Cards to be large enough but close to the text.
     - Maybe center the whole content vertically if there's *too much* space on 27"?
     - Or just keep it top-aligned but tight. User said "trống rất lớn" (huge empty space) at the *bottom*, implying the content is top-aligned but maybe the cards are too small or the gap is weird?
     - "giữa 2 phần này chỉ cần 1 phần nhỏ": Gap between chart and cards should be small.
     - I will inspect `gap` properties and remove any `flex-1` that forces expansion where not needed, allowing elements to stack naturally.

### Testing
1. Verify layout on large viewport.
2. Ensure gap is minimal.

### Code Review
1. Check responsiveness on laptop (don't break previous fix).
