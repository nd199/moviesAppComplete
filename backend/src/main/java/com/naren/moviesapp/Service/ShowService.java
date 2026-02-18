package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.Show;
import com.naren.moviesapp.Exception.RequestValidationException;
import com.naren.moviesapp.Exception.ResourceAlreadyExists;
import com.naren.moviesapp.Exception.ResourceNotFoundException;
import com.naren.moviesapp.Record.ShowRegistration;
import com.naren.moviesapp.Record.ShowUpdation;
import com.naren.moviesapp.Repo.ShowRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class ShowService implements ShowServiceInterface {
    private final ShowRepository showRepository;

    public ShowService(ShowRepository showRepository) {
        this.showRepository = showRepository;
    }

    @Override
    @PreAuthorize("hasPermission('MOVIE_WRITE')")
    public Show addShow(ShowRegistration registration) {
        Show show = createShow(registration);
        if (showRepository.existsByName(registration.name())) {
            String errorMessage = "Show name %s already exists".formatted(registration.name());
            throw new ResourceAlreadyExists(errorMessage);
        }
        Show saved = showRepository.save(show);
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
    @PreAuthorize("hasPermission('MOVIE_DELETE')")
    public void removeShow(Long id) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> {
                    String errorMessage = "Show with ID %s not found".formatted(id);
                    return new ResourceNotFoundException(errorMessage);
                });
        showRepository.delete(show);
    }

    @Override
    @PreAuthorize("hasPermission('MOVIE_READ')")
    public Show getShowById(Long id) {
        return showRepository.findById(id)
                .orElseThrow(() -> {
                    String errorMessage = "Show with ID '%s' not found".formatted(id);
                    return new ResourceNotFoundException(errorMessage);
                });
    }

    @Override
    @PreAuthorize("hasPermission('MOVIE_READ')")
    public List<Show> getShowList() {
        List<Show> shows = showRepository.findAll(org.springframework.data.domain.PageRequest.of(0, 20)).getContent();
        return shows;
    }

    @Override
    @PreAuthorize("hasPermission('MOVIE_WRITE')")
    public Show updateShow(ShowUpdation update, Long showId) {
        Show show = showRepository.findById(showId)
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
    public List<Show> findByCostBetween(Double minCost, Double maxCost) {
        return showRepository.findByCostBetween(minCost, maxCost);
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
    public List<Show> findAllByOrderByCostAsc() {
        return showRepository.findAllByOrderByCostAsc();
    }

    @Override
    public List<Show> findAllByOrderByCostDesc() {
        return showRepository.findAllByOrderByCostDesc();
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

}
