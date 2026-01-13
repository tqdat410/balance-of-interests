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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" />

      {/* Modal Container - Claymorphism style */}
      <div className="relative z-10 w-full max-w-md animate-popupScaleIn">
        <div
          className="rounded-3xl p-6 flex flex-col items-center"
          style={{
            background: "var(--clay-surface, #fdf6e3)",
            boxShadow: `
              12px 12px 24px rgba(170, 160, 140, 0.25),
              -8px -8px 20px rgba(255, 255, 255, 0.9),
              inset 1px 1px 2px rgba(255, 255, 255, 0.5)
            `,
          }}
        >
          {/* Header Badge */}
          <div
            className={`
              px-4 py-1.5 rounded-full text-sm font-semibold mb-4
              ${isSpecial 
                ? "bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700" 
                : "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700"
              }
            `}
            style={{
              boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.8), 2px 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            {isSpecial ? "✨ Cơ Hội Đặc Biệt" : "⚡ Sự Kiện Đặc Biệt"}
          </div>

          {/* Event Image - 16:9 aspect ratio */}
          <div
            className="w-full rounded-2xl overflow-hidden mb-4"
            style={{
              aspectRatio: "16/9",
              boxShadow: "inset 2px 2px 6px rgba(0,0,0,0.08), 4px 4px 12px rgba(170,160,140,0.15)",
            }}
          >
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
                <span className="text-6xl">{isSpecial ? "🎯" : "🌪️"}</span>
              </div>
            )}
          </div>

          {/* Event Name */}
          <h3 
            className="text-xl font-bold text-center mb-2 text-slate-700"
            style={{ textShadow: "1px 1px 0 rgba(255,255,255,0.5)" }}
          >
            {event.name}
          </h3>

          {/* Event Description for Special Events */}
          {isSpecial && (
            <p className="text-sm text-center text-slate-500 mb-4 px-2">
              {event.entity === "Government" && "Nhà nước có cơ hội lựa chọn phe liên minh quốc tế"}
              {event.entity === "Businesses" && "Doanh nghiệp có cơ hội đầu tư vào sản phẩm mới"}
              {event.entity === "Workers" && "Người lao động có cơ hội khởi nghiệp"}
            </p>
          )}

          {/* Effects Display - Regular Events */}
          {!isSpecial && event.effects && (
            <div
              className="w-full rounded-xl p-4 mb-4"
              style={{
                background: "linear-gradient(135deg, #fef9c3 0%, #fef3c7 100%)",
                boxShadow: "inset 2px 2px 4px rgba(255,255,255,0.6), inset -1px -1px 3px rgba(170,160,140,0.1)",
              }}
            >
              <div className="flex justify-center gap-4 flex-wrap">
                {Object.entries(getOriginalEffects(event.effects))
                  .filter(([, value]) => value !== 0)
                  .map(([entity, value]) => (
                    <div
                      key={entity}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/60"
                      style={{ boxShadow: "1px 1px 3px rgba(0,0,0,0.05)" }}
                    >
                      <span className="text-slate-600 font-medium text-sm">
                        {ENTITY_NAMES[entity]}:
                      </span>
                      <span className={`font-bold text-sm ${value > 0 ? "text-green-600" : "text-red-600"}`}>
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
              className="w-full rounded-xl p-4 mb-4 space-y-3"
              style={{
                background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                boxShadow: "inset 2px 2px 4px rgba(255,255,255,0.6), inset -1px -1px 3px rgba(170,160,140,0.1)",
              }}
            >
              {/* Success Outcome */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <span className="text-green-600 font-semibold text-sm">✓ Thành công:</span>
                {event.positiveEffects &&
                  Object.entries(getOriginalEffects(event.positiveEffects))
                    .filter(([, value]) => value !== 0)
                    .map(([entity, value]) => (
                      <span
                        key={entity}
                        className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-sm font-medium"
                      >
                        {ENTITY_LABELS[entity]}: {value > 0 ? `+${value}` : value}
                      </span>
                    ))}
              </div>
              
              {/* Failure Outcome */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <span className="text-red-600 font-semibold text-sm">✗ Thất bại:</span>
                {event.negativeEffects &&
                  Object.entries(getOriginalEffects(event.negativeEffects))
                    .filter(([, value]) => value !== 0)
                    .map(([entity, value]) => (
                      <span
                        key={entity}
                        className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-sm font-medium"
                      >
                        {ENTITY_LABELS[entity]}: {value > 0 ? `+${value}` : value}
                      </span>
                    ))}
              </div>
            </div>
          )}

          {/* Action Buttons - Claymorphism style */}
          <div className="flex gap-3 w-full">
            {isSpecial ? (
              <>
                <button
                  onClick={onSkip || onContinue}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-600 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                    boxShadow: "4px 4px 8px rgba(170,160,140,0.2), -2px -2px 6px rgba(255,255,255,0.8)",
                  }}
                >
                  Bỏ qua
                </button>
                <button
                  onClick={onExecute || onContinue}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
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
                className="flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
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
  );
};

export default EventPopup;
