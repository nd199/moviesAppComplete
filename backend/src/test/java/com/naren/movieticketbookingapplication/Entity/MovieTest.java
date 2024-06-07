package com.naren.movieticketbookingapplication.Entity;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

class MovieTest {

    @Test
    void testToString() {
        Movie movie = new Movie(1L, "test", 100.99, 4.5, "none", "none", "none", 2000, "none", "none");

        String result = movie.toString();

        assertEquals("Movie{movie_id=1, name='test', cost=100.99, rating=4.5, description='none', poster='none', ageRating='none', year=2000, runtime='none', genre='none', customer=null}", result);
    }


    @Test
    void testEquals() {
        Movie movie1 = new Movie(1L, "test", 100.99, 4.5, "none", "none", "none", 2000, "none", "none");
        Movie movie2 = new Movie(1L, "test", 100.99, 4.5, "none", "none", "none", 2000, "none", "none");
        Movie movie3 = new Movie(2L, "test", 120.99, 4.8, "none", "none", "none", 2000, "none", "none");

        assertEquals(movie1, movie2);
        assertNotEquals(movie1, movie3);
    }

    @Test
    void testHashCode() {
        Movie movie1 = new Movie(1L, "test", 100.99, 4.5, "none", "none", "none", 2000, "none", "none");
        Movie movie2 = new Movie(1L, "test", 100.99, 4.5, "none", "none", "none", 2000, "none", "none");
        Movie movie3 = new Movie(2L, "test", 120.99, 4.8, "none", "none", "none", 2000, "none", "none");

        assertEquals(movie1.hashCode(), movie2.hashCode());
        assertNotEquals(movie1.hashCode(), movie3.hashCode());
    }
}
