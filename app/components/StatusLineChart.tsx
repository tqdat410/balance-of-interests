"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
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

// Initial values - Must match Game Config (20)
const INITIAL_BARS: Bars = {
  Government: 20,
  Businesses: 20,
  Workers: 20,
};

// Total turns in game: 30 rounds × 3 turns = 90 turns
const TOTAL_TURNS = 90;
// Pixels per data point for horizontal spacing
const PIXELS_PER_POINT = 25;
// Fixed chart width to show all 90 turns upfront
const CHART_WIDTH = TOTAL_TURNS * PIXELS_PER_POINT;
// Y-axis width for sticky positioning
const Y_AXIS_WIDTH = 36;
// Chart height - responsive values for different screen sizes
const CHART_HEIGHT = 220;
// Y-axis display range (0-60 for display, actual values 0-50)
const Y_MAX = 60;
// Y-axis ticks (do not show 60)
const Y_TICKS = [0, 10, 20, 30, 40, 50];

// Layout Constants for precise alignment
const MARGIN_TOP = 20;
const MARGIN_BOTTOM = 10;
const X_AXIS_HEIGHT = 30;

// Custom Dot Component for Clay effect
const ClayDot = (props: any) => {
  const { cx, cy, stroke, payload } = props;
  const entityName = Object.keys(ENTITY_COLORS).find(
    key => ENTITY_COLORS[key as Entity] === stroke
  );
  
  if (!cx || !cy) return null;

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={`url(#grad-${entityName})`}
        filter="url(#clay-dot-shadow)"
        stroke="none"
      />
      {/* Small highlight for extra gloss */}
      <circle
        cx={cx - 2}
        cy={cy - 2}
        r={1.5}
        fill="white"
        fillOpacity={0.4}
      />
    </g>
  );
};

const StatusLineChart: React.FC<Props> = ({
  history,
  currentBars,
  currentRound,
  currentTurnIndex,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const lastDataPointRef = useRef<number>(0);
  const [chartHeight, setChartHeight] = useState(CHART_HEIGHT);

  // Update chart height when container resizes (for responsive CSS classes)
  useEffect(() => {
    const updateHeight = () => {
      if (chartContainerRef.current) {
        setChartHeight(chartContainerRef.current.clientHeight);
      }
    };
    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    if (chartContainerRef.current) {
      resizeObserver.observe(chartContainerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

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

    // Always start with Start point at x=0
    data.push({
      x: 0,
      label: "Start",
      ...currentValues,
      round: 0,
      turn: 0,
    });

    let xCounter = 0;
    let lastRound = 0;
    let turnInRound = 0;

    history.forEach((entry, index) => {
      // Update values based on effects
      Object.entries(entry.effects).forEach(([entity, value]) => {
        if (entity in currentValues) {
          currentValues[entity as Entity] = Math.max(
            0,
            Math.min(50, currentValues[entity as Entity] + value)
          );
        }
      });

      // Robust Event Detection
      const isEvent = 
        entry.entity === "Event" || 
        entry.action.startsWith("Sự kiện") || 
        entry.action.startsWith("Cơ hội");

      // X-Axis Logic
      if (isEvent) {
         // For events, we advance X if executed (has effect)
         const hasEffect = Object.values(entry.effects).some((v) => v !== 0);
         if (hasEffect) {
           xCounter++;
         }
      } else {
         // Regular Turn
         const prevEntry = history[index - 1];
         const prevIsEvent = prevEntry && (
           prevEntry.entity === "Event" || 
           prevEntry.action.startsWith("Sự kiện") || 
           prevEntry.action.startsWith("Cơ hội")
         );
         const prevWasExecEvent =
           prevIsEvent &&
           Object.values(prevEntry.effects).some((v) => v !== 0);

         // Advance X only if NOT following an executed event
         if (!prevWasExecEvent) {
           xCounter++;
         }
      }

      // Round/Turn Calculation
      if (entry.round !== lastRound) {
        lastRound = entry.round;
        turnInRound = 1;
      } else {
        if (!isEvent) {
           turnInRound++;
        }
      }

      // Push Data - Only if X advanced or we are updating an existing X (Event+Turn case)
      // Note: If skipped event, xCounter didn't change, we effectively don't push? 
      // Actually, if xCounter didn't change for a Regular Turn (after event), we DO want to push/update.
      
      if (isEvent) {
         const hasEffect = Object.values(entry.effects).some((v) => v !== 0);
         if (hasEffect) {
            data.push({
              x: xCounter,
              label: `Sự kiện V${entry.round}`,
              ...currentValues,
              round: entry.round,
              turn: 0,
            });
         }
      } else {
         data.push({
            x: xCounter,
            label: `R${entry.round}.${turnInRound}`,
            ...currentValues,
            round: entry.round,
            turn: turnInRound,
         });
      }
    });

    return data;
  }, [history]); // Removed currentBars dependency as we rely solely on history now

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
          className="px-4 py-3 text-sm rounded-2xl animate-in zoom-in-95 duration-200"
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(8px)",
            boxShadow: "6px 6px 12px rgba(163, 177, 198, 0.3), -6px -6px 12px rgba(255, 255, 255, 1)",
            border: "1px solid rgba(255,255,255,0.6)"
          }}
        >
          <p className="font-bold text-slate-700 mb-2 border-b border-slate-200 pb-1">
            {payload[0]?.payload?.label}
          </p>
          <div className="flex flex-col gap-1">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ 
                    background: entry.color,
                    boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.8), 1px 1px 2px rgba(0,0,0,0.1)" 
                  }}
                />
                <span className="font-bold text-slate-600 w-6">{ENTITY_LABELS[entry.name as Entity]}</span>
                <span className="font-black text-lg" style={{ color: entry.color }}>{entry.value}</span>
              </div>
            ))}
          </div>
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
        className="relative rounded-3xl overflow-hidden"
        style={{
          // Classic Clay/Neumorphism base color - distinct from white but still very bright
          background: "#ECF0F3", 
          // Deeper, sharper shadows for stronger contrast
          boxShadow: "inset 6px 6px 12px rgba(166, 180, 200, 0.4), inset -6px -6px 12px rgba(255, 255, 255, 1)",
          border: "1px solid rgba(255,255,255,0.4)"
        }}
      >
        {/* Chart container - flexible height based on viewport */}
        {/* Uses vh units: ~28vh on laptop, scales up on larger screens */}
        <div ref={chartContainerRef} className="flex h-[28vh] min-h-[180px] max-h-[320px]">
          {/* Sticky Y-Axis - Uses explicit HTML positioning for perfect reliability */}
          <div
            className="flex-shrink-0 z-10 relative"
            style={{
              width: Y_AXIS_WIDTH,
              background: "#ECF0F3", // Match container
              borderRight: "1px solid rgba(166, 180, 200, 0.2)", // Subtle darker border
            }}
          >
            <div className="relative w-full h-full">
              {Y_TICKS.map((tick) => {
                // Calculate position exactly matching Recharts linear scale
                // Uses dynamic chartHeight for responsive sizing
                const gridHeight = chartHeight - MARGIN_TOP - MARGIN_BOTTOM - X_AXIS_HEIGHT;
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
                      className="text-xs font-bold text-slate-500" // Increased from text-[10px] to text-xs (12px)
                      style={{ color: "#475569" }}
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
                  <defs>
                    {/* Shadow filter for lines to make them float */}
                    <filter id="clay-line-shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.15" />
                    </filter>
                    
                    {/* Shadow filter for dots */}
                    <filter id="clay-dot-shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.2" />
                    </filter>

                    {/* Gradients for 3D sphere look */}
                    <radialGradient id="grad-Government" cx="30%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#fca5a5" /> {/* lighter red */}
                      <stop offset="100%" stopColor="#ef4444" /> {/* darker red */}
                    </radialGradient>
                    <radialGradient id="grad-Businesses" cx="30%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#93c5fd" /> {/* lighter blue */}
                      <stop offset="100%" stopColor="#3b82f6" /> {/* darker blue */}
                    </radialGradient>
                    <radialGradient id="grad-Workers" cx="30%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#86efac" /> {/* lighter green */}
                      <stop offset="100%" stopColor="#22c55e" /> {/* darker green */}
                    </radialGradient>
                  </defs>

                  {/* Horizontal grid lines - Automatic alignment */}
                  <CartesianGrid
                    strokeDasharray="0"
                    stroke="rgba(166, 180, 200, 0.4)" 
                    vertical={false}
                  />

                  {/* Round markers (every 3 turns) */}
                  {roundMarkers.map(({ x, round }) => (
                    <ReferenceLine
                      key={`round-${round}`}
                      x={x}
                      stroke={round % 5 === 0 ? "rgba(166, 180, 200, 0.6)" : "rgba(166, 180, 200, 0.2)"}
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
                    tick={{ fontSize: 12, fill: "#475569", fontWeight: 700 }} // Increased font size & contrast
                    axisLine={{ stroke: "rgba(166, 180, 200, 0.4)", strokeWidth: 2 }}
                    tickLine={false}
                    height={X_AXIS_HEIGHT} // Explicit height
                    dy={5}
                  />

                  <YAxis 
                    domain={[0, Y_MAX]} 
                    ticks={Y_TICKS} 
                    hide 
                    padding={{ top: 0, bottom: 0 }} 
                  />

                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 2 }} />

                  {/* Smooth curved lines with Clay effect */}
                  <Line
                    type="monotone"
                    dataKey="Government"
                    stroke={ENTITY_COLORS.Government}
                    strokeWidth={5}
                    strokeLinecap="round"
                    dot={<ClayDot />}
                    activeDot={{ r: 8, fill: "url(#grad-Government)", stroke: "#fff", strokeWidth: 3, filter: "url(#clay-dot-shadow)" }}
                    connectNulls={false}
                    isAnimationActive={true}
                    animationDuration={500}
                    filter="url(#clay-line-shadow)"
                  />
                  <Line
                    type="monotone"
                    dataKey="Businesses"
                    stroke={ENTITY_COLORS.Businesses}
                    strokeWidth={5}
                    strokeLinecap="round"
                    dot={<ClayDot />}
                    activeDot={{ r: 8, fill: "url(#grad-Businesses)", stroke: "#fff", strokeWidth: 3, filter: "url(#clay-dot-shadow)" }}
                    connectNulls={false}
                    isAnimationActive={true}
                    animationDuration={500}
                    filter="url(#clay-line-shadow)"
                  />
                  <Line
                    type="monotone"
                    dataKey="Workers"
                    stroke={ENTITY_COLORS.Workers}
                    strokeWidth={5}
                    strokeLinecap="round"
                    dot={<ClayDot />}
                    activeDot={{ r: 8, fill: "url(#grad-Workers)", stroke: "#fff", strokeWidth: 3, filter: "url(#clay-dot-shadow)" }}
                    connectNulls={false}
                    isAnimationActive={true}
                    animationDuration={500}
                    filter="url(#clay-line-shadow)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Current values display (Legend) - compact on laptop, larger on big screens */}
      <div className="flex justify-center gap-3 xl:gap-6 mt-4 mb-2">
        {(["Government", "Businesses", "Workers"] as Entity[]).map((entity) => {
          // Calculate fill percentage (0-50 scale)
          const value = currentBars[entity];
          const percentage = Math.min(100, Math.max(0, (value / 50) * 100));
          const color = ENTITY_COLORS[entity];
          
          return (
            <div
              key={entity}
              className="relative flex items-center gap-2 px-3 py-2 xl:px-4 xl:py-3 rounded-2xl transition-all hover:-translate-y-1 overflow-hidden"
              style={{
                // Changed from white to Slate-100 for better contrast against the chart/page
                background: "#F1F5F9", 
                // Claymorphism shadow/border
                border: "2px solid rgba(255,255,255,0.6)",
                boxShadow: "4px 4px 8px rgba(163, 177, 198, 0.25), -4px -4px 8px rgba(255, 255, 255, 0.9)",
                minWidth: "100px" // Reduced min-width
              }}
            >
              {/* Progress Bar Fill Background - Subtle Lighter Strip */}
              <div 
                className="absolute inset-y-0 left-0 transition-all duration-500 ease-out"
                style={{
                  width: `${percentage}%`,
                  // Subtle gradient fill behind
                  background: `linear-gradient(to right, ${color}10, ${color}30)`, 
                  borderRight: `2px solid ${color}60`, // Semi-transparent border
                }}
              />

              <div
                className="relative z-10 w-3 h-3 xl:w-4 xl:h-4 rounded-full"
                style={{ 
                  backgroundColor: color,
                  boxShadow: `inset 1.5px 1.5px 3px rgba(255,255,255,0.7), inset -1.5px -1.5px 3px rgba(0,0,0,0.1), 2px 2px 4px rgba(0,0,0,0.15)`
                }}
              />
              <span className="relative z-10 text-xs xl:text-sm font-black tracking-wide" style={{ color: color, textShadow: "1px 1px 0px white" }}>
                {ENTITY_LABELS[entity]}
              </span>
              <span className="relative z-10 ml-auto text-xs xl:text-sm font-black text-slate-700 pl-2">
                {currentBars[entity]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusLineChart;
