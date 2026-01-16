-- Migration: Update get_grouped_leaderboard function to support date filtering
-- Run this script in the Supabase SQL Editor

-- 1. Drop the old function (and the new one if it exists, to be safe)
DROP FUNCTION IF EXISTS get_grouped_leaderboard(INT, INT);
DROP FUNCTION IF EXISTS get_grouped_leaderboard(INT, INT, TIMESTAMPTZ, TIMESTAMPTZ);

-- 2. Create the updated function with date filtering
CREATE OR REPLACE FUNCTION get_grouped_leaderboard(
  page_number INT, 
  page_size INT,
  date_from TIMESTAMPTZ DEFAULT NULL,
  date_to TIMESTAMPTZ DEFAULT NULL
)
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
  -- Count unique sessions for pagination (with date filter)
  SELECT COUNT(DISTINCT gr.session_id) INTO total_sessions
  FROM game_records gr
  WHERE (date_from IS NULL OR gr.created_at >= date_from)
    AND (date_to IS NULL OR gr.created_at <= date_to);

  -- Return best record per session with pagination
  RETURN QUERY
  WITH filtered_records AS (
    SELECT gr.*
    FROM game_records gr
    WHERE (date_from IS NULL OR gr.created_at >= date_from)
      AND (date_to IS NULL OR gr.created_at <= date_to)
  ),
  ranked_records AS (
    SELECT 
      fr.id,
      fr.session_id,
      fr.name,
      fr.final_round,
      fr.total_action,
      fr.gov_bar,
      fr.bus_bar,
      fr.wor_bar,
      fr.start_time,
      fr.end_time,
      fr.duration,
      fr.ending,
      fr.created_at,
      ROW_NUMBER() OVER (
        PARTITION BY fr.session_id 
        ORDER BY 
          -- Best score: ending priority first
          CASE 
            WHEN fr.ending = 'HARMONY' THEN 1
            WHEN fr.ending = 'SURVIVAL' THEN 2
            WHEN fr.ending = 'FAILED' THEN 3
            ELSE 4
          END ASC,
          fr.final_round DESC,
          fr.duration ASC,
          fr.total_action DESC,
          fr.start_time ASC
      ) as rn
    FROM filtered_records fr
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

COMMENT ON FUNCTION get_grouped_leaderboard IS 'Paginated leaderboard with best record per session. Optional date_from/date_to filters on created_at.';
