# Code Standards

> **Last Updated:** 2026-01-15  
> **Framework:** Next.js 16, React 19, TypeScript

## Table of Contents

- [TypeScript Conventions](#typescript-conventions)
- [React Patterns](#react-patterns)
- [CSS & Styling Guidelines](#css--styling-guidelines)
- [Import Organization](#import-organization)
- [Naming Conventions](#naming-conventions)
- [File Organization](#file-organization)
- [Error Handling](#error-handling)

---

## TypeScript Conventions

### Type Definitions

```typescript
// ✅ Use interfaces for object shapes
interface GameState {
  currentRound: number;
  phase: EntityType;
}

// ✅ Use type aliases for unions/primitives
type EntityType = 'gov' | 'bus' | 'wor';
type Ending = 'HARMONY' | 'SURVIVAL' | 'FAILED';

// ✅ Export types from index.ts barrels
export type { GameState, EntityType } from './game';
```

### Type Safety

| Pattern | Usage |
|---------|-------|
| Strict mode | Enabled in tsconfig.json |
| No implicit any | Enforced (with known exceptions) |
| Null checks | Use optional chaining `?.` |
| Type guards | For runtime type narrowing |

### Known Type Issues

```typescript
// StatusLineChart.tsx - ClayDot props uses `any`
// TODO: Define proper ClayDot interface
const ClayDot = (props: any) => { ... }
```

### Generics

```typescript
// API response wrapper
interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Hook with generic state
function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void]
```

---

## React Patterns

### Component Structure

```typescript
// Component file structure
'use client';  // Client component directive (if needed)

import { ... } from 'react';
import { ... } from './local';

interface Props {
  // Props interface
}

export function ComponentName({ prop1, prop2 }: Props) {
  // 1. Hooks
  const [state, setState] = useState();
  
  // 2. Derived values
  const computed = useMemo(() => ..., [deps]);
  
  // 3. Effects
  useEffect(() => { ... }, [deps]);
  
  // 4. Handlers
  const handleClick = () => { ... };
  
  // 5. Render
  return <div>...</div>;
}
```

### Hook Patterns

```typescript
// ✅ Single custom hook for complex state
export function useGameState() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // All game logic encapsulated
  return { ...state, actions };
}

// ✅ Memoized callbacks
const handleAction = useCallback((action: Action) => {
  // ...
}, [dependencies]);

// ✅ Memoized expensive computations
const availableActions = useMemo(() => {
  return actions.filter(a => a.entity === phase);
}, [actions, phase]);
```

### Dynamic Imports

```typescript
// Code splitting for heavy components
const StatusLineChart = dynamic(
  () => import('./StatusLineChart'),
  { 
    loading: () => <LoadingPlaceholder />,
    ssr: false  // Client-only for Recharts
  }
);
```

### State Management

| Pattern | When to Use |
|---------|-------------|
| useState | Simple local state |
| useReducer | Complex state with multiple actions |
| Custom hook | Shared logic across components |
| Context | Rare - only for truly global state |

### Event Handlers

```typescript
// ✅ Inline for simple cases
<button onClick={() => setOpen(true)}>Open</button>

// ✅ Named handler for complex logic
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  await submitScore(data);
};
<form onSubmit={handleSubmit}>
```

---

## CSS & Styling Guidelines

### Design System: Claymorphism

The project uses a custom Claymorphism design system.

**Design Tokens** (`lib/styles/clay-tokens.css`):

```css
:root {
  /* Colors */
  --clay-bg: #f0e6d3;
  --clay-surface: #fff8e7;
  --clay-gov: #ef4444;
  --clay-bus: #3b82f6;
  --clay-wor: #22c55e;
  
  /* Shadows */
  --clay-shadow-sm: 4px 4px 8px rgba(0,0,0,0.1);
  --clay-shadow-md: 8px 8px 16px rgba(0,0,0,0.15);
  
  /* Border radius */
  --clay-radius-sm: 12px;
  --clay-radius-md: 20px;
  --clay-radius-lg: 32px;
}
```

### Tailwind Usage

```tsx
// ✅ Utility-first approach
<div className="flex items-center gap-4 p-6 rounded-clay-md bg-clay-surface">

// ✅ Responsive variants
<div className="text-sm md:text-base lg:text-lg">

// ✅ State variants
<button className="hover:scale-105 active:scale-95 transition-transform">
```

### Animation Classes

30+ custom animations in `globals.css`:

| Animation | Duration | Usage |
|-----------|----------|-------|
| `animate-fade-in` | 300ms | Element entry |
| `animate-slide-up` | 400ms | Modal entry |
| `animate-pulse-soft` | 2s | Attention indicator |
| `animate-bounce-soft` | 1s | Interactive elements |
| `animate-shake` | 500ms | Error feedback |

```css
/* Animation example */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 300ms ease-out forwards;
}
```

### Component Classes

```css
/* Claymorphism card */
.clay-card {
  background: var(--clay-surface);
  border-radius: var(--clay-radius-md);
  box-shadow: var(--clay-shadow-md);
  border: 2px solid rgba(0,0,0,0.05);
}

/* Glass morphism overlay */
.glass-overlay {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |

---

## Import Organization

### Order

```typescript
// 1. React/Next.js imports
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// 2. External libraries
import { LineChart, Line } from 'recharts';

// 3. Internal absolute imports
import { useGameState } from '@/lib/hooks/useGameState';
import { GAME_CONFIG } from '@/lib/config';
import type { GameState, Action } from '@/lib/types';

// 4. Relative imports
import { GameActionButtons } from './GameActionButtons';

// 5. Styles (if any)
import styles from './Component.module.css';
```

### Path Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

```typescript
// ✅ Use aliases for lib imports
import { useGameState } from '@/lib/hooks/useGameState';

// ✅ Use relative for co-located files
import { SubComponent } from './SubComponent';
```

### Barrel Exports

```typescript
// lib/types/index.ts
export * from './game';
export * from './database';

// lib/config/index.ts
export { GAME_CONFIG } from './game';
export { GOV_ACTIONS, BUS_ACTIONS, WOR_ACTIONS } from './actions';
export { EVENTS } from './events';
```

---

## Naming Conventions

### Files & Directories

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `GameActionButtons.tsx` |
| Hooks | camelCase with use prefix | `useGameState.ts` |
| Utilities | camelCase | `gameVerification.ts` |
| Config | camelCase | `actions.ts` |
| Types | camelCase | `game.ts` |
| API routes | kebab-case dirs | `api/submit-score/route.ts` |

### Code Identifiers

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `GamePlayArea` |
| Functions | camelCase | `handleAction` |
| Variables | camelCase | `currentRound` |
| Constants | SCREAMING_SNAKE | `MAX_ROUNDS` |
| Types/Interfaces | PascalCase | `GameState` |
| Enums | PascalCase | `EntityType` |

### Props Naming

```typescript
// ✅ Descriptive boolean props
interface Props {
  isOpen: boolean;      // State
  canSubmit: boolean;   // Capability
  hasError: boolean;    // Existence
}

// ✅ Event handler props
interface Props {
  onClick: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
}
```

---

## File Organization

### Component Files

```
app/components/
├── GameActionButtons.tsx     # Single component
├── GamePlayArea.tsx          # Container component
├── StatusLineChart.tsx       # Chart component
└── index.ts                  # Barrel export (optional)
```

### Feature Organization

```
lib/
├── config/                   # Static configuration
│   ├── actions.ts
│   ├── events.ts
│   ├── game.ts
│   └── index.ts
├── hooks/                    # Custom hooks
│   └── useGameState.ts
├── types/                    # Type definitions
│   ├── game.ts
│   ├── database.ts
│   └── index.ts
└── supabase/                 # Database client
    └── api.ts
```

---

## Error Handling

### API Routes

```typescript
// api/submit-score/route.ts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validation
    if (!body.signature) {
      return Response.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }
    
    // HMAC verification
    const isValid = verifySignature(body);
    if (!isValid) {
      return Response.json(
        { error: 'Invalid signature' },
        { status: 403 }
      );
    }
    
    // Success
    return Response.json({ success: true });
    
  } catch (error) {
    console.error('Submit error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Client Components

```typescript
// ✅ Async error handling
const handleSubmit = async () => {
  try {
    setLoading(true);
    await submitScore(gameData);
    setSuccess(true);
  } catch (error) {
    console.error('Submission failed:', error);
    setError('Failed to submit score');
  } finally {
    setLoading(false);
  }
};
```

### Known Gaps

| Issue | Status |
|-------|--------|
| No React Error Boundaries | TODO |
| Limited error UI feedback | Basic alerts only |
| No Sentry/error tracking | Not implemented |
