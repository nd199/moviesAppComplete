-- Create Admin table
CREATE TABLE IF NOT EXISTS Admin
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
    CONSTRAINT fk_admin_role_id FOREIGN KEY (admin_id) REFERENCES Admin (id) ON DELETE CASCADE,
    CONSTRAINT fk_admins_role_admin_id FOREIGN KEY (role_id) REFERENCES role (id) ON DELETE CASCADE,
    PRIMARY KEY (admin_id, role_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_email ON Admin (email);
CREATE INDEX IF NOT EXISTS idx_admin_phone_number ON Admin (phone_number);
CREATE INDEX IF NOT EXISTS idx_admin_department ON Admin (department);
CREATE INDEX IF NOT EXISTS idx_admin_is_active ON Admin (is_active);
CREATE INDEX IF NOT EXISTS idx_admin_created_at ON Admin (created_at);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_admin_updated_at()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admin_updated_at_trigger
    BEFORE UPDATE
    ON Admin
    FOR EACH ROW
EXECUTE FUNCTION update_admin_updated_at();
