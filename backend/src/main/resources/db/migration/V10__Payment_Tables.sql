-- Payment and User Plan Info Tables Migration

-- Payment table
CREATE TABLE payment
(
    id             BIGSERIAL PRIMARY KEY,
    customer_id    BIGINT         NOT NULL REFERENCES customer (id),
    plan_id        BIGINT         NOT NULL REFERENCES subscription_plans (id),
    payment_method VARCHAR(255),
    transaction_id VARCHAR(255)   NOT NULL UNIQUE,
    amount         DECIMAL(10, 2) NOT NULL,
    status         VARCHAR(50)    NOT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Plan Info table
CREATE TABLE user_plan_info
(
    id                      BIGSERIAL PRIMARY KEY,
    customer_id             BIGINT NOT NULL UNIQUE REFERENCES customer (id),
    selected_plan_id        BIGINT REFERENCES subscription_plans (id),
    is_active               BOOLEAN   DEFAULT FALSE,
    subscription_start_date TIMESTAMP,
    subscription_end_date   TIMESTAMP,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_payment_customer_id ON payment (customer_id);
CREATE INDEX idx_payment_transaction_id ON payment (transaction_id);
CREATE INDEX idx_payment_created_at ON payment (created_at);
CREATE INDEX idx_user_plan_customer_id ON user_plan_info (customer_id);
CREATE INDEX idx_user_plan_active ON user_plan_info (is_active);
