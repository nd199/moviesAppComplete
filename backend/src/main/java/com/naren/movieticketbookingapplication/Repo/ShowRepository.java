package com.naren.movieticketbookingapplication.Repo;

import com.naren.movieticketbookingapplication.Entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShowRepository extends JpaRepository<Show, Long> {
    boolean existsByName(String name);

    Show findByName(String name);

    List<Show> findByGenre(String genre);

    List<Show> findByYear(Integer year);

    List<Show> findByAgeRating(String ageRating);

    List<Show> findByRatingGreaterThanEqual(Double rating);

    List<Show> findByRatingLessThanEqual(Double rating);

    List<Show> findByCostBetween(Double minCost, Double maxCost);
}
