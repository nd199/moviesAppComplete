-- Likes table
CREATE TABLE IF NOT EXISTS likes (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    tmdb_id BIGINT NOT NULL,
    title VARCHAR(500) NOT NULL,
    like_status VARCHAR(20) NOT NULL,
    media_type VARCHAR(50) NOT NULL,
    liked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_like_customer FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE,
    CONSTRAINT uq_like_customer_tmdb UNIQUE (customer_id, tmdb_id, media_type)
);

CREATE INDEX IF NOT EXISTS idx_likes_customer_id ON likes(customer_id);
CREATE INDEX IF NOT EXISTS idx_likes_tmdb_id ON likes(tmdb_id);
CREATE INDEX IF NOT EXISTS idx_likes_media_type ON likes(media_type);
