-- Create Content Manager sequence
CREATE SEQUENCE IF NOT EXISTS id START WITH 1 INCREMENT BY 1;

-- Create Content Manager table
CREATE TABLE content_manager
(
    id                BIGINT       NOT NULL,
    name              TEXT         NOT NULL,
    email             TEXT         NOT NULL,
    password          TEXT         NOT NULL,
    phone_number      TEXT         NOT NULL,
    image_url         TEXT,
    department        TEXT,
    specialization    VARCHAR(50)  NOT NULL,
    access_level      INTEGER      NOT NULL DEFAULT 1,
    is_email_verified BOOLEAN      NOT NULL DEFAULT FALSE,
    is_registered     BOOLEAN      NOT NULL DEFAULT FALSE,
    is_active         BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_content_manager PRIMARY KEY (id)
);

-- Add unique constraints
ALTER TABLE content_manager
    ADD CONSTRAINT content_manager_email_unique UNIQUE (email);

ALTER TABLE content_manager
    ADD CONSTRAINT content_manager_phone_number_unique UNIQUE (phone_number);

-- Create junction table for Content Managers and Roles
CREATE TABLE content_managers_roles
(
    content_manager_id BIGINT NOT NULL,
    role_id            BIGINT NOT NULL,
    CONSTRAINT pk_content_managers_roles PRIMARY KEY (content_manager_id, role_id),
    CONSTRAINT fk_content_managers_roles_content_manager FOREIGN KEY (content_manager_id) REFERENCES content_manager (id),
    CONSTRAINT fk_content_managers_roles_role FOREIGN KEY (role_id) REFERENCES role (id)
);

-- Add content_manager_id to movie table
ALTER TABLE movie
    ADD COLUMN IF NOT EXISTS content_manager_id BIGINT;

ALTER TABLE movie
    ADD CONSTRAINT fk_content_manager_movie_id FOREIGN KEY (content_manager_id) REFERENCES content_manager (id);

-- Add content_manager_id to show table
ALTER TABLE show
    ADD COLUMN IF NOT EXISTS content_manager_id BIGINT;

ALTER TABLE show
    ADD CONSTRAINT fk_content_manager_show_id FOREIGN KEY (content_manager_id) REFERENCES content_manager (id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_manager_email ON content_manager (email);
CREATE INDEX IF NOT EXISTS idx_content_manager_specialization ON content_manager (specialization);
CREATE INDEX IF NOT EXISTS idx_content_manager_is_active ON content_manager (is_active);
CREATE INDEX IF NOT EXISTS idx_movie_content_manager_id ON movie (content_manager_id);
CREATE INDEX IF NOT EXISTS idx_show_content_manager_id ON show (content_manager_id);

-- Insert default content manager role
INSERT INTO role (name)
VALUES ('ROLE_CONTENT_MANAGER') ON CONFLICT (name) DO NOTHING;
