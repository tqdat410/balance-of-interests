"use client";

import React, { useState, useEffect } from "react";

interface Role {
  name: string;
  idleImage: string;
  cryImage?: string;
  sadImage?: string;
  smileImage: string;
  state: "idle" | "cry" | "sad" | "smile";
}

interface PopupEffect {
  entity: string;
  value: number;
  id: number;
}

interface Props {
  round?: number; // Add round prop to display modified effects
}

const GameIllustration: React.FC<Props> = ({ round = 1 } = {}) => {
  const [roles, setRoles] = useState<Role[]>([
    {
      name: "Nhà Nước",
      idleImage: "/animation/ctg.png",
      cryImage: "/animation/ctg_khoc.png",
      smileImage: "/animation/ctg_cuoi.png",
      state: "idle",
    },
    {
      name: "Doanh Nghiệp",
      idleImage: "/animation/dn.png",
      cryImage: "/animation/dn_khoc.png",
      smileImage: "/animation/dn_cuoi.png",
      state: "idle",
    },
    {
      name: "Người Lao Động",
      idleImage: "/animation/cn.png",
      sadImage: "/animation/cn_buon.png",
      smileImage: "/animation/cn_cuoi.png",
      state: "idle",
    },
  ]);

  const [popups, setPopups] = useState<PopupEffect[]>([]);
  const [currentTurn, setCurrentTurn] = useState<string>("Nhà Nước");
  const [currentEvent, setCurrentEvent] = useState<{
    name: string;
    round: number;
  } | null>(null);

  // Function to get modified effects based on round, only for normal actions (not special events)
  const getModifiedEffects = (
    originalEffects: Record<string, number>,
    isSpecialEvent = false
  ) => {
    if (isSpecialEvent) return { ...originalEffects };
    const modifiedEffects = { ...originalEffects };
    if (round >= 11 && round <= 20) {
      Object.keys(modifiedEffects).forEach((key) => {
        if (modifiedEffects[key] > 0) {
          modifiedEffects[key] -= 1;
        } else if (modifiedEffects[key] < 0) {
          modifiedEffects[key] -= 1;
        }
      });
    } else if (round >= 21 && round <= 30) {
      Object.keys(modifiedEffects).forEach((key) => {
        if (modifiedEffects[key] > 0) {
          modifiedEffects[key] -= 2;
        } else if (modifiedEffects[key] < 0) {
          modifiedEffects[key] -= 2;
        }
      });
    }
    return modifiedEffects;
  };

  // Lắng nghe sự kiện từ game để cập nhật trạng thái
  useEffect(() => {
    const handleActionEffect = (event: CustomEvent) => {
      const { effects, currentEntity, isSpecialEvent } = event.detail;
      // isSpecialEvent: truyền từ page.tsx khi dispatch event, true nếu là event đặc biệt
      const modifiedEffects = getModifiedEffects(effects, isSpecialEvent);

      setRoles((prevRoles) => {
        return prevRoles.map((role) => {
          const entityName = role.name;
          const effectValue = modifiedEffects[getEntityKey(entityName)];
          if (effectValue > 0) {
            return { ...role, state: "smile" };
          } else if (effectValue < 0) {
            if (entityName === "Người Lao Động") {
              return { ...role, state: "sad" };
            } else {
              return { ...role, state: "cry" };
            }
          }
          return role;
        });
      });

      const newPopups: PopupEffect[] = [];
      Object.entries(modifiedEffects).forEach(([entity, value]) => {
        if (value !== 0) {
          const entityName = getEntityDisplayName(entity);
          newPopups.push({
            entity: entityName,
            value: Number(value),
            id: Date.now() + Math.random(),
          });
        }
      });
      setPopups((prev) => [...prev, ...newPopups]);
      setTimeout(() => {
        setPopups((prev) =>
          prev.filter((p) => !newPopups.find((np) => np.id === p.id))
        );
      }, 2000);
    };

    const handleTurnChange = (event: CustomEvent) => {
      const { currentEntity } = event.detail;
      if (currentEntity) {
        setCurrentTurn(getEntityDisplayName(currentEntity));
      }
    };

    const handleSpecialEvent = (event: CustomEvent) => {
      const { eventName, round } = event.detail;
      setCurrentEvent({ name: eventName, round });
    };

    window.addEventListener(
      "gameActionEffect",
      handleActionEffect as EventListener
    );
    window.addEventListener(
      "gameTurnChange",
      handleTurnChange as EventListener
    );
    window.addEventListener(
      "specialEvent",
      handleSpecialEvent as EventListener
    );

    return () => {
      window.removeEventListener(
        "gameActionEffect",
        handleActionEffect as EventListener
      );
      window.removeEventListener(
        "gameTurnChange",
        handleTurnChange as EventListener
      );
      window.removeEventListener(
        "specialEvent",
        handleSpecialEvent as EventListener
      );
    };
  }, []);

  // Reset về trạng thái idle sau 3 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      setRoles((prevRoles) =>
        prevRoles.map((role) => ({ ...role, state: "idle" }))
      );
    }, 1300);

    return () => clearTimeout(timer);
  }, [roles]);

  const getEntityKey = (displayName: string): string => {
    switch (displayName) {
      case "Nhà Nước":
        return "Government";
      case "Doanh Nghiệp":
        return "Businesses";
      case "Người Lao Động":
        return "Workers";
      default:
        return "";
    }
  };

  const getEntityDisplayName = (entityKey: string): string => {
    switch (entityKey) {
      case "Government":
        return "Nhà Nước";
      case "Businesses":
        return "Doanh Nghiệp";
      case "Workers":
        return "Người Lao Động";
      default:
        return "";
    }
  };

  const getCurrentImage = (role: Role): string => {
    switch (role.state) {
      case "smile":
        return role.smileImage;
      case "cry":
        return role.cryImage || role.idleImage;
      case "sad":
        return role.sadImage || role.idleImage;
      default:
        return role.idleImage;
    }
  };

  return (
    <div className="w-full h-48 relative flex items-center justify-center mb-3">
      <div className="flex items-center justify-center gap-12 relative">
        {roles.map((role) => (
          <div key={role.name} className="relative flex flex-col items-center">
            {/* Popup hiệu ứng */}
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
              {popups
                .filter((popup) => popup.entity === role.name)
                .map((popup) => (
                  <div
                    key={popup.id}
                    className={`absolute text-2xl font-bold animate-fade-out ${
                      popup.value > 0 ? "text-green-500" : "text-red-500"
                    }`}
                    style={{
                      animation: "fadeOut 2s ease-out forwards",
                    }}
                  >
                    {popup.value > 0 ? "+" : ""}
                    {popup.value}
                  </div>
                ))}
            </div>

            {/* Hình ảnh role */}
            <img
              src={getCurrentImage(role)}
              alt={role.name}
              className="w-36 h-36 object-contain"
            />

            {/* Tên role */}
            <div className="text-sm text-gray-600">{role.name}</div>

            {/* Mũi tên chỉ vào role đang đến lượt */}
            {currentTurn === role.name && (
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-red-500 animate-bounce"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeOut {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export default GameIllustration;
