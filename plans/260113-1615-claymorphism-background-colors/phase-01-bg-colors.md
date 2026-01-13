# Phase 1: Remove Background & Adjust Colors

## Objectives

- Remove the existing radial gradient / grid background from `app/page.tsx`.
- Implement a solid or very soft gradient background (e.g., Soft Pastel Cream or Light Blue/Gray) that works well with Claymorphism.
- Review and adjust colors of:
  - Game Container
  - Buttons
  - Text (Headers, Labels)
  - Entity Colors (Government, Business, Workers) if needed to match the new vibe.

## Tasks

### Implementation
1. **Remove Background**: Identify and remove the background styles in `app/page.tsx` (the `radial-gradient` and `absolute inset-0` divs).
2. **Set New Background**: Apply a global background color (e.g., `bg-slate-50` or a specific pastel tone like `#fdf6e3` (Solarized Light) or similar) in `app/globals.css` or `app/page.tsx`.
3. **Adjust Clay Colors**:
   - Check `lib/styles/clay-tokens.css`.
   - Ensure the "surface" colors of cards contrast well with the new background.
   - If cards are white/light, background should be slightly off-white or colored.
4. **Refine UI Components**:
   - Update `StatusLineChart` container background if needed.
   - Update `GameActionButtons` container if needed.
   - Update Text colors for readability.

### Testing
1. Visual check of the Main Menu.
2. Visual check of the Game Screen.
3. Visual check of the Game Over / Victory screens.

### Code Review
1. Ensure no "magic values" for colors remain if possible (use Tailwind classes).
2. Clean up unused CSS classes.
