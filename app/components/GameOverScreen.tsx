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
      className={`min-h-screen w-full relative overflow-hidden flex items-center justify-center menu-container fade-in ${
        menuFadingOut ? "fade-out" : ""
      } ${endingFadingIn ? "animate-fadeIn" : ""}`}
      style={{
        backgroundImage: "url('/background/bg_failed.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Decorative Circles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-red-200/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <h1 className="text-9xl text-red-800 mb-5 mt-5 tracking-tight font-bold">
          Thất bại
        </h1>
        <p 
          className="text-3xl text-[#FEF3E2] mb-12 text-center max-w-4xl font-bold leading-relaxed tracking-wide"
          style={{ textShadow: "1.5px 1.5px 0 #7f1d1d, -1px -1px 0 #7f1d1d, 1px -1px 0 #7f1d1d, -1px 1px 0 #7f1d1d, 1px 1px 0 #7f1d1d, 0 4px 8px rgba(0,0,0,0.5)" }}
        >
          &quot; Mất cân bằng về lợi ích. Mâu thuẫn xuất hiện! &quot;
        </p>
        <div className="flex flex-col items-center gap-6 w-full animate-fadeInUp">
          <button
            onClick={startGame}
            disabled={startButtonAnimating}
            className={`
              group relative px-12 py-5 bg-red-600 rounded-full text-white text-3xl font-black uppercase tracking-wider transition-all duration-200
              shadow-[inset_0_-6px_10px_rgba(0,0,0,0.3),0_10px_20px_rgba(185,28,28,0.5)]
              ${startButtonAnimating ? "cursor-not-allowed opacity-80 brightness-90" : "hover:-translate-y-1 hover:shadow-[inset_0_-6px_10px_rgba(0,0,0,0.3),0_15px_25px_rgba(185,28,28,0.6)] active:translate-y-1"}
              ${startClickAnimation ? `animate-${startClickAnimation}` : ""}
            `}
          >
            <span className="relative z-10 drop-shadow-md">
              {startButtonAnimating ? "Đang tải..." : "Chơi lại"}
            </span>
          </button>

          <a
            href="/leaderboard"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-amber-500 text-white rounded-full font-bold text-xl transition-all duration-200
              shadow-[inset_0_-4px_8px_rgba(0,0,0,0.2),0_6px_12px_rgba(245,158,11,0.4)]
              hover:-translate-y-0.5 hover:shadow-[inset_0_-4px_8px_rgba(0,0,0,0.2),0_8px_16px_rgba(245,158,11,0.5)]
              active:translate-y-0.5"
          >
            🏆 Bảng Xếp Hạng
          </a>
        </div>
      </div>
    </div>
  );
}
