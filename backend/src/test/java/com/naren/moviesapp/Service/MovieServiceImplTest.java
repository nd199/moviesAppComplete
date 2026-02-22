package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.Movie;
import com.naren.moviesapp.Exception.RequestValidationException;
import com.naren.moviesapp.Exception.ResourceAlreadyExists;
import com.naren.moviesapp.Record.MovieRegistration;
import com.naren.moviesapp.Record.MovieUpdation;
import com.naren.moviesapp.Repo.MovieRepository;
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
        MovieRegistration registration = new MovieRegistration(
                "testName", 5.00, "A great movie",
                "http://poster.url", "PG-13", 2022,
                "120 mins", "Drama", "Trending");

        when(movieRepository.existsByName(registration.name())).thenReturn(false);
        
        // Mock save to return the captured entity
        ArgumentCaptor<Movie> captor = ArgumentCaptor.forClass(Movie.class);
        when(movieRepository.save(captor.capture())).thenAnswer(invocation -> {
            Movie movie = invocation.getArgument(0);
            movie.setId(1L); // Simulate DB-generated ID
            return movie;
        });
        
        underTest.addMovie(registration);

        assertThat(captor.getValue().getCategory()).isEqualTo("Trending");
    }

    @Test
    void addMovieWithNullCategoryDefaultsToGeneral() {
        MovieRegistration registration = new MovieRegistration(
                "testName", 5.00, "A great movie",
                "http://poster.url", "PG-13", 2022,
                "120 mins", "Drama", null);

        when(movieRepository.existsByName(registration.name())).thenReturn(false);
        
        // Mock save to return the captured entity
        ArgumentCaptor<Movie> captor = ArgumentCaptor.forClass(Movie.class);
        when(movieRepository.save(captor.capture())).thenAnswer(invocation -> {
            Movie movie = invocation.getArgument(0);
            movie.setId(1L); // Simulate DB-generated ID
            return movie;
        });
        
        underTest.addMovie(registration);

        assertThat(captor.getValue().getCategory()).isEqualTo("General");
    }

    @Test
    void throwsMovieNameExists() {
        MovieRegistration registration = new MovieRegistration(
                "testName", 5.00, "A great movie",
                "http://poster.url", "PG-13", 2022,
                "120 mins", "Drama", "Trending");

        when(movieRepository.existsByName(registration.name())).thenReturn(true);

        assertThatThrownBy(() -> underTest.addMovie(registration))
                .isInstanceOf(ResourceAlreadyExists.class);
        verify(movieRepository, never()).save(any());
    }

    @Test
    void removeMovie() {
        Movie movie = new Movie("testName", 5.00, "A great movie", "http://poster.url",
                "PG-13", 2022, "120 mins", "Drama", "movies", "Trending");
        movie.setId(1L);

        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));
        underTest.removeMovie(1L);
        verify(movieRepository).delete(movie);
    }

    @Test
    void getMovieById() {
        Movie movie = new Movie("testName", 5.00, "A great movie", "http://poster.url",
                "PG-13", 2022, "120 mins", "Drama", "movies", "Trending");
        movie.setId(1L);

        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));
        assertThat(underTest.getMovieById(1L)).isEqualTo(movie);
    }

    @Test
    void getMovieList() {
        when(movieRepository.findAll(any(org.springframework.data.domain.Pageable.class)))
                .thenReturn(new org.springframework.data.domain.PageImpl<>(List.of()));
        assertThat(underTest.getMovieList()).isNotNull();
    }

    @Test
    void updateMovie() {
        Movie movie = new Movie("testName22", 2.0, "A movie", "http://poster.url",
                "PG", 2000, "100 mins", "Comedy", "movies", "General");
        movie.setId(2L);

        when(movieRepository.findById(2L)).thenReturn(Optional.of(movie));

        MovieUpdation movieUpdation = new MovieUpdation("testName2", 5.0, "An awesome movie",
                "http://newposter.url", "R", 2021, "130 mins", "Thriller", "Trending");

        underTest.updateMovie(movieUpdation, 2L);

        ArgumentCaptor<Movie> captor = ArgumentCaptor.forClass(Movie.class);
        verify(movieRepository).save(captor.capture());
        assertThat(captor.getValue().getCategory()).isEqualTo("Trending");
    }

    @Test
    void testUpdateMovieNoChanges() {
        Movie movie = new Movie();
        MovieUpdation update = new MovieUpdation(null, null, null, null, null, null, null, null, null);

        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));
        assertThatThrownBy(() -> underTest.updateMovie(update, 1L))
                .hasMessage("No data changes found");
    }

    @Test
    void throwsIfNoChangesFoundForUpdation() {
        Movie movie = new Movie("testName", 2.0, "A movie", "http://poster.url",
                "PG", 2000, "100 mins", "Comedy", "movies", "Trending");
        movie.setId(2L);

        when(movieRepository.findById(2L)).thenReturn(Optional.of(movie));

        MovieUpdation movieUpdation = new MovieUpdation("testName", 2.0, "A movie",
                "http://poster.url", "PG", 2000, "100 mins", "Comedy", "Trending");

        assertThatThrownBy(() -> underTest.updateMovie(movieUpdation, 2L))
                .isInstanceOf(RequestValidationException.class)
                .hasMessageContaining("No data changes found");
    }

    @Test
    void testGetMoviesByYear() {
        List<Movie> expectedMovies = Arrays.asList(
                new Movie("Movie1", 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "movies", "Trending"),
                new Movie("Movie2", 4.5, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "movies", "Popular"));

        when(movieRepository.findByYear(2021)).thenReturn(expectedMovies);
        assertEquals(expectedMovies, underTest.getMoviesByYear(2021));
    }

    // Category-based tests
    @Test
    void testGetMoviesByCategory() {
        List<Movie> expectedMovies = Arrays.asList(
                new Movie("Movie1", 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "movies", "Trending"),
                new Movie("Movie2", 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "movies", "Trending"));

        when(movieRepository.findByCategory("Trending")).thenReturn(expectedMovies);
        assertEquals(expectedMovies, underTest.getMoviesByCategory("Trending"));
    }

    @Test
    void testGetMoviesByCategoryOrderByRatingDesc() {
        List<Movie> expectedMovies = Arrays.asList(
                new Movie("Movie2", 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "movies", "Trending"),
                new Movie("Movie1", 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "movies", "Trending"));

        when(movieRepository.findByCategoryOrderByRatingDesc("Trending")).thenReturn(expectedMovies);
        assertEquals(expectedMovies, underTest.getMoviesByCategoryOrderByRatingDesc("Trending"));
    }

    @Test
    void testFindAllByOrderByCategoryAsc() {
        List<Movie> expectedMovies = Arrays.asList(
                new Movie("Movie1", 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "movies", "Popular"),
                new Movie("Movie2", 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "movies", "Trending"));

        when(movieRepository.findAllByOrderByCategoryAsc()).thenReturn(expectedMovies);
        assertEquals(expectedMovies, underTest.findAllByOrderByCategoryAsc());
    }

    @Test
    void testFindAllByOrderByCategoryDesc() {
        List<Movie> expectedMovies = Arrays.asList(
                new Movie("Movie2", 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "movies", "Trending"),
                new Movie("Movie1", 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "movies", "Popular"));

        when(movieRepository.findAllByOrderByCategoryDesc()).thenReturn(expectedMovies);
        assertEquals(expectedMovies, underTest.findAllByOrderByCategoryDesc());
    }

    @Test
    void testGetAllDistinctCategories() {
        List<String> expectedCategories = Arrays.asList("Trending", "Popular", "New Releases", "Top Rated");

        when(movieRepository.findAllDistinctCategories()).thenReturn(expectedCategories);
        assertEquals(expectedCategories, underTest.getAllDistinctCategories());
    }
}
