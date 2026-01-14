import { NextRequest, NextResponse } from "next/server";
import {
  verifyGameSignature,
  validateGameProgression,
  validateTimestamp,
} from "@/lib/gameVerification";
import { getSupabaseApiClient } from "@/lib/supabase/api";
import { GAME_CONFIG } from "@/lib/config/game";
import type { Database } from "@/lib/types/database";

// Enable Edge Runtime for Cloudflare Pages compatibility
export const runtime = "edge";

type GameRecordInsert = Database["public"]["Tables"]["game_records"]["Insert"];

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // ===== 1. BASIC FIELD VALIDATION =====
    if (
      !payload.session_id ||
      !payload.game_session_id ||
      !payload.name ||
      typeof payload.final_round !== "number" ||
      !payload.signature
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ===== 2. VERIFY HMAC SIGNATURE (Anti-cheat) =====
    const secret = process.env.GAME_VERIFICATION_SECRET;
    if (!secret) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    const sigCheck = await verifyGameSignature(
      {
        game_session_id: payload.game_session_id,
        final_round: payload.final_round,
        gov_bar: payload.gov_bar,
        bus_bar: payload.bus_bar,
        wor_bar: payload.wor_bar,
        duration: payload.duration,
        ending: payload.ending,
      },
      payload.signature,
      secret
    );

    if (!sigCheck.valid) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 403 }
      );
    }

    // ===== 3. VALIDATE TIMESTAMPS =====
    const startTime = new Date(payload.start_time);
    const endTime = new Date(payload.end_time);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid timestamps" },
        { status: 400 }
      );
    }

    const timeCheck = validateTimestamp(startTime, endTime, payload.duration);
    if (!timeCheck.valid) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
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
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    // Validate name
    const name = payload.name.trim();
    if (
      !name ||
      name.length < GAME_CONFIG.NAME_MIN_LENGTH ||
      name.length > GAME_CONFIG.NAME_MAX_LENGTH
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid name" },
        { status: 400 }
      );
    }

    // ===== 5. INSERT TO DATABASE (Using SDK) =====
    const supabase = getSupabaseApiClient();

    const insertData: GameRecordInsert = {
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
    };

    // Log payload for debugging
    console.log("Submitting Score Payload:", {
      session_id: payload.session_id,
      name,
      final_round: payload.final_round,
      ending: payload.ending
    });

    const { data, error } = await supabase
      .from("game_records")
      .insert(insertData)
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error details:", error);
      return NextResponse.json(
        { success: false, error: `Database Error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        message: "Score submitted successfully",
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
