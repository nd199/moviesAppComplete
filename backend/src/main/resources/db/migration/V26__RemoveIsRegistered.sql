-- Remove is_registered column from all user tables
-- This column was redundant as user existence implies registration status

-- Remove from customer table
ALTER TABLE customer DROP COLUMN IF EXISTS is_registered;

-- Remove from admin table
ALTER TABLE admin DROP COLUMN IF EXISTS is_registered;

-- Remove from content_manager table
ALTER TABLE content_manager DROP COLUMN IF EXISTS is_registered;
