import React from "react";
import FAQPopup from "./FAQPopup";

interface MainMenuProps {
  startGame: () => void;
  validateAndStartGame: () => void;
  playerName: string;
  setPlayerName: (name: string) => void;
  showNameInput: boolean;
  startButtonAnimating: boolean;
  startClickAnimation: string | null;
  menuFadingOut: boolean;
  showFAQ: boolean;
  setShowFAQ: (show: boolean) => void;
  inputShaking: boolean;
}

export default function MainMenu({
  startGame,
  validateAndStartGame,
  playerName,
  setPlayerName,
  showNameInput,
  startButtonAnimating,
  startClickAnimation,
  menuFadingOut,
  showFAQ,
  setShowFAQ,
  inputShaking,
}: MainMenuProps) {
  return (
    <div
      className={`min-h-screen w-full relative overflow-hidden flex items-center justify-center menu-container ${
        menuFadingOut ? "fade-out" : ""
      }`}
      style={{
        backgroundImage: "url('/background/bg_menu.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* FAQ Button - top left on menu */}
      <div className="absolute top-5 left-10 z-50">
        <button
          className="faq-button"
          title="Hướng dẫn"
          onClick={() => setShowFAQ(!showFAQ)}
        >
          ?
        </button>
        {showFAQ && <FAQPopup onClose={() => setShowFAQ(false)} />}
      </div>

      {/* Decorative Circles instead of Grid */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-200/30 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full mt-32">
        <p 
          className="text-2xl text-[#FEF3E2] mb-6 text-center max-w-3xl font-bold leading-relaxed tracking-wide"
          style={{ textShadow: "1.5px 1.5px 0 #854d0e, -1px -1px 0 #854d0e, 1px -1px 0 #854d0e, -1px 1px 0 #854d0e, 1px 1px 0 #854d0e, 0 4px 8px rgba(0,0,0,0.4)" }}
        >
          &quot; Duy trì sự cân bằng về lợi ích giữa<br />Nhà nước, Doanh nghiệp và
          người lao động. <br /> Đảm bảo không chủ thể nào bị bỏ lại phía sau!
          &quot;
        </p>

        {showNameInput ? (
          <div className="flex flex-col items-center gap-4 w-full animate-fadeInUp">
            <div className="relative w-full max-w-sm">
              {!playerName && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-slate-400 text-xl pt-2 font-medium">
                    Nhập tên của bạn...
                  </span>
                </div>
              )}
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    validateAndStartGame();
                  }
                }}
                maxLength={24}
                className={`w-full px-8 py-4 text-3xl text-center rounded-full outline-none transition-all duration-300
                  bg-white text-slate-700 font-bold
                  shadow-[inset_0_4px_8px_rgba(0,0,0,0.1),0_8px_20px_rgba(0,0,0,0.15)]
                  focus:shadow-[inset_0_4px_8px_rgba(0,0,0,0.05),0_0_0_4px_rgba(251,191,36,0.3)]
                  ${inputShaking ? "animate-inputShake border-red-400" : ""}`}
                autoFocus
              />
            </div>
            <button 
              onClick={validateAndStartGame} 
              className="group relative px-12 py-5 bg-red-500 rounded-full text-white text-3xl font-black uppercase tracking-wider transition-all duration-200
                shadow-[inset_0_-6px_10px_rgba(0,0,0,0.2),0_10px_20px_rgba(220,38,38,0.4)]
                hover:-translate-y-1 hover:shadow-[inset_0_-6px_10px_rgba(0,0,0,0.2),0_15px_25px_rgba(220,38,38,0.5)]
                active:translate-y-1 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
            >
              <span className="relative z-10 drop-shadow-md">Bắt đầu trò chơi</span>
            </button>
            <a
              href="/leaderboard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-amber-400 text-white rounded-full font-bold text-xl transition-all duration-200
                shadow-[inset_0_-4px_8px_rgba(0,0,0,0.2),0_6px_12px_rgba(245,158,11,0.3)]
                hover:-translate-y-0.5 hover:shadow-[inset_0_-4px_8px_rgba(0,0,0,0.2),0_8px_16px_rgba(245,158,11,0.4)]
                active:translate-y-0.5"
            >
              🏆 Bảng Xếp Hạng
            </a>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 w-full animate-fadeInUp">
            <button
              onClick={startGame}
              disabled={startButtonAnimating}
              className={`
                group relative px-16 py-6 bg-red-500 rounded-full text-white text-4xl font-black uppercase tracking-wider transition-all duration-200
                shadow-[inset_0_-8px_12px_rgba(0,0,0,0.2),0_12px_24px_rgba(220,38,38,0.4)]
                ${startButtonAnimating ? "cursor-not-allowed opacity-80 brightness-90" : "hover:-translate-y-1 hover:shadow-[inset_0_-8px_12px_rgba(0,0,0,0.2),0_18px_30px_rgba(220,38,38,0.5)] active:translate-y-1"}
                ${startClickAnimation ? `animate-${startClickAnimation}` : ""}
              `}
            >
              <span className="relative z-10 drop-shadow-md">
                {startButtonAnimating ? "Đang tải..." : "Bắt đầu trò chơi"}
              </span>
            </button>
            <a
              href="/leaderboard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 bg-amber-400 text-white rounded-full font-bold text-2xl transition-all duration-200
                shadow-[inset_0_-4px_8px_rgba(0,0,0,0.2),0_6px_12px_rgba(245,158,11,0.3)]
                hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-[inset_0_-4px_8px_rgba(0,0,0,0.2),0_8px_16px_rgba(245,158,11,0.4)]
                active:translate-y-0.5"
            >
              🏆 Bảng Xếp Hạng
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
