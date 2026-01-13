# Phase 1: Layout Restructuring

## Objectives

- Remove the gradient overlay div.
- Move the effects div out of the `absolute` positioning over the image, placing it statically below the image.
- Adjust responsive sizing to ensure 3 cards fit on a laptop screen (height-wise and width-wise).

## Tasks

### Implementation
1. **Update `app/components/GameActionButtons.tsx`**:
   - Change Button layout from `relative` (for absolute overlays) to `flex flex-col`.
   - Remove the `bg-gradient-to-t` div.
   - Wrap Image in a div with `aspect-[9/16] w-full relative overflow-hidden rounded-2xl`.
   - Place Effects div *after* the Image wrapper.
   - Adjust Card Container width constraints:
     - Reduce max-width on smaller laptop screens (e.g., `md:w-[150px]`, `lg:w-[180px]`).
     - This scales down the 9:16 image height, saving vertical space.
   - Ensure the card background is transparent or clean (user previously asked for flat).

### Testing
1. Verify no dark gradient on image.
2. Verify effects are below the image.
3. Verify layout on 1366x768 (common laptop) - no vertical scroll bar if possible.

### Code Review
1. Check aesthetics of the separated effects (spacing, font size).
