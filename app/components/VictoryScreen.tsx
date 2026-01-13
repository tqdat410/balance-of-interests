import React from "react";
import { EndingType, Bars } from "@/lib/types";

interface VictoryScreenProps {
  startGame: () => void;
  startButtonAnimating: boolean;
  startClickAnimation: string | null;
  menuFadingOut: boolean;
  endingFadingIn: boolean;
  endingType: EndingType;
  round: number;
  bars: Bars;
}

export default function VictoryScreen({
  startGame,
  startButtonAnimating,
  startClickAnimation,
  menuFadingOut,
  endingFadingIn,
  endingType,
  round,
  bars,
}: VictoryScreenProps) {
  const endings: Record<
    Exclude<EndingType, null>,
    {
      title: string;
      desc: string;
    }
  > = {
    harmony: {
      title: "Cân Bằng ☀ Hoàn Hảo",
      desc: '" Bạn đã đạt được sự cân bằng tuyệt đối. 3 lực lượng bằng nhau ở vòng cuối! "',
    },
    survival: {
      title: "Lợi ☘ Ích",
      desc: '" Xin chúc mừng. Bạn đã thành công duy trì sự cân bằng qua 30 vòng đầy biến động. "',
    },
    failed: {
      title: "Thất bại",
      desc: "",
    },
  };
  const ending = endings[endingType as Exclude<EndingType, null>] || endings.survival;

  return (
    <div
      className={`min-h-screen w-full bg-[var(--clay-bg)] relative overflow-hidden flex items-center justify-center menu-container fade-in ${
        menuFadingOut ? "fade-out" : ""
      } ${endingFadingIn ? "animate-fadeIn" : ""}`}
    >
      {/* Decorative Circles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-yellow-200/30 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full bg-green-200/30 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <h1 className="text-9xl text-amber-500 mb-2 tracking-tight text-nowrap font-black drop-shadow-sm">
          {ending.title}
        </h1>

        <p className="text-2xl text-slate-600 mb-8 text-center max-w-4xl font-medium">
          {ending.desc}
        </p>

        {/* Simple Results Display */}
        <div className="text-center mb-8">
          <h2 className="text-xl text-slate-500 mb-4">
            Kết quả cuối cùng (Vòng {round})
          </h2>
          <div className="text-xl text-cyan-600">
            Nhà nước : {bars.Government} &nbsp;&nbsp;|&nbsp;&nbsp; Doanh nghiệp
            : {bars.Businesses} &nbsp;&nbsp;|&nbsp;&nbsp; Người lao động :{" "}
            {bars.Workers}
          </div>
        </div>

        <button
          onClick={startGame}
          disabled={startButtonAnimating}
          className={`
            game-button
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
          🏆 Xem Bảng Xếp Hạng
        </a>
      </div>
    </div>
  );
}
