-- Add tmdb_id column to movie table
ALTER TABLE movie
    ADD COLUMN IF NOT EXISTS tmdb_id BIGINT;

-- Add tmdb_id column to show table
ALTER TABLE "show"
    ADD COLUMN IF NOT EXISTS tmdb_id BIGINT;
