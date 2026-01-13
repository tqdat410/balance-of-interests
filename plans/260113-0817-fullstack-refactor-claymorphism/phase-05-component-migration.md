# Phase 5: Component UI Migration

## Context
- [Plan Overview](./plan.md)
- [Phase 4: Claymorphism Design System](./phase-04-claymorphism-ui.md)
- CWD: C:\Users\Admin\Documents\FPT\MLN122\game\balance

## Overview

| Priority | Status | Effort |
|----------|--------|--------|
| P2 | Pending | 4h |

Apply Claymorphism styles to all existing React components.

## Component Migration Map

| Component | Current Style | New Style | Priority |
|-----------|---------------|-----------|----------|
| GameStatusBars | glass3d with rgba() | clay-status-bar | High |
| GameActionButtons | glass3d-n/d/l | clay-action-card + clay-gov/biz/work | High |
| EventPopup | glass3d-box | clay-modal | High |
| GameHistory | bg-*-500/50 | clay-card with entity colors | Medium |
| GameIllustration | Basic layout | Clay container | Low |
| FAQPopup | Basic white box | clay-card | Low |
| Menu Screen | game-button | clay-button | High |
| Leaderboard Page | Basic table | clay-card + clay-table | Medium |

## Migration Steps

### 1. GameStatusBars.tsx

**Current:**
```tsx
<div className="bg-gray-200 rounded-lg h-full">
  <div className={`${getBarColor(value)} rounded-lg`} style={{ height: `${percentage}%` }} />
</div>
```

**After:**
```tsx
<div className="clay-status-bar h-full">
  <div 
    className={`clay-status-bar-fill ${entityClass}`} 
    style={{ height: `${percentage}%` }} 
  />
</div>
```

**Changes:**
- Replace bg-gray-200 → clay-status-bar
- Replace dynamic color classes → clay-status-bar-fill + entity modifier
- Add entity class mapping: Government→gov, Businesses→biz, Workers→work

### 2. GameActionButtons.tsx

**Current:**
```tsx
<button className={`action-button ${glassClass} rounded-3xl p-4`}>
  <div className="image-container">...</div>
  <div className="action-name">...</div>
  <div className="effects">...</div>
</button>
```

**After:**
```tsx
<button className={`clay-action-card ${entityClayClass}`}>
  <div className="clay-image-container">...</div>
  <div className="clay-action-name">...</div>
  <div className="clay-effects">...</div>
</button>
```

**Changes:**
- Replace glass3d-n/d/l → clay-gov/biz/work
- Update hover/active states to clay-button behavior
- Add clay styling to internal elements

### 3. EventPopup.tsx

**Current:**
```tsx
<div className="fixed inset-0 bg-black/50 z-50">
  <div className="glass3d-box rounded-3xl p-8">
    ...
  </div>
</div>
```

**After:**
```tsx
<div className="clay-modal-overlay fixed inset-0 z-50">
  <div className="clay-modal">
    ...
    <button className="clay-button">Chấp nhận</button>
    <button className="clay-button-secondary">Bỏ qua</button>
  </div>
</div>
```

**Changes:**
- Replace bg-black/50 → clay-modal-overlay
- Replace glass3d-box → clay-modal
- Update buttons to clay-button variants

### 4. GameHistory.tsx

**Current:**
```tsx
<div className="bg-white/90 rounded-xl p-4">
  {entries.map(entry => (
    <div className={`${entityBgClass} rounded-lg p-2`}>
      ...
    </div>
  ))}
</div>
```

**After:**
```tsx
<div className="clay-card max-h-[400px] overflow-y-auto">
  {entries.map(entry => (
    <div className={`clay-history-entry ${entityClayClass}`}>
      ...
    </div>
  ))}
</div>
```

**New CSS:**
```css
.clay-history-entry {
  border-radius: var(--radius-md);
  padding: 12px 16px;
  margin-bottom: 8px;
  box-shadow: 
    inset 0 -2px 6px rgba(0, 0, 0, 0.05),
    inset 0 2px 6px rgba(255, 255, 255, 0.3);
}

.clay-history-entry.gov {
  background: linear-gradient(145deg, rgba(255, 112, 112, 0.3), rgba(255, 77, 77, 0.2));
  border-left: 4px solid var(--clay-gov-primary);
}

.clay-history-entry.biz {
  background: linear-gradient(145deg, rgba(112, 153, 255, 0.3), rgba(77, 124, 255, 0.2));
  border-left: 4px solid var(--clay-biz-primary);
}

.clay-history-entry.work {
  background: linear-gradient(145deg, rgba(112, 224, 138, 0.3), rgba(77, 204, 109, 0.2));
  border-left: 4px solid var(--clay-work-primary);
}
```

### 5. Menu Screen (page.tsx)

**Current:**
```tsx
<button className="game-button">BẮT ĐẦU</button>
<input className="bg-white rounded-lg px-4 py-3" />
```

**After:**
```tsx
<button className="clay-button text-2xl">BẮT ĐẦU</button>
<input className="clay-input text-xl" />
```

### 6. Leaderboard Page

**Current:**
```tsx
<div className="bg-white rounded-xl shadow-lg p-6">
  <table className="w-full">
    ...
  </table>
</div>
```

**After:**
```tsx
<div className="clay-card p-8">
  <table className="clay-table w-full">
    ...
  </table>
</div>
```

**New CSS:**
```css
.clay-table {
  border-collapse: separate;
  border-spacing: 0 8px;
}

.clay-table th {
  color: var(--clay-text-secondary);
  font-weight: 600;
  padding: 12px 16px;
  text-align: left;
}

.clay-table td {
  padding: 16px;
  background: linear-gradient(145deg, var(--clay-surface) 0%, var(--clay-bg-secondary) 100%);
}

.clay-table tr td:first-child {
  border-radius: var(--radius-md) 0 0 var(--radius-md);
}

.clay-table tr td:last-child {
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.clay-table tr {
  box-shadow: 
    -4px -4px 8px var(--shadow-light),
    4px 4px 8px var(--shadow-dark);
}
```

## Files to Modify

| File | Changes |
|------|---------|
| `app/components/GameStatusBars.tsx` | Replace classes, add entity mapping |
| `app/components/GameActionButtons.tsx` | Replace glass3d with clay classes |
| `app/components/EventPopup.tsx` | Update modal and button styles |
| `app/components/GameHistory.tsx` | Apply clay-card and entry styles |
| `app/components/GameIllustration.tsx` | Minor container adjustments |
| `app/components/AudioManager.tsx` | Update control panel styles |
| `app/page.tsx` | Update menu/ending screen styles |
| `app/leaderboard/page.tsx` | Update table and card styles |

## Entity Class Mapping Helper

```typescript
// lib/utils/clay-classes.ts
import type { Entity } from '@/lib/config/game';

export function getEntityClayClass(entity: Entity): string {
  const mapping: Record<Entity, string> = {
    Government: 'clay-gov',
    Businesses: 'clay-biz',
    Workers: 'clay-work',
  };
  return mapping[entity];
}

export function getEntityShortClayClass(entity: Entity): string {
  const mapping: Record<Entity, string> = {
    Government: 'gov',
    Businesses: 'biz',
    Workers: 'work',
  };
  return mapping[entity];
}
```

## Todo List

- [ ] Create lib/utils/clay-classes.ts utility
- [ ] Update GameStatusBars.tsx with clay styles
- [ ] Update GameActionButtons.tsx with clay styles
- [ ] Update EventPopup.tsx with clay modal
- [ ] Update GameHistory.tsx with clay entries
- [ ] Update GameIllustration.tsx container
- [ ] Update AudioManager.tsx control panel
- [ ] Update page.tsx menu and ending screens
- [ ] Update leaderboard/page.tsx
- [ ] Test all components on desktop
- [ ] Test all components on mobile
- [ ] Verify animations work correctly

## Success Criteria

- [ ] All components use clay-* classes
- [ ] No glass3d-* classes remain in codebase
- [ ] Entity colors are vibrant and consistent
- [ ] Depth effect visible on all interactive elements
- [ ] Mobile responsive layout preserved
- [ ] All animations still function

## Visual QA Checklist

| Screen | Desktop | Tablet | Mobile |
|--------|---------|--------|--------|
| Menu | ☐ | ☐ | ☐ |
| Playing | ☐ | ☐ | ☐ |
| Event Popup | ☐ | ☐ | ☐ |
| Game Over | ☐ | ☐ | ☐ |
| Victory | ☐ | ☐ | ☐ |
| Leaderboard | ☐ | ☐ | ☐ |

## Next Steps

→ [Phase 6: Testing & Validation](./phase-06-testing.md)
