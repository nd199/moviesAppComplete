-- Create admin table (lowercase for PostgreSQL convention)
CREATE TABLE IF NOT EXISTS admin
(
    id                BIGSERIAL PRIMARY KEY,
    name              TEXT,
    email             TEXT    NOT NULL UNIQUE,
    password          TEXT    NOT NULL,
    phone_number      TEXT    NOT NULL UNIQUE,
    image_url         TEXT,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    address           TEXT    NOT NULL,
    is_logged         BOOLEAN NOT NULL DEFAULT FALSE,
    is_registered     BOOLEAN NOT NULL DEFAULT FALSE,
    department        TEXT,
    access_level      INTEGER NOT NULL DEFAULT 1,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP        DEFAULT CURRENT_TIMESTAMP
);

-- Create admins_roles join table
CREATE TABLE IF NOT EXISTS admins_roles
(
    admin_id BIGINT NOT NULL,
    role_id  BIGINT NOT NULL,
    CONSTRAINT fk_admin_role_id FOREIGN KEY (admin_id) REFERENCES admin (id) ON DELETE CASCADE,
    CONSTRAINT fk_admins_role_admin_id FOREIGN KEY (role_id) REFERENCES role (id) ON DELETE CASCADE,
    PRIMARY KEY (admin_id, role_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_email ON admin (email);
CREATE INDEX IF NOT EXISTS idx_admin_phone_number ON admin (phone_number);
CREATE INDEX IF NOT EXISTS idx_admin_department ON admin (department);
CREATE INDEX IF NOT EXISTS idx_admin_is_active ON admin (is_active);
CREATE INDEX IF NOT EXISTS idx_admin_created_at ON admin (created_at);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_admin_updated_at()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_admin_updated_at_trigger ON admin;
CREATE TRIGGER update_admin_updated_at_trigger
    BEFORE UPDATE
    ON admin
    FOR EACH ROW
EXECUTE FUNCTION update_admin_updated_at();
