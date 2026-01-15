import { GameEvent } from "../types/game";

const CLOUDINARY_BASE = "https://res.cloudinary.com/do6szo7zy/image/upload";
const OPT_EVENT = "f_auto,q_auto,ar_16:9,c_fill"; // 16:9 for Events

export const EVENTS: Record<number, GameEvent> = {
  5: {
    name: "Startup",
    imageUrl: `${CLOUDINARY_BASE}/${OPT_EVENT}/v1768308253/db_khoi-nghiep_g4cswk.png`,
    positiveEffects: { Government: 15, Businesses: 15, Workers: 30 },
    negativeEffects: { Government: 0, Businesses: 0, Workers: -20 },
    isSpecialEvent: true,
    entity: "Workers",
    rerollReward: true,
  },
  10: {
    name: "Thiên Tai",
    imageUrl: `${CLOUDINARY_BASE}/${OPT_EVENT}/v1768308254/db_thien-tai_ocv2f4.png`,
    effects: { Government: -10, Businesses: -10, Workers: -10 },
    rerollReward: true,
    isSkippable: true,
  },
  15: {
    name: "Đầu Tư Sản Phẩm Mới",
    imageUrl: `${CLOUDINARY_BASE}/${OPT_EVENT}/v1768308251/db_dau-tu_vm9m4i.png`,
    positiveEffects: { Government: 20, Businesses: 40, Workers: 20 },
    negativeEffects: { Government: 0, Businesses: -20, Workers: 0 },
    isSpecialEvent: true,
    entity: "Businesses",
    rerollReward: true,
  },
  20: {
    name: "Khủng Hoảng Kinh Tế",
    imageUrl: `${CLOUDINARY_BASE}/${OPT_EVENT}/v1768308252/db_khkt_jshyig.png`,
    effects: { Government: -20, Businesses: -20, Workers: -20 },
    rerollReward: true,
    isSkippable: true,
  },
  25: {
    name: "Chọn Phe (Quốc Tế)",
    imageUrl: `${CLOUDINARY_BASE}/${OPT_EVENT}/v1768308251/db_chon-phe_pncor9.png`,
    positiveEffects: { Government: 49, Businesses: 49, Workers: 49 },
    negativeEffects: { Government: -30, Businesses: -30, Workers: -30 },
    isSpecialEvent: true,
    entity: "Government",
    rerollReward: true,
  },
  30: {
    name: "Chiến Tranh",
    imageUrl: `${CLOUDINARY_BASE}/${OPT_EVENT}/v1768308251/db_chien-tranh_k9mgjp.png`,
    effects: { Government: -30, Businesses: -30, Workers: -30 },
    rerollReward: true,
    isSkippable: true,
  },
};

// Helper: Check if a round has an event
export function hasEvent(round: number): boolean {
  return round in EVENTS;
}

// Helper: Check if round has a special (choice-based) event
export function isSpecialEventRound(round: number): boolean {
  const event = EVENTS[round];
  return event?.isSpecialEvent === true;
}

// Helper: Get event for a round (if exists)
export function getEventForRound(round: number): GameEvent | undefined {
  return EVENTS[round];
}
