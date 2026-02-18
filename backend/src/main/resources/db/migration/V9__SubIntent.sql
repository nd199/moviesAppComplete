CREATE TABLE subscription_plans
(
    id          BIGSERIAL PRIMARY KEY NOT NULL,
    plan_name   VARCHAR(50)           NOT NULL,
    price       DOUBLE PRECISION      NOT NULL,
    interval    VARCHAR(50)           NOT NULL,
    description TEXT                  NOT NULL
);

CREATE TABLE subscription_intents
(
    id           BIGSERIAL PRIMARY KEY NOT NULL,
    user_id      BIGINT                NOT NULL,
    plan_id      BIGINT                NOT NULL,
    status       VARCHAR(50)           NOT NULL,
    intent_token VARCHAR(100)          NOT NULL,
    created_at   TIMESTAMP             NOT NULL DEFAULT NOW(),
    last_updated TIMESTAMP             NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES customer (id),
    CONSTRAINT fk_plan_id FOREIGN KEY (plan_id) REFERENCES subscription_plans (id)
);