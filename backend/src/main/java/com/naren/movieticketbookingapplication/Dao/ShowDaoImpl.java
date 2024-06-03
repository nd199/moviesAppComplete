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
    public void addShow(Show show) {
        log.info("Adding show: {}", show);
        showRepository.save(show);
        log.info("Show added successfully: {}", show);
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
}
