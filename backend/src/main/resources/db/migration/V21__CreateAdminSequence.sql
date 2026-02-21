CREATE SEQUENCE IF NOT EXISTS admin_id START WITH 1 INCREMENT BY 1;

-- Only alter the table if it exists and the column doesn't already have a default
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin') THEN
        ALTER TABLE admin ALTER COLUMN id SET DEFAULT nextval('admin_id');
    END IF;
END $$;
