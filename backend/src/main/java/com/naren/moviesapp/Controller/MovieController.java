package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Entity.Movie;
import com.naren.moviesapp.Record.MovieRegistration;
import com.naren.moviesapp.Record.MovieUpdation;
import com.naren.moviesapp.Service.MovieService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class MovieController {
    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @PostMapping("/movies")
    public ResponseEntity<Movie> createMovie(@RequestBody MovieRegistration registration) {
        movieService.addMovie(registration);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/movies/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable("id") Long movieId) {
        Movie movie = movieService.getMovieById(movieId);
        return new ResponseEntity<>(movie, HttpStatus.OK);
    }

    @GetMapping("/movies")
    public ResponseEntity<List<Movie>> movieList() {
        List<Movie> movies = movieService.getMovieList();
        return new ResponseEntity<>(movies, HttpStatus.OK);
    }

    @PutMapping("/movies/{id}")
    public ResponseEntity<Movie> updateMovie(@RequestBody MovieUpdation update,
                                             @PathVariable("id") Long movieId) {
        movieService.updateMovie(update, movieId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/movies/{id}")
    public void deleteMovie(@PathVariable("id") Long movieId) {
        movieService.removeMovie(movieId);
    }

    // Category-based endpoints
    @GetMapping("/movies/category/{category}")
    public ResponseEntity<List<Movie>> getMoviesByCategory(@PathVariable("category") String category) {
        List<Movie> movies = movieService.getMoviesByCategory(category);
        return new ResponseEntity<>(movies, HttpStatus.OK);
    }

    @GetMapping("/movies/category/{category}/rating")
    public ResponseEntity<List<Movie>> getMoviesByCategoryOrderByRating(@PathVariable("category") String category) {
        List<Movie> movies = movieService.getMoviesByCategoryOrderByRatingDesc(category);
        return new ResponseEntity<>(movies, HttpStatus.OK);
    }

    @GetMapping("/movies/category/{category}/newest")
    public ResponseEntity<List<Movie>> getMoviesByCategoryOrderByNewest(@PathVariable("category") String category) {
        List<Movie> movies = movieService.getMoviesByCategoryOrderByCreatedAtDesc(category);
        return new ResponseEntity<>(movies, HttpStatus.OK);
    }

    @GetMapping("/movies/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        List<String> categories = movieService.getAllDistinctCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @GetMapping("/movies/sort/category/asc")
    public ResponseEntity<List<Movie>> getMoviesSortedByCategoryAsc() {
        List<Movie> movies = movieService.findAllByOrderByCategoryAsc();
        return new ResponseEntity<>(movies, HttpStatus.OK);
    }

    @GetMapping("/movies/sort/category/desc")
    public ResponseEntity<List<Movie>> getMoviesSortedByCategoryDesc() {
        List<Movie> movies = movieService.findAllByOrderByCategoryDesc();
        return new ResponseEntity<>(movies, HttpStatus.OK);
    }
}
