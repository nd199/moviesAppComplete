package com.naren.movieticketbookingapplication.Dao;

import com.naren.movieticketbookingapplication.Entity.Show;

import java.util.List;
import java.util.Optional;

public interface ShowDao {
    void addShow(Show show);

    void removeShow(Show show);

    Optional<Show> getShowById(Long id);

    void updateShow(Show show);

    boolean existsByName(String name);

    List<Show> getShowList();

    List<Show> getShowsByYear(Integer year);

    List<Show> getShowsByAgeRating(String ageRating);
}

