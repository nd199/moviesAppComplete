CREATE TABLE view_history
(
    id          BIGSERIAL PRIMARY KEY,
    customer_id BIGINT      NOT NULL REFERENCES customer (id) ON DELETE CASCADE,
    tmdb_id     BIGINT      NOT NULL,
    media_type  VARCHAR(10) NOT NULL,
    title       VARCHAR(255),
    poster_path TEXT,
    viewed_at   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (customer_id, tmdb_id, media_type)
);

CREATE INDEX idx_view_history_customer ON view_history (customer_id, viewed_at DESC);