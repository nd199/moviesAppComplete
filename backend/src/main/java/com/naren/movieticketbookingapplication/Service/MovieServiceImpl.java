package com.naren.movieticketbookingapplication.Service;

import com.naren.movieticketbookingapplication.Dao.MovieDao;
import com.naren.movieticketbookingapplication.Entity.Movie;
import com.naren.movieticketbookingapplication.Exception.RequestValidationException;
import com.naren.movieticketbookingapplication.Exception.ResourceAlreadyExists;
import com.naren.movieticketbookingapplication.Exception.ResourceNotFoundException;
import com.naren.movieticketbookingapplication.Record.MovieRegistration;
import com.naren.movieticketbookingapplication.Record.MovieUpdation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Transactional
@Service
public class MovieServiceImpl implements MovieService {

    private final MovieDao movieDao;

    public MovieServiceImpl(MovieDao movieDao) {
        this.movieDao = movieDao;
    }

    @Override
    public void addMovie(MovieRegistration registration) {
        log.info("Creating movie: {}", registration);
        Movie movie = createMovie(registration);
        if (movieDao.existsByName(registration.name())) {
            String errorMessage = "Movie name %s already exists".formatted(registration.name());
            log.error(errorMessage, registration.name());
            throw new ResourceAlreadyExists(errorMessage);
        }
        movieDao.addMovie(movie);
        log.info("Movie added successfully: {}", movie);
    }

    private Movie createMovie(MovieRegistration registration) {
        return new Movie(
                registration.name(),
                registration.cost(),
                registration.rating(),
                registration.description(),
                registration.poster(),
                registration.ageRating(),
                registration.year(),
                registration.runtime(),
                registration.genre()
        );
    }

    @Override
    public void removeMovie(Long id) {
        log.info("Removing movie with ID: {}", id);
        Movie movie = movieDao.getMovieById(id)
                .orElseThrow(() -> {
                    String errorMessage = "Movie with ID %s not found".formatted(id);
                    log.error(errorMessage, id);
                    return new ResourceNotFoundException(errorMessage);
                });
        movieDao.removeMovie(movie);
        log.info("Movie removed successfully: {}", movie);
    }

    @Override
    public Movie getMovieById(Long id) {
        log.info("Fetching movie by ID: {}", id);
        return movieDao.getMovieById(id)
                .orElseThrow(() -> {
                    String errorMessage = "Movie with ID '%s' not found".formatted(id);
                    log.error(errorMessage, id);
                    return new ResourceNotFoundException(errorMessage);
                });
    }

    @Override
    public List<Movie> getMovieList() {
        log.info("Fetching list of movies");
        List<Movie> movies = movieDao.getMovieList();
        log.info("Retrieved {} movies", movies.size());
        return movies;
    }

    @Override
    public void updateMovie(MovieUpdation update, Long movieId) {
        log.info("Updating movie with ID: {}", movieId);
        Movie movie = movieDao.getMovieById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));

        boolean changes = false;

        if (update.name() != null && !update.name().equals(movie.getName())) {
            changes = true;
            movie.setName(update.name());
        }
        if (update.cost() != null && !update.cost().equals(movie.getCost())) {
            changes = true;
            movie.setCost(update.cost());
        }
        if (update.rating() != null && !update.rating().equals(movie.getRating())) {
            changes = true;
            movie.setRating(update.rating());
        }
        if (update.description() != null && !update.description().equals(movie.getDescription())) {
            changes = true;
            movie.setDescription(update.description());
        }
        if (update.poster() != null && !update.poster().equals(movie.getPoster())) {
            changes = true;
            movie.setPoster(update.poster());
        }
        if (update.ageRating() != null && !update.ageRating().equals(movie.getAgeRating())) {
            changes = true;
            movie.setAgeRating(update.ageRating());
        }
        if (update.year() != null && !update.year().equals(movie.getYear())) {
            changes = true;
            movie.setYear(update.year());
        }
        if (update.runtime() != null && !update.runtime().equals(movie.getRuntime())) {
            changes = true;
            movie.setRuntime(update.runtime());
        }
        if (update.genre() != null && !update.genre().equals(movie.getGenre())) {
            changes = true;
            movie.setGenre(update.genre());
        }

        if (!changes) {
            throw new RequestValidationException("No data changes found");
        }
        movieDao.updateMovie(movie);
        log.info("Movie updated successfully: {}", movie);
    }

    @Override
    public List<Movie> getMoviesByYear(Integer year) {
        log.info("Fetching movies by year: {}", year);
        return movieDao.getMoviesByYear(year);
    }

    @Override
    public List<Movie> getMoviesByAgeRating(String ageRating) {
        log.info("Fetching movies by age rating: {}", ageRating);
        return movieDao.getMoviesByAgeRating(ageRating);
    }
}
