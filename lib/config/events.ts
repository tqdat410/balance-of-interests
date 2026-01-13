/**
 * Game Events - Special events triggered at specific rounds
 */

import type { GameEvent } from "@/lib/types/game";

export const EVENTS: Record<number, GameEvent> = {
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
