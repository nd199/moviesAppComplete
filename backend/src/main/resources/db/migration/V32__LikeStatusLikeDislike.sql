-- Likes: support LIKE / DISLIKE in a single column, empty when no reaction
ALTER TABLE likes ALTER COLUMN like_status DROP NOT NULL;

-- Convert any previously stored UNLIKE values to DISLIKE
UPDATE likes SET like_status = 'DISLIKE' WHERE like_status = 'UNLIKE';
