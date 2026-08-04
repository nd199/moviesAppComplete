-- Likes: add poster path for liked/disliked items
ALTER TABLE likes ADD COLUMN IF NOT EXISTS poster_path VARCHAR(500);
