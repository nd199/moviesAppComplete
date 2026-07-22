package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Entity.Movie;
import com.naren.moviesapp.Record.MovieRegistration;
import com.naren.moviesapp.Record.MovieUpdation;
import com.naren.moviesapp.Service.MovieService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class MovieController {

    private static final Logger logger = LoggerFactory.getLogger(MovieController.class);

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @PostMapping("/movies")
    @PreAuthorize("hasAuthority('MOVIE_WRITE')")
    public ResponseEntity<Movie> createMovie(@Valid @RequestBody MovieRegistration registration) {
        logger.info("Creating new movie: {}", registration.name());
        movieService.addMovie(registration);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/movies/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable("id") Long movieId) {
        logger.debug("Fetching movie by ID: {}", movieId);
        Movie movie = movieService.getMovieById(movieId);
        return new ResponseEntity<>(movie, HttpStatus.OK);
    }

    @GetMapping("/movies")
    public ResponseEntity<List<Movie>> movieList() {
        logger.debug("Fetching all movies");
        List<Movie> movies = movieService.getMovieList();
        return new ResponseEntity<>(movies, HttpStatus.OK);
    }

    @PutMapping("/movies/{id}")
    @PreAuthorize("hasAuthority('MOVIE_WRITE')")
    public ResponseEntity<Movie> updateMovie(@RequestBody MovieUpdation update,
                                             @PathVariable("id") Long movieId) {
        logger.info("Updating movie with ID: {}", movieId);
        movieService.updateMovie(update, movieId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/movies/{id}")
    @PreAuthorize("hasAuthority('MOVIE_DELETE')")
    public void deleteMovie(@PathVariable("id") Long movieId) {
        logger.info("Deleting movie with ID: {}", movieId);
        movieService.removeMovie(movieId);
    }

    // Category-based endpoints
    @GetMapping("/movies/category/{category}")
    public ResponseEntity<List<Movie>> getMoviesByCategory(@PathVariable("category") String category) {
        logger.debug("Fetching movies by category: {}", category);
        List<Movie> movies = movieService.getMoviesByCategory(category);
        return new ResponseEntity<>(movies, HttpStatus.OK);
    }

    @GetMapping("/movies/category/{category}/rating")
    public ResponseEntity<List<Movie>> getMoviesByCategoryOrderByRating(@PathVariable("category") String category) {
        logger.debug("Fetching movies by category {} ordered by rating", category);
        List<Movie> movies = movieService.getMoviesByCategoryOrderByRatingDesc(category);
        return new ResponseEntity<>(movies, HttpStatus.OK);
    }

    @GetMapping("/movies/category/{category}/newest")
    public ResponseEntity<List<Movie>> getMoviesByCategoryOrderByNewest(@PathVariable("category") String category) {
        logger.debug("Fetching movies by category {} ordered by newest", category);
        List<Movie> movies = movieService.getMoviesByCategoryOrderByCreatedAtDesc(category);
        return new ResponseEntity<>(movies, HttpStatus.OK);
    }

    @GetMapping("/movies/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        logger.debug("Fetching all distinct categories");
        List<String> categories = movieService.getAllDistinctCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @GetMapping("/movies/sort/category/asc")
    public ResponseEntity<List<Movie>> getMoviesSortedByCategoryAsc() {
        logger.debug("Fetching movies sorted by category ascending");
        List<Movie> movies = movieService.findAllByOrderByCategoryAsc();
        return new ResponseEntity<>(movies, HttpStatus.OK);
    }

    @GetMapping("/movies/sort/category/desc")
    public ResponseEntity<List<Movie>> getMoviesSortedByCategoryDesc() {
        logger.debug("Fetching movies sorted by category descending");
        List<Movie> movies = movieService.findAllByOrderByCategoryDesc();
        return new ResponseEntity<>(movies, HttpStatus.OK);
    }
}
