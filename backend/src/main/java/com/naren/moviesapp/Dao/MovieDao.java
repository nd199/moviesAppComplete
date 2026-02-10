package com.naren.moviesapp.Dao;

import com.naren.moviesapp.Entity.Movie;
import com.naren.moviesapp.Repo.MovieRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class MovieDao {
    private final MovieRepository movieRepository;

    public MovieDao(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public Movie addMovie(Movie movie) {
        Movie savedMovie = movieRepository.save(movie);
        return savedMovie;
    }

    public Movie findByName(String name) {
        return movieRepository.findByName(name);
    }

    
    public void removeMovie(Movie movie) {
        movieRepository.delete(movie);
    }

    
    public List<Movie> findByGenre(String genre) {
        return movieRepository.findByGenre(genre);
    }

    
    public Optional<Movie> getMovieById(Long id) {
        Optional<Movie> movie = movieRepository.findById(id);
        return movie;
    }

    
    public void updateMovie(Movie movie) {
        movieRepository.save(movie);
    }

    
    public boolean existsByName(String name) {
        boolean exists = movieRepository.existsByName(name);
        return exists;
    }

    
    public List<Movie> getMovieList() {
        Page<Movie> movies = movieRepository.findAll(PageRequest.of(0, 20));
        List<Movie> movieList = movies.getContent();
        return movieList;
    }

    public Page<Movie> getMovieList(int page, int size) {
        return movieRepository.findAll(PageRequest.of(page, size));
    }

    
    public List<Movie> getMoviesByYear(Integer year) {
        return movieRepository.findByYear(year);
    }

    
    public List<Movie> getMoviesByAgeRating(String ageRating) {
        return movieRepository.findByAgeRating(ageRating);
    }

    
    public List<Movie> findByRatingGreaterThanEqual(Double rating) {
        return movieRepository.findByRatingGreaterThanEqual(rating);
    }

    
    public List<Movie> findByRatingLessThanEqual(Double rating) {
        return movieRepository.findByRatingLessThanEqual(rating);
    }

    
    public List<Movie> findByCostBetween(Double minCost, Double maxCost) {
        return movieRepository.findByCostBetween(minCost, maxCost);
    }

    
    public List<Movie> findAllByOrderByNameAsc() {
        return movieRepository.findAllByOrderByNameAsc();
    }

    
    public List<Movie> findAllByOrderByNameDesc() {
        return movieRepository.findAllByOrderByNameDesc();
    }

    
    public List<Movie> findAllByOrderByCostAsc() {
        return movieRepository.findAllByOrderByCostAsc();
    }

    
    public List<Movie> findAllByOrderByCostDesc() {
        return movieRepository.findAllByOrderByCostDesc();
    }

    
    public List<Movie> findAllByOrderByRatingAsc() {
        return movieRepository.findAllByOrderByRatingAsc();
    }

    
    public List<Movie> findAllByOrderByRatingDesc() {
        return movieRepository.findAllByOrderByRatingDesc();
    }

    
    public List<Movie> findAllByOrderByYearAsc() {
        return movieRepository.findAllByOrderByYearAsc();
    }

    
    public List<Movie> findAllByOrderByYearDesc() {
        return movieRepository.findAllByOrderByYearDesc();
    }

    
    public List<Movie> findAllByOrderByGenreAsc() {
        return movieRepository.findAllByOrderByGenreAsc();
    }
    
    public List<Movie> findAllByOrderByGenreDesc() {
        return movieRepository.findAllByOrderByGenreDesc();
    }

}
