package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Entity.Show;
import com.naren.moviesapp.Record.ShowRegistration;
import com.naren.moviesapp.Record.ShowUpdation;
import com.naren.moviesapp.Service.ShowService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")

public class ShowController {

    private static final Logger logger = LoggerFactory.getLogger(ShowController.class);

    private final ShowService showService;

    public ShowController(ShowService showService) {
        this.showService = showService;
    }

    @PostMapping("/shows")
    public ResponseEntity<Show> createShow(@RequestBody ShowRegistration registration) {
        logger.info("Creating new show: {}", registration.name());
        showService.addShow(registration);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/shows/{id}")
    public ResponseEntity<Show> getShowById(@PathVariable("id") Long showId) {
        logger.debug("Fetching show by ID: {}", showId);
        Show show = showService.getShowById(showId);
        return new ResponseEntity<>(show, HttpStatus.OK);
    }

    @GetMapping("/shows")
    public ResponseEntity<List<Show>> showList() {
        logger.debug("Fetching all shows");
        List<Show> shows = showService.getShowList();
        return new ResponseEntity<>(shows, HttpStatus.OK);
    }

    @PutMapping("/shows/{id}")
    public ResponseEntity<Show> updateShow(@RequestBody ShowUpdation update,
                                           @PathVariable("id") Long showId) {
        logger.info("Updating show with ID: {}", showId);
        showService.updateShow(update, showId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/shows/{id}")
    public void deleteShow(@PathVariable("id") Long showId) {
        logger.info("Deleting show with ID: {}", showId);
        showService.removeShow(showId);
    }

    // Category-based endpoints
    @GetMapping("/shows/category/{category}")
    public ResponseEntity<List<Show>> getShowsByCategory(@PathVariable("category") String category) {
        logger.debug("Fetching shows by category: {}", category);
        List<Show> shows = showService.getShowsByCategory(category);
        return new ResponseEntity<>(shows, HttpStatus.OK);
    }

    @GetMapping("/shows/category/{category}/rating")
    public ResponseEntity<List<Show>> getShowsByCategoryOrderByRating(@PathVariable("category") String category) {
        logger.debug("Fetching shows by category {} ordered by rating", category);
        List<Show> shows = showService.getShowsByCategoryOrderByRatingDesc(category);
        return new ResponseEntity<>(shows, HttpStatus.OK);
    }

    @GetMapping("/shows/category/{category}/newest")
    public ResponseEntity<List<Show>> getShowsByCategoryOrderByNewest(@PathVariable("category") String category) {
        logger.debug("Fetching shows by category {} ordered by newest", category);
        List<Show> shows = showService.getShowsByCategoryOrderByCreatedAtDesc(category);
        return new ResponseEntity<>(shows, HttpStatus.OK);
    }

    @GetMapping("/shows/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        logger.debug("Fetching all distinct categories");
        List<String> categories = showService.getAllDistinctCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @GetMapping("/shows/sort/category/asc")
    public ResponseEntity<List<Show>> getShowsSortedByCategoryAsc() {
        logger.debug("Fetching shows sorted by category ascending");
        List<Show> shows = showService.findAllByOrderByCategoryAsc();
        return new ResponseEntity<>(shows, HttpStatus.OK);
    }

    @GetMapping("/shows/sort/category/desc")
    public ResponseEntity<List<Show>> getShowsSortedByCategoryDesc() {
        logger.debug("Fetching shows sorted by category descending");
        List<Show> shows = showService.findAllByOrderByCategoryDesc();
        return new ResponseEntity<>(shows, HttpStatus.OK);
    }
}
