# Phase 1: Update Background Color Token

## Objectives

- Change the `--clay-bg` variable to a "standard white Claymorphism" color.
- Remove decorative background blobs if they interfere with the "clean white" look (optional, but checking context).

## Tasks

### Implementation
1. **Update `lib/styles/clay-tokens.css`**:
   - Change `--clay-bg: #fdf6e3;` to `--clay-bg: #f0f4f8;` (Classic Claymorphism Background - Light Blue Grey) or purely `#ffffff` if they meant literal white, but Claymorphism needs contrast for white cards.
   - **Decision**: Use `#f0f4f8` (standard clay background) or `#fdfdfd`.
   - Actually, user said "màu trắng" (white).
   - If I make background #fff, cards (which are #fff or off-white) won't show shadows well unless they are darker.
   - Claymorphism usually has: Background #f0f0f3, Cards #f0f0f3 with shadows light/dark.
   - BUT our cards are `var(--clay-surface)` (#fefcf5).
   - Let's adjust `--clay-bg` to `#f0f2f5` (very light grey-blue, common in modern UI) or preserve a warm white if preferred.
   - I will try `#f5f5f7` (Apple-like white/grey).

2. **Clean up `app/page.tsx`**:
   - Check if any "decorative circles" (blur blobs) clash with the new white background. User just asked for background color, but often "clean white" implies removing noise. I'll keep them for now unless they look bad, or make them very subtle.

### Testing
1. Verify contrast between background and cards.
2. Verify shadow visibility.

### Code Review
1. Ensure global consistency.
