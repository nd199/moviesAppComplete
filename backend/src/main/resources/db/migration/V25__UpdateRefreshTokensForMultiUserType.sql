ALTER TABLE refresh_tokens
    ADD COLUMN user_type VARCHAR(10) NOT NULL DEFAULT 'CUSTOMER';

UPDATE refresh_tokens
SET user_type = 'CUSTOMER'
WHERE user_id IN (SELECT id FROM customer);

DO
$$
BEGIN
    -- Try different possible constraint names
    IF
EXISTS (SELECT 1 FROM information_schema.table_constraints
               WHERE constraint_name = 'refresh_tokens_user_id_fkey' 
               AND table_name = 'refresh_tokens') THEN
ALTER TABLE refresh_tokens DROP CONSTRAINT refresh_tokens_user_id_fkey;
ELSIF
EXISTS (SELECT 1 FROM information_schema.table_constraints
                  WHERE constraint_name = 'fk_refresh_tokens_customer' 
                  AND table_name = 'refresh_tokens') THEN
ALTER TABLE refresh_tokens DROP CONSTRAINT fk_refresh_tokens_customer;
END IF;
END $$;

ALTER TABLE refresh_tokens
    ADD CONSTRAINT chk_user_type
        CHECK (user_type IN ('CUSTOMER', 'ADMIN'));

-- Step 5: Create index for better performance on user lookups
CREATE INDEX idx_refresh_tokens_user_lookup
    ON refresh_tokens (user_id, user_type);
