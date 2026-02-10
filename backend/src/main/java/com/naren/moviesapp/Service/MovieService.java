package com.naren.moviesapp.Service;

import com.naren.moviesapp.Dao.MovieDao;
import com.naren.moviesapp.Entity.Movie;
import com.naren.moviesapp.Exception.RequestValidationException;
import com.naren.moviesapp.Exception.ResourceAlreadyExists;
import com.naren.moviesapp.Exception.ResourceNotFoundException;
import com.naren.moviesapp.Record.MovieRegistration;
import com.naren.moviesapp.Record.MovieUpdation;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class MovieService implements MovieServiceInterface {
    private final MovieDao movieDao;

    public MovieService(MovieDao movieDao) {
        this.movieDao = movieDao;
    }

    @Override
    public Movie addMovie(MovieRegistration registration) {
        Movie movie = createMovie(registration);
        if (movieDao.existsByName(registration.name())) {
            String errorMessage = "Movie name %s already exists".formatted(registration.name());
            throw new ResourceAlreadyExists(errorMessage);
        }
        Movie savedMovie = movieDao.addMovie(movie);
        return savedMovie;
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
                registration.genre(),
                "movies");
    }

    @Override
    public void removeMovie(Long id) {
        Movie movie = movieDao.getMovieById(id)
                .orElseThrow(() -> {
                    String errorMessage = "Movie with ID %s not found".formatted(id);
                    return new ResourceNotFoundException(errorMessage);
                });
        movieDao.removeMovie(movie);
    }

    @Override
    public List<Movie> getMovieList() {
        List<Movie> movies = movieDao.getMovieList();
        return movies;
    }

    @Override
    public Movie getMovieById(Long id) {
        return movieDao.getMovieById(id)
                .orElseThrow(() -> {
                    String errorMessage = "Movie with ID '%s' not found".formatted(id);
                    return new ResourceNotFoundException(errorMessage);
                });
    }

    @Override
    public Movie updateMovie(MovieUpdation update, Long movieId) {
        Movie movie = getMovieById(movieId);

        boolean changes = false;

        if (update.name() != null && !update.name().equals(movie.getName())) {
            movie.setName(update.name());
            changes = true;
        }
        if (update.cost() != null && !update.cost().equals(movie.getCost())) {
            movie.setCost(update.cost());
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

        if (!changes) {
            throw new RequestValidationException("No data changes found");
        }
        movieDao.updateMovie(movie);
        return movie;
    }

    @Override
    public List<Movie> getMoviesByYear(Integer year) {
        return movieDao.getMoviesByYear(year);
    }

    @Override
    public List<Movie> getMoviesByAgeRating(String ageRating) {
        return movieDao.getMoviesByAgeRating(ageRating);
    }

    @Override
    public List<Movie> findByRatingGreaterThanEqual(Double rating) {
        return movieDao.findByRatingGreaterThanEqual(rating);
    }

    @Override
    public List<Movie> findByRatingLessThanEqual(Double rating) {
        return movieDao.findByRatingLessThanEqual(rating);
    }

    @Override
    public List<Movie> findByCostBetween(Double minCost, Double maxCost) {
        return movieDao.findByCostBetween(minCost, maxCost);
    }

    @Override
    public List<Movie> findAllByOrderByNameAsc() {
        return movieDao.findAllByOrderByNameAsc();
    }

    @Override
    public List<Movie> findAllByOrderByNameDesc() {
        return movieDao.findAllByOrderByNameDesc();
    }

    @Override
    public List<Movie> findAllByOrderByCostAsc() {
        return movieDao.findAllByOrderByCostAsc();
    }

    @Override
    public List<Movie> findAllByOrderByCostDesc() {
        return movieDao.findAllByOrderByCostDesc();
    }

    @Override
    public List<Movie> findAllByOrderByRatingAsc() {
        return movieDao.findAllByOrderByRatingAsc();
    }

    @Override
    public List<Movie> findAllByOrderByRatingDesc() {
        return movieDao.findAllByOrderByRatingDesc();
    }

    @Override
    public List<Movie> findAllByOrderByYearAsc() {
        return movieDao.findAllByOrderByYearAsc();
    }

    @Override
    public List<Movie> findAllByOrderByYearDesc() {
        return movieDao.findAllByOrderByYearDesc();
    }

    @Override
    public List<Movie> findAllByOrderByGenreAsc() {
        return movieDao.findAllByOrderByGenreAsc();
    }

    @Override
    public List<Movie> findAllByOrderByGenreDesc() {
        return movieDao.findAllByOrderByGenreDesc();
    }
}
