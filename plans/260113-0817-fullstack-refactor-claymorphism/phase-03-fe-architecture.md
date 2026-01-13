# Phase 3: FE Architecture Refactor

## Context
- [Plan Overview](./plan.md)
- [Phase 2: Supabase Modernization](./phase-02-supabase-modernization.md)
- CWD: C:\Users\Admin\Documents\FPT\MLN122\game\balance

## Overview

| Priority | Status | Effort |
|----------|--------|--------|
| P1 | Pending | 8h |

Extract the monolithic 1289-line page.tsx into modular custom hooks and clean component composition.

## Current Issues

| Issue | Lines | Impact |
|-------|-------|--------|
| 20+ useState in single file | 400-550 | Hard to track state |
| Game logic mixed with UI | 600-900 | Difficult to test |
| Action definitions inline | 66-400 | 330+ lines of data |
| Event handlers scattered | 500-868 | Hard to follow flow |
| Magic numbers everywhere | Multiple | Unclear semantics |

## Target Architecture

```
page.tsx (orchestration only, <200 lines)
    │
    ├── useGameState() ────────── Rounds, bars, entities, turn order
    ├── useGameActions() ─────── Action handling, effects application
    ├── useGameEvents() ──────── Event system, popups
    ├── useGameSession() ─────── Session IDs, tokens, submission
    │
    └── Components (existing, unchanged in this phase)
        ├── GameStatusBars
        ├── GameActionButtons
        ├── GameHistory
        ├── EventPopup
        └── GameIllustration
```

## Requirements

### Functional
- Extract game logic into 4 custom hooks
- Move action/event definitions to config files
- Use constants from lib/config/game.ts
- Maintain exact same behavior

### Non-Functional
- No visual changes
- All existing functionality preserved
- TypeScript strict mode compliance

## Hook Design

### 1. useGameState Hook

**Purpose**: Core game state management

```typescript
// lib/hooks/use-game-state.ts
import { useState, useCallback } from 'react';
import { GAME_CONFIG, ENTITIES, type Entity } from '@/lib/config/game';
import type { GameState, Bars, EndingType, LogEntry } from '@/lib/types/game';

interface UseGameStateReturn {
  // State
  gameState: GameState;
  round: number;
  bars: Bars;
  currentEntity: Entity;
  turnOrder: Entity[];
  turnIndex: number;
  history: LogEntry[];
  endingType: EndingType;
  
  // Actions
  setGameState: (state: GameState) => void;
  initializeGame: () => void;
  updateBars: (newBars: Bars) => void;
  addToHistory: (entry: LogEntry) => void;
  advanceTurn: () => { isRoundComplete: boolean; nextRound: number };
  startNewRound: (round: number) => void;
  checkGameOver: (bars: Bars) => { isOver: boolean; type: 'victory' | 'gameOver' | null; ending: EndingType };
}

export function useGameState(): UseGameStateReturn {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [round, setRound] = useState(1);
  const [bars, setBars] = useState<Bars>({
    Government: GAME_CONFIG.INITIAL_BAR_VALUE,
    Businesses: GAME_CONFIG.INITIAL_BAR_VALUE,
    Workers: GAME_CONFIG.INITIAL_BAR_VALUE,
  });
  const [turnOrder, setTurnOrder] = useState<Entity[]>([...ENTITIES]);
  const [turnIndex, setTurnIndex] = useState(0);
  const [history, setHistory] = useState<LogEntry[]>([]);
  const [endingType, setEndingType] = useState<EndingType>(null);

  const currentEntity = turnOrder[turnIndex];

  const initializeGame = useCallback(() => {
    setRound(1);
    setBars({
      Government: GAME_CONFIG.INITIAL_BAR_VALUE,
      Businesses: GAME_CONFIG.INITIAL_BAR_VALUE,
      Workers: GAME_CONFIG.INITIAL_BAR_VALUE,
    });
    setHistory([]);
    setEndingType(null);
    // Shuffle turn order
    const shuffled = [...ENTITIES].sort(() => Math.random() - 0.5);
    setTurnOrder(shuffled);
    setTurnIndex(0);
  }, []);

  const updateBars = useCallback((newBars: Bars) => {
    setBars({
      Government: Math.max(GAME_CONFIG.MIN_BAR_VALUE, Math.min(GAME_CONFIG.MAX_BAR_VALUE, newBars.Government)),
      Businesses: Math.max(GAME_CONFIG.MIN_BAR_VALUE, Math.min(GAME_CONFIG.MAX_BAR_VALUE, newBars.Businesses)),
      Workers: Math.max(GAME_CONFIG.MIN_BAR_VALUE, Math.min(GAME_CONFIG.MAX_BAR_VALUE, newBars.Workers)),
    });
  }, []);

  const addToHistory = useCallback((entry: LogEntry) => {
    setHistory(prev => [...prev, entry]);
  }, []);

  const advanceTurn = useCallback(() => {
    const nextIndex = turnIndex + 1;
    if (nextIndex >= turnOrder.length) {
      // Round complete
      const nextRound = round + 1;
      setRound(nextRound);
      setTurnIndex(0);
      // Shuffle for new round
      const shuffled = [...ENTITIES].sort(() => Math.random() - 0.5);
      setTurnOrder(shuffled);
      return { isRoundComplete: true, nextRound };
    }
    setTurnIndex(nextIndex);
    return { isRoundComplete: false, nextRound: round };
  }, [turnIndex, turnOrder.length, round]);

  const startNewRound = useCallback((newRound: number) => {
    setRound(newRound);
    const shuffled = [...ENTITIES].sort(() => Math.random() - 0.5);
    setTurnOrder(shuffled);
    setTurnIndex(0);
  }, []);

  const checkGameOver = useCallback((currentBars: Bars): { isOver: boolean; type: 'victory' | 'gameOver' | null; ending: EndingType } => {
    // Check for failure (any bar <= 0)
    if (currentBars.Government <= 0 || currentBars.Businesses <= 0 || currentBars.Workers <= 0) {
      setEndingType('failed');
      return { isOver: true, type: 'gameOver', ending: 'failed' };
    }

    // Check for victory (round 30 completed)
    if (round >= GAME_CONFIG.TOTAL_ROUNDS) {
      // Check for harmony (all bars equal)
      if (currentBars.Government === currentBars.Businesses && currentBars.Businesses === currentBars.Workers) {
        setEndingType('harmony');
        return { isOver: true, type: 'victory', ending: 'harmony' };
      }
      setEndingType('survival');
      return { isOver: true, type: 'victory', ending: 'survival' };
    }

    return { isOver: false, type: null, ending: null };
  }, [round]);

  return {
    gameState,
    round,
    bars,
    currentEntity,
    turnOrder,
    turnIndex,
    history,
    endingType,
    setGameState,
    initializeGame,
    updateBars,
    addToHistory,
    advanceTurn,
    startNewRound,
    checkGameOver,
  };
}
```

### 2. useGameActions Hook

**Purpose**: Action handling and effects

```typescript
// lib/hooks/use-game-actions.ts
import { useCallback, useMemo } from 'react';
import { GAME_CONFIG, type Entity } from '@/lib/config/game';
import { ACTIONS } from '@/lib/config/actions';
import type { GameAction, ActionEffect, Bars } from '@/lib/types/game';

interface UseGameActionsProps {
  round: number;
  currentEntity: Entity;
  onApplyEffects: (effects: ActionEffect, actionName: string, entity: Entity) => void;
}

interface UseGameActionsReturn {
  availableActions: GameAction[];
  handleAction: (action: GameAction) => void;
  getModifiedEffects: (effects: ActionEffect) => ActionEffect;
  actionCount: number;
}

export function useGameActions({
  round,
  currentEntity,
  onApplyEffects,
}: UseGameActionsProps): UseGameActionsReturn {
  
  // Calculate round modifier
  const roundModifier = useMemo(() => {
    if (round <= GAME_CONFIG.MODIFIER_PHASE_1_END) return 0;
    if (round <= GAME_CONFIG.MODIFIER_PHASE_2_END) return GAME_CONFIG.MODIFIER_PHASE_2_VALUE;
    return GAME_CONFIG.MODIFIER_PHASE_3_VALUE;
  }, [round]);

  // Get available actions for current entity
  const availableActions = useMemo(() => {
    const entityActions = ACTIONS[currentEntity] || [];
    const count = round <= GAME_CONFIG.MODIFIER_PHASE_2_END
      ? GAME_CONFIG.ACTIONS_ROUNDS_1_20
      : GAME_CONFIG.ACTIONS_ROUNDS_21_30;
    
    // Shuffle and pick
    const shuffled = [...entityActions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }, [currentEntity, round]);

  // Apply round modifier to effects
  const getModifiedEffects = useCallback((effects: ActionEffect): ActionEffect => {
    if (roundModifier === 0) return effects;

    const modified: ActionEffect = { Government: 0, Businesses: 0, Workers: 0 };
    
    for (const key of Object.keys(effects) as Entity[]) {
      const value = effects[key];
      if (value > 0) {
        modified[key] = Math.max(0, value - roundModifier);
      } else if (value < 0) {
        modified[key] = Math.min(0, value + roundModifier);
      } else {
        modified[key] = 0;
      }
    }
    
    return modified;
  }, [roundModifier]);

  const handleAction = useCallback((action: GameAction) => {
    const modifiedEffects = getModifiedEffects(action.effects);
    onApplyEffects(modifiedEffects, action.name, currentEntity);
  }, [currentEntity, getModifiedEffects, onApplyEffects]);

  return {
    availableActions,
    handleAction,
    getModifiedEffects,
    actionCount: availableActions.length,
  };
}
```

### 3. useGameEvents Hook

**Purpose**: Event system management

```typescript
// lib/hooks/use-game-events.ts
import { useState, useCallback, useMemo } from 'react';
import { GAME_CONFIG } from '@/lib/config/game';
import { EVENTS } from '@/lib/config/events';
import type { GameEvent, ActionEffect } from '@/lib/types/game';

interface UseGameEventsReturn {
  currentEvent: GameEvent | null;
  showEventPopup: boolean;
  isEventRound: (round: number) => boolean;
  triggerEvent: (round: number) => void;
  handleEventContinue: () => ActionEffect | null;
  handleEventSkip: () => void;
  handleEventExecute: () => { success: boolean; effects: ActionEffect };
}

export function useGameEvents(): UseGameEventsReturn {
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [showEventPopup, setShowEventPopup] = useState(false);

  const isEventRound = useCallback((round: number) => {
    return GAME_CONFIG.EVENT_ROUNDS.includes(round);
  }, []);

  const triggerEvent = useCallback((round: number) => {
    const event = EVENTS[round];
    if (event) {
      setCurrentEvent(event);
      setShowEventPopup(true);
    }
  }, []);

  const handleEventContinue = useCallback((): ActionEffect | null => {
    if (!currentEvent) return null;
    
    const effects = currentEvent.effects || null;
    setCurrentEvent(null);
    setShowEventPopup(false);
    return effects;
  }, [currentEvent]);

  const handleEventSkip = useCallback(() => {
    setCurrentEvent(null);
    setShowEventPopup(false);
  }, []);

  const handleEventExecute = useCallback((): { success: boolean; effects: ActionEffect } => {
    if (!currentEvent) {
      return { success: false, effects: { Government: 0, Businesses: 0, Workers: 0 } };
    }

    const isSuccess = Math.random() < GAME_CONFIG.SPECIAL_EVENT_SUCCESS_RATE;
    const effects = isSuccess
      ? currentEvent.positiveEffects!
      : currentEvent.negativeEffects!;

    setCurrentEvent(null);
    setShowEventPopup(false);

    return { success: isSuccess, effects };
  }, [currentEvent]);

  return {
    currentEvent,
    showEventPopup,
    isEventRound,
    triggerEvent,
    handleEventContinue,
    handleEventSkip,
    handleEventExecute,
  };
}
```

### 4. useGameSession Hook

**Purpose**: Session management and score submission (simplified - no token fetch)

```typescript
// lib/hooks/use-game-session.ts
import { useState, useCallback } from 'react';
import { generateGameSignature } from '@/lib/gameVerification';
import type { Bars, EndingType } from '@/lib/types/game';

interface UseGameSessionReturn {
  sessionId: string;
  gameSessionId: string;
  playerName: string;
  startTime: Date | null;
  isSubmitting: boolean;
  submitError: string | null;
  
  setPlayerName: (name: string) => void;
  initializeSession: () => void;
  submitScore: (data: SubmitScoreData) => Promise<boolean>;
}

interface SubmitScoreData {
  finalRound: number;
  totalActions: number;
  bars: Bars;
  ending: EndingType;
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function useGameSession(): UseGameSessionReturn {
  const [sessionId] = useState(() => generateUUID());
  const [gameSessionId, setGameSessionId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // No token fetch needed - simplified flow
  const initializeSession = useCallback(() => {
    const newGameSessionId = generateUUID();
    setGameSessionId(newGameSessionId);
    setStartTime(new Date());
    setSubmitError(null);
  }, []);

  const submitScore = useCallback(async (data: SubmitScoreData): Promise<boolean> => {
    if (!startTime) {
      setSubmitError('Session not initialized');
      return false;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

      // Generate HMAC signature using client secret
      const signature = await generateGameSignature(
        {
          game_session_id: gameSessionId,
          final_round: data.finalRound,
          gov_bar: data.bars.Government,
          bus_bar: data.bars.Businesses,
          wor_bar: data.bars.Workers,
          duration,
          ending: data.ending || 'failed',
        },
        process.env.NEXT_PUBLIC_GAME_VERIFICATION_SECRET!
      );

      const response = await fetch('/api/submit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          game_session_id: gameSessionId,
          name: playerName,
          final_round: data.finalRound,
          total_action: data.totalActions,
          gov_bar: data.bars.Government,
          bus_bar: data.bars.Businesses,
          wor_bar: data.bars.Workers,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          duration,
          ending: data.ending || 'failed',
          signature, // HMAC signature instead of verification_hash
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit score');
      }

      return true;
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unknown error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [gameSessionId, playerName, sessionId, startTime]);

  return {
    sessionId,
    gameSessionId,
    playerName,
    startTime,
    isSubmitting,
    submitError,
    setPlayerName,
    initializeSession,
    submitScore,
  };
}
```

## Files to Create

| File | Lines | Purpose |
|------|-------|---------|
| `lib/hooks/use-game-state.ts` | ~120 | Core state management |
| `lib/hooks/use-game-actions.ts` | ~80 | Action handling |
| `lib/hooks/use-game-events.ts` | ~70 | Event system |
| `lib/hooks/use-game-session.ts` | ~100 | Session & submission |
| `lib/hooks/index.ts` | ~5 | Barrel export |
| `lib/config/actions.ts` | ~350 | Action definitions |
| `lib/config/events.ts` | ~80 | Event definitions |

## Files to Modify

| File | Change |
|------|--------|
| `app/page.tsx` | Rewrite to use hooks (~200 lines) |

## Refactored page.tsx Structure

```typescript
'use client';

import React, { useEffect } from 'react';
import { useGameState, useGameActions, useGameEvents, useGameSession } from '@/lib/hooks';
import GameStatusBars from './components/GameStatusBars';
import GameActionButtons from './components/GameActionButtons';
import GameHistory from './components/GameHistory';
import EventPopup from './components/EventPopup';
import GameIllustration from './components/GameIllustration';
import { ENTITIES, ENTITY_LABELS } from '@/lib/config/game';

export default function GamePage() {
  // Hooks
  const gameState = useGameState();
  const session = useGameSession();
  const events = useGameEvents();
  const actions = useGameActions({
    round: gameState.round,
    currentEntity: gameState.currentEntity,
    onApplyEffects: handleApplyEffects,
  });

  // Effect handlers
  function handleApplyEffects(effects, actionName, entity) {
    const newBars = {
      Government: gameState.bars.Government + effects.Government,
      Businesses: gameState.bars.Businesses + effects.Businesses,
      Workers: gameState.bars.Workers + effects.Workers,
    };
    
    gameState.updateBars(newBars);
    gameState.addToHistory({ round: gameState.round, entity, action: actionName, effects });
    
    // Dispatch custom events for animations
    window.dispatchEvent(new CustomEvent('gameActionEffect', { detail: { effects } }));
    
    // Check game over
    const result = gameState.checkGameOver(newBars);
    if (result.isOver) {
      gameState.setGameState(result.type === 'victory' ? 'victory' : 'gameOver');
      session.submitScore({
        finalRound: gameState.round,
        totalActions: gameState.history.length,
        bars: newBars,
        ending: result.ending,
      });
    }
  }

  // ... rest of orchestration logic

  // Render based on gameState
  if (gameState.gameState === 'menu') return <MenuScreen />;
  if (gameState.gameState === 'playing') return <PlayingScreen />;
  if (gameState.gameState === 'gameOver') return <GameOverScreen />;
  if (gameState.gameState === 'victory') return <VictoryScreen />;
}
```

## Todo List

- [ ] Create lib/config/actions.ts with extracted action definitions
- [ ] Create lib/config/events.ts with event definitions
- [ ] Create lib/hooks/use-game-state.ts
- [ ] Create lib/hooks/use-game-actions.ts
- [ ] Create lib/hooks/use-game-events.ts
- [ ] Create lib/hooks/use-game-session.ts
- [ ] Create lib/hooks/index.ts barrel export
- [ ] Refactor app/page.tsx to use hooks
- [ ] Test all game functionality
- [ ] Verify CustomEvent dispatching still works

## Success Criteria

- [ ] page.tsx reduced to <200 lines
- [ ] All hooks are properly typed
- [ ] No behavior changes
- [ ] All CustomEvents still dispatch correctly
- [ ] Game plays identically to before
- [ ] TypeScript compiles without errors

## Next Steps

→ [Phase 4: Claymorphism Design System](./phase-04-claymorphism-ui.md)
