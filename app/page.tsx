"use client";

import React, { useState, useEffect, useMemo } from "react";
import GameStatusBars from "./components/GameStatusBars";
import GameActionButtons from "./components/GameActionButtons";
import GameHistory from "./components/GameHistory";
import EventPopup from "./components/EventPopup";
import GameIllustration from "./components/GameIllustration";

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
            Duy trì 3 thanh trạng thái cân bằng trong 30 vòng để chiến thắng.
          </li>
          <li className="text-red-400">Thất bại : 1 trong 3 chỉ số về 0.</li>
          <li>N : Nhà nước</li>
          <li>D : Doanh Nghiệp</li>
          <li>L : Người lao động</li>
          <li className="text-purple-600">
            Các sự kiện đặc biệt sẽ xuất hiện ở một số vòng.
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
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/tang_thue_dn_qjctbv.png",
      effects: { Government: 12, Businesses: -12, Workers: -5 },
    },
    {
      name: "Giảm thuế Doanh nghiệp",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/giam_thue_dn_r46w9t.png",
      effects: { Government: -12, Businesses: 8, Workers: 2 },
    },
    {
      name: "Tăng thuế TNCN",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/tang_thue_tncn_gpf941.png",
      effects: { Government: 12, Businesses: -3, Workers: -7 },
    },
    {
      name: "Giảm thuế TNCN",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/giam_thue_tncn_lvyqvl.png",
      effects: { Government: -11, Businesses: 2, Workers: 7 },
    },
    {
      name: "Đầu tư cơ sở hạ tầng",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/dau_tu_ht_d8hcpe.png",
      effects: { Government: -14, Businesses: 5, Workers: 9 },
    },
    {
      name: "Đầu tư vào Giáo dục",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/dau_tu_gd_j0rgaw.png",
      effects: { Government: -14, Businesses: 5, Workers: 9 },
    },
    {
      name: "Trợ cấp an sinh xã hội",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/tro_cap_asxh_adk225.png",
      effects: { Government: -12, Businesses: 3, Workers: 7 },
    },
    {
      name: "Trợ cấp thất nghiệp",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/tro_cap_tn_d6vxxg.png",
      effects: { Government: -9, Businesses: 0, Workers: 3 },
    },
    {
      name: "Tăng mức lương tối thiểu",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/tang_luong_toi_thieu_z3fgki.png",
      effects: { Government: 2, Businesses: -13, Workers: 7 },
    },
    {
      name: "Siết chặt quy định kinh doanh",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/siet_chat_qddn_djxwjf.png",
      effects: { Government: 10, Businesses: -12, Workers: -5 },
    },
    {
      name: "Khuyến khích Startup",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/kk_startup_dy9rps.png",
      effects: { Government: -12, Businesses: 3, Workers: 6 },
    },
    {
      name: "Kích cầu kinh tế",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/kich_cau_kt_bjjsxm.png",
      effects: { Government: -16, Businesses: 12, Workers: 6 },
    },
    {
      name: "Mở rộng hợp tác quốc tế",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/hop_tac_qt_o72rt0.png",
      effects: { Government: 3, Businesses: 3, Workers: 3 },
    },
    {
      name: "Ra soát tham nhũng",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/ra_soat_tn_kyq2gv.png",
      effects: { Government: 6, Businesses: -9, Workers: 3 },
    },
    {
      name: "Siết chặt hàng giả - gian lận",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/siet_chat_hg_gl_boprov.png",
      effects: { Government: 6, Businesses: -10, Workers: 3 },
    },
  ],
  Businesses: [
    {
      name: "Ép buộc tăng ca",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/tang_ca_xwhnje.png",
      effects: { Government: 3, Businesses: 10, Workers: -11 },
    },
    {
      name: "Cắt giảm nhân sự",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/cat_giam_ns_nbwqn3.png",
      effects: { Government: -6, Businesses: 12, Workers: -11 },
    },
    {
      name: "Đầu tư công nghệ mới",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/dau_tu_cn_fxlows.png",
      effects: { Government: 6, Businesses: 4, Workers: 3 },
    },
    {
      name: "Trốn thuế",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/tron_thue_dqogzd.png",
      effects: { Government: -11, Businesses: 7, Workers: -9 },
    },
    {
      name: "Tăng lương",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/tang_luong_jxdd8a.png",
      effects: { Government: 2, Businesses: -6, Workers: 7 },
    },
    {
      name: "Mở rộng sản xuất",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/mo_rong_sx_egazs0.png",
      effects: { Government: 2, Businesses: 6, Workers: 4 },
    },
    {
      name: "Hối lộ quan chức",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/hoi_lo_ddjb9q.png",
      effects: { Government: -12, Businesses: 6, Workers: -7 },
    },
    {
      name: "Xả thải ra môi trường",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/xa_thai_s1myf9.png",
      effects: { Government: -13, Businesses: 6, Workers: -7 },
    },
    {
      name: "Tăng giá bán sản phẩm",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/tang_gia_fgodwi.png",
      effects: { Government: 2, Businesses: 5, Workers: -9 },
    },
    {
      name: "Sản xuất hàng giả",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/sx_hang_gia_l0jguv.png",
      effects: { Government: -12, Businesses: 6, Workers: -10 },
    },
    {
      name: "Chạy đua giảm giá",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/giam_gia_poze84.png",
      effects: { Government: -1, Businesses: 4, Workers: -7 },
    },
    {
      name: "Đào tạo lao động",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/dao_tao_ld_dh3ikr.png",
      effects: { Government: 2, Businesses: 3, Workers: 5 },
    },
  ],
  Workers: [
    {
      name: "Nâng cao tay nghề",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/nang_cao_tay_nghe_yvmflt.png",
      effects: { Government: 4, Businesses: 3, Workers: 5 },
    },
    {
      name: "Nhảy việc",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/nhay_viec_zgaopd.png",
      effects: { Government: -1, Businesses: -10, Workers: 3 },
    },
    {
      name: "Gian lận trong lao động",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/vi_pham_ursnk4.png",
      effects: { Government: -3, Businesses: -9, Workers: 2 },
    },
    {
      name: "Nghỉ việc",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/nghi_viec_wssckn.png",
      effects: { Government: -6, Businesses: -8, Workers: -4 },
    },
    {
      name: "Tự nguyện làm thêm giờ",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/tang_ca_tn_qbacqf.png",
      effects: { Government: 5, Businesses: 4, Workers: 2 },
    },
    {
      name: "Làm thêm nhiều việc",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/lam_nhieu_viec_gy1mrh.png",
      effects: { Government: 5, Businesses: 2, Workers: 4 },
    },
    {
      name: "Đình công",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/dinh_cong_ii5mpu.png",
      effects: { Government: -13, Businesses: -11, Workers: -9 },
    },
    {
      name: "Biểu tình đòi tăng lương",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/bieu_tinh_mt4oqi.png",
      effects: { Government: -11, Businesses: -12, Workers: -8 },
    },
    {
      name: "Làm việc hăng hái",
      imageUrl:
        "https://res.cloudinary.com/do6szo7zy/image/upload/f_auto,q_auto,w_400/lam_viec_hang_hai_rugops.png",
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
    imageUrl: "/event/start_up.png",
    positiveEffects: { Government: 10, Businesses: 15, Workers: 25 },
    negativeEffects: { Government: 0, Businesses: 0, Workers: -30 },
    isSpecialEvent: true,
    entity: "Workers",
  },
  10: {
    name: "Thiên Tai",
    imageUrl: "/event/thien_tai.png",
    effects: { Government: -10, Businesses: -10, Workers: -10 },
  },
  15: {
    name: "Đầu Tư Sản Phẩm Mới",
    imageUrl: "/event/sp_moit.png",
    positiveEffects: { Government: 20, Businesses: 35, Workers: 10 },
    negativeEffects: { Government: -5, Businesses: -30, Workers: -1 },
    isSpecialEvent: true,
    entity: "Businesses",
  },
  20: {
    name: "Khủng Hoảng Kinh Tế",
    imageUrl: "/event/khung_hoang_kt.png",
    effects: { Government: -20, Businesses: -20, Workers: -20 },
  },
  25: {
    name: "Chọn Phe (Quốc Tế)",
    imageUrl: "/event/chon_phe.png",
    positiveEffects: { Government: 49, Businesses: 49, Workers: 49 },
    negativeEffects: { Government: -30, Businesses: -30, Workers: -30 },
    isSpecialEvent: true,
    entity: "Government",
  },
  30: {
    name: "Chiến Tranh",
    imageUrl: "/event/chien_tranh.png",
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

  const startGame = () => {
    // Prevent multiple clicks during animation
    if (startButtonAnimating) return;

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
      startNewRound(1); // pass initial round

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
    }, 1000); // Same duration as menu fade out
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
    let modifiedEffects = { ...action.effects };

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

  // Bar color util
  const getBarColor = (value: number) => {
    if (value > 60) return "bg-green-500";
    if (value > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  // UI Sections:
  const mainGameUI = (
    <div className="w-full h-screen relative bg-transparent">
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

      {/* Desktop Layout */}
      <div className="hidden md:block w-full h-full">
        {/* Header absolute top */}
        <div className="game-header absolute top-0 left-0 w-full flex flex-col items-center justify-center pt-2 z-10">
          <h1 className="text-7xl text-amber-100 mt-6">lợi ⚖ ích</h1>
          <div className="round-display">
            <p className="text-2xl text-slate-400 mb-0">Vòng</p>
            <p className="text-3xl text-purple-600">{round}/30</p>
          </div>
        </div>
        {/* Status Bars absolute left */}
        <div className="status-bars-container absolute top-1/2 left-35 -translate-y-1/2 z-10">
          <GameStatusBars
            bars={bars}
            entities={ENTITIES}
            getBarColor={getBarColor}
          />
        </div>
        {/* RIGHT: GameHistory absolute fixed */}
        <div className="history-container absolute top-1/2 right-15 -translate-y-1/2 z-10">
          <GameHistory history={history} />
        </div>
        {/* Action Choices absolute center dưới header */}
        <div className="absolute left-1/2 bottom-1/30 -translate-x-1/2 -translate-y-1/30 flex flex-col items-center justify-center z-0">
          <div className="game-illustration">
            <GameIllustration round={round} />
          </div>
          {currentEntity && (
            <>
              {/* Role Name and Turn Order Display */}
              <div className="mb-1 text-center">
                <h2 className="text-sm text-slate-700">
                  ( Lượt {turnIndex + 1}/{turnOrder.length} ){" "}
                  <span className="text-lg">
                    {currentEntity === "Government" && "Nhà Nước"}
                    {currentEntity === "Businesses" && "Doanh Nghiệp"}
                    {currentEntity === "Workers" && "Người Lao Động"}
                  </span>
                </h2>
              </div>
              <div className="action-buttons-container">
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

      {/* Mobile Layout */}
      <div className="mobile-game-container md:hidden">
        {/* Mobile Header */}
        <div className="mobile-header">
          <h1 className="text-7xl text-amber-100 mt-6">lợi ⚖ ích</h1>
          <div className="mobile-round">
            <p className="text-lg text-slate-400 mb-0">Vòng</p>
            <p className="text-xl text-purple-600">{round}/30</p>
          </div>
        </div>

        {/* Mobile Status Display */}
        <div className="mobile-status">
          <div className="mobile-status-item">
            <div className="mobile-status-label gov">N</div>
            <div className="mobile-status-value gov">{bars.Government}/50</div>
          </div>
          <div className="mobile-status-item">
            <div className="mobile-status-label biz">D</div>
            <div className="mobile-status-value biz">{bars.Businesses}/50</div>
          </div>
          <div className="mobile-status-item">
            <div className="mobile-status-label worker">L</div>
            <div className="mobile-status-value worker">{bars.Workers}/50</div>
          </div>
        </div>

        {/* Mobile Game Illustration */}
        <div className="mobile-illustration">
          <GameIllustration round={round} />
        </div>

        {/* Mobile Role Display */}
        {currentEntity && (
          <div className="mobile-role">
            ( Lượt {turnIndex + 1}/{turnOrder.length} ){" "}
            <span>
              {currentEntity === "Government" && "Nhà Nước"}
              {currentEntity === "Businesses" && "Doanh Nghiệp"}
              {currentEntity === "Workers" && "Người Lao Động"}
            </span>
          </div>
        )}

        {/* Mobile Action Buttons */}
        {currentEntity && (
          <div className="mobile-actions">
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
        className={`min-h-screen w-full bg-white relative overflow-hidden flex items-center justify-center menu-container ${
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
        {/* Grid + Glow on All Sides */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "#ffffff",
            backgroundImage: `
       radial-gradient(circle at top center, rgba(59, 130, 246, 0.5),transparent 70%)
     `,
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full">
          <h1 className="text-9xl text-amber-500 mb-2 tracking-tight text-nowrap">
            lợi ⚖ ích
          </h1>
          <p className="text-2xl text-amber-700 mb-8 text-center max-w-9xl">
            " Duy trì sự cân bằng về lợi ích giữa Nhà nước, Doanh nghiệp và
            người lao động. <br /> Đảm bảo không chủ thể nào bị bỏ lại phía sau!
            "
          </p>
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
        </div>
      </div>
    );
  }
  if (gameState === "gameOver") {
    return (
      <div
        className={`min-h-screen w-full bg-white relative overflow-hidden flex items-center justify-center menu-container fade-in ${
          menuFadingOut ? "fade-out" : ""
        } ${endingFadingIn ? "animate-fadeIn" : ""}`}
      >
        {/* Grid + Glow on All Sides */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "#ffffff",
            backgroundImage: `
       radial-gradient(circle at top center, rgba(59, 130, 246, 0.5),transparent 70%)
     `,
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full">
          <h1 className="text-9xl text-pink-700 mb-2 tracking-tight text-nowrap">
            lợi💥ích
          </h1>
          <h1 className="text-6xl text-pink-700 mb-5 mt-5 tracking-tight">
            Thất bại
          </h1>
          <p className="text-4xl text-amber-600 mb-8 text-center max-w-9xl">
            " Mất cân bằng về lợi ích. Mâu thuẩn xuất hiện. "
          </p>
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
        className={`min-h-screen w-full bg-white relative overflow-hidden flex items-center justify-center menu-container fade-in ${
          menuFadingOut ? "fade-out" : ""
        } ${endingFadingIn ? "animate-fadeIn" : ""}`}
      >
        {/* Grid + Glow on All Sides */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "#ffffff",
            backgroundImage: `
       radial-gradient(circle at top center, rgba(59, 130, 246, 0.5),transparent 70%)
     `,
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full">
          <h1 className="text-9xl text-amber-500 mb-2 tracking-tight text-nowrap">
            {ending.title}
          </h1>

          <p className="text-2xl text-slate-600 mb-8 text-center max-w-6xl">
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
        </div>
      </div>
    );
  }

  // Game playing
  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden">
      {/* Purple Corner Grid Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
       radial-gradient(circle at center, #93c5fd, transparent)
     `,
        }}
      />
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
