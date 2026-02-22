package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.Movie;
import com.naren.moviesapp.Exception.RequestValidationException;
import com.naren.moviesapp.Exception.ResourceAlreadyExists;
import com.naren.moviesapp.Exception.ResourceNotFoundException;
import com.naren.moviesapp.Record.MovieRegistration;
import com.naren.moviesapp.Record.MovieUpdation;
import com.naren.moviesapp.Repo.MovieRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class MovieService implements MovieServiceInterface {

    private static final Logger logger = LoggerFactory.getLogger(MovieService.class);

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Override
    public Movie addMovie(MovieRegistration registration) {
        logger.info("Adding new movie: {}", registration.name());
        Movie movie = createMovie(registration);
        if (movieRepository.existsByName(registration.name())) {
            String errorMessage = "Movie name %s already exists".formatted(registration.name());
            logger.warn("Movie creation failed: {}", errorMessage);
            throw new ResourceAlreadyExists(errorMessage);
        }
        Movie savedMovie = movieRepository.save(movie);
        logger.info("Movie added successfully with ID: {}", savedMovie.getId());
        return savedMovie;
    }

    /**
     * Add a movie entity directly (used for TMDB sync)
     */
    public Movie addMovie(Movie movie) {
        logger.info("Adding movie from TMDB: {}", movie.getName());
        if (movieRepository.existsByName(movie.getName())) {
            String errorMessage = "Movie name %s already exists".formatted(movie.getName());
            logger.warn("Movie creation from TMDB failed: {}", errorMessage);
            throw new ResourceAlreadyExists(errorMessage);
        }
        Movie savedMovie = movieRepository.save(movie);
        logger.info("Movie added from TMDB successfully with ID: {}", savedMovie.getId());
        return savedMovie;
    }

    private Movie createMovie(MovieRegistration registration) {
        String category = registration.category() != null ? registration.category() : "General";
        return new Movie(
                registration.name(),
                registration.rating(),
                registration.description(),
                registration.poster(),
                registration.ageRating(),
                registration.year(),
                registration.runtime(),
                registration.genre(),
                "movies",
                category);
    }

    @Override
    public void removeMovie(Long id) {
        logger.info("Removing movie with ID: {}", id);
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> {
                    String errorMessage = "Movie with ID %s not found".formatted(id);
                    logger.warn("Movie removal failed: {}", errorMessage);
                    return new ResourceNotFoundException(errorMessage);
                });
        movieRepository.delete(movie);
        logger.info("Movie removed successfully with ID: {}", id);
    }

    @Override
    public List<Movie> getMovieList() {
        logger.debug("Fetching all movies");
        List<Movie> movies = movieRepository.findAll(org.springframework.data.domain.PageRequest.of(0, 20)).getContent();
        return movies;
    }

    @Override
    public Movie getMovieById(Long id) {
        logger.debug("Fetching movie by ID: {}", id);
        return movieRepository.findById(id)
                .orElseThrow(() -> {
                    String errorMessage = "Movie with ID '%s' not found".formatted(id);
                    logger.warn("Movie not found: {}", errorMessage);
                    return new ResourceNotFoundException(errorMessage);
                });
    }

    @Override
    public Movie updateMovie(MovieUpdation update, Long movieId) {
        logger.info("Updating movie with ID: {}", movieId);
        Movie movie = getMovieById(movieId);

        boolean changes = false;

        if (update.name() != null && !update.name().equals(movie.getName())) {
            movie.setName(update.name());
            changes = true;
        }
        if (update.rating() != null && !update.rating().equals(movie.getRating())) {
            movie.setRating(update.rating());
            changes = true;
        }
        if (update.description() != null && !update.description().equals(movie.getDescription())) {
            movie.setDescription(update.description());
            changes = true;
        }
        if (update.poster() != null && !update.poster().equals(movie.getPoster())) {
            movie.setPoster(update.poster());
            changes = true;
        }
        if (update.ageRating() != null && !update.ageRating().equals(movie.getAgeRating())) {
            movie.setAgeRating(update.ageRating());
            changes = true;
        }
        if (update.year() != null && !update.year().equals(movie.getYear())) {
            movie.setYear(update.year());
            changes = true;
        }
        if (update.runtime() != null && !update.runtime().equals(movie.getRuntime())) {
            movie.setRuntime(update.runtime());
            changes = true;
        }
        if (update.genre() != null && !update.genre().equals(movie.getGenre())) {
            movie.setGenre(update.genre());
            changes = true;
        }
        if (update.category() != null && !update.category().equals(movie.getCategory())) {
            movie.setCategory(update.category());
            changes = true;
        }

        if (!changes) {
            throw new RequestValidationException("No data changes found");
        }
        movieRepository.save(movie);
        return movie;
    }

    @Override
    public List<Movie> getMoviesByYear(Integer year) {
        return movieRepository.findByYear(year);
    }

    @Override
    public List<Movie> getMoviesByAgeRating(String ageRating) {
        return movieRepository.findByAgeRating(ageRating);
    }

    @Override
    public List<Movie> findByRatingGreaterThanEqual(Double rating) {
        return movieRepository.findByRatingGreaterThanEqual(rating);
    }

    @Override
    public List<Movie> findByRatingLessThanEqual(Double rating) {
        return movieRepository.findByRatingLessThanEqual(rating);
    }

    @Override
    public List<Movie> findAllByOrderByNameAsc() {
        return movieRepository.findAllByOrderByNameAsc();
    }

    @Override
    public List<Movie> findAllByOrderByNameDesc() {
        return movieRepository.findAllByOrderByNameDesc();
    }

    @Override
    public List<Movie> findAllByOrderByRatingAsc() {
        return movieRepository.findAllByOrderByRatingAsc();
    }

    @Override
    public List<Movie> findAllByOrderByRatingDesc() {
        return movieRepository.findAllByOrderByRatingDesc();
    }

    @Override
    public List<Movie> findAllByOrderByYearAsc() {
        return movieRepository.findAllByOrderByYearAsc();
    }

    @Override
    public List<Movie> findAllByOrderByYearDesc() {
        return movieRepository.findAllByOrderByYearDesc();
    }

    @Override
    public List<Movie> findAllByOrderByGenreAsc() {
        return movieRepository.findAllByOrderByGenreAsc();
    }

    @Override
    public List<Movie> findAllByOrderByGenreDesc() {
        return movieRepository.findAllByOrderByGenreDesc();
    }

    // Category-based methods
    @Override
    public List<Movie> getMoviesByCategory(String category) {
        return movieRepository.findByCategory(category);
    }

    @Override
    public List<Movie> getMoviesByCategoryOrderByRatingDesc(String category) {
        return movieRepository.findByCategoryOrderByRatingDesc(category);
    }

    @Override
    public List<Movie> getMoviesByCategoryOrderByCreatedAtDesc(String category) {
        return movieRepository.findByCategoryOrderByCreatedAtDesc(category);
    }

    @Override
    public List<Movie> findAllByOrderByCategoryAsc() {
        return movieRepository.findAllByOrderByCategoryAsc();
    }

    @Override
    public List<Movie> findAllByOrderByCategoryDesc() {
        return movieRepository.findAllByOrderByCategoryDesc();
    }

    @Override
    public List<String> getAllDistinctCategories() {
        return movieRepository.findAllDistinctCategories();
    }
}
