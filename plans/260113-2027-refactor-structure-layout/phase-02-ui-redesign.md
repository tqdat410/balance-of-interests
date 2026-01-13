# Phase 2: UI Redesign & Optimization

## Objectives

- Implement the visual and layout changes requested.
- Optimize images and card presentation.
- Refine responsive behavior for PC/Laptop.
- Apply the Pure White Claymorphism theme.

## Tasks

### 1. Optimize Images & Card UI
- Update `ACTIONS` data with high-quality 9:16 image URLs.
- Update `EVENTS` data with high-quality 16:9 image URLs.
- Update `GameActionButtons.tsx`:
  - Layout: 9:16 aspect ratio.
  - Content: Show Image full.
  - Overlay/Footer: Show Effects persistently.
  - Hover: Show Name overlay.
  - Animation: Ensure smooth idle/hover effects.

### 2. Responsive Layout (Laptop/PC)
- Adjust grid/flex layouts to utilize screen space better on larger screens.
- Ensure Chart and Action Cards fit well without excessive scrolling.

### 3. Visual Theme (Pure White Clay)
- Update `globals.css` / `clay-tokens.css`:
  - Background: `#ffffff`.
  - Shadows: Adjust to be visible on white (soft but defined).
  - Accents: Red (Gov), Blue (Biz), Green (Work) - Ensure they pop but fit the style.

## Output
- Polished UI matching user requirements.
- Responsive layout.
- Updated visual assets.
