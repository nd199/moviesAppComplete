package com.naren.movieticketbookingapplication.Dao;

import com.naren.movieticketbookingapplication.Entity.Show;

import java.util.List;
import java.util.Optional;

public interface ShowDao {
    Show addShow(Show show);

    void removeShow(Show show);

    Optional<Show> getShowById(Long id);

    void updateShow(Show show);

    boolean existsByName(String name);

    List<Show> getShowList();

    Show findByName(String name);

    List<Show> findByGenre(String genre);

    List<Show> getShowsByYear(Integer year);

    List<Show> getShowsByAgeRating(String ageRating);

    List<Show> findByRatingGreaterThanEqual(Double rating);

    List<Show> findByRatingLessThanEqual(Double rating);

    List<Show> findByCostBetween(Double minCost, Double maxCost);

    List<Show> findAllByOrderByNameAsc();

    List<Show> findAllByOrderByNameDesc();

    List<Show> findAllByOrderByCostAsc();

    List<Show> findAllByOrderByCostDesc();

    List<Show> findAllByOrderByRatingAsc();

    List<Show> findAllByOrderByRatingDesc();

    List<Show> findAllByOrderByYearAsc();

    List<Show> findAllByOrderByYearDesc();

    List<Show> findAllByOrderByGenreAsc();

    List<Show> findAllByOrderByGenreDesc();
}

