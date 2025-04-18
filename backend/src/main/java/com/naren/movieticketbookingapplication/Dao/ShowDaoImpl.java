package com.naren.movieticketbookingapplication.Dao;

import com.naren.movieticketbookingapplication.Entity.Show;
import com.naren.movieticketbookingapplication.Repo.ShowRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@Slf4j
public class ShowDaoImpl implements ShowDao {

    private final ShowRepository showRepository;

    public ShowDaoImpl(ShowRepository showRepository) {
        this.showRepository = showRepository;
    }


    @Override
    public Show addShow(Show show) {
        log.info("Adding show: {}", show);
        Show saved =  showRepository.save(show);
        log.info("Show added successfully: {}", show);
        return saved;
    }

    @Override
    public void removeShow(Show show) {
        log.info("Removing show: {}", show);
        showRepository.delete(show);
        log.info("Show removed successfully: {}", show);
    }

    @Override
    public Optional<Show> getShowById(Long id) {
        log.info("Fetching show by ID: {}", id);
        Optional<Show> show = showRepository.findById(id);
        log.info("Show fetched: {}", show.orElse(null));
        return show;
    }

    @Override
    public void updateShow(Show show) {
        log.info("Updating show: {}", show);
        showRepository.save(show);
        log.info("Show updated successfully: {}", show);
    }

    @Override
    public boolean existsByName(String name) {
        log.info("Checking if show exists by name: {}", name);
        boolean exists = showRepository.existsByName(name);
        log.info("Show exists by name '{}': {}", name, exists);
        return exists;
    }

    @Override
    public List<Show> getShowList() {
        log.info("Fetching list of shows");
        Page<Show> shows = showRepository.findAll(Pageable.ofSize(1000));
        List<Show> showList = shows.getContent();
        log.info("Fetched {} shows", showList.size());
        return showList;
    }

    @Override
    public Show findByName(String name) {
        return showRepository.findByName(name);
    }

    @Override
    public List<Show> findByGenre(String genre) {
        return showRepository.findByGenre(genre);
    }

    @Override
    public List<Show> getShowsByYear(Integer year) {
        log.info("Fetching shows by year: {}", year);
        return showRepository.findByYear(year);
    }

    @Override
    public List<Show> getShowsByAgeRating(String ageRating) {
        log.info("Fetching shows by age rating: {}", ageRating);
        return showRepository.findByAgeRating(ageRating);
    }

    @Override
    public List<Show> findByRatingGreaterThanEqual(Double rating) {
        log.info("Fetching shows with rating greater than or equal to: {}", rating);
        return showRepository.findByRatingGreaterThanEqual(rating);
    }

    @Override
    public List<Show> findByRatingLessThanEqual(Double rating) {
        log.info("Fetching shows with rating less than or equal to: {}", rating);
        return showRepository.findByRatingLessThanEqual(rating);
    }

    @Override
    public List<Show> findByCostBetween(Double minCost, Double maxCost) {
        log.info("Fetching shows with cost between {} and {}", minCost, maxCost);
        return showRepository.findByCostBetween(minCost, maxCost);
    }

    @Override
    public List<Show> findAllByOrderByNameAsc() {
        log.info("Fetching all shows ordered by name in ascending order");
        return showRepository.findAllByOrderByNameAsc();
    }

    @Override
    public List<Show> findAllByOrderByNameDesc() {
        log.info("Fetching all shows ordered by name in descending order");
        return showRepository.findAllByOrderByNameDesc();
    }

    @Override
    public List<Show> findAllByOrderByCostAsc() {
        log.info("Fetching all shows ordered by cost in ascending order");
        return showRepository.findAllByOrderByCostAsc();
    }

    @Override
    public List<Show> findAllByOrderByCostDesc() {
        log.info("Fetching all shows ordered by cost in descending order");
        return showRepository.findAllByOrderByCostDesc();
    }

    @Override
    public List<Show> findAllByOrderByRatingAsc() {
        log.info("Fetching all shows ordered by rating in ascending order");
        return showRepository.findAllByOrderByRatingAsc();
    }

    @Override
    public List<Show> findAllByOrderByRatingDesc() {
        log.info("Fetching all shows ordered by rating in descending order");
        return showRepository.findAllByOrderByRatingDesc();
    }

    @Override
    public List<Show> findAllByOrderByYearAsc() {
        log.info("Fetching all shows ordered by year in ascending order");
        return showRepository.findAllByOrderByYearAsc();
    }

    @Override
    public List<Show> findAllByOrderByYearDesc() {
        log.info("Fetching all shows ordered by year in descending order");
        return showRepository.findAllByOrderByYearDesc();
    }

    @Override
    public List<Show> findAllByOrderByGenreAsc() {
        log.info("Fetching all shows ordered by genre in ascending order");
        return showRepository.findAllByOrderByGenreAsc();
    }

    @Override
    public List<Show> findAllByOrderByGenreDesc() {
        log.info("Fetching all shows ordered by genre in descending order");
        return showRepository.findAllByOrderByGenreDesc();
    }
}