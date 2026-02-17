package com.naren.moviesapp.Repo;

import com.naren.moviesapp.AbstractTestContainers;
import com.naren.moviesapp.Entity.Movie;
import com.naren.moviesapp.TestConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(TestConfig.class)
@ActiveProfiles("test")
public class MovieRepositoryTest extends AbstractTestContainers {

    @Autowired
    private MovieRepository underTest;


    @Test
    void existsByName() {
        Movie movie = new Movie(
                "harryPotter",
                200D,
                5D,
                "Description",
                "Poster",
                "PG-13",
                2022,
                "120 mins",
                "Fantasy",
                "movies");

        underTest.save(movie);

        assertThat(underTest.existsByName(movie.getName())).isTrue();
    }


    @Test
    void findByName() {

        Movie movie = new Movie(
                "harryPotter",
                200D,
                5D,
                "Description",
                "Poster",
                "PG-13",
                2022,
                "120 mins",
                "Fantasy",
                "movies");

        underTest.save(movie);

        assertThat(underTest.findByName("harryPotter")).isEqualTo(movie);
    }

    @Test
    void findByGenre() {
        Movie movie = new Movie(
                "harryPotter",
                200D,
                5D,
                "Description",
                "Poster",
                "PG-13",
                2022,
                "120 mins",
                "Fantasy",
                "movies");

        underTest.save(movie);

        assertThat(underTest.findByGenre("Fantasy")).contains(movie);
    }

    @Test
    void findByYear() {
        Movie movie = new Movie(
                "harryPotter",
                200D,
                5D,
                "Description",
                "Poster",
                "PG-13",
                2022,
                "120 mins",
                "Fantasy",
                "movies");

        underTest.save(movie);

        assertThat(underTest.findByGenre("Fantasy")).contains(movie);


    }

    @Test
    void findByAgeRating() {

        Movie movie = new Movie(
                "harryPotter",
                200D,
                5D,
                "Description",
                "Poster",
                "PG-13",
                2022,
                "120 mins",
                "Fantasy",
                "movies");

        underTest.save(movie);

        assertThat(underTest.findByAgeRating("PG-13")).contains(movie);
    }

    @Test
    void findByRatingGreaterThanEqual() {
        Movie movie = new Movie(
                "harryPotter",
                200D,
                5D,
                "Description",
                "Poster",
                "PG-13",
                2022,
                "120 mins",
                "Fantasy",
                "movies");

        Movie movie1 = new Movie(
                "harryPotter2",
                233D,
                6D,
                "Description",
                "Poster",
                "PG-13",
                2022,
                "120 mins",
                "Fantasy",
                "movies");
        Movie movie2 = new Movie(
                "harryPotter3",
                233D,
                5D,
                "Description",
                "Poster",
                "PG-13",
                2022,
                "120 mins",
                "Fantasy",
                "movies");


        underTest.save(movie);
        underTest.save(movie1);
        underTest.save(movie2);

        assertThat(underTest.findByRatingGreaterThanEqual(movie.getRating())).contains(movie1);
        assertThat(underTest.findByRatingGreaterThanEqual(movie.getRating())).contains(movie2);
    }

    @Test
    void findByRatingLessThanEqual() {
        Movie movie = new Movie(
                "harryPotter",
                200D,
                5D,
                "Description",
                "Poster",
                "PG-13",
                2022,
                "120 mins",
                "Fantasy",
                "movies");

        Movie movie1 = new Movie(
                "harryPotter2",
                233D,
                4D,
                "Description",
                "Poster",
                "PG-13",
                2022,
                "120 mins",
                "Fantasy",
                "movies");
        Movie movie2 = new Movie(
                "harryPotter3",
                233D,
                5D,
                "Description",
                "Poster",
                "PG-13",
                2022,
                "120 mins",
                "Fantasy",
                "movies");


        underTest.save(movie);
        underTest.save(movie1);
        underTest.save(movie2);

        assertThat(underTest.findByRatingLessThanEqual(movie.getRating())).contains(movie1);
        assertThat(underTest.findByRatingLessThanEqual(movie.getRating())).contains(movie2);
    }

    @Test
    void findByCostBetween() {
        Movie movie = new Movie(
                "harryPotter",
                200D,
                5D,
                "Description",
                "Poster",
                "PG-13",
                2022,
                "120 mins",
                "Fantasy",
                "movies");

        Movie movie1 = new Movie(
                "harryPotter2",
                233D,
                4D,
                "Description",
                "Poster",
                "PG-13",
                2022,
                "120 mins",
                "Fantasy",
                "movies");
        Movie movie2 = new Movie(
                "harryPotter3",
                233D,
                5D,
                "Description",
                "Poster",
                "PG-13",
                2022,
                "120 mins",
                "Fantasy",
                "movies");

        underTest.save(movie);
        underTest.save(movie1);
        underTest.save(movie2);

        assertThat(underTest.findByCostBetween(3D, 700D)).contains(movie1);
        assertThat(underTest.findByCostBetween(3D, 700D)).contains(movie2);
        assertThat(underTest.findByCostBetween(3D, 7D)).doesNotContain(movie);
    }
}