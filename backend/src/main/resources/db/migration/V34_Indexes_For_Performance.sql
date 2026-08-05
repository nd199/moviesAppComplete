-- 1. Most used search index: searches by movie name (MovieList.jsx search)
CREATE INDEX idx_movie_name_search ON movie (name);

-- 2. Most used filter/sort index: filters movies by category + sorts by rating/date
CREATE INDEX idx_movie_category_rating_created ON movie (category, rating DESC, created_at DESC);

-- 3. Content manager queries: content managers only see their own movies
CREATE INDEX idx_movie_content_manager_category ON movie (content_manager_id, category);

-- 4. Show table (same high-value pattern)
CREATE INDEX idx_show_name_search ON show (name);
CREATE INDEX idx_show_category_rating_created ON show (category, rating DESC, created_at DESC);

-- 5. Customer table: login uses email lookup every time
CREATE INDEX idx_customer_email_unique ON customer (email);

-- 6. High-traffic user-specific tables (users load their own history/watchlist)
CREATE INDEX idx_view_history_customer_date ON view_history (customer_id, watched_at DESC);
CREATE INDEX idx_watchlist_customer_date ON watchlist_item (customer_id, added_at DESC);
