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
      title: "Hòa Hợp",
      desc: '" Không còn giai cấp, không còn lợi ích, không cần cân bằng ! "',
    },
    survival: {
      title: "Cân bằng",
      desc: '" Xin chúc mừng. Bạn đã thành công duy trì sự cân bằng qua 30 vòng đầy biến động. "',
    },
    failed: {
      title: "Thất bại",
      desc: "",
    },
  };
  const ending = endings[endingType as Exclude<EndingType, null>] || endings.survival;

  const bgImage =
    endingType === "harmony"
      ? "/background/bg_harmony.jpg"
      : "/background/bg_survived.jpg";

  return (
    <div
      className={`min-h-screen w-full relative overflow-hidden flex items-center justify-center ${
        menuFadingOut
          ? "animate-screenFadeOut"
          : endingFadingIn
          ? "animate-endingEntrance"
          : "opacity-100"
      }`}
      style={{
        backgroundImage: `url('${bgImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Decorative Circles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-yellow-200/30 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full bg-green-200/30 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <h1 className="text-9xl text-amber-500 mb-2 tracking-tight text-nowrap font-black drop-shadow-md">
          {ending.title}
        </h1>

        <p
          className="text-3xl text-white mb-8 text-center max-w-4xl font-bold leading-relaxed tracking-wide"
          style={{
            textShadow:
              "1.5px 1.5px 0 #854d0e, -1px -1px 0 #854d0e, 1px -1px 0 #854d0e, -1px 1px 0 #854d0e, 1px 1px 0 #854d0e, 0 4px 8px rgba(0,0,0,0.5)",
          }}
        >
          {ending.desc}
        </p>

        <div className="flex flex-col items-center gap-6 w-full animate-fadeInUp">
          <button
            onClick={startGame}
            disabled={startButtonAnimating}
            className={`
              group relative px-12 py-5 bg-red-500 rounded-full text-white text-3xl font-black uppercase tracking-wider transition-all duration-200
              shadow-[inset_0_-6px_10px_rgba(0,0,0,0.2),0_10px_20px_rgba(220,38,38,0.4)]
              ${
                startButtonAnimating
                  ? "cursor-not-allowed opacity-80 brightness-90"
                  : "hover:-translate-y-1 hover:shadow-[inset_0_-6px_10px_rgba(0,0,0,0.2),0_15px_25px_rgba(220,38,38,0.5)] active:translate-y-1"
              }
              ${startClickAnimation ? `animate-${startClickAnimation}` : ""}
            `}
          >
            <span className="relative z-10 drop-shadow-md">
              Chơi lại
            </span>
          </button>

          <a
            href="/leaderboard"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-amber-400 text-white rounded-full font-bold text-xl transition-all duration-200
              shadow-[inset_0_-4px_8px_rgba(0,0,0,0.2),0_6px_12px_rgba(245,158,11,0.3)]
              hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-[inset_0_-4px_8px_rgba(0,0,0,0.2),0_8px_16px_rgba(245,158,11,0.4)]
              active:translate-y-0.5 flex items-center gap-2"
          >
            <img src="/background/trophy.svg" alt="Trophy" className="w-6 h-6" />
            Xem Bảng Xếp Hạng
          </a>
        </div>
      </div>
    </div>
  );
}
