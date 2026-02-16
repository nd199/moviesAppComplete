package com.naren.moviesapp.Dao;

import com.naren.moviesapp.Entity.Show;
import com.naren.moviesapp.Repo.ShowRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ShowDao {
    private final ShowRepository showRepository;

    public ShowDao(ShowRepository showRepository) {
        this.showRepository = showRepository;
    }

    public Show addShow(Show show) {
        Show saved = showRepository.save(show);
        return saved;
    }


    public void removeShow(Show show) {
        showRepository.delete(show);
    }


    public Optional<Show> getShowById(Long id) {
        Optional<Show> show = showRepository.findById(id);
        return show;
    }


    public void updateShow(Show show) {
        showRepository.save(show);
    }


    public boolean existsByName(String name) {
        boolean exists = showRepository.existsByName(name);
        return exists;
    }


    public List<Show> getShowList() {
        Page<Show> shows = showRepository.findAll(PageRequest.of(0, 20));
        List<Show> showList = shows.getContent();
        return showList;
    }

    public Page<Show> getShowList(int page, int size) {
        return showRepository.findAll(PageRequest.of(page, size));
    }


    public Show findByName(String name) {
        return showRepository.findByName(name);
    }


    public List<Show> findByGenre(String genre) {
        return showRepository.findByGenre(genre);
    }


    public List<Show> getShowsByYear(Integer year) {
        return showRepository.findByYear(year);
    }


    public List<Show> getShowsByAgeRating(String ageRating) {
        return showRepository.findByAgeRating(ageRating);
    }


    public List<Show> findByRatingGreaterThanEqual(Double rating) {
        return showRepository.findByRatingGreaterThanEqual(rating);
    }


    public List<Show> findByRatingLessThanEqual(Double rating) {
        return showRepository.findByRatingLessThanEqual(rating);
    }


    public List<Show> findByCostBetween(Double minCost, Double maxCost) {
        return showRepository.findByCostBetween(minCost, maxCost);
    }


    public List<Show> findAllByOrderByNameAsc() {
        return showRepository.findAllByOrderByNameAsc();
    }


    public List<Show> findAllByOrderByNameDesc() {
        return showRepository.findAllByOrderByNameDesc();
    }


    public List<Show> findAllByOrderByCostAsc() {
        return showRepository.findAllByOrderByCostAsc();
    }


    public List<Show> findAllByOrderByCostDesc() {
        return showRepository.findAllByOrderByCostDesc();
    }


    public List<Show> findAllByOrderByRatingAsc() {
        return showRepository.findAllByOrderByRatingAsc();
    }


    public List<Show> findAllByOrderByRatingDesc() {
        return showRepository.findAllByOrderByRatingDesc();
    }


    public List<Show> findAllByOrderByYearAsc() {
        return showRepository.findAllByOrderByYearAsc();
    }


    public List<Show> findAllByOrderByYearDesc() {
        return showRepository.findAllByOrderByYearDesc();
    }


    public List<Show> findAllByOrderByGenreAsc() {
        return showRepository.findAllByOrderByGenreAsc();
    }


    public List<Show> findAllByOrderByGenreDesc() {
        return showRepository.findAllByOrderByGenreDesc();
    }
}