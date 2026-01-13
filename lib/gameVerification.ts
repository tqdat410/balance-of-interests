/**
 * Game Verification Module - Simplified HMAC-based Anti-cheat
 *
 * Flow: Client generates signature with client secret → Server verifies with same secret
 * No token API needed - single submit call only
 */

/**
 * Generate HMAC-SHA256 using Web Crypto API (Edge Runtime compatible)
 */
async function hmacSha256(key: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
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
}

/**
 * Game data for signature generation
 */
export interface GameSignatureData {
  game_session_id: string;
  final_round: number;
  gov_bar: number;
  bus_bar: number;
  wor_bar: number;
  duration: number;
  ending: string;
}

/**
 * Generate game verification signature (used by client and server)
 * game_session_id acts as nonce - prevents replay across sessions
 */
export async function generateGameSignature(
  data: GameSignatureData,
  secret: string
): Promise<string> {
  const message = [
    data.game_session_id,
    data.final_round,
    data.gov_bar,
    data.bus_bar,
    data.wor_bar,
    data.duration,
    data.ending,
  ].join("|");

  return hmacSha256(secret, message);
}

/**
 * Server-side signature verification
 */
export async function verifyGameSignature(
  data: GameSignatureData,
  clientSignature: string,
  secret: string
): Promise<{ valid: boolean; reason?: string }> {
  const expectedSig = await generateGameSignature(data, secret);

  if (expectedSig !== clientSignature) {
    return { valid: false, reason: "Invalid signature" };
  }

  return { valid: true };
}

/**
 * Validate game progression logic
 */
export function validateGameProgression(data: {
  final_round: number;
  total_action: number;
  duration: number;
  gov_bar: number;
  bus_bar: number;
  wor_bar: number;
  ending: string;
}): { valid: boolean; reason?: string } {
  // 1. Bars should be within valid range
  if (
    data.gov_bar < 0 ||
    data.gov_bar > 50 ||
    data.bus_bar < 0 ||
    data.bus_bar > 50 ||
    data.wor_bar < 0 ||
    data.wor_bar > 50
  ) {
    return { valid: false, reason: "Bar values out of range" };
  }

  // 2. Validate ending logic
  if (data.ending === "harmony") {
    if (
      data.final_round !== 30 ||
      data.gov_bar !== data.bus_bar ||
      data.bus_bar !== data.wor_bar
    ) {
      return { valid: false, reason: "Invalid harmony ending conditions" };
    }
  }

  if (data.ending === "failed") {
    if (data.gov_bar > 0 && data.bus_bar > 0 && data.wor_bar > 0) {
      return { valid: false, reason: "Invalid failed ending conditions" };
    }
  }

  if (data.ending === "survival") {
    if (data.final_round !== 30) {
      return { valid: false, reason: "Invalid survival ending conditions" };
    }
    if (data.gov_bar <= 0 || data.bus_bar <= 0 || data.wor_bar <= 0) {
      return { valid: false, reason: "Survival ending with zero bar" };
    }
  }

  return { valid: true };
}

/**
 * Validate timestamps and duration
 * Relaxed validation - allow 10% tolerance for network delays
 */
export function validateTimestamp(
  startTime: Date,
  endTime: Date,
  duration: number
): { valid: boolean; reason?: string } {
  const calculatedDuration = Math.floor(
    (endTime.getTime() - startTime.getTime()) / 1000
  );

  // Allow 10% tolerance (min 10s) for network/processing delays
  const tolerance = Math.max(10, duration * 0.1);

  if (Math.abs(calculatedDuration - duration) > tolerance) {
    return { valid: false, reason: "Duration mismatch" };
  }

  // Max game duration: 2 hours (sanity check)
  if (duration > 7200) {
    return { valid: false, reason: "Game duration too long" };
  }

  // Min game duration: 10 seconds (prevent instant submissions)
  if (duration < 10) {
    return { valid: false, reason: "Game duration too short" };
  }

  return { valid: true };
}
