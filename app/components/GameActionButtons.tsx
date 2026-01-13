"use client";

import React, { useState, useEffect, useCallback } from "react";

type Entity = "Government" | "Businesses" | "Workers";
interface GameAction {
  name: string;
  imageUrl: string;
  effects: Record<Entity, number>;
  special?: boolean;
}
interface Props {
  actions: GameAction[];
  handleAction: (action: GameAction) => void;
  eventMessage: string | null;
  entity: Entity;
  onActionComplete?: () => void; // New prop to notify when action animation should reset
  round?: number; // Add round prop to display modified effects
}

const LABELS: Record<Entity, string> = {
  Government: "N",
  Businesses: "D",
  Workers: "L",
};
const roleGlassClass = {
  Government: "clay-card-gov",
  Businesses: "clay-card-biz",
  Workers: "clay-card-work",
};

const DEFAULT_IMG = "/actions/placeholder.png";

const actionNameColor: Record<Entity, string> = {
  Government: "text-red-800 font-bold",
  Businesses: "text-blue-800 font-bold",
  Workers: "text-green-800 font-bold",
};
const effectColor = (role: Entity, value: number) => {
  if (role === "Government") {
    return value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "";
  } else if (role === "Businesses") {
    return value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "";
  } else {
    return value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "";
  }
};

const GameActionButtons: React.FC<Props> = ({
  actions,
  handleAction,
  eventMessage,
  entity,
  onActionComplete,
  round = 1, // Default to round 1 if not provided
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [clickedAction, setClickedAction] = useState<string | null>(null);

  // Function to get modified effects based on round, only for normal actions (not special events)
  const getModifiedEffects = (
    originalEffects: Record<Entity, number>,
    isSpecialEvent = false
  ) => {
    if (isSpecialEvent) return { ...originalEffects };
    const modifiedEffects = { ...originalEffects };
    if (round >= 11 && round <= 20) {
      Object.keys(modifiedEffects).forEach((key) => {
        const entityKey = key as Entity;
        if (modifiedEffects[entityKey] > 0) {
          modifiedEffects[entityKey] -= 1;
        } else if (modifiedEffects[entityKey] < 0) {
          modifiedEffects[entityKey] -= 1;
        }
      });
    } else if (round >= 21 && round <= 30) {
      Object.keys(modifiedEffects).forEach((key) => {
        const entityKey = key as Entity;
        if (modifiedEffects[entityKey] > 0) {
          modifiedEffects[entityKey] -= 2;
        } else if (modifiedEffects[entityKey] < 0) {
          modifiedEffects[entityKey] -= 2;
        }
      });
    }
    return modifiedEffects;
  };

  useEffect(() => {
    // Trigger fade-in animation when actions change
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional: animation trigger on prop change
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [actions]);

  // Memoize action handler to prevent unnecessary re-renders
  const memoizedHandleAction = useCallback(
    (action: GameAction) => {
      // Prevent multiple clicks on the same action
      if (clickedAction === action.name) return;

      // Set clicked action and start simple animation
      setClickedAction(action.name);

      // Call the actual action handler
      handleAction(action);

      // Reset clicked state after 1.5s
      setTimeout(() => {
        setClickedAction(null);
        if (onActionComplete) {
          onActionComplete();
        }
      }, 800);
    },
    [handleAction, clickedAction, onActionComplete]
  );

  return (
    <div className="action-buttons-container mobile-actions w-full flex flex-row flex-wrap justify-center gap-6 items-center">
      {actions.map((action, idx) => (
        <button
          key={`${action.name}-${idx}`}
          onClick={() => memoizedHandleAction(action)}
          disabled={!!eventMessage || clickedAction === action.name}
          style={
            {
              "--idle-scale": 1.02 + Math.random() * 0.04, // Random scale between 1.02 and 1.06
              animationDelay: `${Math.random() * 3}s`, // Random delay 0-3s
              animationDuration: `${5 + Math.random() * 3}s`, // Random duration 5s-8s (very slow)
            } as React.CSSProperties
          }
          className={`
            relative
            w-[180px] h-[320px] 
            min-w-[135px] min-h-[240px]
            max-w-[180px] max-h-[320px]
            aspect-[9/16]
            rounded-2xl
            overflow-hidden
            transition-all duration-300 ease-out
            hover:scale-105 hover:z-10
            animate-idleZoom
            bg-transparent
            border-none
            p-0
            ${
              clickedAction === action.name
                ? "opacity-0 scale-150 transition-opacity duration-500" // Disappear effect on click
                : ""
            }
          `}
        >
          {action.imageUrl ? (
            <img
              src={action.imageUrl}
              alt={action.name}
              className="object-cover w-full h-full rounded-2xl pointer-events-none select-none"
              draggable={false}
            />
          ) : (
            <img
              src={DEFAULT_IMG}
              alt="Placeholder"
              className="object-cover w-full h-full rounded-2xl pointer-events-none select-none"
              draggable={false}
            />
          )}
        </button>
      ))}
    </div>
  );
};
export default GameActionButtons;
