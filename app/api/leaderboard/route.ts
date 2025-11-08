import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { page_number, page_size } = await request.json();

    // Validate pagination params
    if (
      !page_number ||
      !page_size ||
      page_number < 1 ||
      page_size < 1 ||
      page_size > 100
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Call Supabase RPC function
    const response = await fetch(
      `${supabaseUrl}/rest/v1/rpc/get_grouped_leaderboard`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          page_number,
          page_size,
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch leaderboard" },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Extract total count from first row
    const totalCount = data && data.length > 0 ? data[0].total_count : 0;

    return NextResponse.json({
      success: true,
      data: data,
      pagination: {
        page: page_number,
        pageSize: page_size,
        totalCount: totalCount,
        totalPages: Math.ceil(totalCount / page_size),
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
