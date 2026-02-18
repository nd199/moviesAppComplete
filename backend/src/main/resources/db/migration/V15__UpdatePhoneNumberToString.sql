ALTER TABLE customer
    ALTER COLUMN phone_number TYPE TEXT;

UPDATE customer
SET phone_number = CAST(phone_number AS TEXT)
WHERE phone_number IS NOT NULL;
