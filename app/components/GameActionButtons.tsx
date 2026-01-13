"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Entity, GameAction, ActionEffect } from "@/lib/types";

interface Props {
  actions: GameAction[];
  handleAction: (action: GameAction) => void;
  eventMessage: string | null;
  entity: Entity;
  onActionComplete?: () => void;
  round?: number;
}

const LABELS: Record<Entity, string> = {
  Government: "N",
  Businesses: "D",
  Workers: "L",
};

const DEFAULT_IMG = "/actions/placeholder.png";

const effectColor = (role: Entity, value: number) => {
  return value > 0 ? "text-green-600 font-bold" : value < 0 ? "text-red-600 font-bold" : "text-gray-500 font-bold";
};

const GameActionButtons: React.FC<Props> = ({
  actions,
  handleAction,
  eventMessage,
  entity,
  onActionComplete,
  round = 1,
}) => {
  const [clickedAction, setClickedAction] = useState<string | null>(null);

  // Function to get modified effects based on round
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

  const memoizedHandleAction = useCallback(
    (action: GameAction) => {
      if (clickedAction === action.name) return;
      setClickedAction(action.name);
      handleAction(action);
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
    <div className="action-buttons-container w-full flex flex-row flex-wrap justify-center gap-6 items-center">
      {actions.map((action, idx) => {
        const modifiedEffects = getModifiedEffects(action.effects);
        return (
          <button
            key={`${action.name}-${idx}`}
            onClick={() => memoizedHandleAction(action)}
            disabled={!!eventMessage || clickedAction === action.name}
            style={
              {
                "--idle-scale": 1.02 + Math.random() * 0.04,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${5 + Math.random() * 3}s`,
              } as React.CSSProperties
            }
            className={`
              group relative
              flex flex-col items-center
              w-[160px] md:w-[180px] lg:w-[200px]
              aspect-[9/16]
              rounded-2xl
              transition-all duration-300 ease-out
              hover:scale-105 hover:z-10
              animate-idleZoom
              bg-transparent
              border-none
              p-0
              overflow-hidden
              ${
                clickedAction === action.name
                  ? "opacity-0 scale-150 transition-opacity duration-500"
                  : ""
              }
            `}
          >
            {/* Image Layer - Aspect 9:16 */}
            <div className="absolute inset-0 z-0">
              <img
                src={action.imageUrl || DEFAULT_IMG}
                alt={action.name}
                className="object-cover w-full h-full pointer-events-none select-none"
                draggable={false}
              />
              
              {/* Hover Name Layer - Centered over Image */}
              <div className="absolute inset-0 z-20 flex items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                <span className="text-white font-bold text-lg text-center drop-shadow-md">
                  {action.name}
                </span>
              </div>

               {/* Effects Layer - Bottom Overlay */}
               <div className="absolute bottom-0 left-0 right-0 z-10 p-2 pb-3 flex flex-col gap-1 items-center bg-gradient-to-t from-black/60 to-transparent">
                  <div className="flex flex-wrap justify-center gap-1.5">
                   {(Object.entries(modifiedEffects) as [Entity, number][]).map(
                     ([e, value]) =>
                       value !== 0 ? (
                         <div
                           key={e}
                           className="bg-white/80 px-2 py-0.5 rounded-md flex items-center text-xs font-bold backdrop-blur-sm"
                         >
                           <span className="text-slate-700 mr-1">{LABELS[e]}:</span>
                           <span className={effectColor(entity, value)}>
                             {Math.abs(value)}
                           </span>
                         </div>
                       ) : null
                   )}
                 </div>
               </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
export default GameActionButtons;
