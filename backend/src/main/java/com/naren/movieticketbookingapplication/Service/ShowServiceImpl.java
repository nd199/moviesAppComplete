package com.naren.movieticketbookingapplication.Service;

import com.naren.movieticketbookingapplication.Dao.ShowDao;
import com.naren.movieticketbookingapplication.Entity.Show;
import com.naren.movieticketbookingapplication.Exception.RequestValidationException;
import com.naren.movieticketbookingapplication.Exception.ResourceAlreadyExists;
import com.naren.movieticketbookingapplication.Exception.ResourceNotFoundException;
import com.naren.movieticketbookingapplication.Record.ShowRegistration;
import com.naren.movieticketbookingapplication.Record.ShowUpdation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Transactional
@Service
public class ShowServiceImpl implements ShowService {

    private final ShowDao showDao;

    public ShowServiceImpl(ShowDao showDao) {
        this.showDao = showDao;
    }

    @Override
    public void addShow(ShowRegistration registration) {
        log.info("Creating show: {}", registration);
        Show show = createShow(registration);
        if (showDao.existsByName(registration.name())) {
            String errorMessage = "Show name %s already exists".formatted(registration.name());
            log.error(errorMessage, registration.name());
            throw new ResourceAlreadyExists(errorMessage);
        }
        showDao.addShow(show);
        log.info("Show added successfully: {}", show);
    }

    private Show createShow(ShowRegistration registration) {
        return new Show(
                registration.name(),
                registration.cost(),
                registration.rating(),
                registration.description(),
                registration.poster(),
                registration.ageRating(),
                registration.year(),
                registration.runtime(),
                registration.genre()
        );
    }

    @Override
    public void removeShow(Long id) {
        log.info("Removing show with ID: {}", id);
        Show show = showDao.getShowById(id)
                .orElseThrow(() -> {
                    String errorMessage = "Show with ID %s not found".formatted(id);
                    log.error(errorMessage, id);
                    return new ResourceNotFoundException(errorMessage);
                });
        showDao.removeShow(show);
        log.info("Show removed successfully: {}", show);
    }

    @Override
    public Show getShowById(Long id) {
        log.info("Fetching show by ID: {}", id);
        return showDao.getShowById(id)
                .orElseThrow(() -> {
                    String errorMessage = "Show with ID '%s' not found".formatted(id);
                    log.error(errorMessage, id);
                    return new ResourceNotFoundException(errorMessage);
                });
    }

    @Override
    public List<Show> getShowList() {
        log.info("Fetching list of shows");
        List<Show> shows = showDao.getShowList();
        log.info("Retrieved {} shows", shows.size());
        return shows;
    }

    @Override
    public void updateShow(ShowUpdation update, Long showId) {
        log.info("Updating show with ID: {}", showId);
        Show show = showDao.getShowById(showId)
                .orElseThrow(() -> new ResourceNotFoundException("Show not found"));

        boolean changes = false;

        if (update.name() != null && !update.name().equals(show.getName())) {
            changes = true;
            show.setName(update.name());
        }
        if (update.cost() != null && !update.cost().equals(show.getCost())) {
            changes = true;
            show.setCost(update.cost());
        }
        if (update.rating() != null && !update.rating().equals(show.getRating())) {
            changes = true;
            show.setRating(update.rating());
        }
        if (update.description() != null && !update.description().equals(show.getDescription())) {
            changes = true;
            show.setDescription(update.description());
        }
        if (update.poster() != null && !update.poster().equals(show.getPoster())) {
            changes = true;
            show.setPoster(update.poster());
        }
        if (update.ageRating() != null && !update.ageRating().equals(show.getAgeRating())) {
            changes = true;
            show.setAgeRating(update.ageRating());
        }
        if (update.year() != null && !update.year().equals(show.getYear())) {
            changes = true;
            show.setYear(update.year());
        }
        if (update.runtime() != null && !update.runtime().equals(show.getRuntime())) {
            changes = true;
            show.setRuntime(update.runtime());
        }
        if (update.genre() != null && !update.genre().equals(show.getGenre())) {
            changes = true;
            show.setGenre(update.genre());
        }

        if (!changes) {
            throw new RequestValidationException("No data changes found");
        }
        showDao.updateShow(show);
        log.info("Show updated successfully: {}", show);
    }

    @Override
    public List<Show> getShowsByYear(Integer year) {
        log.info("Fetching shows by year: {}", year);
        return showDao.getShowsByYear(year);
    }

    @Override
    public List<Show> getShowsByAgeRating(String ageRating) {
        log.info("Fetching shows by age rating: {}", ageRating);
        return showDao.getShowsByAgeRating(ageRating);
    }

    @Override
    public List<Show> findByRatingGreaterThanEqual(Double rating) {
        log.info("Fetching shows with rating greater than or equal to: {}", rating);
        return showDao.findByRatingGreaterThanEqual(rating);
    }

    @Override
    public List<Show> findByRatingLessThanEqual(Double rating) {
        log.info("Fetching shows with rating less than or equal to: {}", rating);
        return showDao.findByRatingLessThanEqual(rating);
    }

    @Override
    public List<Show> findByCostBetween(Double minCost, Double maxCost) {
        log.info("Fetching shows with cost between {} and {}", minCost, maxCost);
        return showDao.findByCostBetween(minCost, maxCost);
    }

    @Override
    public List<Show> findAllByOrderByNameAsc() {
        log.info("Fetching all shows ordered by name in ascending order");
        return showDao.findAllByOrderByNameAsc();
    }

    @Override
    public List<Show> findAllByOrderByNameDesc() {
        log.info("Fetching all shows ordered by name in descending order");
        return showDao.findAllByOrderByNameDesc();
    }

    @Override
    public List<Show> findAllByOrderByCostAsc() {
        log.info("Fetching all shows ordered by cost in ascending order");
        return showDao.findAllByOrderByCostAsc();
    }

    @Override
    public List<Show> findAllByOrderByCostDesc() {
        log.info("Fetching all shows ordered by cost in descending order");
        return showDao.findAllByOrderByCostDesc();
    }

    @Override
    public List<Show> findAllByOrderByRatingAsc() {
        log.info("Fetching all shows ordered by rating in ascending order");
        return showDao.findAllByOrderByRatingAsc();
    }

    @Override
    public List<Show> findAllByOrderByRatingDesc() {
        log.info("Fetching all shows ordered by rating in descending order");
        return showDao.findAllByOrderByRatingDesc();
    }

    @Override
    public List<Show> findAllByOrderByYearAsc() {
        log.info("Fetching all shows ordered by year in ascending order");
        return showDao.findAllByOrderByYearAsc();
    }

    @Override
    public List<Show> findAllByOrderByYearDesc() {
        log.info("Fetching all shows ordered by year in descending order");
        return showDao.findAllByOrderByYearDesc();
    }

    @Override
    public List<Show> findAllByOrderByGenreAsc() {
        log.info("Fetching all shows ordered by genre in ascending order");
        return showDao.findAllByOrderByGenreAsc();
    }

    @Override
    public List<Show> findAllByOrderByGenreDesc() {
        log.info("Fetching all shows ordered by genre in descending order");
        return showDao.findAllByOrderByGenreDesc();
    }

}
