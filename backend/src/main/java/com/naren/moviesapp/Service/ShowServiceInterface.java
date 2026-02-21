package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.Show;
import com.naren.moviesapp.Record.ShowRegistration;
import com.naren.moviesapp.Record.ShowUpdation;

import java.util.List;

public interface ShowServiceInterface {

    Show addShow(ShowRegistration registration);

    void removeShow(Long id);

    Show getShowById(Long id);

    List<Show> getShowList();

    Show updateShow(ShowUpdation update, Long showId);

    List<Show> getShowsByYear(Integer year);

    List<Show> getShowsByAgeRating(String ageRating);

    List<Show> findByRatingGreaterThanEqual(Double rating);

    List<Show> findByRatingLessThanEqual(Double rating);

    List<Show> findAllByOrderByNameAsc();

    List<Show> findAllByOrderByNameDesc();

    List<Show> findAllByOrderByRatingAsc();

    List<Show> findAllByOrderByRatingDesc();

    List<Show> findAllByOrderByYearAsc();

    List<Show> findAllByOrderByYearDesc();

    List<Show> findAllByOrderByGenreAsc();

    List<Show> findAllByOrderByGenreDesc();

    // Category-based methods
    List<Show> getShowsByCategory(String category);

    List<Show> getShowsByCategoryOrderByRatingDesc(String category);

    List<Show> getShowsByCategoryOrderByCreatedAtDesc(String category);

    List<Show> findAllByOrderByCategoryAsc();

    List<Show> findAllByOrderByCategoryDesc();

    List<String> getAllDistinctCategories();
}
