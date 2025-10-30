"use client";

import React, { useRef, useEffect, useState } from "react";

type Entity = "Government" | "Businesses" | "Workers";
interface ActionEffect {
  [key: string]: number;
}
interface LogEntry {
  round: number;
  entity: Entity | "Event";
  action: string;
  effects: ActionEffect;
}
interface Props {
  history: LogEntry[];
}

const ROLE_LABELS: Record<Entity | "Event", string> = {
  Government: "Nhà nước",
  Businesses: "Doanh Nghiệp",
  Workers: "Người lao động",
  Event: "Sự kiện",
};
const actionNameColor: Record<Entity | "Event", string> = {
  Government: "text-amber-100",
  Businesses: "text-purple-100",
  Workers: "text-blue-600",
  Event: "text-gray-200",
};
const effectColor = (role: Entity | "Event", value: number) => {
  if (role === "Government") {
    return value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "";
  } else if (role === "Businesses") {
    return value > 0 ? "text-green-200" : value < 0 ? "text-red-500" : "";
  } else if (role === "Workers") {
    return value > 0 ? "text-green-700" : value < 0 ? "text-red-600" : "";
  } else {
    return "";
  }
};
const LABELS: Record<Entity | "Event", string> = {
  Government: "N",
  Businesses: "D",
  Workers: "L",
  Event: "Ev",
};

const GameHistory: React.FC<Props> = ({ history }) => {
  const [newEntries, setNewEntries] = useState<Set<string>>(new Set());

  // Group by round
  const grouped: Record<number, LogEntry[]> = {};
  history.forEach((h) => {
    if (!grouped[h.round]) grouped[h.round] = [];
    grouped[h.round].push(h);
  });
  // List rounds ASC (mới nhất ở dưới cùng)
  const roundNumbers = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b);

  // Ref để auto scroll xuống cuối
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [history]);

  // Track new entries for animation
  useEffect(() => {
    if (history.length > 0) {
      const latestEntry = history[history.length - 1];
      const entryKey = `${latestEntry.round}-${latestEntry.entity}-${latestEntry.action}`;

      setNewEntries((prev) => new Set(prev).add(entryKey));

      // Remove animation flag after animation completes
      const timer = setTimeout(() => {
        setNewEntries((prev) => {
          const newSet = new Set(prev);
          newSet.delete(entryKey);
          return newSet;
        });
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [history]);

  // Add pulse effect when new entry is added
  const [isPulsing, setIsPulsing] = useState(false);
  const historyLengthRef = useRef(history.length);

  useEffect(() => {
    if (history.length > historyLengthRef.current) {
      setIsPulsing(true);
      const pulseTimer = setTimeout(() => setIsPulsing(false), 1000);
      return () => clearTimeout(pulseTimer);
    }
    historyLengthRef.current = history.length;
  }, [history]);

  return (
    <div
      className={`glass3d w-72 h-[520px] rounded-lg p-4 text-xs border-none transition-all duration-300 ${
        isPulsing ? "animate-actionPulse" : ""
      }`}
    >
      <h2 className="text-3xl text-purple-600 mb-2 text-center">
        Sự kiện đã diễn ra
      </h2>
      <div
        className="space-y-2 overflow-y-auto scrollbar-hide text-white"
        ref={listRef}
        style={{
          maxHeight: "435px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {roundNumbers.map((round) => (
          <div key={round} className="mb-1">
            <div className="text-lg text-purple-600 mt-5">Vòng {round}</div>
            <div className="flex flex-col gap-1">
              {grouped[round].map((entry, idx) => {
                const entryKey = `${entry.round}-${entry.entity}-${entry.action}`;
                const isNewEntry = newEntries.has(entryKey);

                return (
                  <div
                    key={idx}
                    className={`
                    p-2 rounded text-xs flex flex-col
                    ${
                      entry.entity === "Government"
                        ? "bg-red-500/50"
                        : entry.entity === "Businesses"
                        ? "bg-blue-500/50"
                        : entry.entity === "Workers"
                        ? "bg-green-500/50"
                        : "bg-gray-500/50"
                    }
                    border-none
                    ${isNewEntry ? "animate-fadeInRight" : ""}
                  `}
                  >
                    <div
                      className={`mb-0.5 ${
                        actionNameColor[entry.entity]
                      } text-[16px]`}
                    >
                      {ROLE_LABELS[entry.entity]}
                    </div>
                    <div
                      className={`ml-2 mb-1 ${
                        actionNameColor[entry.entity]
                      } text-[14px]`}
                    >
                      {entry.action}
                    </div>
                    <div className="flex flex-row gap-2 flex-wrap mt-1 ml-2 text-[15px]">
                      {Object.entries(entry.effects).map(([entity, value]) =>
                        value !== 0 ? (
                          <span
                            key={entity}
                            className={`${effectColor(entry.entity, value)}`}
                          >
                            {LABELS[entity as Entity]}{" "}
                            {value > 0 ? `+${value}` : value}
                          </span>
                        ) : null
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
    </div>
  );
};

export default GameHistory;
