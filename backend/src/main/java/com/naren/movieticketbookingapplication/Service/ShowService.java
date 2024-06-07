package com.naren.movieticketbookingapplication.Service;

import com.naren.movieticketbookingapplication.Entity.Show;
import com.naren.movieticketbookingapplication.Record.ShowRegistration;
import com.naren.movieticketbookingapplication.Record.ShowUpdation;

import java.util.List;

public interface ShowService {

    void addShow(ShowRegistration registration);

    void removeShow(Long id);

    Show getShowById(Long id);

    List<Show> getShowList();

    void updateShow(ShowUpdation update, Long showId);

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
