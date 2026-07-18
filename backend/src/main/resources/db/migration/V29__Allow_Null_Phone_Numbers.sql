-- Allow NULL phone numbers for admins and content managers created via invite flow.
-- Previously, invite-based password set used phoneNumber="" which violated the
-- UNIQUE constraint on phone_number after the first invite.

-- Clean up existing empty-string phone numbers (they block future invites)
UPDATE admin SET phone_number = NULL WHERE phone_number = '';
UPDATE content_manager SET phone_number = NULL WHERE phone_number = '';

-- Drop NOT NULL so invite-created records can use NULL
ALTER TABLE admin ALTER COLUMN phone_number DROP NOT NULL;
ALTER TABLE content_manager ALTER COLUMN phone_number DROP NOT NULL;
