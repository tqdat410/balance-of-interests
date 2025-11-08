import crypto from "crypto";

/**
 * Generate verification hash from game data + token + timestamp
 * This proves the game was actually played, not faked
 */
export function generateGameHash(data: {
  game_session_id: string; // Changed from session_id to game_session_id
  final_round: number;
  gov_bar: number;
  bus_bar: number;
  wor_bar: number;
  duration: number;
  ending: string;
  timestamp: number;
  token: string;
}): string {
  // Create deterministic string from game data
  const dataString = `${data.game_session_id}|${data.final_round}|${data.gov_bar}|${data.bus_bar}|${data.wor_bar}|${data.duration}|${data.ending}|${data.timestamp}|${data.token}`;

  // Generate SHA256 hash
  return crypto.createHash("sha256").update(dataString).digest("hex");
}

/**
 * Verify game hash matches expected value
 */
export function verifyGameHash(
  data: {
    game_session_id: string; // Changed from session_id to game_session_id
    final_round: number;
    gov_bar: number;
    bus_bar: number;
    wor_bar: number;
    duration: number;
    ending: string;
    timestamp: number;
  },
  providedHash: string,
  token: string
): boolean {
  const expectedHash = generateGameHash({ ...data, token });
  return expectedHash === providedHash;
}

/**
 * Validate timestamp is recent (within 60 seconds)
 * Prevents replay attacks with old hashes
 */
export function validateTimestamp(
  timestamp: number,
  maxAgeSeconds: number = 60
): { valid: boolean; reason?: string } {
  const now = Date.now();
  const age = Math.abs(now - timestamp);

  if (age > maxAgeSeconds * 1000) {
    return {
      valid: false,
      reason: `Timestamp too old: ${Math.floor(
        age / 1000
      )}s ago (max: ${maxAgeSeconds}s)`,
    };
  }

  // Also check if timestamp is in the future (clock skew protection)
  if (timestamp > now + 5000) {
    return {
      valid: false,
      reason: "Timestamp is in the future",
    };
  }

  return { valid: true };
}

/**
 * Additional validation: check if game progression makes sense
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
  // 1. Actions should match rounds (3 actions per round)
  const expectedActions = data.final_round * 3;
  if (Math.abs(data.total_action - expectedActions) > 3) {
    // Allow small deviation
    return {
      valid: false,
      reason: `Invalid action count: expected ~${expectedActions}, got ${data.total_action}`,
    };
  }

  // 2. Duration should be reasonable (at least 2 seconds per action, max 2 minutes per action)
  const minDuration = data.total_action * 2;
  const maxDuration = data.total_action * 120;
  if (data.duration < minDuration || data.duration > maxDuration) {
    return {
      valid: false,
      reason: `Suspicious duration: ${data.duration}s for ${data.total_action} actions`,
    };
  }

  // 3. Bars should be within valid range
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

  // 4. Validate ending logic
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
 * Generate session-specific token
 */
export function generateSessionToken(
  sessionId: string,
  secret: string
): string {
  return crypto
    .createHash("sha256")
    .update(`${secret}|${sessionId}`)
    .digest("hex")
    .substring(0, 32);
}
