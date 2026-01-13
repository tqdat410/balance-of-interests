# Code Standards

## Project Conventions

### File Organization

```
app/
├── api/                    # API route handlers
│   └── [endpoint]/
│       └── route.ts        # HTTP method handlers
├── components/             # React components
│   └── ComponentName.tsx   # PascalCase naming
├── [page]/
│   └── page.tsx           # Page components
├── globals.css            # Global styles
└── layout.tsx             # Root layout

lib/
└── utilityName.ts         # camelCase utility modules

public/
├── animation/             # Game images
├── font/                  # Custom fonts
└── sound/                 # Audio files
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `GameStatusBars.tsx` |
| Hooks | camelCase with use prefix | `useGameState` |
| Utilities | camelCase | `gameVerification.ts` |
| Types | PascalCase | `GameAction`, `Entity` |
| Constants | SCREAMING_SNAKE | `INITIAL_BARS`, `ENTITIES` |
| Variables | camelCase | `currentEntity`, `turnOrder` |
| API routes | kebab-case | `/api/submit-score` |

### TypeScript Standards

**Type Definitions:**
```typescript
// Use type for simple unions/aliases
type Entity = "Government" | "Businesses" | "Workers";
type GameState = "menu" | "playing" | "gameOver" | "victory";

// Use interface for object shapes
interface GameAction {
  name: string;
  imageUrl: string;
  effects: ActionEffect;
}

// Use Record for consistent key-value mappings
type ActionEffect = Record<Entity, number>;
type Bars = Record<Entity, number>;
type ActionPool = Record<Entity, GameAction[]>;
```

**Explicit Return Types on Functions:**
```typescript
// API handlers
export async function POST(request: NextRequest): Promise<NextResponse> { }

// Utility functions
export async function generateGameHash(data: HashData): Promise<string> { }
export function validateTimestamp(ts: number): { valid: boolean; reason?: string } { }
```

### React Patterns

**Component Structure:**
```typescript
"use client";  // Client components when needed

import React, { useState, useEffect, useMemo } from "react";
import ComponentA from "./components/ComponentA";

// Types at top
interface Props {
  propA: string;
  onAction: () => void;
}

// Component
export default function ComponentName({ propA, onAction }: Props) {
  // State declarations
  const [state, setState] = useState<Type>(initialValue);

  // Effects
  useEffect(() => { }, [dependencies]);

  // Memoized values
  const computed = useMemo(() => { }, [dependencies]);

  // Handlers
  const handleAction = () => { };

  // Render
  return <div>...</div>;
}
```

**Event Communication:**
```typescript
// Dispatch custom events for component communication
window.dispatchEvent(new CustomEvent("eventName", {
  detail: { key: value }
}));

// Listen for events
useEffect(() => {
  const handler = (e: CustomEvent) => { };
  window.addEventListener("eventName", handler as EventListener);
  return () => window.removeEventListener("eventName", handler as EventListener);
}, []);
```

### API Route Standards

**Edge Runtime:**
```typescript
import { NextRequest, NextResponse } from "next/server";

// Enable Edge Runtime for all API routes
export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Validation
    if (!payload.required_field) {
      return NextResponse.json(
        { success: false, error: "Missing field" },
        { status: 400 }
      );
    }
    
    // Processing
    
    // Success response
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

**Response Format:**
```typescript
// Success
{ success: true, data: { ... } }
{ success: true, data: [...], pagination: { ... } }

// Error
{ success: false, error: "Error message" }
```

### Styling Standards

**Tailwind Classes:**
```tsx
// Responsive breakpoints
<div className="md:block hidden">    {/* Desktop only */}
<div className="md:hidden block">    {/* Mobile only */}

// Color scheme
className="text-red-500"      // Government
className="text-blue-500"     // Business
className="text-green-500"    // Worker
className="text-amber-500"    // Accent

// Common patterns
className="glass3d-card"      // Glass morphism card
className="animate-fadeIn"    // Fade animation
className="animate-actionPulse" // Action feedback
```

**Custom CSS Classes (globals.css):**
```css
/* Glass morphism styling */
.glass3d-card { ... }
.glass3d-positive { ... }
.glass3d-negative { ... }

/* Animations */
@keyframes fadeIn { ... }
@keyframes actionPulse { ... }
@keyframes jello-vertical { ... }

/* Mobile-specific */
.mobile-game-container { ... }
.mobile-status { ... }
```

### State Management Patterns

**Local State with useState:**
```typescript
// Simple values
const [round, setRound] = useState<number>(1);

// Objects with spread
const [bars, setBars] = useState<Bars>({ ...INITIAL_BARS });

// Update with callback for derived state
setBars(prev => ({
  ...prev,
  [entity]: Math.max(0, Math.min(50, prev[entity] + effect))
}));
```

**Refs for Non-Reactive Values:**
```typescript
// Prevent duplicate API calls
const submitScoreRef = React.useRef(false);

if (submitScoreRef.current) return;
submitScoreRef.current = true;
```

### Error Handling

**API Routes:**
```typescript
// Specific error responses
if (!payload.field) {
  return NextResponse.json(
    { success: false, error: "Missing required fields" },
    { status: 400 }
  );
}

// Generic errors (hide details)
return NextResponse.json(
  { success: false, error: "Invalid request" },
  { status: 403 }
);
```

**Client Side:**
```typescript
try {
  const response = await fetch("/api/endpoint", { ... });
  const result = await response.json();
  
  if (!response.ok || !result.success) {
    throw new Error(result.error || "Request failed");
  }
} catch (error) {
  // Silent fail for non-critical (score submission)
  // Or show user feedback for critical
}
```

### Security Standards

**Never Expose:**
- Database credentials in client code
- API secrets in client code
- Detailed error messages to client

**Always Validate:**
- All API inputs
- Game logic consistency
- Timestamp freshness
- Hash verification

**Hash Verification Pattern:**
```typescript
// Client generates hash
const hash = await crypto.subtle.digest("SHA-256", dataBuffer);

// Server regenerates and compares
const expectedHash = await generateGameHash({ ...data, token });
return expectedHash === providedHash;
```

### Documentation Standards

**JSDoc for Functions:**
```typescript
/**
 * Generate session-specific token for anti-cheat verification
 * @param sessionId - Unique game session identifier
 * @param secret - Server secret (from env)
 * @returns 32-character token string
 */
export async function generateSessionToken(
  sessionId: string,
  secret: string
): Promise<string> { }
```

**Inline Comments for Complex Logic:**
```typescript
// Apply round-based difficulty modifiers
if (round >= 11 && round <= 20) {
  // Reduce effects by 1 for rounds 11-20
  modifiedEffects[entity] -= 1;
}
```

## Anti-Patterns to Avoid

| Avoid | Prefer |
|-------|--------|
| Magic numbers | Named constants (`INITIAL_BARS`) |
| Large files (>500 LOC) | Extract to custom hooks/components |
| `any` type | Proper type definitions |
| Nested ternaries | Early returns or switch |
| Direct DOM manipulation | React state/refs |
| Inline styles | Tailwind classes |
| `console.log` in production | Silent fails or proper logging |
