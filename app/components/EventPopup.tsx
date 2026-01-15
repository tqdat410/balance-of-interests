"use client";

import React from "react";

interface EventData {
  name: string;
  imageUrl?: string;
  effects?: Record<string, number>;
  positiveEffects?: Record<string, number>;
  negativeEffects?: Record<string, number>;
  isSpecialEvent?: boolean;
  entity?: string;
  rerollReward?: boolean;
  isSkippable?: boolean;
}

interface Props {
  event: EventData;
  onContinue: () => void;
  onExecute?: () => void;
  onSkip?: () => void;
  onAccept?: () => void;
  round?: number;
  bars: Record<string, number>;
}

const ENTITY_LABELS: Record<string, string> = {
  Government: "N",
  Businesses: "D", 
  Workers: "L",
};

const ENTITY_COLORS: Record<string, string> = {
  Government: "text-red-500",
  Businesses: "text-blue-600",
  Workers: "text-green-600",
};

const ENTITY_BG_COLORS: Record<string, string> = {
  Government: "bg-red-500",
  Businesses: "bg-blue-600",
  Workers: "bg-green-600",
};

const ENTITY_NAMES: Record<string, string> = {
  Government: "Nhà nước",
  Businesses: "Doanh nghiệp",
  Workers: "Người lao động",
};

// Glassmorphism style matching leaderboard
const glassContainerStyle = {
  background: "rgba(255, 255, 255, 0.45)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
  border: "1px solid rgba(255, 255, 255, 0.6)"
};

const RecycleIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={2.5} 
    stroke="currentColor" 
    className="w-3 h-3"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" 
    />
  </svg>
);

const RerollBadge = () => (
  <div className="absolute -top-2 -right-2 bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm border border-amber-200 z-10">
    <span className="font-bold">+</span>
    <RecycleIcon />
  </div>
);

const EventPopup: React.FC<Props> = ({
  event,
  onContinue,
  onExecute,
  onSkip,
  onAccept,
  bars,
}) => {
  const isSpecial = event.isSpecialEvent;
  const isSkippable = event.isSkippable;

  const getOriginalEffects = (originalEffects: Record<string, number>) => {
    return { ...originalEffects };
  };

  const MAX_BAR = 50;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 gap-4">
      {/* Backdrop - Glassmorphism blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fadeIn" />

      {/* Status Bars - Floating above */}
      <div 
        className="relative z-20 flex items-center gap-6 px-6 py-3 rounded-2xl animate-popupScaleIn"
        style={glassContainerStyle}
      >
        {["Government", "Businesses", "Workers"].map((entity) => {
          const value = bars[entity as keyof typeof bars] || 0;
          const percent = Math.min(100, (value / MAX_BAR) * 100);
          
          return (
            <div key={entity} className="flex flex-col items-center gap-1 min-w-[60px]">
              <div className="flex items-center gap-2">
                <span className={`font-bold ${ENTITY_COLORS[entity]}`}>
                  {ENTITY_LABELS[entity]}
                </span>
                <span className={`font-bold ${ENTITY_COLORS[entity]}`}>
                  {value}
                </span>
              </div>
              <div className="w-16 h-1.5 bg-slate-200/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${ENTITY_BG_COLORS[entity]}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal - Horizontal 16:9 layout with Glassmorphism */}
      <div 
        className="relative z-10 w-full max-w-2xl xl:max-w-3xl animate-popupScaleIn"
      >
        <div
          className="rounded-[32px] overflow-hidden"
          style={glassContainerStyle}
        >
          {/* Image Section - Full width, 16:9 with rounded corners */}
          <div 
            className="relative w-full m-3 rounded-[24px] overflow-hidden"
            style={{ aspectRatio: "16/9", width: "calc(100% - 24px)" }}
          >
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div 
                className="absolute inset-0 w-full h-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)" }}
              >
                <span className="text-9xl">{isSpecial ? "🎯" : "🌪️"}</span>
              </div>
            )}
            
            {/* Overlay gradient at bottom for text */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
            
            {/* Event Name with Description - Overlaid on image bottom */}
            <div className="absolute inset-x-0 bottom-0 p-4 xl:p-6">
              <div
                className={`
                  inline-block px-3 py-1 rounded-full text-xs xl:text-sm font-bold mb-2
                  ${isSpecial 
                    ? "bg-purple-500/90 text-white" 
                    : "bg-amber-500/90 text-white"
                  }
                `}
              >
                {isSpecial ? "✨ Cơ Hội Đặc Biệt" : "⚡ Sự Kiện"}
              </div>
              <h3 className="text-2xl xl:text-3xl font-bold text-white drop-shadow-lg">
                {event.name}
                {isSpecial && (
                  <span className="text-lg xl:text-xl font-normal text-white/80">
                    {" - "}
                    {event.entity === "Government" && "Lựa chọn liên minh quốc tế"}
                    {event.entity === "Businesses" && "Đầu tư sản phẩm mới"}
                    {event.entity === "Workers" && "Cơ hội khởi nghiệp"}
                  </span>
                )}
              </h3>
            </div>
          </div>

          {/* Bottom Bar - Content + Buttons horizontal */}
          <div className="flex items-center gap-4 px-4 pb-4 xl:px-5 xl:pb-5">
            {/* Left: Effects */}
            <div className="flex-1 flex items-center gap-3 flex-wrap">
              {/* Outcomes indicator for Special Events */}
              {isSpecial && (
                <span className="text-sm text-slate-600 font-medium ml-1">
                  <span className="text-green-600">✓ Thành công</span>
                  {" / "}
                  <span className="text-red-600">✗ Thất bại</span>
                </span>
              )}

              {/* Effects - Regular Events (no +/- signs) */}
              {!isSpecial && event.effects && (
                <div className="flex items-center gap-2 flex-wrap">
                  {Object.entries(getOriginalEffects(event.effects))
                    .filter(([, value]) => value !== 0)
                    .map(([entity, value]) => (
                      <span
                        key={entity}
                        className={`
                          px-3 py-1.5 rounded-xl text-sm font-bold
                          ${value > 0 
                            ? "bg-green-100/80 text-green-700" 
                            : "bg-red-100/80 text-red-700"
                          }
                        `}
                      >
                        {ENTITY_NAMES[entity]}: {Math.abs(value)}
                      </span>
                    ))}
                </div>
              )}

              {/* Outcomes - Special Events (no +/- signs) */}
              {isSpecial && (
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-green-600 font-bold text-sm">✓</span>
                    {event.positiveEffects &&
                      Object.entries(getOriginalEffects(event.positiveEffects))
                        .filter(([, value]) => value !== 0)
                        .map(([entity, value]) => (
                          <span
                            key={entity}
                            className="px-2 py-1 rounded-lg bg-green-100/80 text-green-700 text-sm font-bold"
                          >
                            {ENTITY_LABELS[entity]}: {Math.abs(value)}
                          </span>
                        ))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-red-600 font-bold text-sm">✗</span>
                    {event.negativeEffects &&
                      Object.entries(getOriginalEffects(event.negativeEffects))
                        .filter(([, value]) => value !== 0)
                        .map(([entity, value]) => (
                          <span
                            key={entity}
                            className="px-2 py-1 rounded-lg bg-red-100/80 text-red-700 text-sm font-bold"
                          >
                            {ENTITY_LABELS[entity]}: {Math.abs(value)}
                          </span>
                        ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Buttons - Claymorphism style */}
            <div className="flex gap-3 flex-shrink-0">
              {isSpecial ? (
                <>
                  <button
                    onClick={onSkip}
                    className="py-2.5 px-6 rounded-2xl font-bold text-sm text-slate-600 transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                      background: "rgba(241, 245, 249, 0.9)",
                      boxShadow: "4px 4px 12px rgba(0,0,0,0.1), -2px -2px 8px rgba(255,255,255,0.9)",
                      border: "1px solid rgba(255,255,255,0.8)"
                    }}
                  >
                    Bỏ qua
                  </button>
                  <button
                    onClick={onExecute}
                    className="relative py-2.5 px-6 rounded-2xl font-bold text-sm text-white transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                      boxShadow: "4px 4px 12px rgba(139,92,246,0.35), -2px -2px 8px rgba(255,255,255,0.15)",
                    }}
                  >
                    Thực hiện
                    {event.rerollReward && <RerollBadge />}
                  </button>
                </>
              ) : isSkippable ? (
                <>
                  <button
                    onClick={onSkip}
                    className="py-2.5 px-6 rounded-2xl font-bold text-sm text-slate-600 transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                      background: "rgba(241, 245, 249, 0.9)",
                      boxShadow: "4px 4px 12px rgba(0,0,0,0.1), -2px -2px 8px rgba(255,255,255,0.9)",
                      border: "1px solid rgba(255,255,255,0.8)"
                    }}
                  >
                    Bỏ qua
                  </button>
                  <button
                    onClick={onAccept}
                    className="relative py-2.5 px-6 rounded-2xl font-bold text-sm text-white transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      boxShadow: "4px 4px 12px rgba(16,185,129,0.35), -2px -2px 8px rgba(255,255,255,0.15)",
                    }}
                  >
                    Chấp nhận
                    {event.rerollReward && <RerollBadge />}
                  </button>
                </>
              ) : (
                <button
                  onClick={onContinue}
                  className="relative py-2.5 px-8 rounded-2xl font-bold text-sm text-white transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    boxShadow: "4px 4px 12px rgba(245,158,11,0.35), -2px -2px 8px rgba(255,255,255,0.15)",
                  }}
                >
                  Chấp nhận!
                  {event.rerollReward && <RerollBadge />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPopup;
