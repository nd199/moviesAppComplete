-- Create subscription_plans table first
CREATE TABLE subscription_plans
(
    id          BIGSERIAL PRIMARY KEY NOT NULL,
    plan_name   VARCHAR(50)           NOT NULL,
    price       DECIMAL(10, 2)        NOT NULL,
    interval    VARCHAR(50)           NOT NULL,
    description TEXT                  NOT NULL
);

-- Then create subscription_intents with foreign key reference
CREATE TABLE subscription_intents
(
    id          BIGSERIAL PRIMARY KEY NOT NULL,
    user_id     BIGINT                NOT NULL,
    plan_id     BIGINT                NOT NULL,
    status      VARCHAR(50)           NOT NULL,
    intentToken VARCHAR(100)          NOT NULL,
    created_at  TIMESTAMP             NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP             NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES customer (id),
    CONSTRAINT fk_plan_id FOREIGN KEY (plan_id) REFERENCES subscription_plans (id)
);