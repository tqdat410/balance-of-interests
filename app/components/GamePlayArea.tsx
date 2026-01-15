import React from "react";
import dynamic from "next/dynamic";
import GameActionButtons from "./GameActionButtons";
import GameHeader from "./GameHeader";
import GameStatus from "./GameStatus";
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
    <div className="clay-card p-4 w-full h-64 flex items-center justify-center">
      <span className="text-slate-400">Đang tải biểu đồ...</span>
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
    <div className="w-full h-full flex flex-col">
      {/* Desktop Layout - uses full height, centers content */}
      <div className="hidden md:flex w-full h-full flex-col px-3 xl:px-6 items-center justify-center">
        {/* Chart Section - responsive max-width for larger screens */}
        <div className="w-[70%] max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] mx-auto flex-shrink-0">
          <StatusLineChart
            history={history}
            currentBars={bars}
            currentRound={round}
            currentTurnIndex={turnIndex}
          />
        </div>

        {/* Action Area - Compact, responsive */}
        <div className="w-full max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] mx-auto mt-2 xl:mt-1 flex flex-col items-center">
          {currentEntity && (
            <>
              {/* Info Text - Enhanced Styling */}
              <div className="text-center px-6 py-2 rounded-full bg-white/50 backdrop-blur-sm inline-flex items-center gap-4">
                <span className="text-slate-600 font-bold text-sm xl:text-lg">
                  Vòng {round}/30
                </span>
                <span className="text-slate-400 font-light mx-1">|</span>
                <span className="text-slate-600 font-bold text-sm xl:text-lg">
                  Lượt {turnIndex + 1}/{turnOrder.length}
                </span>
                <span className="text-slate-400 font-light mx-1">:</span>
                <span 
                  className={`text-base xl:text-xl font-black uppercase tracking-wide
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
              
              {/* Cards - Centered */}
              <div className="w-full flex justify-center">
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

      {/* Mobile Layout */}
      <div className="mobile-game-container md:hidden flex flex-col p-3 gap-3">
        <GameHeader round={round} />
        <GameStatus bars={bars} />

        {currentEntity && (
          <div className="text-center text-sm text-slate-600">
            Lượt {turnIndex + 1}/{turnOrder.length} -{" "}
            <span className="font-semibold text-purple-600">
              {currentEntity === "Government" && "Nhà Nước"}
              {currentEntity === "Businesses" && "Doanh Nghiệp"}
              {currentEntity === "Workers" && "Người Lao Động"}
            </span>
          </div>
        )}

        {currentEntity && (
          <div className="flex-1">
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
        )}
      </div>
    </div>
  );
}
