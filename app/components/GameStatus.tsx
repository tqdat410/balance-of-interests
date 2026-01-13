import React from "react";
import { Bars } from "@/lib/types";

interface GameStatusProps {
  bars: Bars;
}

export default function GameStatus({ bars }: GameStatusProps) {
  return (
    <div className="flex justify-center gap-4 w-full">
      <div className="text-center">
        <span className="text-red-500 font-bold">N</span>
        <span className="text-slate-600 ml-1">{bars.Government}</span>
      </div>
      <div className="text-center">
        <span className="text-blue-500 font-bold">D</span>
        <span className="text-slate-600 ml-1">{bars.Businesses}</span>
      </div>
      <div className="text-center">
        <span className="text-green-500 font-bold">L</span>
        <span className="text-slate-600 ml-1">{bars.Workers}</span>
      </div>
    </div>
  );
}
