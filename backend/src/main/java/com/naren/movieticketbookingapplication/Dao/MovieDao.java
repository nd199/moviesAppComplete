package com.naren.movieticketbookingapplication.Dao;

import com.naren.movieticketbookingapplication.Entity.Movie;

import java.util.List;
import java.util.Optional;

public interface MovieDao {

    void addMovie(Movie movie);

    Movie findByName(String name);

    void removeMovie(Movie movie);

    List<Movie> findByGenre(String genre);

    Optional<Movie> getMovieById(Long id);

    void updateMovie(Movie update);

    boolean existsByName(String name);

    List<Movie> getMovieList();

    List<Movie> getMoviesByYear(Integer year);

    List<Movie> getMoviesByAgeRating(String ageRating);

    List<Movie> findByRatingGreaterThanEqual(Double rating);

    List<Movie> findByRatingLessThanEqual(Double rating);

    List<Movie> findByCostBetween(Double minCost, Double maxCost);

    List<Movie> findAllByOrderByNameAsc();

    List<Movie> findAllByOrderByNameDesc();

    List<Movie> findAllByOrderByCostAsc();

    List<Movie> findAllByOrderByCostDesc();

    List<Movie> findAllByOrderByRatingAsc();

    List<Movie> findAllByOrderByRatingDesc();

    List<Movie> findAllByOrderByYearAsc();

    List<Movie> findAllByOrderByYearDesc();

    List<Movie> findAllByOrderByGenreAsc();

    List<Movie> findAllByOrderByGenreDesc();


}


