package com.naren.movieticketbookingapplication.Service;

import com.naren.movieticketbookingapplication.Dao.MovieDao;
import com.naren.movieticketbookingapplication.Entity.Movie;
import com.naren.movieticketbookingapplication.Exception.RequestValidationException;
import com.naren.movieticketbookingapplication.Exception.ResourceAlreadyExists;
import com.naren.movieticketbookingapplication.Exception.ResourceNotFoundException;
import com.naren.movieticketbookingapplication.Record.MovieRegistration;
import com.naren.movieticketbookingapplication.Record.MovieUpdation;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@Slf4j
class MovieServiceImplTest {

    @Mock
    private MovieDao movieDao;
    private MovieService underTest;

    @BeforeEach
    void setUp() {
        underTest = new MovieServiceImpl(movieDao);
    }

    @Test
    void addMovie() {
        MovieRegistration registration = new MovieRegistration(
                "testName", 300.23, 5.00, "A great movie",
                "http://poster.url", "PG-13", 2022,
                "120 mins", "Action");

        when(movieDao.existsByName("testName")).thenReturn(false);

        underTest.addMovie(registration);

        ArgumentCaptor<Movie> movieArgumentCaptor = ArgumentCaptor.forClass(Movie.class);

        verify(movieDao).addMovie(movieArgumentCaptor.capture());

        Movie captured = movieArgumentCaptor.getValue();

        assertThat(captured.getMovie_id()).isNull();
        assertThat(captured.getName()).isEqualTo(registration.name());
        assertThat(captured.getCost()).isEqualTo(registration.cost());
        assertThat(captured.getRating()).isEqualTo(registration.rating());
        assertThat(captured.getDescription()).isEqualTo(registration.description());
        assertThat(captured.getPoster()).isEqualTo(registration.poster());
        assertThat(captured.getAgeRating()).isEqualTo(registration.ageRating());
        assertThat(captured.getYear()).isEqualTo(registration.year());
        assertThat(captured.getRuntime()).isEqualTo(registration.runtime());
        assertThat(captured.getGenre()).isEqualTo(registration.genre());
    }

    @Test
    void throwsMovieNameExists() {
        MovieRegistration registration = new MovieRegistration(
                "testName", 300.23, 5.00, "A great movie",
                "http://poster.url", "PG-13", 2022,
                "120 mins", "Action");

        when(movieDao.existsByName("testName")).thenReturn(true);

        assertThatThrownBy(
                () -> underTest.addMovie(registration))
                .isInstanceOf(ResourceAlreadyExists.class)
                .hasMessageContaining("Movie name %s already exists".formatted(registration.name()));

        verify(movieDao, never()).addMovie(any());
    }

    @Test
    void removeMovie() {
        long id = 1;
        Movie movie = new Movie(id, "testName", 300.22, 5.00,
                "A great movie", "http://poster.url", "PG-13",
                2022, "120 mins", "Action", "movies");

        when(movieDao.getMovieById(id)).thenReturn(Optional.of(movie));

        underTest.removeMovie(id);

        verify(movieDao).removeMovie(movie);
    }

    @Test
    void throwsWhenMovieRemovalIfNotExist() {
        long id = 1;

        when(movieDao.getMovieById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.removeMovie(id))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Movie with ID %s not found".formatted(id));

        verify(movieDao, never()).removeMovie(any());
    }

    @Test
    void getMovieById() {
        long id = 1;
        Movie movie = new Movie(id, "testName", 300.22, 5.00,
                "A great movie", "http://poster.url", "PG-13",
                2022, "120 mins", "Action", "movies");

        when(movieDao.getMovieById(id)).thenReturn(Optional.of(movie));

        Movie actual = underTest.getMovieById(id);

        assertThat(actual).isEqualTo(movie);
    }

    @Test
    void getMovieByIdThrowsIfNotExists() {
        long id = 1;

        when(movieDao.getMovieById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.getMovieById(id))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Movie with ID '%s' not found".formatted(id));
    }

    @Test
    void getMovieList() {
        underTest.getMovieList();

        verify(movieDao).getMovieList();
    }

    @Test
    void updateMovie() {
        long id = 2;

        Movie movie = new Movie(id, "testName22", 200.0, 2.0,
                "A movie", "http://poster.url", "PG", 2000,
                "100 mins", "Comedy", "movies");

        when(movieDao.getMovieById(id)).thenReturn(Optional.of(movie));

        MovieUpdation movieUpdation = new MovieUpdation(
                "testName2", 300.00, 5.0, "An awesome movie",
                "http://newposter.url", "R", 2021,
                "130 mins", "Thriller");

        underTest.updateMovie(movieUpdation, id);

        ArgumentCaptor<Movie> movieArgumentCaptor = ArgumentCaptor.forClass(Movie.class);

        verify(movieDao).updateMovie(movieArgumentCaptor.capture());

        Movie updatedMovie = movieArgumentCaptor.getValue();

        assertThat(updatedMovie.getName()).isEqualTo(movieUpdation.name());
        assertThat(updatedMovie.getCost()).isEqualTo(movieUpdation.cost());
        assertThat(updatedMovie.getRating()).isEqualTo(movieUpdation.rating());
        assertThat(updatedMovie.getDescription()).isEqualTo(movieUpdation.description());
        assertThat(updatedMovie.getPoster()).isEqualTo(movieUpdation.poster());
        assertThat(updatedMovie.getAgeRating()).isEqualTo(movieUpdation.ageRating());
        assertThat(updatedMovie.getYear()).isEqualTo(movieUpdation.year());
        assertThat(updatedMovie.getRuntime()).isEqualTo(movieUpdation.runtime());
        assertThat(updatedMovie.getGenre()).isEqualTo(movieUpdation.genre());
    }


    @Test
    void testUpdateMovieNoChanges() {
        Movie movie = new Movie();
        MovieUpdation update = new MovieUpdation(null, null, null, null, null, null, null, null, null);
        Long movieId = 1L;

        when(movieDao.getMovieById(movieId)).thenReturn(java.util.Optional.ofNullable(movie));

        assertThatThrownBy
                (() -> underTest.updateMovie(update, movieId))
                .hasMessage("No data changes found");

        verify(movieDao, never()).updateMovie(movie);
    }

    @Test
    void testUpdateMovieMovieNotFound() {
        Long movieId = 1L;

        when(movieDao.getMovieById(movieId)).thenReturn(java.util.Optional.empty());

        assertThatThrownBy(() -> underTest.updateMovie(
                new MovieUpdation("Hello", 100.0, 4.5, "New Description", "New Poster",
                        "New Age Rating", 2000, "New Runtime", "New Genre"), movieId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Movie not found");

        verify(movieDao, never()).updateMovie(any());
    }


    @Test
    void throwsIfNoChangesFoundForUpdation() {
        long id = 2;

        Movie movie = new Movie(id, "testName", 200.0, 2.0,
                "A movie", "http://poster.url", "PG", 2000,
                "100 mins", "Comedy", "movies");

        when(movieDao.getMovieById(id)).thenReturn(Optional.of(movie));

        MovieUpdation movieUpdation = new MovieUpdation(
                "testName", 200.0, 2.0, "A movie",
                "http://poster.url", "PG", 2000,
                "100 mins", "Comedy");

        assertThatThrownBy(() -> underTest.updateMovie(movieUpdation, id))
                .isInstanceOf(RequestValidationException.class)
                .hasMessageContaining("No data changes found");
    }

    @Test
    void updateMovieByIdThrowsIfNotExists() {
        long id = 1;

        when(movieDao.getMovieById(id)).thenReturn(Optional.empty());

        MovieUpdation updation = new MovieUpdation(
                "Name", 220.0, 3.30, "A good movie",
                "http://poster.url", "PG-13", 2020,
                "110 mins", "Drama");

        assertThatThrownBy(() -> underTest.updateMovie(updation, id))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Movie not found");

        verify(movieDao, never()).updateMovie(any());
    }

    @Test
    void testGetMoviesByYear() {
        int year = 2021;
        List<Movie> expectedMovies = Arrays.asList(
                new Movie("Movie1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "movies"),
                new Movie("Movie2", 10.0, 4.5, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "movies")
        );

        when(movieDao.getMoviesByYear(year)).thenReturn(expectedMovies);

        List<Movie> actualMovies = underTest.getMoviesByYear(year);

        assertEquals(expectedMovies.size(), actualMovies.size());
        assertEquals(expectedMovies, actualMovies);
    }

    @Test
    void testGetMoviesByAgeRating() {
        String ageRating = "PG-13";
        List<Movie> expectedMovies = Arrays.asList(
                new Movie("Movie1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "movies"),
                new Movie("Movie2", 10.0, 4.5, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "movies")
        );

        when(movieDao.getMoviesByAgeRating(ageRating)).thenReturn(expectedMovies);

        List<Movie> actualMovies = underTest.getMoviesByAgeRating(ageRating);

        assertEquals(expectedMovies.size(), actualMovies.size());
        assertEquals(expectedMovies, actualMovies);
    }

    @Test
    void testFindByRatingGreaterThanEqual() {
        double rating = 4.5;
        List<Movie> expectedMovies = Arrays.asList(
                new Movie("Movie1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "movies"),
                new Movie("Movie2", 10.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "movies")
        );

        when(movieDao.findByRatingGreaterThanEqual(rating)).thenReturn(expectedMovies);

        List<Movie> actualMovies = underTest.findByRatingGreaterThanEqual(rating);

        assertEquals(expectedMovies.size(), actualMovies.size());
        assertEquals(expectedMovies, actualMovies);
    }

    @Test
    void testFindByRatingLessThanEqual() {
        double rating = 4.5;
        List<Movie> expectedMovies = Arrays.asList(
                new Movie("Movie1", 10.0, 4.2, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "movies"),
                new Movie("Movie2", 10.0, 4.5, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "movies")
        );

        when(movieDao.findByRatingLessThanEqual(rating)).thenReturn(expectedMovies);

        List<Movie> actualMovies = underTest.findByRatingLessThanEqual(rating);

        assertEquals(expectedMovies.size(), actualMovies.size());
        assertEquals(expectedMovies, actualMovies);
    }

    @Test
    void testFindByCostBetween() {
        double minCost = 5.0;
        double maxCost = 15.0;
        List<Movie> expectedMovies = Arrays.asList(
                new Movie("Movie1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "movies"),
                new Movie("Movie2", 12.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "movies")
        );

        when(movieDao.findByCostBetween(minCost, maxCost)).thenReturn(expectedMovies);

        List<Movie> actualMovies = underTest.findByCostBetween(minCost, maxCost);

        assertEquals(expectedMovies.size(), actualMovies.size());
        assertEquals(expectedMovies, actualMovies);
    }

    @Test
    void testFindAllByOrderByNameAsc() {
        List<Movie> expectedMovies = Arrays.asList(
                new Movie("Movie1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "movies"),
                new Movie("Movie2", 12.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "movies")
        );

        when(movieDao.findAllByOrderByNameAsc()).thenReturn(expectedMovies);

        List<Movie> actualMovies = underTest.findAllByOrderByNameAsc();

        assertEquals(expectedMovies.size(), actualMovies.size());
        assertEquals(expectedMovies, actualMovies);
    }

    @Test
    void testFindAllByOrderByNameDesc() {
        List<Movie> expectedMovies = Arrays.asList(
                new Movie("Movie2", 12.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "movies"),
                new Movie("Movie1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "movies")
        );

        when(movieDao.findAllByOrderByNameDesc()).thenReturn(expectedMovies);

        List<Movie> actualMovies = underTest.findAllByOrderByNameDesc();

        assertEquals(expectedMovies.size(), actualMovies.size());
        assertEquals(expectedMovies, actualMovies);
    }

    @Test
    void testFindAllByOrderByCostAsc() {
        List<Movie> expectedMovies = Arrays.asList(
                new Movie("Movie1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "movies"),
                new Movie("Movie2", 12.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "movies")
        );

        when(movieDao.findAllByOrderByCostAsc()).thenReturn(expectedMovies);

        List<Movie> actualMovies = underTest.findAllByOrderByCostAsc();

        assertEquals(expectedMovies.size(), actualMovies.size());
        assertEquals(expectedMovies, actualMovies);
    }

    @Test
    void testFindAllByOrderByCostDesc() {
        List<Movie> expectedMovies = Arrays.asList(
                new Movie("Movie2", 12.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "movies"),
                new Movie("Movie1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "movies")
        );

        when(movieDao.findAllByOrderByCostDesc()).thenReturn(expectedMovies);

        List<Movie> actualMovies = underTest.findAllByOrderByCostDesc();

        assertEquals(expectedMovies.size(), actualMovies.size());
        assertEquals(expectedMovies, actualMovies);
    }

    @Test
    void testFindAllByOrderByRatingAsc() {
        List<Movie> expectedMovies = Arrays.asList(
                new Movie("Movie1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "movies"),
                new Movie("Movie2", 12.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "movies")
        );

        when(movieDao.findAllByOrderByRatingAsc()).thenReturn(expectedMovies);

        List<Movie> actualMovies = underTest.findAllByOrderByRatingAsc();

        assertEquals(expectedMovies.size(), actualMovies.size());
        assertEquals(expectedMovies, actualMovies);
    }

    @Test
    void testFindAllByOrderByRatingDesc() {
        List<Movie> expectedMovies = Arrays.asList(
                new Movie("Movie2", 12.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "movies"),
                new Movie("Movie1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "movies")
        );

        when(movieDao.findAllByOrderByRatingDesc()).thenReturn(expectedMovies);

        List<Movie> actualMovies = underTest.findAllByOrderByRatingDesc();

        assertEquals(expectedMovies.size(), actualMovies.size());
        assertEquals(expectedMovies, actualMovies);
    }

    @Test
    void testFindAllByOrderByYearAsc() {
        List<Movie> expectedMovies = Arrays.asList(
                new Movie("Movie1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "movies"),
                new Movie("Movie2", 12.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "movies")
        );

        when(movieDao.findAllByOrderByYearAsc()).thenReturn(expectedMovies);

        List<Movie> actualMovies = underTest.findAllByOrderByYearAsc();

        assertEquals(expectedMovies.size(), actualMovies.size());
        assertEquals(expectedMovies, actualMovies);
    }

    @Test
    void testFindAllByOrderByYearDesc() {
        List<Movie> expectedMovies = Arrays.asList(
                new Movie("Movie2", 12.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "movies"),
                new Movie("Movie1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "movies")
        );

        when(movieDao.findAllByOrderByYearDesc()).thenReturn(expectedMovies);

        List<Movie> actualMovies = underTest.findAllByOrderByYearDesc();

        assertEquals(expectedMovies.size(), actualMovies.size());
        assertEquals(expectedMovies, actualMovies);
    }

    @Test
    void testFindAllByOrderByGenreAsc() {
        List<Movie> expectedMovies = Arrays.asList(
                new Movie("Movie1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "movies"),
                new Movie("Movie2", 12.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "movies")
        );

        when(movieDao.findAllByOrderByGenreAsc()).thenReturn(expectedMovies);

        List<Movie> actualMovies = underTest.findAllByOrderByGenreAsc();

        assertEquals(expectedMovies.size(), actualMovies.size());
        assertEquals(expectedMovies, actualMovies);
    }

    @Test
    void testFindAllByOrderByGenreDesc() {
        List<Movie> expectedMovies = Arrays.asList(
                new Movie("Movie2", 12.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "movies"),
                new Movie("Movie1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "movies")
        );

        when(movieDao.findAllByOrderByGenreDesc()).thenReturn(expectedMovies);

        List<Movie> actualMovies = underTest.findAllByOrderByGenreDesc();

        assertEquals(expectedMovies.size(), actualMovies.size());
        assertEquals(expectedMovies, actualMovies);
    }
}
