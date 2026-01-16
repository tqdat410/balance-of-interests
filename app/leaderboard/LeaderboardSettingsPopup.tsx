"use client";

import React from "react";

interface LeaderboardSettingsPopupProps {
  onClose: () => void;
  bgVolume: number;
  setBgVolume: (volume: number) => void;
  sfxVolume: number;
  setSfxVolume: (volume: number) => void;
  autoRefresh: boolean;
  setAutoRefresh: (enabled: boolean) => void;
}

// Glassmorphism style matching leaderboard/event popup
const glassContainerStyle = {
  background: "rgba(255, 255, 255, 0.65)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.12)",
  border: "1px solid rgba(255, 255, 255, 0.7)"
};

export default function LeaderboardSettingsPopup({
  onClose,
  bgVolume,
  setBgVolume,
  sfxVolume,
  setSfxVolume,
  autoRefresh,
  setAutoRefresh,
}: LeaderboardSettingsPopupProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop - Glassmorphism blur */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal - Center popup with Glassmorphism */}
      <div 
        className="relative z-10 w-full max-w-xs animate-popupScaleIn"
      >
        <div
          className="rounded-[24px] p-5"
          style={glassContainerStyle}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-slate-700">Cài đặt</h2>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-white/50 transition-all text-lg font-bold"
              aria-label="Đóng"
            >
              ×
            </button>
          </div>

          {/* Audio Section */}
          <div className="mb-5">
            {/* Background Music Volume */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-slate-600">Nhạc nền</label>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {Math.round(bgVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={bgVolume}
                onChange={(e) => setBgVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-slate-500"
              />
            </div>

            {/* Click Sound Volume */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-slate-600">Hiệu ứng</label>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {Math.round(sfxVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={sfxVolume}
                onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-slate-500"
              />
            </div>
          </div>

          {/* Auto Refresh Section */}
          <div className="mb-5 pt-4 border-t border-slate-200/50">
            <div className="flex justify-between items-center">
              <div>
                <label className="text-sm font-medium text-slate-600">Tự động làm mới</label>
                <p className="text-xs text-slate-400 mt-0.5">Mỗi 5 giây</p>
              </div>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  autoRefresh 
                    ? "bg-amber-500" 
                    : "bg-slate-300"
                }`}
              >
                <span 
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${
                    autoRefresh ? "left-6" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Close Button - Subtle */}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl font-semibold text-slate-600 bg-white/70 border border-slate-200/50 transition-all duration-200 hover:bg-white hover:border-slate-300 active:scale-[0.98]"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
