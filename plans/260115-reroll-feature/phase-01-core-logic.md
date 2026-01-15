# Phase 1: Core Logic & State

**Status:** Completed (260115)
**Estimated Effort:** Medium

---

## Objective

Implement reroll state management and event handling logic.

---

## Tasks

### Task 1.1: Update GameEvent Type

**File:** `lib/types/game.ts`

Add optional properties to `GameEvent` interface:

```typescript
export interface GameEvent {
  name: string;
  imageUrl?: string;
  effects?: ActionEffect;
  positiveEffects?: ActionEffect;
  negativeEffects?: ActionEffect;
  isSpecialEvent?: boolean;
  entity?: Entity;
  // NEW
  rerollReward?: boolean;    // If true, grants +1 reroll on Execute/Accept
  isSkippable?: boolean;     // If true, shows Accept/Skip buttons instead of auto-continue
}
```

---

### Task 1.2: Update Events Config

**File:** `lib/config/events.ts`

Add flags to all 6 events:

```typescript
5: {
  // ... existing
  rerollReward: true,  // Execute = +1 reroll
},
10: {
  // ... existing
  isSkippable: true,   // Enable Accept/Skip choice
  rerollReward: true,  // Accept = +1 reroll
},
15: {
  // ... existing
  rerollReward: true,
},
20: {
  // ... existing
  isSkippable: true,
  rerollReward: true,
},
25: {
  // ... existing
  rerollReward: true,
},
30: {
  // ... existing
  isSkippable: true,
  rerollReward: true,
},
```

---

### Task 1.3: Add Reroll State

**File:** `lib/hooks/useGameState.ts`

Add new state variables:

```typescript
const [rerollCount, setRerollCount] = useState<number>(1);  // Start with 1
const [rerollTrigger, setRerollTrigger] = useState<number>(0);  // Force useMemo recompute
```

Reset in `startGame()`:

```typescript
setRerollCount(1);
setRerollTrigger(0);
```

---

### Task 1.4: Update availableActions useMemo

**File:** `lib/hooks/useGameState.ts`

Add `rerollTrigger` to dependencies:

```typescript
const availableActions: GameAction[] = useMemo(() => {
  if (!currentEntity) return [];
  const actions = ACTIONS[currentEntity];
  const shuffled = actions.slice().sort(() => Math.random() - 0.5);
  if (round >= 21) {
    return shuffled.slice(0, Math.min(2, shuffled.length));
  }
  return shuffled.slice(0, Math.min(3, shuffled.length));
}, [currentEntity, round, rerollTrigger]);  // ADD rerollTrigger
```

---

### Task 1.5: Implement handleReroll

**File:** `lib/hooks/useGameState.ts`

```typescript
const handleReroll = useCallback(() => {
  if (rerollCount <= 0 || isProcessingTurn) return;
  
  setRerollCount(prev => prev - 1);
  setRerollTrigger(prev => prev + 1);  // Force useMemo to recompute
  
  // Optional: dispatch event for UI feedback
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("gameReroll", { detail: { remaining: rerollCount - 1 } })
    );
  }
}, [rerollCount, isProcessingTurn]);
```

---

### Task 1.6: Update handleEventExecute

**File:** `lib/hooks/useGameState.ts`

Add reroll reward after executing special event:

```typescript
const handleEventExecute = () => {
  if (currentEvent && currentEvent.isSpecialEvent) {
    const isSuccess = Math.random() < 0.1;
    const effects = isSuccess
      ? currentEvent.positiveEffects
      : currentEvent.negativeEffects;

    if (effects) {
      applyEffects(
        effects,
        `Co hoi ${currentEvent.name}: ${isSuccess ? "Thanh cong!" : "That bai!"}`,
        currentEvent.entity || "Event"
      );
    }
    setTotalActions((prev) => prev + 1);
    
    // NEW: Grant reroll if event has rerollReward
    if (currentEvent.rerollReward) {
      setRerollCount(prev => prev + 1);
    }
  }
  setShowEventPopup(false);
  setCurrentEvent(null);
};
```

---

### Task 1.7: Add handleEventAccept (for skippable events)

**File:** `lib/hooks/useGameState.ts`

New handler for events 10, 20, 30:

```typescript
const handleEventAccept = () => {
  if (currentEvent && currentEvent.effects) {
    applyEffects(
      currentEvent.effects,
      `Su kien: ${currentEvent.name}`,
      "Event"
    );
  }
  
  // Grant reroll if event has rerollReward
  if (currentEvent?.rerollReward) {
    setRerollCount(prev => prev + 1);
  }
  
  setShowEventPopup(false);
  setCurrentEvent(null);
};
```

---

### Task 1.8: Update handleEventSkip

**File:** `lib/hooks/useGameState.ts`

Ensure skip does NOT grant reroll (already correct, just confirm):

```typescript
const handleEventSkip = () => {
  // No effects applied, no reroll granted
  setShowEventPopup(false);
  setCurrentEvent(null);
};
```

---

### Task 1.9: Export New State & Handlers

**File:** `lib/hooks/useGameState.ts`

Add to return object:

```typescript
return {
  // ... existing
  rerollCount,
  handleReroll,
  handleEventAccept,  // NEW
  canReroll: rerollCount > 0 && !isProcessingTurn,  // Computed helper
};
```

---

## Verification Checklist

- [x] `GameEvent` type updated with new optional fields
- [x] All 6 events have appropriate flags
- [x] `rerollCount` initializes to 1 on game start
- [x] `availableActions` recomputes when `rerollTrigger` changes
- [x] `handleReroll` decrements count and triggers recompute
- [x] Special events (5, 15, 25) grant reroll on Execute
- [x] Skippable events (10, 20, 30) grant reroll on Accept, not Skip
- [x] All new handlers exported from hook
- [x] No TypeScript errors

---

## Dependencies

- None (this is the foundation phase)

## Blocks

- Phase 2 (UI) depends on this phase completing first
