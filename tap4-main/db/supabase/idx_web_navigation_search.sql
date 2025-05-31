-- 1. Kích hoạt extension nếu chưa có
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Tạo index tìm kiếm mờ trên các trường văn bản
CREATE INDEX idx_web_navigation_search ON public.web_navigation
USING GIN (
  name gin_trgm_ops,
  title gin_trgm_ops,
  content gin_trgm_ops,
  category_name gin_trgm_ops
);
