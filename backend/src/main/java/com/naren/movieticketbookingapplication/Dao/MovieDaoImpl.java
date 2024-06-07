package com.naren.movieticketbookingapplication.Dao;

import com.naren.movieticketbookingapplication.Entity.Movie;
import com.naren.movieticketbookingapplication.Repo.MovieRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@Slf4j
public class MovieDaoImpl implements MovieDao {

    private final MovieRepository movieRepository;

    public MovieDaoImpl(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Override
    public void addMovie(Movie movie) {
        log.info("Adding movie: {}", movie);
        movieRepository.save(movie);
        log.info("Movie added successfully: {}", movie);
    }

    @Override
    public Movie findByName(String name) {
        return movieRepository.findByName(name);
    }

    @Override
    public void removeMovie(Movie movie) {
        log.info("Removing movie: {}", movie);
        movieRepository.delete(movie);
        log.info("Movie removed successfully: {}", movie);
    }

    @Override
    public List<Movie> findByGenre(String genre) {
        return movieRepository.findByGenre(genre);
    }

    @Override
    public Optional<Movie> getMovieById(Long id) {
        log.info("Fetching movie by ID: {}", id);
        Optional<Movie> movie = movieRepository.findById(id);
        log.info("Movie fetched: {}", movie.orElse(null));
        return movie;
    }

    @Override
    public void updateMovie(Movie movie) {
        log.info("Updating movie: {}", movie);
        movieRepository.save(movie);
        log.info("Movie updated successfully: {}", movie);
    }

    @Override
    public boolean existsByName(String name) {
        log.info("Checking if movie exists by name: {}", name);
        boolean exists = movieRepository.existsByName(name);
        log.info("Movie exists by name '{}': {}", name, exists);
        return exists;
    }

    @Override
    public List<Movie> getMovieList() {
        log.info("Fetching list of movies");
        Page<Movie> movies = movieRepository.findAll(Pageable.ofSize(1000));
        List<Movie> movieList = movies.getContent();
        log.info("Fetched {} movies", movieList.size());
        return movieList;
    }

    @Override
    public List<Movie> getMoviesByYear(Integer year) {
        log.info("Fetching movies by year: {}", year);
        return movieRepository.findByYear(year);
    }

    @Override
    public List<Movie> getMoviesByAgeRating(String ageRating) {
        log.info("Fetching movies by age rating: {}", ageRating);
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
    public List<Movie> findByCostBetween(Double minCost, Double maxCost) {
        return movieRepository.findByCostBetween(minCost, maxCost);
    }

    @Override
    public List<Movie> findAllByOrderByNameAsc() {
        log.info("Fetching all movies sorted by name in ascending order");
        return movieRepository.findAllByOrderByNameAsc();
    }

    @Override
    public List<Movie> findAllByOrderByNameDesc() {
        log.info("Fetching all movies sorted by name in descending order");
        return movieRepository.findAllByOrderByNameDesc();
    }

    @Override
    public List<Movie> findAllByOrderByCostAsc() {
        log.info("Fetching all movies sorted by cost in ascending order");
        return movieRepository.findAllByOrderByCostAsc();
    }

    @Override
    public List<Movie> findAllByOrderByCostDesc() {
        log.info("Fetching all movies sorted by cost in descending order");
        return movieRepository.findAllByOrderByCostDesc();
    }

    @Override
    public List<Movie> findAllByOrderByRatingAsc() {
        log.info("Fetching all movies sorted by rating in ascending order");
        return movieRepository.findAllByOrderByRatingAsc();
    }

    @Override
    public List<Movie> findAllByOrderByRatingDesc() {
        log.info("Fetching all movies sorted by rating in descending order");
        return movieRepository.findAllByOrderByRatingDesc();
    }

    @Override
    public List<Movie> findAllByOrderByYearAsc() {
        log.info("Fetching all movies sorted by year in ascending order");
        return movieRepository.findAllByOrderByYearAsc();
    }

    @Override
    public List<Movie> findAllByOrderByYearDesc() {
        log.info("Fetching all movies sorted by year in descending order");
        return movieRepository.findAllByOrderByYearDesc();
    }

    @Override
    public List<Movie> findAllByOrderByGenreAsc() {
        log.info("Fetching all movies ordered by genre in ascending order");
        return movieRepository.findAllByOrderByGenreAsc();
    }


    @Override
    public List<Movie> findAllByOrderByGenreDesc() {
        log.info("Fetching all movies sorted by genre in descending order");
        return movieRepository.findAllByOrderByGenreDesc();
    }

}
