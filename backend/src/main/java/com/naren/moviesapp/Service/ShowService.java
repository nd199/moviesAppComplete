package com.naren.moviesapp.Service;

import com.naren.moviesapp.Dao.ShowDao;
import com.naren.moviesapp.Entity.Show;
import com.naren.moviesapp.Exception.RequestValidationException;
import com.naren.moviesapp.Exception.ResourceAlreadyExists;
import com.naren.moviesapp.Exception.ResourceNotFoundException;
import com.naren.moviesapp.Record.ShowRegistration;
import com.naren.moviesapp.Record.ShowUpdation;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class ShowService implements ShowServiceInterface {
    private final ShowDao showDao;

    public ShowService(ShowDao showDao) {
        this.showDao = showDao;
    }

    @Override
    public Show addShow(ShowRegistration registration) {
        Show show = createShow(registration);
        if (showDao.existsByName(registration.name())) {
            String errorMessage = "Show name %s already exists".formatted(registration.name());
            throw new ResourceAlreadyExists(errorMessage);
        }
        Show saved = showDao.addShow(show);
        return saved;
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
                registration.genre(),
                "shows");
    }

    @Override
    public void removeShow(Long id) {
        Show show = showDao.getShowById(id)
                .orElseThrow(() -> {
                    String errorMessage = "Show with ID %s not found".formatted(id);
                    return new ResourceNotFoundException(errorMessage);
                });
        showDao.removeShow(show);
    }

    @Override
    public Show getShowById(Long id) {
        return showDao.getShowById(id)
                .orElseThrow(() -> {
                    String errorMessage = "Show with ID '%s' not found".formatted(id);
                    return new ResourceNotFoundException(errorMessage);
                });
    }

    @Override
    public List<Show> getShowList() {
        List<Show> shows = showDao.getShowList();
        return shows;
    }

    @Override
    public Show updateShow(ShowUpdation update, Long showId) {
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

        return show;
    }

    @Override
    public List<Show> getShowsByYear(Integer year) {
        return showDao.getShowsByYear(year);
    }

    @Override
    public List<Show> getShowsByAgeRating(String ageRating) {
        return showDao.getShowsByAgeRating(ageRating);
    }

    @Override
    public List<Show> findByRatingGreaterThanEqual(Double rating) {
        return showDao.findByRatingGreaterThanEqual(rating);
    }

    @Override
    public List<Show> findByRatingLessThanEqual(Double rating) {
        return showDao.findByRatingLessThanEqual(rating);
    }

    @Override
    public List<Show> findByCostBetween(Double minCost, Double maxCost) {
        return showDao.findByCostBetween(minCost, maxCost);
    }

    @Override
    public List<Show> findAllByOrderByNameAsc() {
        return showDao.findAllByOrderByNameAsc();
    }

    @Override
    public List<Show> findAllByOrderByNameDesc() {
        return showDao.findAllByOrderByNameDesc();
    }

    @Override
    public List<Show> findAllByOrderByCostAsc() {
        return showDao.findAllByOrderByCostAsc();
    }

    @Override
    public List<Show> findAllByOrderByCostDesc() {
        return showDao.findAllByOrderByCostDesc();
    }

    @Override
    public List<Show> findAllByOrderByRatingAsc() {
        return showDao.findAllByOrderByRatingAsc();
    }

    @Override
    public List<Show> findAllByOrderByRatingDesc() {
        return showDao.findAllByOrderByRatingDesc();
    }

    @Override
    public List<Show> findAllByOrderByYearAsc() {
        return showDao.findAllByOrderByYearAsc();
    }

    @Override
    public List<Show> findAllByOrderByYearDesc() {
        return showDao.findAllByOrderByYearDesc();
    }

    @Override
    public List<Show> findAllByOrderByGenreAsc() {
        return showDao.findAllByOrderByGenreAsc();
    }

    @Override
    public List<Show> findAllByOrderByGenreDesc() {
        return showDao.findAllByOrderByGenreDesc();
    }

}
