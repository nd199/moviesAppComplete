package com.naren.moviesapp.Service;

import com.naren.moviesapp.Repo.MovieRepository;
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
    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Override
    public Movie addMovie(MovieRegistration registration) {
        Movie movie = createMovie(registration);
        if (movieRepository.existsByName(registration.name())) {
            String errorMessage = "Movie name %s already exists".formatted(registration.name());
            throw new ResourceAlreadyExists(errorMessage);
        }
        Movie savedMovie = movieRepository.save(movie);
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
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> {
                    String errorMessage = "Movie with ID %s not found".formatted(id);
                    return new ResourceNotFoundException(errorMessage);
                });
        movieRepository.delete(movie);
    }

    @Override
    public List<Movie> getMovieList() {
        List<Movie> movies = movieRepository.findAll(org.springframework.data.domain.PageRequest.of(0, 20)).getContent();
        return movies;
    }

    @Override
    public Movie getMovieById(Long id) {
        return movieRepository.findById(id)
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
        movieRepository.save(movie);
        return movie;
    }

    @Override
    public List<Movie> getMoviesByYear(Integer year) {
        return movieRepository.getMoviesByYear(year);
    }

    @Override
    public List<Movie> getMoviesByAgeRating(String ageRating) {
        return movieRepository.getMoviesByAgeRating(ageRating);
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
    public List<Movie> findByCostBetween(Double minCost, Double maxCost) {
        return movieRepository.findByCostBetween(minCost, maxCost);
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
    public List<Movie> findAllByOrderByCostAsc() {
        return movieRepository.findAllByOrderByCostAsc();
    }

    @Override
    public List<Movie> findAllByOrderByCostDesc() {
        return movieRepository.findAllByOrderByCostDesc();
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
}
