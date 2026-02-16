CREATE TABLE refresh_tokens
(
    id          VARCHAR   NOT NULL PRIMARY KEY,
    user_id     BIGINT    NOT NULL,
    token       VARCHAR   NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES customer (id)
);
