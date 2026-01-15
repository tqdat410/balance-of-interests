"use client";

import React, { useState, useCallback } from "react";
import { Entity, GameAction } from "@/lib/types";

interface Props {
  actions: GameAction[];
  handleAction: (action: GameAction) => void;
  eventMessage: string | null;
  entity: Entity;
  onActionComplete?: () => void;
  round?: number;
  rerollCount: number;
  onReroll: () => void;
}

const LABELS: Record<Entity, string> = {
  Government: "N",
  Businesses: "D",
  Workers: "L",
};

const DEFAULT_IMG = "/actions/placeholder.png";

// Custom color helper for claymorphism badges
const getEffectStyles = (value: number) => {
  if (value > 0) return {
    bg: "bg-green-100",
    text: "text-green-700", 
    border: "border-green-200",
    shadow: "shadow-[inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.05),2px_2px_5px_rgba(0,0,0,0.05)]"
  };
  if (value < 0) return {
    bg: "bg-red-100", 
    text: "text-red-700",
    border: "border-red-200",
    shadow: "shadow-[inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.05),2px_2px_5px_rgba(0,0,0,0.05)]"
  };
  return {
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200", 
    shadow: "shadow-[inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.05),2px_2px_5px_rgba(0,0,0,0.05)]"
  };
};

const GameActionButtons: React.FC<Props> = ({
  actions,
  handleAction,
  eventMessage,
  entity,
  onActionComplete,
  round = 1,
  rerollCount,
  onReroll,
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

  // Reroll button styles (Claymorphism)
  const rerollStyles = {
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-200",
    shadow: "shadow-[inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.05),2px_2px_5px_rgba(0,0,0,0.05)]"
  };

  return (
    <div className="action-buttons-container w-full flex flex-row flex-wrap justify-center gap-6 xl:gap-10 items-start mt-4">
      {actions.map((action, idx) => {
        const modifiedEffects = getModifiedEffects(action.effects);
        return (
          <button
            key={`${action.name}-${idx}`}
            onClick={() => memoizedHandleAction(action)}
            disabled={!!eventMessage || clickedAction !== null}
            style={
              {
                "--idle-scale": 1.02 + ((idx % 4) * 0.01),
                animationDelay: `${(idx * 0.5) % 3}s`,
                animationDuration: `${5 + (idx * 0.7) % 3}s`,
              } as React.CSSProperties
            }
            className={`
              group relative
              flex flex-col items-center
              w-[24vh] max-w-[220px] min-w-[140px]
              transition-all duration-300 ease-out
              animate-idleZoom
              bg-transparent
              border-none
              p-0
              ${
                clickedAction === action.name
                  ? "animate-cardSelectExit pointer-events-none"
                  : clickedAction !== null
                  ? "opacity-50 scale-95 grayscale cursor-not-allowed"
                  : "hover:-translate-y-2"
              }
            `}
          >
            {/* Image Container - Aspect 9:16 with Clay Effect - NO Border/Shadow as requested */}
            <div 
              className="relative w-full aspect-[9/16] rounded-3xl overflow-hidden mb-1 transition-transform duration-300"
              style={{
                // Removed border and shadow
                boxShadow: "none",
                border: "none"
              }}
            >
              <img
                src={action.imageUrl || DEFAULT_IMG}
                alt={action.name}
                className="object-cover w-full h-full pointer-events-none select-none transition-transform duration-500"
                draggable={false}
              />
              {/* Gloss Overlay - kept for subtle depth */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-30 pointer-events-none" />
              
              {/* Name Overlay on Hover - Inside Image area for better visibility when name is hidden outside */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                 <span className="text-white font-bold text-xl text-center px-2 drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                   {action.name}
                 </span>
              </div>
            </div>

            {/* Content Container - External - Name Removed from here, Effects Only */}
            <div className="flex flex-col items-center w-full gap-2">
              <div className="flex flex-wrap justify-center gap-2 w-full">
                {(Object.entries(modifiedEffects) as [Entity, number][]).map(
                  ([e, value]) => {
                    if (value === 0) return null;
                    const styles = getEffectStyles(value);
                    return (
                      <div
                        key={e}
                        className={`
                          flex items-center gap-1.5 px-3 py-1.5 rounded-xl border
                          ${styles.bg} ${styles.border} ${styles.shadow}
                          transition-transform hover:scale-105
                        `}
                      >
                        <span className="text-xs xl:text-sm font-bold text-slate-600">
                          {LABELS[e]}:
                        </span>
                        <span className={`text-sm xl:text-base font-black ${styles.text}`}>
                          {/* Removed +/- signs */}
                          {Math.abs(value)}
                        </span>
                      </div>
                    );
                  }
                )}
            </div>
            </div>
          </button>
        );
      })}

      {/* Reroll Button - Same Dimensions as Cards */}
      <button
        onClick={onReroll}
        disabled={rerollCount === 0 || !!eventMessage || clickedAction !== null}
        className={`
          group relative
          flex flex-col items-center justify-center
          w-[24vh] max-w-[220px] min-w-[140px]
          aspect-[9/16] 
          rounded-3xl
          transition-all duration-300 ease-out
          animate-idleZoom
          p-4
          ${rerollStyles.bg}
          ${rerollStyles.shadow}
          border-2 ${rerollStyles.border}
          ${
            rerollCount > 0 && !eventMessage && clickedAction === null
              ? "hover:-translate-y-2 cursor-pointer hover:brightness-105"
              : "opacity-60 grayscale cursor-not-allowed"
          }
        `}
        style={{
          "--idle-scale": 1.03,
          animationDelay: "1s",
          animationDuration: "6s",
        } as React.CSSProperties}
      >
        {/* Badge */}
        <div className="absolute top-4 right-4 bg-red-500 text-white text-base font-black rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-10">
          {rerollCount}
        </div>

        {/* Content */}
        <div className="flex flex-col items-center gap-4 z-10">
          {/* SVG Icon - Refresh/Dice */}
          <div className={`p-4 rounded-full bg-white/40 backdrop-blur-sm shadow-inner ${rerollCount > 0 && !eventMessage && clickedAction === null ? "group-hover:rotate-180 transition-transform duration-700 ease-in-out" : ""}`}>
             <svg 
               xmlns="http://www.w3.org/2000/svg" 
               className={`w-12 h-12 ${rerollStyles.text}`} 
               fill="none" 
               viewBox="0 0 24 24" 
               stroke="currentColor" 
               strokeWidth={2.5}
             >
               <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
             </svg>
          </div>
          
          <span className={`text-xl font-black uppercase tracking-wider ${rerollStyles.text}`}>
            Đổi bài
          </span>
          
          <div className="text-xs font-medium text-amber-700/70 text-center px-2">
            Thay đổi danh sách hành động hiện tại
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl" />
      </button>
    </div>
  );
};
export default GameActionButtons;
