/**
 * Game Configuration Constants
 * Centralized settings to eliminate magic numbers
 */

import type { Bars } from "@/lib/types/game";

export const GAME_CONFIG = {
  // Rounds
  TOTAL_ROUNDS: 30,
  INITIAL_BAR_VALUE: 20,
  MAX_BAR_VALUE: 50,
  MIN_BAR_VALUE: 0,

  // Round modifiers (difficulty scaling)
  MODIFIER_PHASE_1_END: 10, // Rounds 1-10: no modifier
  MODIFIER_PHASE_2_END: 20, // Rounds 11-20: -1
  MODIFIER_PHASE_2_VALUE: 1,
  MODIFIER_PHASE_3_VALUE: 2, // Rounds 21-30: -2

  // Actions per round
  ACTIONS_ROUNDS_1_20: 3,
  ACTIONS_ROUNDS_21_30: 2,

  // Event rounds
  EVENT_ROUNDS: [5, 10, 15, 20, 25, 30] as const,
  SPECIAL_EVENT_ROUNDS: [5, 15, 25] as const,
  REGULAR_EVENT_ROUNDS: [10, 20, 30] as const,

  // Special event probability
  SPECIAL_EVENT_SUCCESS_RATE: 0.1, // 10%

  // Player name validation
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,

  // Duration limits (seconds)
  MIN_GAME_DURATION: 10,
  MAX_GAME_DURATION: 7200, // 2 hours
} as const;

// Initial bar values
export const INITIAL_BARS: Bars = {
  Government: GAME_CONFIG.INITIAL_BAR_VALUE,
  Businesses: GAME_CONFIG.INITIAL_BAR_VALUE,
  Workers: GAME_CONFIG.INITIAL_BAR_VALUE,
};

// Entity display labels
export const ENTITY_LABELS = {
  Government: "Nhà Nước",
  Businesses: "Doanh Nghiệp",
  Workers: "Người Lao Động",
} as const;

// Entity short labels for compact display
export const ENTITY_SHORT_LABELS = {
  Government: "N",
  Businesses: "D",
  Workers: "L",
} as const;
