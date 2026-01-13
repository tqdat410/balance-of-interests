"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import GameActionButtons from "./components/GameActionButtons";
import EventPopup from "./components/EventPopup";

// Dynamic import for chart to avoid SSR issues
const StatusLineChart = dynamic(() => import("./components/StatusLineChart"), {
  ssr: false,
  loading: () => (
    <div className="clay-card p-4 w-full h-64 flex items-center justify-center">
      <span className="text-slate-400">Đang tải biểu đồ...</span>
    </div>
  ),
});

// FAQ Popup component
function FAQPopup({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="faq-popup mobile-faq-popup absolute left-0 mt-2 top-16 ml-2 z-[100] bg-white rounded-xl shadow-xl border border-yellow-400 p-6 w-80 animate-fadeIn"
      style={{ minWidth: 260 }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className=" text-yellow-700 text-lg">Hướng dẫn</span>
        <button
          className="text-slate-500 hover:text-red-500 text-xl font-bold px-2"
          onClick={onClose}
          aria-label="Đóng"
        >
          ×
        </button>
      </div>
      <div className="text-slate-500 text-[16px] leading-relaxed">
        <ul className="list-disc pl-5">
          <li className="text-yellow-500">
            Lựa chọn các &apos;hành động&apos; khôn ngoan để duy trì 3 thanh trạng thái
            cân bằng trong 30 vòng để chiến thắng.
          </li>
          <li className="text-red-400">Thất bại : 1 trong 3 chỉ số về 0.</li>
          <li>N : Nhà nước</li>
          <li>D : Doanh Nghiệp</li>
          <li>L : Người lao động</li>
          <li className="text-purple-600">
            Các sự kiện đặc biệt sẽ xuất hiện ở một số vòng.
          </li>
          <li className="text-slate-400 text-[14px] leading-relaxed list-none text-center mt-2 font-bold">
            góp ý / báo lỗi : tqdat410@gmail.com
          </li>
        </ul>
      </div>
    </div>
  );
}

// Entity literals and types
type Entity = "Government" | "Businesses" | "Workers";
const ENTITIES: Entity[] = ["Government", "Businesses", "Workers"];

// Action types
type ActionEffect = Record<Entity, number>;
// Sửa GameAction cho đúng spec mới (name, imageUrl, effects)
interface GameAction {
  name: string;
  imageUrl: string;
  effects: ActionEffect;
  // desc: string;  // BỎ! Không dùng nữa
  // special?: boolean; // giữ lại nếu cần check đặc biệt
}

// Actions pool
type ActionPool = Record<Entity, GameAction[]>;
const ACTIONS: ActionPool = {
  Government: [
    {
      name: "Tăng thuế Doanh nghiệp",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/tang_thue_dn_qjctbv.png",
      effects: { Government: 12, Businesses: -12, Workers: -5 },
    },
    {
      name: "Giảm thuế Doanh nghiệp",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/giam_thue_dn_r46w9t.png",
      effects: { Government: -12, Businesses: 8, Workers: 2 },
    },
    {
      name: "Tăng thuế TNCN",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/tang_thue_tncn_gpf941.png",
      effects: { Government: 12, Businesses: -3, Workers: -7 },
    },
    {
      name: "Giảm thuế TNCN",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/giam_thue_tncn_lvyqvl.png",
      effects: { Government: -11, Businesses: 2, Workers: 7 },
    },
    {
      name: "Đầu tư cơ sở hạ tầng",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/dau_tu_ht_d8hcpe.png",
      effects: { Government: -14, Businesses: 5, Workers: 9 },
    },
    {
      name: "Đầu tư vào Giáo dục",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/dau_tu_gd_j0rgaw.png",
      effects: { Government: -14, Businesses: 5, Workers: 9 },
    },
    {
      name: "Trợ cấp an sinh xã hội",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/tro_cap_asxh_adk225.png",
      effects: { Government: -12, Businesses: 3, Workers: 7 },
    },
    {
      name: "Trợ cấp thất nghiệp",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/tro_cap_tn_d6vxxg.png",
      effects: { Government: -9, Businesses: 0, Workers: 3 },
    },
    {
      name: "Tăng mức lương tối thiểu",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/tang_luong_toi_thieu_z3fgki.png",
      effects: { Government: 2, Businesses: -13, Workers: 7 },
    },
    {
      name: "Siết chặt quy định kinh doanh",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/siet_chat_qddn_djxwjf.png",
      effects: { Government: 10, Businesses: -12, Workers: -5 },
    },
    {
      name: "Khuyến khích Startup",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/kk_startup_dy9rps.png",
      effects: { Government: -12, Businesses: 3, Workers: 6 },
    },
    {
      name: "Kích cầu kinh tế",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/kich_cau_kt_bjjsxm.png",
      effects: { Government: -16, Businesses: 12, Workers: 6 },
    },
    {
      name: "Mở rộng hợp tác quốc tế",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/hop_tac_qt_o72rt0.png",
      effects: { Government: 3, Businesses: 3, Workers: 3 },
    },
    {
      name: "Ra soát tham nhũng",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/ra_soat_tn_kyq2gv.png",
      effects: { Government: 6, Businesses: -9, Workers: 3 },
    },
    {
      name: "Siết chặt hàng giả - gian lận",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/siet_chat_hg_gl_boprov.png",
      effects: { Government: 6, Businesses: -10, Workers: 3 },
    },
  ],
  Businesses: [
    {
      name: "Ép buộc tăng ca",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/tang_ca_xwhnje.png",
      effects: { Government: 3, Businesses: 10, Workers: -11 },
    },
    {
      name: "Cắt giảm nhân sự",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/cat_giam_ns_nbwqn3.png",
      effects: { Government: -6, Businesses: 12, Workers: -11 },
    },
    {
      name: "Đầu tư công nghệ mới",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/dau_tu_cn_fxlows.png",
      effects: { Government: 6, Businesses: 4, Workers: 3 },
    },
    {
      name: "Trốn thuế",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/tron_thue_dqogzd.png",
      effects: { Government: -11, Businesses: 7, Workers: -9 },
    },
    {
      name: "Tăng lương",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/tang_luong_jxdd8a.png",
      effects: { Government: 2, Businesses: -6, Workers: 7 },
    },
    {
      name: "Mở rộng sản xuất",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/mo_rong_sx_egazs0.png",
      effects: { Government: 2, Businesses: 6, Workers: 4 },
    },
    {
      name: "Hối lộ quan chức",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/hoi_lo_ddjb9q.png",
      effects: { Government: -12, Businesses: 6, Workers: -7 },
    },
    {
      name: "Xả thải ra môi trường",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/xa_thai_s1myf9.png",
      effects: { Government: -13, Businesses: 6, Workers: -7 },
    },
    {
      name: "Tăng giá bán sản phẩm",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/tang_gia_fgodwi.png",
      effects: { Government: 2, Businesses: 5, Workers: -9 },
    },
    {
      name: "Sản xuất hàng giả",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/sx_hang_gia_l0jguv.png",
      effects: { Government: -12, Businesses: 6, Workers: -10 },
    },
    {
      name: "Chạy đua giảm giá",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/giam_gia_poze84.png",
      effects: { Government: -1, Businesses: 4, Workers: -7 },
    },
    {
      name: "Đào tạo lao động",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/dao_tao_ld_dh3ikr.png",
      effects: { Government: 2, Businesses: 3, Workers: 5 },
    },
  ],
  Workers: [
    {
      name: "Nâng cao tay nghề",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/nang_cao_tay_nghe_yvmflt.png",
      effects: { Government: 4, Businesses: 3, Workers: 5 },
    },
    {
      name: "Nhảy việc",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/nhay_viec_zgaopd.png",
      effects: { Government: -1, Businesses: -10, Workers: 3 },
    },
    {
      name: "Gian lận trong lao động",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/vi_pham_ursnk4.png",
      effects: { Government: -3, Businesses: -9, Workers: 2 },
    },
    {
      name: "Nghỉ việc",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/nghi_viec_wssckn.png",
      effects: { Government: -6, Businesses: -8, Workers: -4 },
    },
    {
      name: "Tự nguyện làm thêm giờ",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/tang_ca_tn_qbacqf.png",
      effects: { Government: 5, Businesses: 4, Workers: 2 },
    },
    {
      name: "Làm thêm nhiều việc",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/lam_nhieu_viec_gy1mrh.png",
      effects: { Government: 5, Businesses: 2, Workers: 4 },
    },
    {
      name: "Đình công",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/dinh_cong_ii5mpu.png",
      effects: { Government: -13, Businesses: -11, Workers: -9 },
    },
    {
      name: "Biểu tình đòi tăng lương",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/bieu_tinh_mt4oqi.png",
      effects: { Government: -11, Businesses: -12, Workers: -8 },
    },
    {
      name: "Làm việc hăng hái",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/lam_viec_hang_hai_rugops.png",
      effects: { Government: 3, Businesses: 5, Workers: 3 },
    },
  ],
};

// Events
interface GameEvent {
  name: string;
  imageUrl?: string;
  effects?: ActionEffect;
  positiveEffects?: ActionEffect;
  negativeEffects?: ActionEffect;
  isSpecialEvent?: boolean;
  entity?: Entity;
}
const EVENTS: Record<number, GameEvent> = {
  5: {
    name: "Startup",
    imageUrl:
      "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/start_up_xmarxz.png",
    positiveEffects: { Government: 15, Businesses: 15, Workers: 30 },
    negativeEffects: { Government: 0, Businesses: 0, Workers: -20 },
    isSpecialEvent: true,
    entity: "Workers",
  },
  10: {
    name: "Thiên Tai",
    imageUrl:
      "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/thien_tai_xg3v4z.png",
    effects: { Government: -10, Businesses: -10, Workers: -10 },
  },
  15: {
    name: "Đầu Tư Sản Phẩm Mới",
    imageUrl:
      "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/sp_moit_ouqyl5.png",
    positiveEffects: { Government: 20, Businesses: 40, Workers: 20 },
    negativeEffects: { Government: 0, Businesses: -20, Workers: 0 },
    isSpecialEvent: true,
    entity: "Businesses",
  },
  20: {
    name: "Khủng Hoảng Kinh Tế",
    imageUrl:
      "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/khung_hoang_kt_moajh4.png",
    effects: { Government: -20, Businesses: -20, Workers: -20 },
  },
  25: {
    name: "Chọn Phe (Quốc Tế)",
    imageUrl:
      "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/chon_phe_pvqwwc.png",
    positiveEffects: { Government: 49, Businesses: 49, Workers: 49 },
    negativeEffects: { Government: -30, Businesses: -30, Workers: -30 },
    isSpecialEvent: true,
    entity: "Government",
  },
  30: {
    name: "Chiến Tranh",
    imageUrl:
      "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_300/chien_tranh_knrld0.png",
    effects: { Government: -30, Businesses: -30, Workers: -30 },
  },
};

// Game log/history
interface LogEntry {
  round: number;
  entity: Entity | "Event";
  action: string;
  effects: ActionEffect;
}

type Bars = Record<Entity, number>;

type GameState = "menu" | "playing" | "gameOver" | "victory";
type EndingType = "harmony" | "survival" | null;

const INITIAL_BARS: Bars = { Government: 20, Businesses: 20, Workers: 20 };

export default function BalanceOfInterests() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [round, setRound] = useState<number>(1);
  const [bars, setBars] = useState<Bars>({ ...INITIAL_BARS });
  const [currentEntity, setCurrentEntity] = useState<Entity | null>(null);
  const [turnOrder, setTurnOrder] = useState<Entity[]>([]);
  const [turnIndex, setTurnIndex] = useState<number>(0);
  const [history, setHistory] = useState<LogEntry[]>([]);
  const [endingType, setEndingType] = useState<EndingType>(null);
  const [eventMessage, setEventMessage] = useState<string | null>(null);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [startButtonAnimating, setStartButtonAnimating] = useState(false);
  const [startClickAnimation, setStartClickAnimation] = useState<string | null>(
    null
  );
  const [menuFadingOut, setMenuFadingOut] = useState(false);
  const [endingFadingIn, setEndingFadingIn] = useState(false);

  // FAQ popup state
  const [showFAQ, setShowFAQ] = useState(false);

  // Player name and session tracking
  const [playerName, setPlayerName] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>(""); // Database grouping
  const [gameSessionId, setGameSessionId] = useState<string>(""); // Anti-cheat per game
  const [showNameInput, setShowNameInput] = useState(true);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [totalActions, setTotalActions] = useState<number>(0);
  const [inputShaking, setInputShaking] = useState(false);

  // Close FAQ popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showFAQ) {
        const target = event.target as Element;
        // Check if click is outside FAQ popup and FAQ button
        if (!target.closest(".faq-popup") && !target.closest(".faq-button")) {
          setShowFAQ(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFAQ]);

  // Generate UUID for session
  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  // Initialize user session on mount (for database grouping)
  useEffect(() => {
    if (!sessionId) {
      setSessionId(generateUUID());
    }
  }, [sessionId]);

  // Initialize game session on mount
  useEffect(() => {
    if (!gameSessionId) {
      setGameSessionId(generateUUID());
    }
  }, [gameSessionId]);


  const validateAndStartGame = () => {
    const trimmedName = playerName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      // Trigger shake animation instead of alert
      setInputShaking(true);
      setTimeout(() => setInputShaking(false), 500);
      return;
    }
    if (trimmedName.length > 50) {
      // Trigger shake animation instead of alert
      setInputShaking(true);
      setTimeout(() => setInputShaking(false), 500);
      return;
    }
    setShowNameInput(false);
    startGame();
  };

  const startGame = () => {
    // Prevent multiple clicks during animation
    if (startButtonAnimating) return;

    // Generate new game session for anti-cheat
    const newGameSessionId = generateUUID();
    setGameSessionId(newGameSessionId);

    // Set start button animation state
    setStartButtonAnimating(true);
    setStartClickAnimation("buttonClick");

    // Trigger additional animations after delay
    setTimeout(() => {
      setStartClickAnimation("actionPulse");
    }, 300);

    setTimeout(() => {
      setStartClickAnimation("actionGlow");
    }, 800);

    // Start menu fade out after 1 second
    setTimeout(() => {
      setMenuFadingOut(true);
    }, 1000);

    // Start the game after 2 seconds total
    setTimeout(() => {
      setGameState("playing");
      setRound(1);
      setBars({ ...INITIAL_BARS });
      setHistory([]);
      setEndingType(null);
      setEventMessage(null);
      setCurrentEvent(null);
      setShowEventPopup(false);
      setGameStartTime(Date.now());
      setTotalActions(0);
      // Reset submit flag for new game
      submitScoreRef.current = false;
      startNewRound(1); // pass initial round

      // Trigger music restart event
      window.dispatchEvent(
        new CustomEvent("gameStateChange", { detail: { state: "playing" } })
      );

      // Reset animation states after game starts
      setTimeout(() => {
        setStartButtonAnimating(false);
        setStartClickAnimation(null);
        setMenuFadingOut(false);
        setEndingFadingIn(false);
      }, 500);
    }, 2000);
  };

  const startNewRound = (startRound: number) => {
    const order = ENTITIES.slice().sort(() => Math.random() - 0.5);
    setTurnOrder(order);
    setTurnIndex(0);
    const firstEntity = order[0];
    setCurrentEntity(firstEntity);

    // Notify about turn change
    window.dispatchEvent(
      new CustomEvent("gameTurnChange", {
        detail: { currentEntity: firstEntity },
      })
    );

    if (EVENTS[startRound]) {
      const event = EVENTS[startRound];
      setCurrentEvent(event);
      setShowEventPopup(true);

      // Notify GameIllustration about special event
      window.dispatchEvent(
        new CustomEvent("specialEvent", {
          detail: {
            eventName: event.name,
            round: startRound,
          },
        })
      );
    }
  };

  const handleEventContinue = () => {
    if (currentEvent) {
      if (currentEvent.effects) {
        applyEffects(
          currentEvent.effects,
          `Sự kiện: ${currentEvent.name}`,
          "Event"
        );
      }
    }
    setShowEventPopup(false);
    setCurrentEvent(null);
  };

  const handleEventSkip = () => {
    // Skip the special event - no effects applied
    setShowEventPopup(false);
    setCurrentEvent(null);
  };

  const handleEventExecute = () => {
    if (currentEvent && currentEvent.isSpecialEvent) {
      // 10% chance for positive outcome, 90% for negative
      const isSuccess = Math.random() < 0.1;
      const effects = isSuccess
        ? currentEvent.positiveEffects
        : currentEvent.negativeEffects;

      if (effects) {
        applyEffects(
          effects,
          `Cơ hội ${currentEvent.name}: ${
            isSuccess ? "Thành công!" : "Thất bại!"
          }`,
          currentEvent.entity || "Event"
        );
      }
    }
    setShowEventPopup(false);
    setCurrentEvent(null);
  };

  const applyEffects = (
    effects: ActionEffect,
    actionName: string,
    by: Entity | "Event" = currentEntity || "Event"
  ) => {
    setBars((prev) => {
      const newBars: Bars = { ...prev };
      ENTITIES.forEach((entity) => {
        newBars[entity] = Math.max(
          0,
          Math.min(50, newBars[entity] + (effects[entity] ?? 0))
        );
      });
      return newBars;
    });
    setHistory((prev) => [
      ...prev,
      { round, entity: by, action: actionName, effects },
    ]);

    // Trigger event for GameIllustration component
    if (by !== "Event") {
      window.dispatchEvent(
        new CustomEvent("gameActionEffect", {
          detail: {
            effects,
            currentEntity: by,
          },
        })
      );
    } else {
      // Trigger event for special events too
      window.dispatchEvent(
        new CustomEvent("gameActionEffect", {
          detail: {
            effects,
            currentEntity: "Event",
          },
        })
      );
    }
  };

  const checkGameOver = (currentBars: Bars): boolean => {
    // Chỉ còn 2 ending: harmony và survival
    // Nếu bất kỳ chỉ số nào về 0, kết thúc game với survival
    if (
      currentBars.Government <= 0 ||
      currentBars.Businesses <= 0 ||
      currentBars.Workers <= 0
    ) {
      setEndingType("survival");
      startEndingTransition("gameOver");
      return true;
    }
    // Endgame - only check at end of round 30 or after all entities have taken their turn
    if (round >= 30 && turnIndex >= turnOrder.length - 1) {
      // Cân bằng hoàn hảo: 3 chỉ số bằng nhau
      if (
        currentBars.Government === currentBars.Businesses &&
        currentBars.Businesses === currentBars.Workers
      ) {
        setEndingType("harmony");
      } else {
        setEndingType("survival");
      }
      startEndingTransition("victory");
      return true;
    }
    return false;
  };

  const startEndingTransition = (targetState: "gameOver" | "victory") => {
    // Fade out current game
    setMenuFadingOut(true);

    setTimeout(() => {
      setGameState(targetState);
      setMenuFadingOut(false);
      // Start fade-in for ending screen
      setEndingFadingIn(true);
      // Submit score when game ends
      submitScore(targetState);

      // Trigger music restart event
      window.dispatchEvent(
        new CustomEvent("gameStateChange", { detail: { state: targetState } })
      );
    }, 1000); // Same duration as menu fade out
  };

  // Submit score to Supabase - using ref to prevent duplicate calls
  const submitScoreRef = React.useRef(false);

  // Helper function to generate HMAC signature client-side
  const generateClientSignature = async (data: {
    game_session_id: string;
    final_round: number;
    gov_bar: number;
    bus_bar: number;
    wor_bar: number;
    duration: number;
    ending: string;
  }): Promise<string> => {
    const secret = process.env.NEXT_PUBLIC_GAME_SECRET || "default_secret";
    const message = [
      data.game_session_id,
      data.final_round,
      data.gov_bar,
      data.bus_bar,
      data.wor_bar,
      data.duration,
      data.ending,
    ].join("|");

    // Use Web Crypto API for HMAC-SHA256
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const msgData = encoder.encode(message);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
    return Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const submitScore = async (resultState: "gameOver" | "victory") => {
    // Prevent duplicate submissions
    if (submitScoreRef.current) {
      return;
    }

    submitScoreRef.current = true;

    const gameDuration = Math.floor((Date.now() - gameStartTime) / 1000);
    const ending =
      resultState === "gameOver"
        ? "FAILED"
        : endingType === "harmony"
        ? "HARMONY"
        : "SURVIVAL";

    const gameData = {
      game_session_id: gameSessionId,
      final_round: round,
      gov_bar: bars.Government,
      bus_bar: bars.Businesses,
      wor_bar: bars.Workers,
      duration: gameDuration,
      ending: ending,
    };

    // Generate HMAC signature
    const signature = await generateClientSignature(gameData);

    const payload = {
      session_id: sessionId,
      game_session_id: gameSessionId,
      name: playerName.trim(),
      final_round: round,
      total_action: totalActions,
      gov_bar: bars.Government,
      bus_bar: bars.Businesses,
      wor_bar: bars.Workers,
      start_time: new Date(gameStartTime).toISOString(),
      end_time: new Date().toISOString(),
      duration: gameDuration,
      ending: ending,
      signature: signature,
    };

    try {
      const response = await fetch("/api/submit-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to submit score");
      }
    } catch {
      // Silent fail - reset flag to allow retry
      submitScoreRef.current = false;
    }
  };

  // Check end states each time bars/turn/round updates
  useEffect(() => {
    if (gameState === "playing" && currentEntity) {
      const currentBars = bars;
      if (checkGameOver(currentBars)) return;
    }
    // eslint-disable-next-line
  }, [bars, round, turnIndex]);

  // Action handling
  const handleAction = (action: GameAction) => {
    const modifiedEffects = { ...action.effects };

    // Apply round-based difficulty modifiers
    if (round >= 11 && round <= 20) {
      // Reduce effects by 1 for rounds 11-20 (make all effects closer to 0)
      Object.keys(modifiedEffects).forEach((key) => {
        const entity = key as Entity;
        if (modifiedEffects[entity] > 0) {
          modifiedEffects[entity] -= 1;
        } else if (modifiedEffects[entity] < 0) {
          modifiedEffects[entity] -= 1; // Make negative effects more negative
        }
      });
    } else if (round >= 21 && round <= 30) {
      // Reduce effects by 2 for rounds 21-30 (make all effects closer to 0)
      Object.keys(modifiedEffects).forEach((key) => {
        const entity = key as Entity;
        if (modifiedEffects[entity] > 0) {
          modifiedEffects[entity] -= 2;
        } else if (modifiedEffects[entity] < 0) {
          modifiedEffects[entity] -= 2; // Make negative effects more negative
        }
      });
    }

    applyEffects(modifiedEffects, action.name, currentEntity || "Event");
    setTotalActions((prev) => prev + 1);
  };

  const handleActionComplete = () => {
    setTimeout(() => {
      if (turnIndex < turnOrder.length - 1) {
        // Move to next entity's turn
        const nextIndex = turnIndex + 1;
        const nextEntity = turnOrder[nextIndex];
        setTurnIndex(nextIndex);
        setCurrentEntity(nextEntity);

        // Notify about turn change
        window.dispatchEvent(
          new CustomEvent("gameTurnChange", {
            detail: { currentEntity: nextEntity },
          })
        );
      } else {
        // All entities have taken their turn this round
        if (round < 30) {
          // Start next round
          setRound(round + 1);
          startNewRound(round + 1);
        }
        // If round >= 30, let the useEffect handle game over check
        // Don't start a new round, the game should end
      }
    }, 0); // Immediate transition after action animation completes
  };

  // Get available actions by entity and round (random subset per choice)
  const availableActions: GameAction[] = useMemo(() => {
    if (!currentEntity) return [];
    const actions = ACTIONS[currentEntity];
    const shuffled = actions.slice().sort(() => Math.random() - 0.5);
    if (round >= 21) {
      return shuffled.slice(0, Math.min(2, shuffled.length));
    }
    // rounds 1-20
    return shuffled.slice(0, Math.min(3, shuffled.length));
  }, [currentEntity, round]);

  // UI Sections:
  const mainGameUI = (
    <div className="w-full h-screen relative bg-[var(--clay-bg)]">
      {/* FAQ Button - top left */}
      <div className="absolute top-5 left-10 z-50 mobile-faq-container">
        <button
          className="faq-button"
          title="Hướng dẫn"
          onClick={() => setShowFAQ((v) => !v)}
        >
          ?
        </button>
        {showFAQ && <FAQPopup onClose={() => setShowFAQ(false)} />}
      </div>

      {/* Desktop Layout - New Claymorphism Design */}
      <div className="hidden md:flex w-full h-full flex-col p-2 pt-1 gap-2">
        {/* Chart Row - Full Width, Closer to Top */}
        <div className="w-full max-w-6xl mx-auto">
          <StatusLineChart
            history={history}
            currentBars={bars}
            currentRound={round}
            currentTurnIndex={turnIndex}
          />
        </div>

          {/* Main Content Row: Actions only */}
        <div className="flex-1 flex gap-4 max-w-6xl mx-auto w-full">
          {/* Action Buttons - Centered */}
          <div className="flex-1 flex flex-col">
            {currentEntity && (
              <>
                <div className="text-center mb-2">
                  <span className="text-slate-500">Lượt {turnIndex + 1}/{turnOrder.length} - </span>
                  <span className="text-lg font-semibold text-purple-600">
                    {currentEntity === "Government" && "Nhà Nước"}
                    {currentEntity === "Businesses" && "Doanh Nghiệp"}
                    {currentEntity === "Workers" && "Người Lao Động"}
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <GameActionButtons
                    actions={availableActions}
                    handleAction={handleAction}
                    eventMessage={eventMessage}
                    entity={currentEntity}
                    onActionComplete={handleActionComplete}
                    round={round}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="mobile-game-container md:hidden flex flex-col p-3 gap-3">
        {/* Mobile Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl text-amber-500 font-bold">lợi ⚖ ích</h1>
          <div className="clay-card px-3 py-1 flex items-center gap-1">
            <span className="text-sm text-slate-500">Vòng</span>
            <span className="text-lg text-purple-600 font-bold">{round}/30</span>
          </div>
        </div>

        {/* Mobile Status Display - Compact */}
        <div className="flex justify-center gap-4">
          <div className="text-center">
            <span className="text-red-500 font-bold">N</span>
            <span className="text-slate-600 ml-1">{bars.Government}</span>
          </div>
          <div className="text-center">
            <span className="text-blue-500 font-bold">D</span>
            <span className="text-slate-600 ml-1">{bars.Businesses}</span>
          </div>
          <div className="text-center">
            <span className="text-green-500 font-bold">L</span>
            <span className="text-slate-600 ml-1">{bars.Workers}</span>
          </div>
        </div>

        {/* Mobile Role Display */}
        {currentEntity && (
          <div className="text-center text-sm text-slate-600">
            Lượt {turnIndex + 1}/{turnOrder.length} -{" "}
            <span className="font-semibold text-purple-600">
              {currentEntity === "Government" && "Nhà Nước"}
              {currentEntity === "Businesses" && "Doanh Nghiệp"}
              {currentEntity === "Workers" && "Người Lao Động"}
            </span>
          </div>
        )}

        {/* Mobile Action Buttons */}
        {currentEntity && (
          <div className="flex-1">
            <GameActionButtons
              actions={availableActions}
              handleAction={handleAction}
              eventMessage={eventMessage}
              entity={currentEntity}
              onActionComplete={handleActionComplete}
              round={round}
            />
          </div>
        )}
      </div>
    </div>
  );

  if (gameState === "menu") {
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
            onClick={() => setShowFAQ((v) => !v)}
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
  if (gameState === "gameOver") {
    return (
      <div
        className={`min-h-screen w-full bg-[var(--clay-bg)] relative overflow-hidden flex items-center justify-center menu-container fade-in ${
          menuFadingOut ? "fade-out" : ""
        } ${endingFadingIn ? "animate-fadeIn" : ""}`}
      >
        {/* Decorative Circles */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-red-200/20 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full">
          <h1 className="text-9xl text-pink-600 mb-2 tracking-tight text-nowrap font-black drop-shadow-sm">
            lợi💥ích
          </h1>
          <h1 className="text-6xl text-pink-600 mb-5 mt-5 tracking-tight font-bold">
            Thất bại
          </h1>
          <p className="text-4xl text-slate-600 mb-8 text-center max-w-4xl font-medium">
            &quot; Mất cân bằng về lợi ích. Mâu thuẫn xuất hiện! &quot;
          </p>
          <button
            onClick={startGame}
            disabled={startButtonAnimating}
            className={`
              w-60 game-button
              ${startButtonAnimating ? "cursor-not-allowed opacity-80" : ""}
              ${startClickAnimation ? `animate-${startClickAnimation}` : ""}
            `}
          >
            <span className="relative z-10">
              {startButtonAnimating ? "Đang tải..." : "Chơi lại"}
            </span>
          </button>

          <a
            href="/leaderboard"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-200 shadow-lg text-lg"
          >
            🏆 Bảng Xếp Hạng
          </a>
        </div>
      </div>
    );
  }
  if (gameState === "victory") {
    const endings: Record<
      Exclude<EndingType, null>,
      {
        title: string;
        desc: string;
      }
    > = {
      harmony: {
        title: "Cân Bằng ☀ Hoàn Hảo",
        desc: '" Bạn đã đạt được sự cân bằng tuyệt đối. 3 lực lượng bằng nhau ở vòng cuối! "',
      },
      survival: {
        title: "Lợi ☘ Ích",
        desc: '" Xin chúc mừng. Bạn đã thành công duy trì sự cân bằng qua 30 vòng đầy biến động. "',
      },
    };
    const ending = endings[endingType as Exclude<EndingType, null>];

    return (
      <div
        className={`min-h-screen w-full bg-[var(--clay-bg)] relative overflow-hidden flex items-center justify-center menu-container fade-in ${
          menuFadingOut ? "fade-out" : ""
        } ${endingFadingIn ? "animate-fadeIn" : ""}`}
      >
        {/* Decorative Circles */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-yellow-200/30 blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full bg-green-200/30 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full">
          <h1 className="text-9xl text-amber-500 mb-2 tracking-tight text-nowrap font-black drop-shadow-sm">
            {ending.title}
          </h1>

          <p className="text-2xl text-slate-600 mb-8 text-center max-w-4xl font-medium">
            {ending.desc}
          </p>

          {/* Simple Results Display */}
          <div className="text-center mb-8">
            <h2 className="text-xl text-slate-500 mb-4">
              Kết quả cuối cùng (Vòng {round})
            </h2>
            <div className="text-xl text-cyan-600">
              Nhà nước : {bars.Government} &nbsp;&nbsp;|&nbsp;&nbsp; Doanh
              nghiệp : {bars.Businesses} &nbsp;&nbsp;|&nbsp;&nbsp; Người lao
              động : {bars.Workers}
            </div>
          </div>

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
              {startButtonAnimating ? "Đang tải..." : "Chơi lại"}
            </span>
          </button>

          <a
            href="/leaderboard"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-200 shadow-lg text-lg"
          >
            🏆 Xem Bảng Xếp Hạng
          </a>
        </div>
      </div>
    );
  }

  // Game playing
  return (
    <div className="min-h-screen w-full bg-[var(--clay-bg)] relative overflow-hidden">
      {/* Decorative Circles for Game Screen */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10">{mainGameUI}</div>

      {/* Event Popup */}
      {showEventPopup && currentEvent && (
        <EventPopup
          event={currentEvent}
          onContinue={handleEventContinue}
          onSkip={handleEventSkip}
          onExecute={handleEventExecute}
          round={round}
        />
      )}
    </div>
  );
}
