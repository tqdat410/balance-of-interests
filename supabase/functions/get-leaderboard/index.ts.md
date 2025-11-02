// Supabase Edge Function for Leaderboard with Grouping and Pagination
// Deploy: supabase functions deploy get-leaderboard

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

interface LeaderboardRecord {
  id: number;
  session_id: string;
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
  created_at: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Get query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10");

    // Create Supabase client with service role key for admin access
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // SQL query with window function for grouping
    const { data, error } = await supabaseClient.rpc(
      "get_grouped_leaderboard",
      {
        page_number: page,
        page_size: pageSize,
      }
    );

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    // Extract total count from first row (if exists)
    const totalCount = data && data.length > 0 ? data[0].total_count : 0;

    // Remove total_count from each record for cleaner response
    const records =
      data?.map(({ total_count, ...record }: any) => record) || [];

    return new Response(
      JSON.stringify({
        success: true,
        data: records,
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || "Unknown error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
