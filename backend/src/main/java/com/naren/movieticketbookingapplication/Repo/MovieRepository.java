package com.naren.movieticketbookingapplication.Repo;

import com.naren.movieticketbookingapplication.Entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface MovieRepository extends JpaRepository<Movie, Long> {

    boolean existsByName(String name);

    Movie findByName(String name);

    List<Movie> findByGenre(String genre);

    List<Movie> findByYear(Integer year);

    List<Movie> findByAgeRating(String ageRating);

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

    List<Movie> findMovieByType(String type);

}
