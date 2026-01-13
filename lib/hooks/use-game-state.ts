/**
 * useGameState - Core game state management hook
 *
 * Manages: bars, round, turnOrder, turnIndex, currentEntity, history
 * Extracted from app/page.tsx
 */

"use client";

import { useState, useCallback, useRef } from "react";
import type {
  Entity,
  Bars,
  GameState,
  EndingType,
  LogEntry,
  ActionEffect,
  GameAction,
  GameEvent,
} from "@/lib/types/game";
import { ENTITIES } from "@/lib/types/game";
import { INITIAL_BARS, GAME_CONFIG } from "@/lib/config/game";
import { ACTIONS } from "@/lib/config/actions";
import { EVENTS } from "@/lib/config/events";

// Generate UUID - defined outside component to avoid hoisting issues
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Shuffle array using Fisher-Yates
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface UseGameStateReturn {
  // Core state
  gameState: GameState;
  round: number;
  bars: Bars;
  currentEntity: Entity | null;
  turnOrder: Entity[];
  turnIndex: number;
  history: LogEntry[];
  endingType: EndingType;

  // Event state
  showEventPopup: boolean;
  currentEvent: GameEvent | null;

  // Actions
  startGame: () => void;
  handleAction: (action: GameAction) => void;
  handleActionComplete: () => void;
  handleEventContinue: () => void;
  handleEventSkip: () => void;
  handleEventExecute: () => void;
  resetGame: () => void;
  refreshAvailableActions: () => void;

  // Computed
  availableActions: GameAction[];
  getBarColor: (value: number) => string;

  // Session data for score submission
  sessionData: {
    sessionId: string;
    gameSessionId: string;
    gameStartTime: number;
    totalActions: number;
  };

  // Animation states
  animationState: {
    startButtonAnimating: boolean;
    startClickAnimation: string | null;
    menuFadingOut: boolean;
    endingFadingIn: boolean;
  };
}

export function useGameState(): UseGameStateReturn {
  // Core game state
  const [gameState, setGameState] = useState<GameState>("menu");
  const [round, setRound] = useState<number>(1);
  const [bars, setBars] = useState<Bars>({ ...INITIAL_BARS });
  const [currentEntity, setCurrentEntity] = useState<Entity | null>(null);
  const [turnOrder, setTurnOrder] = useState<Entity[]>([]);
  const [turnIndex, setTurnIndex] = useState<number>(0);
  const [history, setHistory] = useState<LogEntry[]>([]);
  const [endingType, setEndingType] = useState<EndingType>(null);

  // Event state
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);

  // Session tracking
  const [sessionId] = useState(generateUUID);
  const [gameSessionId, setGameSessionId] = useState(generateUUID);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [totalActions, setTotalActions] = useState<number>(0);

  // Animation states
  const [startButtonAnimating, setStartButtonAnimating] = useState(false);
  const [startClickAnimation, setStartClickAnimation] = useState<string | null>(
    null
  );
  const [menuFadingOut, setMenuFadingOut] = useState(false);
  const [endingFadingIn, setEndingFadingIn] = useState(false);

  // Available actions - stored in state to avoid impure useMemo
  const [availableActions, setAvailableActions] = useState<GameAction[]>([]);

  // Submit score ref
  const submitScoreRef = useRef(false);

  // Apply effects to bars
  const applyEffects = useCallback(
    (
      effects: ActionEffect,
      actionName: string,
      by: Entity | "Event" = currentEntity || "Event"
    ) => {
      setBars((prev) => {
        const newBars: Bars = { ...prev };
        ENTITIES.forEach((entity) => {
          newBars[entity] = Math.max(
            GAME_CONFIG.MIN_BAR_VALUE,
            Math.min(
              GAME_CONFIG.MAX_BAR_VALUE,
              newBars[entity] + (effects[entity] ?? 0)
            )
          );
        });
        return newBars;
      });
      setHistory((prev) => [
        ...prev,
        { round, entity: by, action: actionName, effects },
      ]);

      // Trigger event for GameIllustration component
      window.dispatchEvent(
        new CustomEvent("gameActionEffect", {
          detail: {
            effects,
            currentEntity: by,
          },
        })
      );
    },
    [currentEntity, round]
  );

  // Refresh available actions (call when entity/round changes)
  const refreshAvailableActions = useCallback(() => {
    if (!currentEntity) {
      setAvailableActions([]);
      return;
    }
    const actions = ACTIONS[currentEntity];
    const shuffled = shuffleArray(actions);
    if (round >= GAME_CONFIG.MODIFIER_PHASE_2_END + 1) {
      setAvailableActions(
        shuffled.slice(
          0,
          Math.min(GAME_CONFIG.ACTIONS_ROUNDS_21_30, shuffled.length)
        )
      );
    } else {
      setAvailableActions(
        shuffled.slice(
          0,
          Math.min(GAME_CONFIG.ACTIONS_ROUNDS_1_20, shuffled.length)
        )
      );
    }
  }, [currentEntity, round]);

  // Start new round
  const startNewRound = useCallback(
    (startRound: number) => {
      const order = shuffleArray(ENTITIES.slice());
      setTurnOrder(order);
      setTurnIndex(0);
      const firstEntity = order[0];
      setCurrentEntity(firstEntity);

      // Refresh actions for new entity
      const actions = ACTIONS[firstEntity];
      const shuffled = shuffleArray(actions);
      if (startRound >= GAME_CONFIG.MODIFIER_PHASE_2_END + 1) {
        setAvailableActions(
          shuffled.slice(
            0,
            Math.min(GAME_CONFIG.ACTIONS_ROUNDS_21_30, shuffled.length)
          )
        );
      } else {
        setAvailableActions(
          shuffled.slice(
            0,
            Math.min(GAME_CONFIG.ACTIONS_ROUNDS_1_20, shuffled.length)
          )
        );
      }

      // Notify about turn change
      window.dispatchEvent(
        new CustomEvent("gameTurnChange", {
          detail: { currentEntity: firstEntity },
        })
      );

      if (EVENTS[startRound]) {
        const event = EVENTS[startRound];
        setCurrentEvent(event);
        setShowEventPopup(true);

        // Notify GameIllustration about special event
        window.dispatchEvent(
          new CustomEvent("specialEvent", {
            detail: {
              eventName: event.name,
              round: startRound,
            },
          })
        );
      }
    },
    []
  );

  // Start game
  const startGame = useCallback(() => {
    if (startButtonAnimating) return;

    const newGameSessionId = generateUUID();
    setGameSessionId(newGameSessionId);

    setStartButtonAnimating(true);
    setStartClickAnimation("buttonClick");

    setTimeout(() => {
      setStartClickAnimation("actionPulse");
    }, 300);

    setTimeout(() => {
      setStartClickAnimation("actionGlow");
    }, 800);

    setTimeout(() => {
      setMenuFadingOut(true);
    }, 1000);

    setTimeout(() => {
      setGameState("playing");
      setRound(1);
      setBars({ ...INITIAL_BARS });
      setHistory([]);
      setEndingType(null);
      setCurrentEvent(null);
      setShowEventPopup(false);
      setGameStartTime(Date.now());
      setTotalActions(0);
      submitScoreRef.current = false;
      startNewRound(1);

      window.dispatchEvent(
        new CustomEvent("gameStateChange", { detail: { state: "playing" } })
      );

      setTimeout(() => {
        setStartButtonAnimating(false);
        setStartClickAnimation(null);
        setMenuFadingOut(false);
        setEndingFadingIn(false);
      }, 500);
    }, 2000);
  }, [startButtonAnimating, startNewRound]);

  // Handle action
  const handleAction = useCallback(
    (action: GameAction) => {
      const modifiedEffects = { ...action.effects };

      // Apply round-based difficulty modifiers
      if (
        round >= GAME_CONFIG.MODIFIER_PHASE_1_END + 1 &&
        round <= GAME_CONFIG.MODIFIER_PHASE_2_END
      ) {
        Object.keys(modifiedEffects).forEach((key) => {
          const entity = key as Entity;
          if (modifiedEffects[entity] > 0) {
            modifiedEffects[entity] -= GAME_CONFIG.MODIFIER_PHASE_2_VALUE;
          } else if (modifiedEffects[entity] < 0) {
            modifiedEffects[entity] -= GAME_CONFIG.MODIFIER_PHASE_2_VALUE;
          }
        });
      } else if (round >= GAME_CONFIG.MODIFIER_PHASE_2_END + 1) {
        Object.keys(modifiedEffects).forEach((key) => {
          const entity = key as Entity;
          if (modifiedEffects[entity] > 0) {
            modifiedEffects[entity] -= GAME_CONFIG.MODIFIER_PHASE_3_VALUE;
          } else if (modifiedEffects[entity] < 0) {
            modifiedEffects[entity] -= GAME_CONFIG.MODIFIER_PHASE_3_VALUE;
          }
        });
      }

      applyEffects(modifiedEffects, action.name, currentEntity || "Event");
      setTotalActions((prev) => prev + 1);
    },
    [round, currentEntity, applyEffects]
  );

  // Handle action complete
  const handleActionComplete = useCallback(() => {
    setTimeout(() => {
      if (turnIndex < turnOrder.length - 1) {
        const nextIndex = turnIndex + 1;
        const nextEntity = turnOrder[nextIndex];
        setTurnIndex(nextIndex);
        setCurrentEntity(nextEntity);

        // Refresh actions for new entity
        const actions = ACTIONS[nextEntity];
        const shuffled = shuffleArray(actions);
        if (round >= GAME_CONFIG.MODIFIER_PHASE_2_END + 1) {
          setAvailableActions(
            shuffled.slice(
              0,
              Math.min(GAME_CONFIG.ACTIONS_ROUNDS_21_30, shuffled.length)
            )
          );
        } else {
          setAvailableActions(
            shuffled.slice(
              0,
              Math.min(GAME_CONFIG.ACTIONS_ROUNDS_1_20, shuffled.length)
            )
          );
        }

        window.dispatchEvent(
          new CustomEvent("gameTurnChange", {
            detail: { currentEntity: nextEntity },
          })
        );
      } else {
        if (round < GAME_CONFIG.TOTAL_ROUNDS) {
          setRound(round + 1);
          startNewRound(round + 1);
        }
      }
    }, 0);
  }, [turnIndex, turnOrder, round, startNewRound]);

  // Event handlers
  const handleEventContinue = useCallback(() => {
    if (currentEvent) {
      if (currentEvent.effects) {
        applyEffects(
          currentEvent.effects,
          `Sự kiện: ${currentEvent.name}`,
          "Event"
        );
      }
    }
    setShowEventPopup(false);
    setCurrentEvent(null);
  }, [currentEvent, applyEffects]);

  const handleEventSkip = useCallback(() => {
    setShowEventPopup(false);
    setCurrentEvent(null);
  }, []);

  const handleEventExecute = useCallback(() => {
    if (currentEvent && currentEvent.isSpecialEvent) {
      const isSuccess = Math.random() < GAME_CONFIG.SPECIAL_EVENT_SUCCESS_RATE;
      const effects = isSuccess
        ? currentEvent.positiveEffects
        : currentEvent.negativeEffects;

      if (effects) {
        applyEffects(
          effects,
          `Cơ hội ${currentEvent.name}: ${isSuccess ? "Thành công!" : "Thất bại!"}`,
          currentEvent.entity || "Event"
        );
      }
    }
    setShowEventPopup(false);
    setCurrentEvent(null);
  }, [currentEvent, applyEffects]);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState("menu");
    setRound(1);
    setBars({ ...INITIAL_BARS });
    setHistory([]);
    setEndingType(null);
    setCurrentEvent(null);
    setShowEventPopup(false);
    setTotalActions(0);
    setAvailableActions([]);
    submitScoreRef.current = false;
  }, []);

  // Bar color utility
  const getBarColor = useCallback((value: number): string => {
    if (value > 60) return "bg-green-500";
    if (value > 30) return "bg-yellow-500";
    return "bg-red-500";
  }, []);

  return {
    // Core state
    gameState,
    round,
    bars,
    currentEntity,
    turnOrder,
    turnIndex,
    history,
    endingType,

    // Event state
    showEventPopup,
    currentEvent,

    // Actions
    startGame,
    handleAction,
    handleActionComplete,
    handleEventContinue,
    handleEventSkip,
    handleEventExecute,
    resetGame,
    refreshAvailableActions,

    // Computed
    availableActions,
    getBarColor,

    // Session data
    sessionData: {
      sessionId,
      gameSessionId,
      gameStartTime,
      totalActions,
    },

    // Animation states
    animationState: {
      startButtonAnimating,
      startClickAnimation,
      menuFadingOut,
      endingFadingIn,
    },
  };
}
