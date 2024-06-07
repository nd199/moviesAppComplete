CREATE SEQUENCE IF NOT EXISTS show_id START WITH 1 INCREMENT BY 1;

CREATE TABLE show
(
    show_id     BIGINT           NOT NULL,
    name        TEXT             NOT NULL,
    cost        DOUBLE PRECISION NOT NULL,
    rating      DOUBLE PRECISION NOT NULL,
    customer_id BIGINT,
    CONSTRAINT pk_show PRIMARY KEY (show_id)
);

ALTER TABLE show
    ADD CONSTRAINT show_name_unique UNIQUE (name);

ALTER TABLE show
    ADD CONSTRAINT FK_CUSTOMER_SHOW_ID FOREIGN KEY (customer_id) REFERENCES customer (customer_id);