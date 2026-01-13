# Phase 4: Claymorphism Design System

## Context
- [Plan Overview](./plan.md)
- [Phase 3: FE Architecture](./phase-03-fe-architecture.md)
- CWD: C:\Users\Admin\Documents\FPT\MLN122\game\balance

## Overview

| Priority | Status | Effort |
|----------|--------|--------|
| P1 | Pending | 10h |

Implement Claymorphism design system replacing current Glassmorphism style with bold, playful, game-appropriate aesthetics.

## Claymorphism Fundamentals

### What is Claymorphism?
A 3D-like design trend featuring:
- **Soft, puffy shapes** with significant border-radius
- **Bold, layered shadows** creating depth illusion
- **Vibrant colors** with subtle gradients
- **Inner shadows** for pressed/clay-like effect
- **Playful, tactile feel** - like clay or soft rubber

### Key CSS Properties

```css
/* Core Claymorphism Pattern */
.clay-element {
  /* Rounded corners - essential */
  border-radius: 24px; /* or more */
  
  /* Layered external shadows for depth */
  box-shadow: 
    /* Light shadow (top-left highlight) */
    -8px -8px 20px rgba(255, 255, 255, 0.8),
    /* Dark shadow (bottom-right depth) */
    8px 8px 20px rgba(0, 0, 0, 0.15),
    /* Colored shadow for vibrancy */
    0 10px 30px rgba(currentColor, 0.3);
  
  /* Optional inner shadow for clay effect */
  box-shadow: 
    inset 0 -8px 20px rgba(0, 0, 0, 0.1),
    inset 0 8px 20px rgba(255, 255, 255, 0.3),
    8px 8px 20px rgba(0, 0, 0, 0.15);
  
  /* Gradient background for depth */
  background: linear-gradient(145deg, #colorLight 0%, #colorDark 100%);
}
```

## Design Tokens

### Color Palette - Bold Clay Style

```css
:root {
  /* Entity Colors - Vibrant */
  --clay-gov-primary: #FF4D4D;      /* Government - Bold Red */
  --clay-gov-light: #FF7070;
  --clay-gov-dark: #CC3D3D;
  --clay-gov-shadow: rgba(255, 77, 77, 0.4);
  
  --clay-biz-primary: #4D7CFF;      /* Business - Bold Blue */
  --clay-biz-light: #7099FF;
  --clay-biz-dark: #3D63CC;
  --clay-biz-shadow: rgba(77, 124, 255, 0.4);
  
  --clay-work-primary: #4DCC6D;     /* Workers - Bold Green */
  --clay-work-light: #70E08A;
  --clay-work-dark: #3DA357;
  --clay-work-shadow: rgba(77, 204, 109, 0.4);
  
  /* Accent Colors */
  --clay-accent: #FFB84D;           /* Amber/Gold */
  --clay-accent-light: #FFC870;
  --clay-accent-dark: #CC933D;
  
  --clay-purple: #9B59B6;           /* Secondary accent */
  --clay-purple-light: #B07CC5;
  --clay-purple-dark: #7C4792;
  
  /* Neutrals */
  --clay-bg-primary: #F5F0E8;       /* Warm cream background */
  --clay-bg-secondary: #EDE7DD;
  --clay-surface: #FFFDF9;
  
  --clay-text-primary: #2D3748;
  --clay-text-secondary: #4A5568;
  --clay-text-muted: #718096;
  
  /* Shadows */
  --shadow-light: rgba(255, 255, 255, 0.8);
  --shadow-dark: rgba(0, 0, 0, 0.12);
  --shadow-darker: rgba(0, 0, 0, 0.2);
}
```

### Typography

Keep existing `DFVN_Hogfish` font - it fits the playful theme.

### Border Radius Scale

```css
:root {
  --radius-sm: 12px;
  --radius-md: 20px;
  --radius-lg: 28px;
  --radius-xl: 36px;
  --radius-full: 9999px;
}
```

## Component Styles

### 1. Clay Card (Base Component)

```css
.clay-card {
  background: linear-gradient(145deg, var(--clay-surface) 0%, var(--clay-bg-secondary) 100%);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 
    -6px -6px 16px var(--shadow-light),
    6px 6px 16px var(--shadow-dark),
    inset 0 -4px 10px rgba(0, 0, 0, 0.05),
    inset 0 4px 10px rgba(255, 255, 255, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.6);
}
```

### 2. Clay Button

```css
.clay-button {
  background: linear-gradient(145deg, var(--clay-accent-light) 0%, var(--clay-accent) 100%);
  border-radius: var(--radius-full);
  padding: 16px 32px;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: none;
  box-shadow: 
    -4px -4px 12px var(--shadow-light),
    4px 4px 12px rgba(204, 147, 61, 0.4),
    0 6px 0 var(--clay-accent-dark);
  transition: all 0.15s ease;
}

.clay-button:hover {
  transform: translateY(-2px);
  box-shadow: 
    -4px -4px 12px var(--shadow-light),
    4px 4px 16px rgba(204, 147, 61, 0.5),
    0 8px 0 var(--clay-accent-dark);
}

.clay-button:active {
  transform: translateY(4px);
  box-shadow: 
    -2px -2px 8px var(--shadow-light),
    2px 2px 8px rgba(204, 147, 61, 0.3),
    0 2px 0 var(--clay-accent-dark);
}
```

### 3. Entity-Specific Clay Cards

```css
/* Government Card */
.clay-gov {
  background: linear-gradient(145deg, var(--clay-gov-light) 0%, var(--clay-gov-primary) 100%);
  box-shadow: 
    -6px -6px 16px rgba(255, 255, 255, 0.4),
    6px 6px 16px var(--clay-gov-shadow),
    inset 0 -4px 10px rgba(0, 0, 0, 0.15),
    inset 0 4px 10px rgba(255, 255, 255, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.4);
}

/* Business Card */
.clay-biz {
  background: linear-gradient(145deg, var(--clay-biz-light) 0%, var(--clay-biz-primary) 100%);
  box-shadow: 
    -6px -6px 16px rgba(255, 255, 255, 0.4),
    6px 6px 16px var(--clay-biz-shadow),
    inset 0 -4px 10px rgba(0, 0, 0, 0.15),
    inset 0 4px 10px rgba(255, 255, 255, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.4);
}

/* Workers Card */
.clay-work {
  background: linear-gradient(145deg, var(--clay-work-light) 0%, var(--clay-work-primary) 100%);
  box-shadow: 
    -6px -6px 16px rgba(255, 255, 255, 0.4),
    6px 6px 16px var(--clay-work-shadow),
    inset 0 -4px 10px rgba(0, 0, 0, 0.15),
    inset 0 4px 10px rgba(255, 255, 255, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.4);
}
```

### 4. Status Bar (Clay Style)

```css
.clay-status-bar {
  background: linear-gradient(180deg, #E0E0E0 0%, #C0C0C0 100%);
  border-radius: var(--radius-md);
  box-shadow: 
    inset 0 4px 8px rgba(0, 0, 0, 0.2),
    inset 0 -4px 8px rgba(255, 255, 255, 0.4);
  border: 3px solid rgba(255, 255, 255, 0.5);
  overflow: hidden;
}

.clay-status-bar-fill {
  border-radius: calc(var(--radius-md) - 4px);
  box-shadow: 
    inset 0 -4px 8px rgba(0, 0, 0, 0.15),
    inset 0 4px 8px rgba(255, 255, 255, 0.4);
  transition: width 0.5s ease-out;
}

.clay-status-bar-fill.gov {
  background: linear-gradient(180deg, var(--clay-gov-light) 0%, var(--clay-gov-primary) 100%);
}

.clay-status-bar-fill.biz {
  background: linear-gradient(180deg, var(--clay-biz-light) 0%, var(--clay-biz-primary) 100%);
}

.clay-status-bar-fill.work {
  background: linear-gradient(180deg, var(--clay-work-light) 0%, var(--clay-work-primary) 100%);
}
```

### 5. Action Card (Clay Style)

```css
.clay-action-card {
  background: linear-gradient(145deg, var(--clay-surface) 0%, var(--clay-bg-secondary) 100%);
  border-radius: var(--radius-lg);
  padding: 16px;
  box-shadow: 
    -4px -4px 12px var(--shadow-light),
    4px 4px 12px var(--shadow-dark);
  border: 3px solid rgba(255, 255, 255, 0.6);
  transition: all 0.2s ease;
}

.clay-action-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 
    -6px -6px 16px var(--shadow-light),
    6px 6px 20px var(--shadow-darker);
}

.clay-action-card:active {
  transform: translateY(2px) scale(0.98);
  box-shadow: 
    -2px -2px 8px var(--shadow-light),
    2px 2px 8px var(--shadow-dark),
    inset 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

### 6. Event Popup (Clay Modal)

```css
.clay-modal-overlay {
  background: rgba(45, 55, 72, 0.6);
  backdrop-filter: blur(8px);
}

.clay-modal {
  background: linear-gradient(145deg, var(--clay-surface) 0%, var(--clay-bg-primary) 100%);
  border-radius: var(--radius-xl);
  padding: 32px;
  box-shadow: 
    -8px -8px 24px var(--shadow-light),
    8px 8px 24px var(--shadow-darker),
    0 20px 40px rgba(0, 0, 0, 0.3);
  border: 4px solid rgba(255, 255, 255, 0.7);
}
```

### 7. Input Field (Clay Style)

```css
.clay-input {
  background: linear-gradient(180deg, var(--clay-bg-secondary) 0%, var(--clay-bg-primary) 100%);
  border-radius: var(--radius-full);
  padding: 16px 24px;
  font-size: 18px;
  box-shadow: 
    inset 3px 3px 8px rgba(0, 0, 0, 0.1),
    inset -3px -3px 8px rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.5);
  outline: none;
  transition: all 0.2s ease;
}

.clay-input:focus {
  border-color: var(--clay-accent);
  box-shadow: 
    inset 3px 3px 8px rgba(0, 0, 0, 0.1),
    inset -3px -3px 8px rgba(255, 255, 255, 0.8),
    0 0 0 4px rgba(255, 184, 77, 0.3);
}
```

## Tailwind CSS v4 Configuration

### Custom Plugin (tailwind.config.ts)

```typescript
import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        clay: {
          gov: {
            DEFAULT: '#FF4D4D',
            light: '#FF7070',
            dark: '#CC3D3D',
          },
          biz: {
            DEFAULT: '#4D7CFF',
            light: '#7099FF',
            dark: '#3D63CC',
          },
          work: {
            DEFAULT: '#4DCC6D',
            light: '#70E08A',
            dark: '#3DA357',
          },
          accent: {
            DEFAULT: '#FFB84D',
            light: '#FFC870',
            dark: '#CC933D',
          },
          bg: {
            primary: '#F5F0E8',
            secondary: '#EDE7DD',
          },
          surface: '#FFFDF9',
        },
      },
      borderRadius: {
        'clay-sm': '12px',
        'clay-md': '20px',
        'clay-lg': '28px',
        'clay-xl': '36px',
      },
      boxShadow: {
        'clay': '-6px -6px 16px rgba(255,255,255,0.8), 6px 6px 16px rgba(0,0,0,0.12)',
        'clay-lg': '-8px -8px 24px rgba(255,255,255,0.8), 8px 8px 24px rgba(0,0,0,0.15)',
        'clay-inset': 'inset 0 -4px 10px rgba(0,0,0,0.05), inset 0 4px 10px rgba(255,255,255,0.5)',
        'clay-pressed': 'inset 3px 3px 8px rgba(0,0,0,0.1), inset -3px -3px 8px rgba(255,255,255,0.8)',
      },
    },
  },
  plugins: [
    plugin(function({ addComponents }) {
      addComponents({
        '.clay-card': {
          background: 'linear-gradient(145deg, #FFFDF9 0%, #EDE7DD 100%)',
          borderRadius: '28px',
          padding: '24px',
          boxShadow: '-6px -6px 16px rgba(255,255,255,0.8), 6px 6px 16px rgba(0,0,0,0.12), inset 0 -4px 10px rgba(0,0,0,0.05), inset 0 4px 10px rgba(255,255,255,0.5)',
          border: '2px solid rgba(255,255,255,0.6)',
        },
        '.clay-button': {
          background: 'linear-gradient(145deg, #FFC870 0%, #FFB84D 100%)',
          borderRadius: '9999px',
          padding: '16px 32px',
          fontWeight: 'bold',
          color: 'white',
          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          border: 'none',
          boxShadow: '-4px -4px 12px rgba(255,255,255,0.8), 4px 4px 12px rgba(204,147,61,0.4), 0 6px 0 #CC933D',
          transition: 'all 0.15s ease',
        },
      });
    }),
  ],
};

export default config;
```

## Files to Create/Modify

### Files to Create

| File | Purpose |
|------|---------|
| `lib/styles/clay-tokens.css` | CSS custom properties |
| `lib/styles/clay-components.css` | Component classes |

### Files to Modify

| File | Change |
|------|--------|
| `app/globals.css` | Replace glass3d with clay classes |
| `tailwind.config.ts` | Add clay theme + plugin |

## Implementation Steps

### 1. Create CSS Token File

```css
/* lib/styles/clay-tokens.css */
@layer base {
  :root {
    /* All color tokens from above */
  }
}
```

### 2. Create Component Styles

```css
/* lib/styles/clay-components.css */
@layer components {
  /* All component styles from above */
}
```

### 3. Update globals.css

- Import new clay styles
- Remove old glass3d classes
- Keep animations (they still work with Claymorphism)

### 4. Update Background

```css
body {
  background: linear-gradient(135deg, #F5F0E8 0%, #EDE7DD 50%, #E5DFD5 100%);
  min-height: 100vh;
}
```

## Todo List

- [ ] Create lib/styles/clay-tokens.css with CSS custom properties
- [ ] Create lib/styles/clay-components.css with all component styles
- [ ] Create tailwind.config.ts with clay theme extension
- [ ] Update app/globals.css to import new styles
- [ ] Remove old glass3d-* classes from globals.css
- [ ] Update body background to warm cream gradient
- [ ] Test visual appearance
- [ ] Verify animations still work
- [ ] Check responsive breakpoints

## Success Criteria

- [ ] All glass3d classes replaced with clay equivalents
- [ ] Warm cream background with subtle gradient
- [ ] Bold, vibrant entity colors (red/blue/green)
- [ ] Visible depth effect on all interactive elements
- [ ] Smooth hover/active transitions
- [ ] No visual regressions on mobile

## Accessibility Considerations

| Element | Requirement |
|---------|-------------|
| Text on colored backgrounds | Minimum 4.5:1 contrast ratio |
| Interactive elements | Clear focus states |
| Buttons | Visible press feedback |
| Status bars | Color + value labels for colorblind users |

## Next Steps

→ [Phase 5: Component UI Migration](./phase-05-component-migration.md)
