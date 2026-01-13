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
    <div className="action-buttons-container mobile-actions w-full flex flex-row flex-wrap justify-center gap-4">
      {actions.map((action, idx) => (
        <button
          key={`${action.name}-${idx}`}
          onClick={() => memoizedHandleAction(action)}
          disabled={!!eventMessage || clickedAction === action.name}
          className={`
            clay-button flex flex-col items-center px-4 py-3 rounded-2xl min-w-[140px] max-w-[180px]
            transition-all duration-200 ease-out
            hover:scale-102 hover:-translate-y-1
            ${roleGlassClass[entity]}
            ${isAnimating && !clickedAction ? "animate-fadeIn" : ""}
            ${
              clickedAction === action.name
                ? "opacity-60 scale-95 cursor-not-allowed"
                : ""
            }
          `}
        >
          {/* Ảnh vuông */}
          <div className="image-container w-36 h-36 min-w-[130px] min-h-[130px] max-w-[162px] max-h-[162px] rounded-2xl mb-2 flex items-center justify-center overflow-hidden bg-slate-600 flex-shrink-0">
            {action.imageUrl ? (
              <img
                src={action.imageUrl}
                alt={action.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <img
                src={DEFAULT_IMG}
                alt="Placeholder"
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <div
            className={`action-name text-xl text-center mb-1 flex-1 flex items-center justify-center w-full min-h-[42px] ${actionNameColor[entity]}`}
          >
            {action.name}
          </div>
          {/* Chỉ số luôn ở đáy, margin-top auto để đẩy xuống */}
          <div className="effects flex flex-row flex-nowrap justify-center gap-1 w-full mt-auto">
            {(
              Object.entries(getModifiedEffects(action.effects, false)) as [
                Entity,
                number
              ][]
            ).map(([e, value]) =>
              value !== 0 ? (
                <span
                  key={e}
                  className={`text-2xl px-1 rounded-full flex items-center ${effectColor(
                    entity,
                    value
                  )}`}
                >
                  {LABELS[e]}
                  {value > 0 ? (
                    <span className="ml-0.5">+{value}</span>
                  ) : (
                    <span className="ml-0.5">-{Math.abs(value)}</span>
                  )}
                </span>
              ) : null
            )}
          </div>
        </button>
      ))}
    </div>
  );
};
export default GameActionButtons;
