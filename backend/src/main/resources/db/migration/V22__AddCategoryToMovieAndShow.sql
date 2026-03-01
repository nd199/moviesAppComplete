-- Add category column to movie table
ALTER TABLE movie
    ADD COLUMN IF NOT EXISTS category VARCHAR (255) DEFAULT 'General';

-- Add category column to show table
ALTER TABLE show
    ADD COLUMN IF NOT EXISTS category VARCHAR (255) DEFAULT 'General';

-- Create indexes for category queries
CREATE INDEX IF NOT EXISTS idx_movie_category ON movie (category);
CREATE INDEX IF NOT EXISTS idx_show_category ON show (category);
