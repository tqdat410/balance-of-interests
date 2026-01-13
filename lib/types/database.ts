/**
 * Database Types - Supabase schema types
 * TODO: Generate from Supabase CLI when credentials available
 * npx supabase gen types typescript --project-id <id> > lib/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Leaderboard row type (returned by RPC)
export interface LeaderboardRow {
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
  total_count: number;
}

export interface Database {
  public: {
    Tables: {
      game_records: {
        Row: {
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
        };
        Insert: {
          id?: number;
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
          created_at?: string;
        };
        Update: {
          id?: number;
          session_id?: string;
          name?: string;
          final_round?: number;
          total_action?: number;
          gov_bar?: number;
          bus_bar?: number;
          wor_bar?: number;
          start_time?: string;
          end_time?: string;
          duration?: number;
          ending?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_grouped_leaderboard: {
        Args: {
          page_number: number;
          page_size: number;
        };
        Returns: LeaderboardRow[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
