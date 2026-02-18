package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.Movie;
import com.naren.moviesapp.Exception.RequestValidationException;
import com.naren.moviesapp.Exception.ResourceAlreadyExists;
import com.naren.moviesapp.Exception.ResourceNotFoundException;
import com.naren.moviesapp.Record.MovieRegistration;
import com.naren.moviesapp.Record.MovieUpdation;
import com.naren.moviesapp.Repo.MovieRepository;
import com.naren.moviesapp.TestData.TestDataFactory;
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
    private MovieRepository movieRepository;
    private MovieService underTest;

    @BeforeEach
    void setUp() {
        underTest = new MovieService(movieRepository);
    }

    @Test
    void addMovie() {
        MovieRegistration registration = TestDataFactory.createTestMovieRegistration();

        when(movieRepository.existsByName(registration.name())).thenReturn(false);

        underTest.addMovie(registration);

        ArgumentCaptor<Movie> movieArgumentCaptor = ArgumentCaptor.forClass(Movie.class);

        verify(movieRepository).save(movieArgumentCaptor.capture());

        Movie captured = movieArgumentCaptor.getValue();

        assertThat(captured.getId()).isNull();
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
        MovieRegistration registration = TestDataFactory.createTestMovieRegistration();

        when(movieRepository.existsByName(registration.name())).thenReturn(true);

        assertThatThrownBy(
                () -> underTest.addMovie(registration))
                .isInstanceOf(ResourceAlreadyExists.class)
                .hasMessageContaining("Movie name %s already exists".formatted(registration.name()));

        verify(movieRepository, never()).save(any());
    }

    @Test
    void removeMovie() {
        long id = 1;
        Movie movie = new Movie(
                "testName",
                300.22,
                5.00,
                "A great movie",
                "http://poster.url",
                "PG-13",
                2022,
                "120 mins",
                "Action",
                "movies");
        movie.setId(id);

        when(movieRepository.findById(id)).thenReturn(Optional.of(movie));

        underTest.removeMovie(id);

        verify(movieRepository).delete(movie);
    }

    @Test
    void throwsWhenMovieRemovalIfNotExist() {
        long id = 1;

        when(movieRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.removeMovie(id))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Movie with ID %s not found".formatted(id));

        verify(movieRepository, never()).delete(any());
    }

    @Test
    void getMovieById() {
        long id = 1;
        Movie movie = new Movie(
                "testName",
                300.22,
                5.00,
                "A great movie",
                "http://poster.url",
                "PG-13",
                2022,
                "120 mins",
                "Action",
                "movies");
        movie.setId(id);

        when(movieRepository.findById(id)).thenReturn(Optional.of(movie));

        Movie actual = underTest.getMovieById(id);

        assertThat(actual).isEqualTo(movie);
    }

    @Test
    void getMovieByIdThrowsIfNotExists() {
        long id = 1;

        when(movieRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.getMovieById(id))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Movie with ID '%s' not found".formatted(id));
    }

    @Test
    void getMovieList() {
        when(movieRepository.findAll(any(org.springframework.data.domain.Pageable.class)))
                .thenReturn(new org.springframework.data.domain.PageImpl<>(List.of()));

        List<Movie> movies = underTest.getMovieList();

        assertThat(movies).isNotNull();
    }

    @Test
    void updateMovie() {
        long id = 2;

        Movie movie = new Movie(
                "testName22",
                200.0,
                2.0,
                "A movie",
                "http://poster.url",
                "PG",
                2000,
                "100 mins",
                "Comedy",
                "movies");
        movie.setId(id);

        when(movieRepository.findById(id)).thenReturn(Optional.of(movie));

        MovieUpdation movieUpdation = new MovieUpdation(
                "testName2", 300.00, 5.0, "An awesome movie",
                "http://newposter.url", "R", 2021,
                "130 mins", "Thriller");

        underTest.updateMovie(movieUpdation, id);

        ArgumentCaptor<Movie> movieArgumentCaptor = ArgumentCaptor.forClass(Movie.class);

        verify(movieRepository).save(movieArgumentCaptor.capture());

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

        when(movieRepository.findById(movieId)).thenReturn(java.util.Optional.ofNullable(movie));

        assertThatThrownBy
                (() -> underTest.updateMovie(update, movieId))
                .hasMessage("No data changes found");

        verify(movieRepository, never()).save(movie);
    }

    @Test
    void testUpdateMovieMovieNotFound() {
        Long movieId = 1L;

        when(movieRepository.findById(movieId)).thenReturn(java.util.Optional.empty());

        assertThatThrownBy(() -> underTest.updateMovie(
                new MovieUpdation("Hello", 100.0, 4.5, "New Description", "New Poster",
                        "New Age Rating", 2000, "New Runtime", "New Genre"), movieId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Movie with ID '%s' not found".formatted(movieId));

        verify(movieRepository, never()).save(any());
    }


    @Test
    void throwsIfNoChangesFoundForUpdation() {
        long id = 2;

        Movie movie = new Movie(
                "testName",
                200.0,
                2.0,
                "A movie",
                "http://poster.url",
                "PG",
                2000,
                "100 mins",
                "Comedy",
                "movies");
        movie.setId(id);

        when(movieRepository.findById(id)).thenReturn(Optional.of(movie));

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

        when(movieRepository.findById(id)).thenReturn(Optional.empty());

        MovieUpdation updation = new MovieUpdation(
                "Name", 220.0, 3.30, "A good movie",
                "http://poster.url", "PG-13", 2020,
                "110 mins", "Drama");

        assertThatThrownBy(() -> underTest.updateMovie(updation, id))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Movie with ID '%s' not found".formatted(id));

        verify(movieRepository, never()).save(any());
    }

    @Test
    void testGetMoviesByYear() {
        int year = 2021;
        List<Movie> expectedMovies = Arrays.asList(
                new Movie("Movie1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "movies"),
                new Movie("Movie2", 10.0, 4.5, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "movies")
        );

        when(movieRepository.findByYear(year)).thenReturn(expectedMovies);

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

        when(movieRepository.findByAgeRating(ageRating)).thenReturn(expectedMovies);

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

        when(movieRepository.findByRatingGreaterThanEqual(rating)).thenReturn(expectedMovies);

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

        when(movieRepository.findByRatingLessThanEqual(rating)).thenReturn(expectedMovies);

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

        when(movieRepository.findByCostBetween(minCost, maxCost)).thenReturn(expectedMovies);

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

        when(movieRepository.findAllByOrderByNameAsc()).thenReturn(expectedMovies);

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

        when(movieRepository.findAllByOrderByNameDesc()).thenReturn(expectedMovies);

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

        when(movieRepository.findAllByOrderByCostAsc()).thenReturn(expectedMovies);

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

        when(movieRepository.findAllByOrderByCostDesc()).thenReturn(expectedMovies);

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

        when(movieRepository.findAllByOrderByRatingAsc()).thenReturn(expectedMovies);

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

        when(movieRepository.findAllByOrderByRatingDesc()).thenReturn(expectedMovies);

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

        when(movieRepository.findAllByOrderByYearAsc()).thenReturn(expectedMovies);

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

        when(movieRepository.findAllByOrderByYearDesc()).thenReturn(expectedMovies);

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

        when(movieRepository.findAllByOrderByGenreAsc()).thenReturn(expectedMovies);

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

        when(movieRepository.findAllByOrderByGenreDesc()).thenReturn(expectedMovies);

        List<Movie> actualMovies = underTest.findAllByOrderByGenreDesc();

        assertEquals(expectedMovies.size(), actualMovies.size());
        assertEquals(expectedMovies, actualMovies);
    }
}
