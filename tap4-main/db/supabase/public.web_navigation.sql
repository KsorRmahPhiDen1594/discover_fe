CREATE OR REPLACE FUNCTION search_suggestions(query_text TEXT)
RETURNS TABLE (
    id BIGINT,
    name TEXT,
    title TEXT,
    category_name TEXT,
    type TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    w.id,
    w.name,
    w.title,
    w.category_name,
    'web_navigation' AS type
  FROM public.web_navigation w
  WHERE 
    w.name ILIKE '%' || query_text || '%'
    OR w.title ILIKE '%' || query_text || '%'
    OR w.content ILIKE '%' || query_text || '%'
    OR w.category_name ILIKE '%' || query_text || '%'
  LIMIT 10; -- Giới hạn 10 gợi ý để tối ưu hiệu suất
END;
$$ LANGUAGE plpgsql;