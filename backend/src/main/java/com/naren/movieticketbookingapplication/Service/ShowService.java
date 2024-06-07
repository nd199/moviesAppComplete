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
}
