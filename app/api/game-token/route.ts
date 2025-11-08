import { NextRequest, NextResponse } from "next/server";
import { generateSessionToken } from "@/lib/gameVerification";

// Enable Edge Runtime for Cloudflare Pages compatibility
export const runtime = "edge";

/**
 * Generate a game-specific token for verification
 * This token is unique per game session (anti-cheat)
 */
export async function POST(request: NextRequest) {
  try {
    const { game_session_id } = await request.json();

    if (!game_session_id) {
      return NextResponse.json(
        { success: false, error: "Missing game_session_id" },
        { status: 400 }
      );
    }

    // Get secret from environment
    const secret = process.env.GAME_VERIFICATION_SECRET;
    if (!secret) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Generate game-session-specific token
    const token = await generateSessionToken(game_session_id, secret);

    return NextResponse.json({
      success: true,
      token: token,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
