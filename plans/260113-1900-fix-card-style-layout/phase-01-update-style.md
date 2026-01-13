# Phase 1: Update Card Style & Overlay

## Objectives

- Remove card borders.
- Move effects to overlay the bottom of the image.
- Ensure 9:16 aspect ratio contains everything.
- Ensure laptop fit.

## Tasks

### Implementation
1. **Update `app/components/GameActionButtons.tsx`**:
   - Change structure:
     - Button (relative, 9:16 aspect).
     - Image (absolute inset-0).
     - Effects (absolute bottom-0, w-full).
   - Remove any border classes.
   - Adjust effects container styling (padding, background for readability).
   - Keep responsive widths (`w-[150px]` etc.) from previous fix.

### Testing
1. Verify no borders.
2. Verify effects are inside the card area at the bottom.
3. Verify laptop fit (should be easier now as height is reduced).

### Code Review
1. Check text contrast on overlay.
