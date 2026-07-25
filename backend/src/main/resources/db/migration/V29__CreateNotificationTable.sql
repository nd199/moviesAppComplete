CREATE TABLE IF NOT EXISTS notification
(
    id                     BIGSERIAL PRIMARY KEY,
    customer_id            BIGINT       NOT NULL REFERENCES customer (id),
    notification_title     TEXT,
    message                TEXT,
    notification_category  TEXT,
    notification_type      TEXT,
    is_read                BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at             TIMESTAMP    NOT NULL DEFAULT NOW()
);
