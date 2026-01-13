import React from "react";

interface GameHeaderProps {
  round: number;
}

export default function GameHeader({ round }: GameHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <h1 className="text-3xl text-amber-500 font-bold">lợi ⚖ ích</h1>
      <div className="clay-card px-3 py-1 flex items-center gap-1">
        <span className="text-sm text-slate-500">Vòng</span>
        <span className="text-lg text-purple-600 font-bold">{round}/30</span>
      </div>
    </div>
  );
}
