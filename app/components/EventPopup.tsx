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
}

interface Props {
  event: EventData;
  onContinue: () => void;
  onExecute?: () => void;
  onSkip?: () => void;
  round?: number;
}

// Entity label mapping
const ENTITY_LABELS: Record<string, string> = {
  Government: "N",
  Businesses: "D",
  Workers: "L",
};

const ENTITY_NAMES: Record<string, string> = {
  Government: "Nhà nước",
  Businesses: "Doanh nghiệp",
  Workers: "Người lao động",
};

const EventPopup: React.FC<Props> = ({
  event,
  onContinue,
  onExecute,
  onSkip,
}) => {
  const isSpecial = event.isSpecialEvent;

  // Return original effects without modifications
  const getOriginalEffects = (originalEffects: Record<string, number>) => {
    return { ...originalEffects };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" />

      {/* Modal Container - 16:9 aspect ratio layout */}
      <div 
        className="relative z-10 w-full max-w-3xl animate-popupScaleIn"
        style={{ aspectRatio: "16/9" }}
      >
        <div
          className="absolute inset-0 rounded-3xl overflow-hidden flex"
          style={{
            background: "var(--clay-surface, #fdf6e3)",
            boxShadow: `
              16px 16px 32px rgba(170, 160, 140, 0.3),
              -10px -10px 24px rgba(255, 255, 255, 0.95),
              inset 1px 1px 2px rgba(255, 255, 255, 0.5)
            `,
          }}
        >
          {/* Left Side - Large Image (takes ~60% width) */}
          <div className="w-[55%] h-full relative">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)" }}
              >
                <span className="text-8xl">{isSpecial ? "🎯" : "🌪️"}</span>
              </div>
            )}
            
            {/* Image overlay gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[var(--clay-surface,#fdf6e3)]/30" />
          </div>

          {/* Right Side - Content (takes ~40% width) */}
          <div className="w-[45%] h-full flex flex-col justify-center p-6 xl:p-8">
            {/* Header Badge */}
            <div
              className={`
                self-start px-3 py-1 rounded-full text-xs xl:text-sm font-semibold mb-3
                ${isSpecial 
                  ? "bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700" 
                  : "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700"
                }
              `}
              style={{
                boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.8), 2px 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              {isSpecial ? "✨ Cơ Hội Đặc Biệt" : "⚡ Sự Kiện"}
            </div>

            {/* Event Name */}
            <h3 
              className="text-xl xl:text-2xl font-bold mb-2 text-slate-700 leading-tight"
              style={{ textShadow: "1px 1px 0 rgba(255,255,255,0.5)" }}
            >
              {event.name}
            </h3>

            {/* Event Description for Special Events */}
            {isSpecial && (
              <p className="text-xs xl:text-sm text-slate-500 mb-3 leading-relaxed">
                {event.entity === "Government" && "Nhà nước có cơ hội lựa chọn phe liên minh quốc tế"}
                {event.entity === "Businesses" && "Doanh nghiệp có cơ hội đầu tư vào sản phẩm mới"}
                {event.entity === "Workers" && "Người lao động có cơ hội khởi nghiệp"}
              </p>
            )}

            {/* Effects Display - Regular Events */}
            {!isSpecial && event.effects && (
              <div
                className="rounded-xl p-3 mb-4"
                style={{
                  background: "linear-gradient(135deg, #fef9c3 0%, #fef3c7 100%)",
                  boxShadow: "inset 2px 2px 4px rgba(255,255,255,0.6), inset -1px -1px 3px rgba(170,160,140,0.1)",
                }}
              >
                <div className="flex flex-col gap-2">
                  {Object.entries(getOriginalEffects(event.effects))
                    .filter(([, value]) => value !== 0)
                    .map(([entity, value]) => (
                      <div
                        key={entity}
                        className="flex items-center justify-between px-2 py-1 rounded-lg bg-white/50"
                      >
                        <span className="text-slate-600 font-medium text-xs xl:text-sm">
                          {ENTITY_NAMES[entity]}
                        </span>
                        <span className={`font-bold text-sm xl:text-base ${value > 0 ? "text-green-600" : "text-red-600"}`}>
                          {value > 0 ? `+${value}` : value}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Outcomes Display - Special Events */}
            {isSpecial && (
              <div
                className="rounded-xl p-3 mb-4 space-y-2"
                style={{
                  background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                  boxShadow: "inset 2px 2px 4px rgba(255,255,255,0.6), inset -1px -1px 3px rgba(170,160,140,0.1)",
                }}
              >
                {/* Success Outcome */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-green-600 font-semibold text-xs">✓ Thành công:</span>
                  {event.positiveEffects &&
                    Object.entries(getOriginalEffects(event.positiveEffects))
                      .filter(([, value]) => value !== 0)
                      .map(([entity, value]) => (
                        <span
                          key={entity}
                          className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-medium"
                        >
                          {ENTITY_LABELS[entity]}: {value > 0 ? `+${value}` : value}
                        </span>
                      ))}
                </div>
                
                {/* Failure Outcome */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-red-600 font-semibold text-xs">✗ Thất bại:</span>
                  {event.negativeEffects &&
                    Object.entries(getOriginalEffects(event.negativeEffects))
                      .filter(([, value]) => value !== 0)
                      .map(([entity, value]) => (
                        <span
                          key={entity}
                          className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-medium"
                        >
                          {ENTITY_LABELS[entity]}: {value > 0 ? `+${value}` : value}
                        </span>
                      ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto">
              {isSpecial ? (
                <>
                  <button
                    onClick={onSkip || onContinue}
                    className="flex-1 py-2.5 px-3 rounded-xl font-semibold text-sm text-slate-600 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                      boxShadow: "4px 4px 8px rgba(170,160,140,0.2), -2px -2px 6px rgba(255,255,255,0.8)",
                    }}
                  >
                    Bỏ qua
                  </button>
                  <button
                    onClick={onExecute || onContinue}
                    className="flex-1 py-2.5 px-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                      boxShadow: "4px 4px 8px rgba(139,92,246,0.3), -2px -2px 6px rgba(255,255,255,0.2)",
                    }}
                  >
                    Thực hiện
                  </button>
                </>
              ) : (
                <button
                  onClick={onContinue}
                  className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    boxShadow: "4px 4px 8px rgba(245,158,11,0.3), -2px -2px 6px rgba(255,255,255,0.2)",
                  }}
                >
                  Chấp nhận!
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
