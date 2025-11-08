-- Chạy SQL này trong Supabase SQL Editor để tạo function
-- https://supabase.com/dashboard/project/ctecaqewflybcqyclwom/sql/new

-- Xóa function cũ nếu tồn tại
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
  -- Đếm tổng số session unique
  SELECT COUNT(DISTINCT gr.session_id) INTO total_sessions
  FROM game_records gr;

  -- Trả về best record cho mỗi session với phân trang
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
          -- Best score per session: ending priority first
          CASE 
            WHEN gr.ending = 'harmony' THEN 1
            WHEN gr.ending = 'survival' THEN 2
            WHEN gr.ending = 'failed' THEN 3
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
      WHEN rr.ending = 'harmony' THEN 1
      WHEN rr.ending = 'survival' THEN 2
      WHEN rr.ending = 'failed' THEN 3
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
