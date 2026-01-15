/**
 * Game Types - Core type definitions for the balance game
 */

// Entity types
export type Entity = "Government" | "Businesses" | "Workers";
export const ENTITIES: Entity[] = ["Government", "Businesses", "Workers"];

// Action effect type
export type ActionEffect = Record<Entity, number>;

// Game action definition
export interface GameAction {
  name: string;
  imageUrl: string;
  effects: ActionEffect;
}

// Action pool by entity
export type ActionPool = Record<Entity, GameAction[]>;

// Game event definition
export interface GameEvent {
  name: string;
  imageUrl?: string;
  effects?: ActionEffect;
  positiveEffects?: ActionEffect;
  negativeEffects?: ActionEffect;
  isSpecialEvent?: boolean;
  entity?: Entity;
  rerollReward?: boolean;
  isSkippable?: boolean;
}

// Game log entry
export interface LogEntry {
  round: number;
  entity: Entity | "Event";
  action: string;
  effects: ActionEffect;
}

// Bar values
export type Bars = Record<Entity, number>;

// Game states
export type GameState = "menu" | "playing" | "gameOver" | "victory";
export type EndingType = "harmony" | "survival" | "failed" | null;

// Session data for score submission
export interface GameSessionData {
  sessionId: string;
  gameSessionId: string;
  playerName: string;
  startTime: number;
  totalActions: number;
}

// Score submission payload
export interface ScoreSubmitPayload {
  session_id: string;
  game_session_id: string;
  name: string;
  final_round: number;
  total_action: number;
  gov_bar: number;
  bus_bar: number;
  wor_bar: number;
  start_time: string;
  end_time: string;
  duration: number;
  ending: string;
  signature: string;
}
