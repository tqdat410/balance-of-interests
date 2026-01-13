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
      className={`min-h-screen w-full bg-[var(--clay-bg)] relative overflow-hidden flex items-center justify-center menu-container ${
        menuFadingOut ? "fade-out" : ""
      }`}
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

      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <h1 className="text-9xl text-amber-500 mb-2 tracking-tight text-nowrap font-black drop-shadow-sm">
          lợi ⚖ ích
        </h1>
        <p className="text-2xl text-slate-600 mb-8 text-center max-w-2xl font-medium">
          &quot; Duy trì sự cân bằng về lợi ích giữa Nhà nước, Doanh nghiệp và
          người lao động. <br /> Đảm bảo không chủ thể nào bị bỏ lại phía sau!
          &quot;
        </p>

        {showNameInput ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full max-w-md">
              {!playerName && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-slate-400 text-xl pt-2">
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
                className={`w-full px-6 pt-2 text-2xl leading-loose text-center border-2 border-amber-500 rounded-xl focus:outline-none focus:border-amber-600 bg-white text-slate-700 ${
                  inputShaking ? "animate-inputShake" : ""
                }`}
                autoFocus
              />
            </div>
            <button onClick={validateAndStartGame} className="game-button">
              <span className="relative z-10">Bắt đầu trò chơi</span>
            </button>
            <a
              href="/leaderboard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-all duration-200 shadow-md text-2xl"
            >
              🏆 Bảng Xếp Hạng
            </a>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
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
                {startButtonAnimating ? "Đang tải..." : "Bắt đầu trò chơi"}
              </span>
            </button>
            <a
              href="/leaderboard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 shadow-md text-lg"
            >
              🏆 Bảng Xếp Hạng
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
