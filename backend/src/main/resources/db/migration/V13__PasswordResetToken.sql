CREATE TABLE password_reset_token
(
    id     BIGSERIAL PRIMARY KEY,
    token  VARCHAR   NOT NULL UNIQUE,
    email  VARCHAR   NOT NULL,
    expiry TIMESTAMP NOT NULL
);
