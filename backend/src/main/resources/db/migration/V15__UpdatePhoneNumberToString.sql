-- Change phone_number column from numeric to text to support proper phone number validation
ALTER TABLE customer
    ALTER COLUMN phone_number TYPE TEXT;

-- Update any existing phone numbers that might be stored as numbers
UPDATE customer
SET phone_number = CAST(phone_number AS TEXT)
WHERE phone_number IS NOT NULL;
