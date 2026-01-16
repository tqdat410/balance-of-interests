import React from "react";
import dynamic from "next/dynamic";
import GameActionButtons from "./GameActionButtons";
import {
  Entity,
  LogEntry,
  Bars,
  GameAction,
} from "@/lib/types";

// Dynamic import for chart
const StatusLineChart = dynamic(() => import("./StatusLineChart"), {
  ssr: false,
  loading: () => (
    <div className="clay-card p-4 w-full h-40 sm:h-64 flex items-center justify-center">
      <span className="text-slate-400 text-sm sm:text-base">Đang tải biểu đồ...</span>
    </div>
  ),
});

interface GamePlayAreaProps {
  history: LogEntry[];
  bars: Bars;
  round: number;
  turnIndex: number;
  currentEntity: Entity | null;
  turnOrder: Entity[];
  availableActions: GameAction[];
  handleAction: (action: GameAction) => void;
  eventMessage: string | null;
  handleActionComplete: () => void;
  rerollCount: number;
  onReroll: () => void;
}

export default function GamePlayArea({
  history,
  bars,
  round,
  turnIndex,
  currentEntity,
  turnOrder,
  availableActions,
  handleAction,
  eventMessage,
  handleActionComplete,
  rerollCount,
  onReroll,
}: GamePlayAreaProps) {
  return (
    // Unified Layout - same structure for all screen sizes
    // Mobile/Tablet (<1024px) OR Landscape (<700px height): scrollable
    <div className="w-full min-h-full flex flex-col px-2 sm:px-3 xl:px-6 py-2 lg:py-0 items-center justify-start lg:justify-center gap-2 lg:gap-0">
      {/* Chart Section - responsive width and sizing */}
      <div className="w-full sm:w-[90%] md:w-[85%] lg:w-[70%] max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] mx-auto flex-shrink-0">
        <StatusLineChart
          history={history}
          currentBars={bars}
          currentRound={round}
          currentTurnIndex={turnIndex}
        />
      </div>

      {/* Action Area - Responsive sizing */}
      <div className="w-full max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] mx-auto mt-1 lg:mt-2 xl:mt-1 flex flex-col items-center">
        {currentEntity && (
          <>
            {/* Info Text - Scales with screen size */}
            <div className="text-center px-3 sm:px-6 py-1.5 sm:py-2 rounded-full bg-white/50 backdrop-blur-sm inline-flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
              <span className="text-slate-600 font-bold text-xs sm:text-sm xl:text-lg">
                Vòng {round}/30
              </span>
              <span className="text-slate-400 font-light mx-0.5 sm:mx-1">|</span>
              <span className="text-slate-600 font-bold text-xs sm:text-sm xl:text-lg">
                Lượt {turnIndex + 1}/{turnOrder.length}
              </span>
              <span className="text-slate-400 font-light mx-0.5 sm:mx-1">:</span>
              <span 
                className={`text-sm sm:text-base xl:text-xl font-black uppercase tracking-wide
                  ${currentEntity === "Government" ? "text-red-500" : ""}
                  ${currentEntity === "Businesses" ? "text-blue-500" : ""}
                  ${currentEntity === "Workers" ? "text-green-500" : ""}
                `}
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
              >
                {currentEntity === "Government" && "Nhà Nước"}
                {currentEntity === "Businesses" && "Doanh Nghiệp"}
                {currentEntity === "Workers" && "Người Lao Động"}
              </span>
            </div>
            
            {/* Cards - Centered, responsive */}
            <div className="w-full flex justify-center pb-4 lg:pb-0">
              <GameActionButtons
                actions={availableActions}
                handleAction={handleAction}
                eventMessage={eventMessage}
                entity={currentEntity}
                onActionComplete={handleActionComplete}
                round={round}
                rerollCount={rerollCount}
                onReroll={onReroll}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
