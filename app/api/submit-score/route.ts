import { NextRequest, NextResponse } from "next/server";
import {
  verifyGameHash,
  validateGameProgression,
  validateTimestamp,
  generateSessionToken,
} from "@/lib/gameVerification";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // ===== 1. BASIC FIELD VALIDATION =====
    if (
      !payload.session_id || // User session for database
      !payload.game_session_id || // Game session for anti-cheat
      !payload.name ||
      typeof payload.final_round !== "number" ||
      !payload.verification_hash ||
      typeof payload.timestamp !== "number"
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ===== 2. VERIFY TIMESTAMP (Anti-replay attack) =====
    const timestampCheck = validateTimestamp(payload.timestamp, 60); // 60 seconds tolerance
    if (!timestampCheck.valid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request",
        },
        { status: 403 }
      );
    }

    // ===== 3. VERIFY GAME HASH (Anti-cheat) =====
    const secret = process.env.GAME_VERIFICATION_SECRET;
    if (!secret) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Recreate game-session-specific token (use game_session_id, NOT session_id)
    const sessionToken = generateSessionToken(payload.game_session_id, secret);

    // Verify hash
    const isValidHash = verifyGameHash(
      {
        game_session_id: payload.game_session_id, // Use game_session_id for anti-cheat
        final_round: payload.final_round,
        gov_bar: payload.gov_bar,
        bus_bar: payload.bus_bar,
        wor_bar: payload.wor_bar,
        duration: payload.duration,
        ending: payload.ending,
        timestamp: payload.timestamp,
      },
      payload.verification_hash,
      sessionToken
    );

    if (!isValidHash) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request",
        },
        { status: 403 }
      );
    }

    // ===== 4. VALIDATE GAME PROGRESSION =====
    const progressionCheck = validateGameProgression({
      final_round: payload.final_round,
      total_action: payload.total_action,
      duration: payload.duration,
      gov_bar: payload.gov_bar,
      bus_bar: payload.bus_bar,
      wor_bar: payload.wor_bar,
      ending: payload.ending,
    });

    if (!progressionCheck.valid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request",
        },
        { status: 400 }
      );
    }

    // Validate name
    const name = payload.name.trim();
    if (name.length < 2 || name.length > 50) {
      return NextResponse.json(
        {
          success: false,
          error: "Name must be between 2-50 characters",
        },
        { status: 400 }
      );
    }

    // Validate timestamps
    const startTime = new Date(payload.start_time);
    const endTime = new Date(payload.end_time);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid timestamps" },
        { status: 400 }
      );
    }

    if (endTime <= startTime) {
      return NextResponse.json(
        {
          success: false,
          error: "End time must be after start time",
        },
        { status: 400 }
      );
    }

    // ===== 6. INSERT TO DATABASE =====
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/game_records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        session_id: payload.session_id,
        name: name,
        final_round: payload.final_round,
        total_action: payload.total_action,
        gov_bar: payload.gov_bar,
        bus_bar: payload.bus_bar,
        wor_bar: payload.wor_bar,
        start_time: payload.start_time,
        end_time: payload.end_time,
        duration: payload.duration,
        ending: payload.ending,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to save score" },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        id: data[0]?.id,
        message: "Score submitted successfully",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
