# Phase 2: UI Components

**Status:** Completed
**Completed:** 260115
**Estimated Effort:** Medium
**Depends On:** Phase 1

---

## Objective

Add reroll button UI and update EventPopup for new Accept/Skip flow.

---

## Tasks

### Task 2.1: Add Reroll Button to GameActionButtons

**File:** `app/components/GameActionButtons.tsx`

Update Props interface:

```typescript
interface Props {
  actions: GameAction[];
  handleAction: (action: GameAction) => void;
  eventMessage: string | null;
  entity: Entity;
  onActionComplete?: () => void;
  round?: number;
  // NEW
  rerollCount?: number;
  onReroll?: () => void;
  canReroll?: boolean;
}
```

Add reroll button above or beside action cards:

```tsx
{/* Reroll Button - Show only when there are actions */}
{actions.length > 0 && (
  <button
    onClick={onReroll}
    disabled={!canReroll || clickedAction !== null}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-2xl
      font-bold text-sm transition-all duration-200
      ${canReroll && !clickedAction
        ? "bg-amber-100 text-amber-700 hover:bg-amber-200 hover:scale-105 active:scale-95"
        : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
      }
    `}
    style={{
      boxShadow: canReroll 
        ? "4px 4px 12px rgba(245,158,11,0.2), -2px -2px 8px rgba(255,255,255,0.9)"
        : "none",
      border: "1px solid rgba(255,255,255,0.8)"
    }}
  >
    <span className="text-lg">🎲</span>
    <span>Doi bai</span>
    <span className={`
      px-2 py-0.5 rounded-full text-xs font-black
      ${canReroll ? "bg-amber-500 text-white" : "bg-gray-300 text-gray-500"}
    `}>
      {rerollCount}
    </span>
  </button>
)}
```

Position: Add as first element in `action-buttons-container`, or create separate row above cards.

---

### Task 2.2: Update GamePlayArea or page.tsx

**File:** Where `GameActionButtons` is rendered (likely `app/page.tsx` or `GamePlayArea.tsx`)

Pass new props:

```tsx
<GameActionButtons
  actions={availableActions}
  handleAction={handleAction}
  eventMessage={eventMessage}
  entity={currentEntity}
  onActionComplete={handleActionComplete}
  round={round}
  // NEW
  rerollCount={rerollCount}
  onReroll={handleReroll}
  canReroll={canReroll}
/>
```

---

### Task 2.3: Update EventPopup Props

**File:** `app/components/EventPopup.tsx`

Update interface:

```typescript
interface EventData {
  name: string;
  imageUrl?: string;
  effects?: Record<string, number>;
  positiveEffects?: Record<string, number>;
  negativeEffects?: Record<string, number>;
  isSpecialEvent?: boolean;
  entity?: string;
  // NEW
  rerollReward?: boolean;
  isSkippable?: boolean;
}

interface Props {
  event: EventData;
  onContinue: () => void;
  onExecute?: () => void;
  onSkip?: () => void;
  onAccept?: () => void;  // NEW: For skippable events (10, 20, 30)
  round?: number;
}
```

---

### Task 2.4: Update EventPopup Button Logic

**File:** `app/components/EventPopup.tsx`

Modify button rendering logic:

```tsx
{/* Right: Buttons */}
<div className="flex gap-3 flex-shrink-0">
  {isSpecial ? (
    // Special events (5, 15, 25): Execute/Skip
    <>
      <button onClick={onSkip || onContinue} className="...">
        Bo qua
      </button>
      <button onClick={onExecute || onContinue} className="...">
        Thuc hien
        {event.rerollReward && (
          <span className="ml-1 text-xs opacity-80">+1 🎲</span>
        )}
      </button>
    </>
  ) : event.isSkippable ? (
    // Skippable events (10, 20, 30): Accept/Skip
    <>
      <button
        onClick={onSkip}
        className="py-2.5 px-6 rounded-2xl font-bold text-sm text-slate-600 transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          background: "rgba(241, 245, 249, 0.9)",
          boxShadow: "4px 4px 12px rgba(0,0,0,0.1), -2px -2px 8px rgba(255,255,255,0.9)",
          border: "1px solid rgba(255,255,255,0.8)"
        }}
      >
        Bo qua
      </button>
      <button
        onClick={onAccept}
        className="py-2.5 px-8 rounded-2xl font-bold text-sm text-white transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          boxShadow: "4px 4px 12px rgba(245,158,11,0.35), -2px -2px 8px rgba(255,255,255,0.15)",
        }}
      >
        Chap nhan!
        {event.rerollReward && (
          <span className="ml-1 text-xs opacity-80">+1 🎲</span>
        )}
      </button>
    </>
  ) : (
    // Auto-apply events (fallback, shouldn't happen with new config)
    <button onClick={onContinue} className="...">
      Chap nhan!
    </button>
  )}
</div>
```

---

### Task 2.5: Update Event Rendering in page.tsx

**File:** `app/page.tsx` (or wherever EventPopup is rendered)

Pass new handler:

```tsx
{showEventPopup && currentEvent && (
  <EventPopup
    event={currentEvent}
    onContinue={handleEventContinue}
    onExecute={handleEventExecute}
    onSkip={handleEventSkip}
    onAccept={handleEventAccept}  // NEW
    round={round}
  />
)}
```

---

### Task 2.6: Optional - Reroll Animation

**File:** `app/globals.css` (or appropriate CSS file)

Add subtle animation for reroll feedback:

```css
@keyframes rerollShuffle {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  25% { transform: translateX(-5px) rotate(-3deg); }
  75% { transform: translateX(5px) rotate(3deg); }
}

.animate-rerollShuffle {
  animation: rerollShuffle 0.4s ease-in-out;
}
```

Apply to action cards container when reroll is triggered (via state or custom event listener).

---

## Verification Checklist

- [x] Reroll button visible during action selection
- [x] Button shows current reroll count
- [x] Button disabled when count = 0 or during turn processing
- [x] Clicking reroll shuffles cards (visual change)
- [x] EventPopup shows "Bo qua" / "Chap nhan!" for events 10, 20, 30
- [x] EventPopup shows "+1 reroll" indicator on relevant buttons
- [x] Accept on skippable events applies effects AND grants reroll
- [x] Skip on skippable events does nothing (no effects, no reroll)
- [x] No visual regressions on existing UI
- [x] Responsive design maintained

---

## Testing Scenarios

| Scenario | Expected Result |
|----------|-----------------|
| Game start | Reroll count = 1 |
| Click reroll with count > 0 | Cards shuffle, count decrements |
| Click reroll with count = 0 | Button disabled, nothing happens |
| Round 5: Execute | +1 reroll granted |
| Round 5: Skip | No reroll granted |
| Round 10: Accept | Effects applied, +1 reroll |
| Round 10: Skip | No effects, no reroll |
| Multiple rerolls accumulated | Count increments correctly, no cap |
