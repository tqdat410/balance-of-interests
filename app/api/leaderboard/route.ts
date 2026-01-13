import { NextRequest, NextResponse } from "next/server";
import { getSupabaseApiClient } from "@/lib/supabase/api";
import type { LeaderboardRow } from "@/lib/types/database";

// Enable Edge Runtime for Cloudflare Pages compatibility
export const runtime = "edge";

// Pagination limits
const MAX_PAGE_SIZE = 100;

export async function POST(request: NextRequest) {
  try {
    const { page_number, page_size } = await request.json();

    // Validate pagination params
    if (
      !page_number ||
      !page_size ||
      page_number < 1 ||
      page_size < 1 ||
      page_size > MAX_PAGE_SIZE
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    // Call Supabase RPC function using SDK
    const supabase = getSupabaseApiClient();

    const { data, error } = await supabase.rpc("get_grouped_leaderboard", {
      page_number,
      page_size,
    });

    if (error) {
      console.error("Supabase RPC error:", error.message);
      return NextResponse.json(
        { success: false, error: "Failed to fetch leaderboard" },
        { status: 500 }
      );
    }

    // Type assertion since we know the RPC returns LeaderboardRow[]
    const rows = data as LeaderboardRow[] | null;

    // Extract total count from first row
    const totalCount = rows && rows.length > 0 ? rows[0].total_count : 0;

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        page: page_number,
        pageSize: page_size,
        totalCount: totalCount,
        totalPages: Math.ceil(totalCount / page_size),
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
