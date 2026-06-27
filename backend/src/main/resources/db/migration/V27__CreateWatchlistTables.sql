-- Watchlist items table
CREATE TABLE IF NOT EXISTS watchlist_items (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    tmdb_id BIGINT NOT NULL,
    title VARCHAR(500) NOT NULL,
    poster_path VARCHAR(500),
    media_type VARCHAR(50) NOT NULL,
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_watchlist_customer FOREIGN KEY (customer_id) REFERENCES "Customer"(id) ON DELETE CASCADE,
    CONSTRAINT uq_watchlist_customer_tmdb UNIQUE (customer_id, tmdb_id, media_type)
);

CREATE INDEX IF NOT EXISTS idx_watchlist_customer_id ON watchlist_items(customer_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_tmdb_id ON watchlist_items(tmdb_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_media_type ON watchlist_items(media_type);