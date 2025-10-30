"use client";

import React, { useRef, useState } from "react";

type Entity = "Government" | "Businesses" | "Workers";
type Bars = Record<Entity, number>;
interface Props {
  bars: Bars;
  entities: Entity[];
  getBarColor?: (value: number) => string;
}

const LABELS: Record<Entity, string> = {
  Government: "N",
  Businesses: "D",
  Workers: "L",
};

// Color classes to match glass3d backgrounds for each role
const barLabelColor: Record<Entity, string> = {
  Government: "text-red-500", // matches glass3d-n (background: rgba(255, 0, 0, 0.45))
  Businesses: "text-blue-600", // matches glass3d-d (background: rgba(0, 0, 255, 0.3))
  Workers: "text-green-600", // matches glass3d-l (background: rgba(0, 255, 0, 0.35))
};

const getStatusBarColor = (value: number) => {
  if (value >= 35) return "bg-green-500";
  if (value >= 20) return "bg-yellow-400";
  return "bg-red-500";
};

const MAX_BAR = 50;
const ROLE_LABELS: Record<Entity, string> = {
  Government: "Nhà nước",
  Businesses: "Doanh Nghiệp",
  Workers: "Người lao động",
};

const GameStatusBars: React.FC<Props> = ({ bars, entities, getBarColor }) => {
  // Track mouse position for tooltip
  const [tooltip, setTooltip] = useState<{
    idx: number;
    x: number;
    y: number;
  } | null>(null);

  // Track bar changes for animation
  const [prevBars, setPrevBars] = useState<Bars>(bars);
  const [changedBars, setChangedBars] = useState<Set<Entity>>(new Set());

  React.useEffect(() => {
    const changed = new Set<Entity>();
    entities.forEach(entity => {
      if (bars[entity] !== prevBars[entity]) {
        changed.add(entity);
      }
    });

    if (changed.size > 0) {
      setChangedBars(changed);
      setPrevBars(bars);

      // Clear animation flags after animation completes
      const timer = setTimeout(() => {
        setChangedBars(new Set());
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [bars, prevBars, entities]);
  return (
    <div className="flex flex-col items-center min-w-fit">
      <h2 className="text-3xl text-purple-600 mb-2">Tình trạng xã hội</h2>
      <div className="flex flex-row justify-center items-end gap-6">
        {entities.map((entity, idx) => {
          const percent = Math.max(
            0,
            Math.min(100, (bars[entity] / MAX_BAR) * 100)
          );
          return (
            <div
              key={entity}
              className="flex flex-col items-center group relative"
              onMouseMove={(e) => {
                setTooltip({ idx, x: e.pageX, y: e.pageY });
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              <span
                className={`text-xl mb-1 ${barLabelColor[entity]} transition-transform duration-150 group-hover:-translate-y-1.5 group-hover:scale-101 ${changedBars.has(entity) ? 'animate-actionShake' : ''}`}
              >
                {LABELS[entity]}
              </span>
              <div
                className={`relative transition-transform duration-150 group-hover:-translate-y-1 group-hover:scale-101 ${changedBars.has(entity) ? 'animate-actionGlow' : ''}`}
              >
                <div className="h-100 w-5 bg-slate-400 rounded-full flex items-end overflow-hidden">
                  <div
                    className={`${getStatusBarColor(
                      bars[entity]
                    )} w-5 rounded-b-full transition-all duration-500 ${changedBars.has(entity) ? 'animate-actionPulse' : ''}`}
                    style={{ height: `${percent}%` }}
                  />
                </div>
              </div>
              <span
                className={`text-xl mt-1 ${barLabelColor[entity]} transition-transform duration-150 group-hover:-translate-y-1 group-hover:scale-101 ${changedBars.has(entity) ? 'animate-actionShake' : ''}`}
              >
                {bars[entity]}
              </span>
              {/* Tooltip follows mouse, only one per bar */}
              {tooltip && tooltip.idx === idx && (
                <div
                  className="fixed z-50 px-2 py-1 rounded-lg bg-slate-700 text-white text-xl pointer-events-none whitespace-nowrap transition-opacity duration-200 opacity-100"
                  style={{
                    left: tooltip.x - 90,
                    top: tooltip.y - 180,
                    transform: "translate(-50%, 10px)",
                  }}
                >
                  {ROLE_LABELS[entity]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameStatusBars;
