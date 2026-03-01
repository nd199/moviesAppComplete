-- Create function to update updated_at timestamp
CREATE
OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at
= CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Create trigger for movie table
DROP TRIGGER IF EXISTS update_movie_updated_at ON movie;
CREATE TRIGGER update_movie_updated_at
    BEFORE UPDATE
    ON movie
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for show table
DROP TRIGGER IF EXISTS update_show_updated_at ON show;
CREATE TRIGGER update_show_updated_at
    BEFORE UPDATE
    ON show
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for customer table
DROP TRIGGER IF EXISTS update_customer_updated_at ON customer;
CREATE TRIGGER update_customer_updated_at
    BEFORE UPDATE
    ON customer
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
