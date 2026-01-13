import React from "react";

interface GameOverScreenProps {
  startGame: () => void;
  startButtonAnimating: boolean;
  startClickAnimation: string | null;
  menuFadingOut: boolean;
  endingFadingIn: boolean;
}

export default function GameOverScreen({
  startGame,
  startButtonAnimating,
  startClickAnimation,
  menuFadingOut,
  endingFadingIn,
}: GameOverScreenProps) {
  return (
    <div
      className={`min-h-screen w-full bg-[var(--clay-bg)] relative overflow-hidden flex items-center justify-center menu-container fade-in ${
        menuFadingOut ? "fade-out" : ""
      } ${endingFadingIn ? "animate-fadeIn" : ""}`}
    >
      {/* Decorative Circles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-red-200/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <h1 className="text-9xl text-pink-600 mb-2 tracking-tight text-nowrap font-black drop-shadow-sm">
          lợi💥ích
        </h1>
        <h1 className="text-6xl text-pink-600 mb-5 mt-5 tracking-tight font-bold">
          Thất bại
        </h1>
        <p className="text-4xl text-slate-600 mb-8 text-center max-w-4xl font-medium">
          &quot; Mất cân bằng về lợi ích. Mâu thuẫn xuất hiện! &quot;
        </p>
        <button
          onClick={startGame}
          disabled={startButtonAnimating}
          className={`
            w-60 game-button
            ${startButtonAnimating ? "cursor-not-allowed opacity-80" : ""}
            ${startClickAnimation ? `animate-${startClickAnimation}` : ""}
          `}
        >
          <span className="relative z-10">
            {startButtonAnimating ? "Đang tải..." : "Chơi lại"}
          </span>
        </button>

        <a
          href="/leaderboard"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-200 shadow-lg text-lg"
        >
          🏆 Bảng Xếp Hạng
        </a>
      </div>
    </div>
  );
}
