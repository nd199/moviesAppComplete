package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.Show;
import com.naren.moviesapp.Exception.RequestValidationException;
import com.naren.moviesapp.Exception.ResourceAlreadyExists;
import com.naren.moviesapp.Exception.ResourceNotFoundException;
import com.naren.moviesapp.Record.ShowRegistration;
import com.naren.moviesapp.Record.ShowUpdation;
import com.naren.moviesapp.Repo.ShowRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class ShowService implements ShowServiceInterface {

    private static final Logger logger = LoggerFactory.getLogger(ShowService.class);

    private final ShowRepository showRepository;

    public ShowService(ShowRepository showRepository) {
        this.showRepository = showRepository;
    }

    @Override
    public Show addShow(ShowRegistration registration) {
        logger.info("Adding new show: {}", registration.name());
        Show show = createShow(registration);
        if (showRepository.existsByName(registration.name())) {
            String errorMessage = "Show name %s already exists".formatted(registration.name());
            logger.warn("Show creation failed: {}", errorMessage);
            throw new ResourceAlreadyExists(errorMessage);
        }
        Show saved = showRepository.save(show);
        logger.info("Show added successfully with ID: {}", saved.getShow_id());
        return saved;
    }

    /**
     * Add a show entity directly (used for TMDB sync)
     */
    public Show addShow(Show show) {
        logger.info("Adding show from TMDB: {}", show.getName());
        if (showRepository.existsByName(show.getName())) {
            String errorMessage = "Show name %s already exists".formatted(show.getName());
            logger.warn("Show creation from TMDB failed: {}", errorMessage);
            throw new ResourceAlreadyExists(errorMessage);
        }
        Show saved = showRepository.save(show);
        logger.info("Show added from TMDB successfully with ID: {}", saved.getShow_id());
        return saved;
    }

    private Show createShow(ShowRegistration registration) {
        String category = registration.category() != null ? registration.category() : "General";
        return new Show(
                registration.name(),
                registration.rating(),
                registration.description(),
                registration.poster(),
                registration.ageRating(),
                registration.year(),
                registration.runtime(),
                registration.genre(),
                "shows",
                category);
    }

    @Override
    public void removeShow(Long id) {
        logger.info("Removing show with ID: {}", id);
        Show show = showRepository.findById(id)
                .orElseThrow(() -> {
                    String errorMessage = "Show with ID %s not found".formatted(id);
                    logger.warn("Show removal failed: {}", errorMessage);
                    return new ResourceNotFoundException(errorMessage);
                });
        showRepository.delete(show);
        logger.info("Show removed successfully with ID: {}", id);
    }

    @Override
    public Show getShowById(Long id) {
        logger.debug("Fetching show by ID: {}", id);
        return showRepository.findById(id)
                .orElseThrow(() -> {
                    String errorMessage = "Show with ID '%s' not found".formatted(id);
                    logger.warn("Show not found: {}", errorMessage);
                    return new ResourceNotFoundException(errorMessage);
                });
    }

    @Override
    public List<Show> getShowList() {
        logger.debug("Fetching all shows");
        List<Show> shows = showRepository.findAll(org.springframework.data.domain.PageRequest.of(0, 20)).getContent();
        return shows;
    }

    @Override
    public Show updateShow(ShowUpdation update, Long showId) {
        logger.info("Updating show with ID: {}", showId);
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new ResourceNotFoundException("Show not found"));

        boolean changes = false;

        if (update.name() != null && !update.name().equals(show.getName())) {
            changes = true;
            show.setName(update.name());
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
        if (update.category() != null && !update.category().equals(show.getCategory())) {
            changes = true;
            show.setCategory(update.category());
        }

        if (!changes) {
            throw new RequestValidationException("No data changes found");
        }
        showRepository.save(show);

        return show;
    }

    @Override
    public List<Show> getShowsByYear(Integer year) {
        return showRepository.findByYear(year);
    }

    @Override
    public List<Show> getShowsByAgeRating(String ageRating) {
        return showRepository.findByAgeRating(ageRating);
    }

    @Override
    public List<Show> findByRatingGreaterThanEqual(Double rating) {
        return showRepository.findByRatingGreaterThanEqual(rating);
    }

    @Override
    public List<Show> findByRatingLessThanEqual(Double rating) {
        return showRepository.findByRatingLessThanEqual(rating);
    }

    @Override
    public List<Show> findAllByOrderByNameAsc() {
        return showRepository.findAllByOrderByNameAsc();
    }

    @Override
    public List<Show> findAllByOrderByNameDesc() {
        return showRepository.findAllByOrderByNameDesc();
    }

    @Override
    public List<Show> findAllByOrderByRatingAsc() {
        return showRepository.findAllByOrderByRatingAsc();
    }

    @Override
    public List<Show> findAllByOrderByRatingDesc() {
        return showRepository.findAllByOrderByRatingDesc();
    }

    @Override
    public List<Show> findAllByOrderByYearAsc() {
        return showRepository.findAllByOrderByYearAsc();
    }

    @Override
    public List<Show> findAllByOrderByYearDesc() {
        return showRepository.findAllByOrderByYearDesc();
    }

    @Override
    public List<Show> findAllByOrderByGenreAsc() {
        return showRepository.findAllByOrderByGenreAsc();
    }

    @Override
    public List<Show> findAllByOrderByGenreDesc() {
        return showRepository.findAllByOrderByGenreDesc();
    }

    // Category-based methods
    @Override
    public List<Show> getShowsByCategory(String category) {
        return showRepository.findByCategory(category);
    }

    @Override
    public List<Show> getShowsByCategoryOrderByRatingDesc(String category) {
        return showRepository.findByCategoryOrderByRatingDesc(category);
    }

    @Override
    public List<Show> getShowsByCategoryOrderByCreatedAtDesc(String category) {
        return showRepository.findByCategoryOrderByCreatedAtDesc(category);
    }

    @Override
    public List<Show> findAllByOrderByCategoryAsc() {
        return showRepository.findAllByOrderByCategoryAsc();
    }

    @Override
    public List<Show> findAllByOrderByCategoryDesc() {
        return showRepository.findAllByOrderByCategoryDesc();
    }

    @Override
    public List<String> getAllDistinctCategories() {
        return showRepository.findAllDistinctCategories();
    }

}
