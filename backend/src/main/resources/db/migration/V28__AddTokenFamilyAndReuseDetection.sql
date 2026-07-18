-- Add token family tracking, reuse detection, and device binding for refresh token security.
-- family_id: Links all tokens from the same login session for theft detection.
-- used: Marks a token as consumed; second use = token theft → revoke all.
-- device_fingerprint: SHA-256 hash of User-Agent + Accept-Language headers.
--                     Tokens can only be refreshed from the SAME device that created them.

ALTER TABLE refresh_tokens
    ADD COLUMN family_id VARCHAR(64) NOT NULL DEFAULT gen_random_uuid()::text;

ALTER TABLE refresh_tokens
    ADD COLUMN used BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE refresh_tokens
    ADD COLUMN device_fingerprint VARCHAR(64) NOT NULL DEFAULT 'unknown';

-- Indexes for fast lookups
CREATE INDEX idx_refresh_tokens_family_id ON refresh_tokens (family_id);
CREATE INDEX idx_refresh_tokens_device ON refresh_tokens (device_fingerprint);

-- Backfill existing tokens: each gets its own unique family and device = 'unknown'
UPDATE refresh_tokens SET family_id = gen_random_uuid()::text WHERE family_id IS NULL;
