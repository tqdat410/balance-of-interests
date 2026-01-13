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
  round?: number; // Add round prop to display modified effects
}

const EventPopup: React.FC<Props> = ({
  event,
  onContinue,
  onExecute,
  onSkip,
  // round prop kept for future use
}) => {
  // Suppress unused variable warning
  void 0;
  const isSpecial = event.isSpecialEvent;

  // Luôn trả về chỉ số gốc, không áp dụng -1/-2 cho event popup
  const getOriginalEffects = (originalEffects: Record<string, number>) => {
    return { ...originalEffects };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-opacity-75 animate-fadeIn" />

      {/* Modal Container */}
      <div className=" relative z-10 animate-popupScaleIn">
        <div className="mobile-event-popup clay-card max-w-lg w-full mx-4 p-8 justify-center items-center flex flex-col">
          {/* Warning Icon */}
          <h2 className="text-3xl text-yellow-500">
            {isSpecial ? "Cơ Hội Đặc Biệt" : "Sự Kiện Đặc Biệt"}
          </h2>

          {/* Event Image */}
          <div className="w-72 mb-6 rounded-lg overflow-hidden bg-white flex items-center justify-center">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="text-8xl text-yellow-600">🌪️</div>
            )}
          </div>

          {/* Event Name */}
          <h3 className="text-4xl text-center mb-4 text-red-700">
            {event.name}
          </h3>

          {/* Event Description */}
          {isSpecial && (
            <div className="mb-4 text-center text-lg text-slate-600">
              {event.entity === "Government" &&
                "Nhà nước có cơ hội lựa chọn phe liên minh quốc tế"}
              {event.entity === "Businesses" &&
                "Doanh nghiệp có cơ hội đầu tư vào sản phẩm mới"}
              {event.entity === "Workers" &&
                "Người lao động có cơ hội khởi nghiệp"}
              <br />
            </div>
          )}

          {/* Effects Preview */}
          {!isSpecial && event.effects && (
            <div className="mb-6 p-6 bg-yellow-50 rounded-xl shadow-[var(--clay-shadow-in)] w-full">
              <div className="flex justify-center gap-4 text-sm">
                {Object.entries(getOriginalEffects(event.effects))
                  .filter(([, value]) => value !== 0)
                  .map(([entity, value]) => (
                    <span key={entity} className={`text-red-600 text-[18px]`}>
                      {entity === "Government" && "Nhà nước"}
                      {entity === "Businesses" && "Doanh nghiệp"}
                      {entity === "Workers" && "Người lao động"}:{" "}
                      {value > 0 ? `+${value}` : value}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Possible Outcomes for Special Events */}
          {isSpecial && (
            <div className="mb-6 p-6 bg-blue-50 rounded-xl shadow-[var(--clay-shadow-in)] w-full">
              <div className="space-y-4">
                <div className="flex justify-center gap-2 text-xl">
                  <span className="text-green-600 font-semibold">
                    Thành công :
                  </span>
                  {event.positiveEffects &&
                    Object.entries(getOriginalEffects(event.positiveEffects))
                      .filter(([, value]) => value !== 0)
                      .map(([entity, value]) => (
                        <span key={entity} className={`text-green-600`}>
                          {entity === "Government" && "N"}
                          {entity === "Businesses" && "D"}
                          {entity === "Workers" && "L"}:{" "}
                          {value > 0 ? `+${value}` : value}
                        </span>
                      ))}
                </div>
                <div className="flex justify-center gap-2 text-xl">
                  <span className="text-red-600 font-semibold">Thất bại :</span>
                  {event.negativeEffects &&
                    Object.entries(getOriginalEffects(event.negativeEffects))
                      .filter(([, value]) => value !== 0)
                      .map(([entity, value]) => (
                        <span key={entity} className={`text-red-600`}>
                          {entity === "Government" && "N"}
                          {entity === "Businesses" && "D"}
                          {entity === "Workers" && "L"}:{" "}
                          {value > 0 ? `+${value}` : value}
                        </span>
                      ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            {isSpecial ? (
              <>
                <button onClick={onSkip || onContinue} className="skip-button">
                  Bỏ qua
                </button>
                <button
                  onClick={onExecute || onContinue}
                  className="execute-button"
                >
                  Thực hiện
                </button>
              </>
            ) : (
              <button onClick={onContinue} className="next-button">
                Chấp nhận !
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPopup;
