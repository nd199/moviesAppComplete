ALTER TABLE movie
    ADD type VARCHAR(255) NOT NULL DEFAULT 'movies';

ALTER TABLE show
    ADD type VARCHAR(255) NOT NULL DEFAULT 'shows';