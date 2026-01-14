-- ============================================================================
-- Loi Ich (Balance of Interests) - Database Initialization Script
-- ============================================================================
-- Run this script in Supabase SQL Editor to initialize the database.
-- This script is IDEMPOTENT - safe to run multiple times.
-- ============================================================================
-- RESET DATABASE (Uncomment below to wipe all data and start fresh)
-- ============================================================================
DROP TABLE IF EXISTS game_records CASCADE;
DROP FUNCTION IF EXISTS get_grouped_leaderboard(INT, INT);

-- ============================================================================

-- ============================================================================
-- 1. TABLE: game_records
-- ============================================================================
-- Stores all game session records for leaderboard

CREATE TABLE IF NOT EXISTS game_records (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 24),
  final_round SMALLINT NOT NULL CHECK (final_round BETWEEN 0 AND 30),
  total_action SMALLINT NOT NULL CHECK (total_action BETWEEN 0 AND 100),
  gov_bar SMALLINT NOT NULL CHECK (gov_bar BETWEEN 0 AND 100),
  bus_bar SMALLINT NOT NULL CHECK (bus_bar BETWEEN 0 AND 100),
  wor_bar SMALLINT NOT NULL CHECK (wor_bar BETWEEN 0 AND 100),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration SMALLINT NOT NULL CHECK (duration >= 0),
  ending VARCHAR(20) NOT NULL CHECK (ending IN ('HARMONY', 'SURVIVAL', 'FAILED')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment for documentation
COMMENT ON TABLE game_records IS 'Game session records for leaderboard';
COMMENT ON COLUMN game_records.session_id IS 'Browser session UUID - groups records by player';
COMMENT ON COLUMN game_records.final_round IS 'Completed rounds: 0=failed before round 1, 30=completed all rounds';
COMMENT ON COLUMN game_records.ending IS 'Game result: HARMONY (all equal at 30), SURVIVAL (completed 30), FAILED (bar hit 0)';

-- ============================================================================
-- 2. INDEXES
-- ============================================================================
-- Composite index for leaderboard queries (session grouping + ranking)
CREATE INDEX IF NOT EXISTS idx_game_records_leaderboard
ON game_records(session_id, ending, final_round DESC, duration ASC);

-- Index for pagination count queries
CREATE INDEX IF NOT EXISTS idx_game_records_session_id
ON game_records(session_id);

-- Index for cleanup queries (by created_at)
CREATE INDEX IF NOT EXISTS idx_game_records_created_at
ON game_records(created_at DESC);

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE game_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (for idempotency)
DROP POLICY IF EXISTS "Public read access" ON game_records;
DROP POLICY IF EXISTS "Public insert access" ON game_records;

-- Allow anyone to read (for leaderboard display)
CREATE POLICY "Public read access" ON game_records
  FOR SELECT USING (true);

-- Allow anyone to insert (for score submission)
CREATE POLICY "Public insert access" ON game_records
  FOR INSERT WITH CHECK (true);

-- ============================================================================
-- 4. FUNCTION: get_grouped_leaderboard
-- ============================================================================
-- Returns paginated leaderboard with best record per session
-- Ranking: harmony > survival > failed, then by round DESC, duration ASC

DROP FUNCTION IF EXISTS get_grouped_leaderboard(INT, INT);

CREATE OR REPLACE FUNCTION get_grouped_leaderboard(page_number INT, page_size INT)
RETURNS TABLE (
  id INT8,
  session_id UUID,
  name TEXT,
  final_round INT2,
  total_action INT2,
  gov_bar INT2,
  bus_bar INT2,
  wor_bar INT2,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  duration INT2,
  ending VARCHAR,
  created_at TIMESTAMPTZ,
  total_count BIGINT
) 
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  total_sessions BIGINT;
BEGIN
  -- Count unique sessions for pagination
  SELECT COUNT(DISTINCT gr.session_id) INTO total_sessions
  FROM game_records gr;

  -- Return best record per session with pagination
  RETURN QUERY
  WITH ranked_records AS (
    SELECT 
      gr.id,
      gr.session_id,
      gr.name,
      gr.final_round,
      gr.total_action,
      gr.gov_bar,
      gr.bus_bar,
      gr.wor_bar,
      gr.start_time,
      gr.end_time,
      gr.duration,
      gr.ending,
      gr.created_at,
      ROW_NUMBER() OVER (
        PARTITION BY gr.session_id 
        ORDER BY 
          -- Best score: ending priority first
          CASE 
            WHEN gr.ending = 'HARMONY' THEN 1
            WHEN gr.ending = 'SURVIVAL' THEN 2
            WHEN gr.ending = 'FAILED' THEN 3
            ELSE 4
          END ASC,
          gr.final_round DESC,
          gr.duration ASC,
          gr.total_action DESC,
          gr.start_time ASC
      ) as rn
    FROM game_records gr
  )
  SELECT 
    rr.id,
    rr.session_id,
    rr.name,
    rr.final_round,
    rr.total_action,
    rr.gov_bar,
    rr.bus_bar,
    rr.wor_bar,
    rr.start_time,
    rr.end_time,
    rr.duration,
    rr.ending,
    rr.created_at,
    total_sessions as total_count
  FROM ranked_records rr
  WHERE rr.rn = 1
  ORDER BY 
    -- Leaderboard ranking: ending priority first
    CASE 
      WHEN rr.ending = 'HARMONY' THEN 1
      WHEN rr.ending = 'SURVIVAL' THEN 2
      WHEN rr.ending = 'FAILED' THEN 3
      ELSE 4
    END ASC,
    rr.final_round DESC,
    rr.duration ASC,
    rr.total_action DESC,
    rr.start_time ASC
  LIMIT page_size
  OFFSET (page_number - 1) * page_size;
END;
$$;

COMMENT ON FUNCTION get_grouped_leaderboard IS 'Paginated leaderboard with best record per session';

-- ============================================================================
-- 5. UTILITY: Cleanup old records (optional, run manually)
-- ============================================================================
-- Uncomment and run to delete records older than 30 days:
-- DELETE FROM game_records WHERE created_at < NOW() - INTERVAL '30 days';

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Test the function (should return empty if no data):
-- SELECT * FROM get_grouped_leaderboard(1, 10);

-- Check table size:
-- SELECT pg_size_pretty(pg_total_relation_size('game_records')) AS size;
