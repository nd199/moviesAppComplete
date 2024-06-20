package com.naren.movieticketbookingapplication.Service;

import com.naren.movieticketbookingapplication.Entity.Movie;
import com.naren.movieticketbookingapplication.Record.MovieRegistration;
import com.naren.movieticketbookingapplication.Record.MovieUpdation;

import java.util.List;


public interface MovieService {

    void addMovie(MovieRegistration registration);

    void removeMovie(Long id);

    Movie getMovieById(Long id);

    List<Movie> getMovieList();

    Movie updateMovie(MovieUpdation update, Long movieId);

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
