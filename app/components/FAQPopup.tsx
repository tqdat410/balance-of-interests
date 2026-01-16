"use client";

import React from "react";

interface FAQPopupProps {
  onClose: () => void;
}

// Glassmorphism style matching leaderboard/event popup
const glassContainerStyle = {
  background: "rgba(255, 255, 255, 0.65)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.12)",
  border: "1px solid rgba(255, 255, 255, 0.7)"
};

export default function FAQPopup({ onClose }: FAQPopupProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop - Glassmorphism blur */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal - Center popup with Glassmorphism */}
      <div 
        className="relative z-10 w-full max-w-sm animate-popupScaleIn"
      >
        <div
          className="rounded-[24px] p-5"
          style={glassContainerStyle}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-700">Hướng dẫn</h2>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-white/50 transition-all text-lg font-bold"
              aria-label="Đóng"
            >
              ×
            </button>
          </div>

          {/* Content - Clean, minimal */}
          <div className="space-y-3 mb-5 text-sm text-slate-600 leading-relaxed">
            <p>
              Lựa chọn các hành động khôn ngoan để duy trì lợi ích của 3 chủ thể cân bằng trong <strong>30 vòng</strong> để chiến thắng.
            </p>
            
            <p className="text-red-500 font-medium">
              Thất bại khi có chỉ số về 0.
            </p>

            {/* Entity legend - compact */}
            <div className="flex items-center justify-center gap-4 py-2">
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-lg bg-red-400 text-white text-xs font-bold flex items-center justify-center">N</span>
                <span className="text-xs text-slate-500">Nhà nước</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-lg bg-blue-400 text-white text-xs font-bold flex items-center justify-center">D</span>
                <span className="text-xs text-slate-500">Doanh nghiệp</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-lg bg-green-400 text-white text-xs font-bold flex items-center justify-center">L</span>
                <span className="text-xs text-slate-500">Người lao động</span>
              </div>
            </div>

            <p className="text-slate-500">
              Các sự kiện đặc biệt sẽ xuất hiện ở một số vòng.
            </p>

            <p className="text-slate-500">
              Dùng các lượt 'Phương án khác' để thay đổi các hành động có thể lựa chọn.
            </p>
            <div className="pt-2 border-t border-slate-200/50">
              <h3 className="text-xs font-bold text-slate-500 mb-1">Cơ chế tính điểm:</h3>
              <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
                <li>Mỗi lần nhập tên tính là <strong>1 Phiên chơi</strong>.</li>
                <li>Trong phiên có thể chơi lại nhiều lần, hệ thống sẽ lấy <strong>kết quả cao nhất</strong>.</li>
                <li>Nhập lại tên ở màn hình chính sẽ tính là phiên chơi mới.</li>
              </ul>
            </div>
          </div>

          {/* Version Info */}
          <div className="mb-3 pt-3 border-t border-slate-200/50 flex flex-col items-start gap-1">
            <span className="text-xs text-slate-500 font-medium">
              Version : 2.3.1 - By : <a href="mailto:tqdat410@gmail.com" className="hover:text-slate-600 hover:underline transition-colors">tqdat410@gmail.com</a>
            </span>
          </div>

          {/* Close Button - Subtle */}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl font-semibold text-slate-600 bg-white/70 border border-slate-200/50 transition-all duration-200 hover:bg-white hover:border-slate-300 active:scale-[0.98]"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}
