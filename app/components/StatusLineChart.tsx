"use client";

import React, { useMemo, useRef, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

type Entity = "Government" | "Businesses" | "Workers";
type Bars = Record<Entity, number>;

interface LogEntry {
  round: number;
  entity: Entity | "Event";
  action: string;
  effects: Record<string, number>;
}

interface Props {
  history: LogEntry[];
  currentBars: Bars;
  currentRound: number;
  currentTurnIndex: number;
}

// Claymorphism-friendly pastel colors
const ENTITY_COLORS: Record<Entity, string> = {
  Government: "#f87171", // red-400
  Businesses: "#60a5fa", // blue-400
  Workers: "#4ade80", // green-400
};

const ENTITY_LABELS: Record<Entity, string> = {
  Government: "N",
  Businesses: "D",
  Workers: "L",
};

// Initial values
const INITIAL_BARS: Bars = {
  Government: 25,
  Businesses: 25,
  Workers: 25,
};

// Total turns in game: 30 rounds × 3 turns = 90 turns
// Total turns in game: 30 rounds × 3 turns = 90 turns
const TOTAL_TURNS = 90;
// Pixels per data point for horizontal spacing
const PIXELS_PER_POINT = 35;
// Fixed chart width to show all 90 turns upfront
const CHART_WIDTH = TOTAL_TURNS * PIXELS_PER_POINT;
// Y-axis width for sticky positioning
const Y_AXIS_WIDTH = 36;
// Chart height
const CHART_HEIGHT = 220; // Reduced from 280 to save space on laptop
// Y-axis display range (0-60 for display, actual values 0-50)
const Y_MAX = 60;
// Y-axis ticks (do not show 60)
const Y_TICKS = [0, 10, 20, 30, 40, 50];

// Layout Constants for precise alignment
const MARGIN_TOP = 20;
const MARGIN_BOTTOM = 10; // Reduced margin, as XAxis height provides spacing
const X_AXIS_HEIGHT = 30; // Explicit height reserved for X-Axis

const StatusLineChart: React.FC<Props> = ({
  history,
  currentBars,
  currentRound,
  currentTurnIndex,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastDataPointRef = useRef<number>(0);

  // Build chart data from history with sequential X values
  const chartData = useMemo(() => {
    const data: Array<{
      x: number;
      label: string;
      Government: number | null;
      Businesses: number | null;
      Workers: number | null;
      round: number;
      turn: number;
    }> = [];

    // Start with initial values at position 0
    const currentValues = { ...INITIAL_BARS };

    data.push({
      x: 0,
      label: "Bắt đầu",
      ...currentValues,
      round: 0,
      turn: 0,
    });

    // Process history to build timeline
    let lastRound = 0;
    let turnInRound = 0;

    history.forEach((entry, index) => {
      const isNewRound = entry.round !== lastRound;
      if (isNewRound) {
        lastRound = entry.round;
        turnInRound = 1;
      } else {
        turnInRound++;
      }

      // Apply effects - clamp to actual game range 0-50
      Object.entries(entry.effects).forEach(([entity, value]) => {
        if (entity in currentValues) {
          currentValues[entity as Entity] = Math.max(
            0,
            Math.min(50, currentValues[entity as Entity] + value)
          );
        }
      });

      data.push({
        x: index + 1,
        label: `Vòng ${entry.round}, Lượt ${turnInRound}`,
        ...currentValues,
        round: entry.round,
        turn: turnInRound,
      });
    });

    // Add current state if different
    if (data.length > 0) {
      const last = data[data.length - 1];
      if (
        last.Government !== currentBars.Government ||
        last.Businesses !== currentBars.Businesses ||
        last.Workers !== currentBars.Workers
      ) {
        data.push({
          x: data.length,
          label: `Vòng ${currentRound}, Lượt ${currentTurnIndex + 1}`,
          ...currentBars,
          round: currentRound,
          turn: currentTurnIndex + 1,
        });
      }
    }

    return data;
  }, [history, currentBars, currentRound, currentTurnIndex]);

  // Smart auto-scroll: keep current data point visible, not jump to end
  useEffect(() => {
    if (scrollContainerRef.current && chartData.length > 0) {
      const container = scrollContainerRef.current;
      const containerWidth = container.clientWidth;
      const currentDataX = chartData.length - 1;
      const currentPixelPosition = currentDataX * PIXELS_PER_POINT;
      
      const visibleStart = container.scrollLeft;
      const visibleEnd = container.scrollLeft + containerWidth;
      const targetPosition = currentPixelPosition - containerWidth * 0.3;
      
      if (currentPixelPosition > visibleEnd - 100 || currentPixelPosition < visibleStart + 50) {
        if (currentDataX !== lastDataPointRef.current) {
          container.scrollTo({
            left: Math.max(0, targetPosition),
            behavior: "smooth",
          });
        }
      }
      
      lastDataPointRef.current = currentDataX;
    }
  }, [chartData.length]);

  // Generate round markers (every 3 turns = new round)
  const roundMarkers = useMemo(() => {
    const markers: { x: number; round: number }[] = [];
    for (let round = 1; round <= 30; round++) {
      const xPos = (round - 1) * 3 + 1;
      markers.push({ x: xPos, round });
    }
    return markers;
  }, []);

  // X-axis ticks at round boundaries
  const xAxisTicks = useMemo(() => {
    const ticks: number[] = [0];
    for (let round = 5; round <= 30; round += 5) {
      ticks.push((round - 1) * 3 + 1);
    }
    return ticks;
  }, []);

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      color: string;
      name: string;
      value: number;
      payload: { label: string };
    }>;
  }) => {
    if (active && payload && payload.length && payload[0]?.value !== null) {
      return (
        <div
          className="px-3 py-2 text-xs rounded-xl"
          style={{
            background: "rgba(253, 246, 227, 0.95)",
            boxShadow: "4px 4px 8px rgba(170, 160, 140, 0.2), -4px -4px 8px rgba(255, 255, 255, 0.9)",
            border: "2px solid rgba(170, 160, 140, 0.1)",
          }}
        >
          <p className="font-semibold text-slate-600 mb-1">
            {payload[0]?.payload?.label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-medium">
              {ENTITY_LABELS[entry.name as Entity]}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom X-axis tick formatter
  const formatXTick = (value: number) => {
    if (value === 0) return "0";
    const round = Math.floor((value - 1) / 3) + 1;
    return `R${round}`;
  };

  return (
    <div className="w-full">
      {/* Chart with Sticky Y-Axis */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "var(--clay-surface)",
          boxShadow: "inset 2px 2px 6px rgba(255, 255, 255, 0.8), inset -2px -2px 6px rgba(170, 160, 140, 0.1)",
        }}
      >
        <div className="flex" style={{ height: CHART_HEIGHT }}>
          {/* Sticky Y-Axis - Uses explicit HTML positioning for perfect reliability */}
          <div
            className="flex-shrink-0 z-10 relative"
            style={{
              width: Y_AXIS_WIDTH,
              background: "var(--clay-surface)",
              borderRight: "1px solid rgba(170, 160, 140, 0.1)",
            }}
          >
            <div className="relative w-full h-full">
              {Y_TICKS.map((tick) => {
                // Calculate position exactly matching Recharts linear scale
                // Recharts with explicit X-axis height subtracts that height from available vertical space
                const gridHeight = CHART_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM - X_AXIS_HEIGHT;
                const percentage = tick / Y_MAX;
                const topPosition = MARGIN_TOP + gridHeight * (1 - percentage);
                
                return (
                  <div
                    key={tick}
                    className="absolute w-full text-center flex justify-center"
                    style={{
                      top: topPosition,
                      transform: "translateY(-50%)", // Center vertically on the grid line
                    }}
                  >
                    <span
                      className="text-[10px] font-medium text-slate-500"
                      style={{ color: "#6b7280" }}
                    >
                      {tick}
                    </span>
                  </div>
                );
              })}
              
              {/* Custom Right Border Line - Constrained to match chart grid exactly */}
              <div
                className="absolute right-0 w-[1px]"
                style={{
                  background: "rgba(170, 160, 140, 0.3)",
                  top: MARGIN_TOP,
                  bottom: MARGIN_BOTTOM + X_AXIS_HEIGHT,
                }}
              />
            </div>
          </div>

          {/* Scrollable Chart Area - Hidden Scrollbar */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-x-auto"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div style={{ width: CHART_WIDTH, height: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: MARGIN_TOP, right: 20, left: 0, bottom: MARGIN_BOTTOM }}
                >
                  {/* Horizontal grid lines - Automatic alignment */}
                  <CartesianGrid
                    strokeDasharray="0"
                    stroke="rgba(170, 160, 140, 0.15)"
                    vertical={false}
                  />

                  {/* Round markers (every 3 turns) */}
                  {roundMarkers.map(({ x, round }) => (
                    <ReferenceLine
                      key={`round-${round}`}
                      x={x}
                      stroke={round % 5 === 0 ? "rgba(170, 160, 140, 0.4)" : "rgba(170, 160, 140, 0.15)"}
                      strokeWidth={round % 5 === 0 ? 1.5 : 1}
                      strokeDasharray={round % 5 === 0 ? "0" : "4 4"}
                    />
                  ))}

                  {/* X-Axis with round numbers */}
                  <XAxis
                    dataKey="x"
                    type="number"
                    domain={[0, TOTAL_TURNS]}
                    ticks={xAxisTicks}
                    tickFormatter={formatXTick}
                    tick={{ fontSize: 9, fill: "#6b7280" }}
                    axisLine={{ stroke: "rgba(170, 160, 140, 0.4)" }}
                    tickLine={{ stroke: "rgba(170, 160, 140, 0.3)" }}
                    height={X_AXIS_HEIGHT} // Explicit height
                  />

                  <YAxis 
                    domain={[0, Y_MAX]} 
                    ticks={Y_TICKS} 
                    hide 
                    padding={{ top: 0, bottom: 0 }} 
                  />

                  <Tooltip content={<CustomTooltip />} />

                  {/* Smooth curved lines */}
                  <Line
                    type="monotone"
                    dataKey="Government"
                    stroke={ENTITY_COLORS.Government}
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: ENTITY_COLORS.Government, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: ENTITY_COLORS.Government, stroke: "#fff", strokeWidth: 2 }}
                    connectNulls={false}
                    isAnimationActive={true}
                    animationDuration={300}
                  />
                  <Line
                    type="monotone"
                    dataKey="Businesses"
                    stroke={ENTITY_COLORS.Businesses}
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: ENTITY_COLORS.Businesses, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: ENTITY_COLORS.Businesses, stroke: "#fff", strokeWidth: 2 }}
                    connectNulls={false}
                    isAnimationActive={true}
                    animationDuration={300}
                  />
                  <Line
                    type="monotone"
                    dataKey="Workers"
                    stroke={ENTITY_COLORS.Workers}
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: ENTITY_COLORS.Workers, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: ENTITY_COLORS.Workers, stroke: "#fff", strokeWidth: 2 }}
                    connectNulls={false}
                    isAnimationActive={true}
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Current values display (Legend moved here) */}
      <div className="flex justify-center gap-6 mt-1">
        {(["Government", "Businesses", "Workers"] as Entity[]).map((entity) => (
          <div
            key={entity}
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all"
            style={{
              background: `linear-gradient(135deg, ${ENTITY_COLORS[entity]}15 0%, ${ENTITY_COLORS[entity]}05 100%)`,
              border: `1px solid ${ENTITY_COLORS[entity]}40`,
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
            }}
          >
             <div
              className="w-3 h-3 rounded-full shadow-sm"
              style={{ backgroundColor: ENTITY_COLORS[entity] }}
            />
            <span className="text-sm font-bold" style={{ color: ENTITY_COLORS[entity] }}>
              {ENTITY_LABELS[entity]}
            </span>
            <span className="text-sm font-semibold text-slate-600 ml-1">
              {currentBars[entity]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusLineChart;
