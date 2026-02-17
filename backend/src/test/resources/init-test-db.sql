-- Test database initialization
CREATE
    DATABASE IF NOT EXISTS movieott_test;
CREATE
    USER IF NOT EXISTS test WITH PASSWORD 'test';
GRANT ALL PRIVILEGES ON DATABASE
    movieott_test TO test;
