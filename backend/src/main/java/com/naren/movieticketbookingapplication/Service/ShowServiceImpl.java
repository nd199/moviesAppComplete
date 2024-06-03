package com.naren.movieticketbookingapplication.Service;

import com.naren.movieticketbookingapplication.Dao.ShowDao;
import com.naren.movieticketbookingapplication.Entity.Show;
import com.naren.movieticketbookingapplication.Exception.RequestValidationException;
import com.naren.movieticketbookingapplication.Exception.ResourceAlreadyExists;
import com.naren.movieticketbookingapplication.Exception.ResourceNotFoundException;
import com.naren.movieticketbookingapplication.Record.ShowRegistration;
import com.naren.movieticketbookingapplication.Record.ShowUpdation;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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
                registration.rating()
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
        if (!changes) {
            throw new RequestValidationException("No data changes found");
        }
        showDao.updateShow(show);
        log.info("Show updated successfully: {}", show);
    }
}