import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  ACTIONS,
  EVENTS,
  INITIAL_BARS,
  GAME_CONFIG,
  BAD_WORDS,
} from "@/lib/config";
import {
  Entity,
  ENTITIES,
  GameState,
  Bars,
  LogEntry,
  EndingType,
  GameEvent,
  GameAction,
  ActionEffect,
} from "@/lib/types";

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [round, setRound] = useState<number>(1);
  const [bars, setBars] = useState<Bars>({ ...INITIAL_BARS });
  const [currentEntity, setCurrentEntity] = useState<Entity | null>(null);
  const [turnOrder, setTurnOrder] = useState<Entity[]>([]);
  const [turnIndex, setTurnIndex] = useState<number>(0);
  const [history, setHistory] = useState<LogEntry[]>([]);
  const [endingType, setEndingType] = useState<EndingType>(null);
  const [eventMessage, setEventMessage] = useState<string | null>(null);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [showEventPopup, setShowEventPopup] = useState(false);
  
  // UI States
  const [startButtonAnimating, setStartButtonAnimating] = useState(false);
  const [startClickAnimation, setStartClickAnimation] = useState<string | null>(null);
  const [menuFadingOut, setMenuFadingOut] = useState(false);
  const [endingFadingIn, setEndingFadingIn] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [inputShaking, setInputShaking] = useState(false);

  // Player & Session
  const [playerName, setPlayerName] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [gameSessionId, setGameSessionId] = useState<string>("");
  const [showNameInput, setShowNameInput] = useState(true);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [totalActions, setTotalActions] = useState<number>(0);
  const [completedRound, setCompletedRound] = useState<number>(0);
  const [isProcessingTurn, setIsProcessingTurn] = useState(false);

  const submitScoreRef = useRef(false);

  // --- Helpers ---

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const generateClientSignature = async (data: {
    game_session_id: string;
    final_round: number;
    gov_bar: number;
    bus_bar: number;
    wor_bar: number;
    duration: number;
    ending: string;
  }): Promise<string> => {
    const secret = process.env.NEXT_PUBLIC_GAME_SECRET || "default_secret";
    const message = [
      data.game_session_id,
      data.final_round,
      data.gov_bar,
      data.bus_bar,
      data.wor_bar,
      data.duration,
      data.ending,
    ].join("|");

    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const msgData = encoder.encode(message);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
    return Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const submitScore = async (resultState: "gameOver" | "victory", currentCompletedRound: number) => {
    if (submitScoreRef.current) return;
    submitScoreRef.current = true;

    const gameDuration = Math.floor((Date.now() - gameStartTime) / 1000);
    const ending =
      resultState === "gameOver"
        ? "FAILED"
        : endingType === "harmony"
        ? "HARMONY"
        : "SURVIVAL";

    // For victory, use 30 (completed all rounds)
    // For gameOver, use completedRound (rounds that were fully passed)
    const finalRound = resultState === "victory" ? 30 : currentCompletedRound;

    const gameData = {
      game_session_id: gameSessionId,
      final_round: finalRound,
      gov_bar: bars.Government,
      bus_bar: bars.Businesses,
      wor_bar: bars.Workers,
      duration: gameDuration,
      ending: ending,
    };

    const signature = await generateClientSignature(gameData);

    const payload = {
      session_id: sessionId,
      game_session_id: gameSessionId,
      name: playerName.trim(),
      final_round: finalRound,
      total_action: totalActions,
      gov_bar: bars.Government,
      bus_bar: bars.Businesses,
      wor_bar: bars.Workers,
      start_time: new Date(gameStartTime).toISOString(),
      end_time: new Date().toISOString(),
      duration: gameDuration,
      ending: ending,
      signature: signature,
    };

    try {
      await fetch("/api/submit-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      submitScoreRef.current = false;
    }
  };

  const applyEffects = (
    effects: ActionEffect,
    actionName: string,
    by: Entity | "Event" = currentEntity || "Event"
  ) => {
    setBars((prev) => {
      const newBars: Bars = { ...prev };
      ENTITIES.forEach((entity) => {
        newBars[entity] = Math.max(
          0,
          Math.min(50, newBars[entity] + (effects[entity] ?? 0))
        );
      });
      return newBars;
    });
    setHistory((prev) => [
      ...prev,
      { round, entity: by, action: actionName, effects },
    ]);

    const eventDetail = {
      effects,
      currentEntity: by,
    };
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("gameActionEffect", { detail: eventDetail })
      );
    }
  };

  const startEndingTransition = (targetState: "gameOver" | "victory", currentCompletedRound: number) => {
    setMenuFadingOut(true);
    setTimeout(() => {
      setGameState(targetState);
      setMenuFadingOut(false);
      setEndingFadingIn(true);
      submitScore(targetState, currentCompletedRound);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("gameStateChange", { detail: { state: targetState } })
        );
      }
    }, 1000);
  };

  const checkGameOver = (currentBars: Bars, currentCompletedRound: number): boolean => {
    if (
      currentBars.Government <= 0 ||
      currentBars.Businesses <= 0 ||
      currentBars.Workers <= 0
    ) {
      setEndingType("survival");
      startEndingTransition("gameOver", currentCompletedRound);
      return true;
    }
    
    // Victory: only when round 30 is FULLY completed (all 3 turns done)
    if (currentCompletedRound >= 30) {
      if (
        currentBars.Government === currentBars.Businesses &&
        currentBars.Businesses === currentBars.Workers
      ) {
        setEndingType("harmony");
      } else {
        setEndingType("survival");
      }
      startEndingTransition("victory", 30);
      return true;
    }
    return false;
  };

  const startNewRound = (startRound: number) => {
    const order = ENTITIES.slice().sort(() => Math.random() - 0.5);
    setTurnOrder(order);
    setTurnIndex(0);
    const firstEntity = order[0];
    setCurrentEntity(firstEntity);

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("gameTurnChange", {
          detail: { currentEntity: firstEntity },
        })
      );
    }

    if (EVENTS[startRound]) {
      const event = EVENTS[startRound];
      setCurrentEvent(event);
      setShowEventPopup(true);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("specialEvent", {
            detail: { eventName: event.name, round: startRound },
          })
        );
      }
    }
  };

  const startGame = () => {
    if (startButtonAnimating) return;
    const newGameSessionId = generateUUID();
    setGameSessionId(newGameSessionId);
    setStartButtonAnimating(true);
    setStartClickAnimation("buttonClick");

    // Immediate feedback, then fade out quickly
    setTimeout(() => setMenuFadingOut(true), 100);

    setTimeout(() => {
      setGameState("playing");
      setRound(1);
      setBars({ ...INITIAL_BARS });
      setHistory([]);
      setEndingType(null);
      setEventMessage(null);
      setCurrentEvent(null);
      setShowEventPopup(false);
      setGameStartTime(Date.now());
      setTotalActions(0);
      setCompletedRound(0);
      setIsProcessingTurn(false);
      submitScoreRef.current = false;
      startNewRound(1);

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("gameStateChange", { detail: { state: "playing" } })
        );
      }

      // Reset animation states shortly after transition
      setTimeout(() => {
        setStartButtonAnimating(false);
        setStartClickAnimation(null);
        setMenuFadingOut(false);
        setEndingFadingIn(false);
      }, 500);
    }, 600); // 600ms total transition time for snappy feel
  };

  const validateAndStartGame = () => {
    const trimmedName = playerName.trim();
    // Check for bad words
    const lowerName = trimmedName.toLowerCase();
    const hasBadWord = BAD_WORDS.some(word => lowerName.includes(word.toLowerCase()));

    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 50 || hasBadWord) {
      if (hasBadWord) {
        // Optional: show a specific message or just shake
        console.warn("Input contains restricted text.");
      }
      setInputShaking(true);
      setTimeout(() => setInputShaking(false), 500);
      return;
    }
    setShowNameInput(false);
    startGame();
  };

  // --- Event Handlers ---

  const handleEventContinue = () => {
    if (currentEvent && currentEvent.effects) {
      applyEffects(
        currentEvent.effects,
        `Sự kiện: ${currentEvent.name}`,
        "Event"
      );
    }
    setShowEventPopup(false);
    setCurrentEvent(null);
  };

  const handleEventSkip = () => {
    setShowEventPopup(false);
    setCurrentEvent(null);
  };

  const handleEventExecute = () => {
    if (currentEvent && currentEvent.isSpecialEvent) {
      const isSuccess = Math.random() < 0.1;
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
      // Count special event execute as an action
      setTotalActions((prev) => prev + 1);
    }
    setShowEventPopup(false);
    setCurrentEvent(null);
  };

  const handleAction = (action: GameAction) => {
    if (isProcessingTurn) return;
    setIsProcessingTurn(true);

    const modifiedEffects = { ...action.effects };
    if (round >= 11 && round <= 20) {
      Object.keys(modifiedEffects).forEach((key) => {
        const entity = key as Entity;
        if (modifiedEffects[entity] > 0) modifiedEffects[entity] -= 1;
        else if (modifiedEffects[entity] < 0) modifiedEffects[entity] -= 1;
      });
    } else if (round >= 21 && round <= 30) {
      Object.keys(modifiedEffects).forEach((key) => {
        const entity = key as Entity;
        if (modifiedEffects[entity] > 0) modifiedEffects[entity] -= 2;
        else if (modifiedEffects[entity] < 0) modifiedEffects[entity] -= 2;
      });
    }
    applyEffects(modifiedEffects, action.name, currentEntity || "Event");
    setTotalActions((prev) => prev + 1);
  };

  const handleActionComplete = useCallback(() => {
    setTimeout(() => {
      setIsProcessingTurn(false);
      if (turnIndex < turnOrder.length - 1) {
        const nextIndex = turnIndex + 1;
        const nextEntity = turnOrder[nextIndex];
        setTurnIndex(nextIndex);
        setCurrentEntity(nextEntity);
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("gameTurnChange", {
              detail: { currentEntity: nextEntity },
            })
          );
        }
      } else {
        // All 3 turns completed - mark this round as completed
        setCompletedRound(round);
        if (round < 30) {
          setRound((r) => r + 1);
          startNewRound(round + 1);
        }
      }
    }, 0);
  }, [turnIndex, turnOrder, round]);

  // --- Effects ---

  useEffect(() => {
    if (!sessionId) setSessionId(generateUUID());
  }, [sessionId]);

  useEffect(() => {
    if (!gameSessionId) setGameSessionId(generateUUID());
  }, [gameSessionId]);

  useEffect(() => {
    if (gameState === "playing" && currentEntity) {
      checkGameOver(bars, completedRound);
    }
  }, [bars, round, turnIndex, gameState, currentEntity, completedRound]);

  // --- Memos ---

  const availableActions: GameAction[] = useMemo(() => {
    if (!currentEntity) return [];
    const actions = ACTIONS[currentEntity];
    const shuffled = actions.slice().sort(() => Math.random() - 0.5);
    if (round >= 21) {
      return shuffled.slice(0, Math.min(2, shuffled.length));
    }
    return shuffled.slice(0, Math.min(3, shuffled.length));
  }, [currentEntity, round]);

  return {
    gameState,
    round,
    bars,
    currentEntity,
    turnOrder,
    turnIndex,
    history,
    endingType,
    eventMessage,
    currentEvent,
    showEventPopup,
    startButtonAnimating,
    startClickAnimation,
    menuFadingOut,
    endingFadingIn,
    showFAQ,
    setShowFAQ,
    playerName,
    setPlayerName,
    showNameInput,
    inputShaking,
    validateAndStartGame,
    startGame,
    handleEventContinue,
    handleEventSkip,
    handleEventExecute,
    handleAction,
    handleActionComplete,
    availableActions,
  };
}
