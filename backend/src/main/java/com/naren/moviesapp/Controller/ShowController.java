package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Entity.Show;
import com.naren.moviesapp.Record.ShowRegistration;
import com.naren.moviesapp.Record.ShowUpdation;
import com.naren.moviesapp.Service.ShowService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")

public class ShowController {
    private final ShowService showService;

    public ShowController(ShowService showService) {
        this.showService = showService;
    }

    @PostMapping("/shows")
    public ResponseEntity<Show> createShow(@RequestBody ShowRegistration registration) {
        showService.addShow(registration);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/shows/{id}")
    public ResponseEntity<Show> getShowById(@PathVariable("id") Long showId) {
        Show show = showService.getShowById(showId);
        return new ResponseEntity<>(show, HttpStatus.OK);
    }

    @GetMapping("/shows")
    public ResponseEntity<List<Show>> showList() {
        List<Show> shows = showService.getShowList();
        return new ResponseEntity<>(shows, HttpStatus.OK);
    }

    @PutMapping("/shows/{id}")
    public ResponseEntity<Show> updateShow(@RequestBody ShowUpdation update,
                                           @PathVariable("id") Long showId) {
        showService.updateShow(update, showId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/shows/{id}")
    public void deleteShow(@PathVariable("id") Long showId) {
        showService.removeShow(showId);
    }

    // Category-based endpoints
    @GetMapping("/shows/category/{category}")
    public ResponseEntity<List<Show>> getShowsByCategory(@PathVariable("category") String category) {
        List<Show> shows = showService.getShowsByCategory(category);
        return new ResponseEntity<>(shows, HttpStatus.OK);
    }

    @GetMapping("/shows/category/{category}/rating")
    public ResponseEntity<List<Show>> getShowsByCategoryOrderByRating(@PathVariable("category") String category) {
        List<Show> shows = showService.getShowsByCategoryOrderByRatingDesc(category);
        return new ResponseEntity<>(shows, HttpStatus.OK);
    }

    @GetMapping("/shows/category/{category}/newest")
    public ResponseEntity<List<Show>> getShowsByCategoryOrderByNewest(@PathVariable("category") String category) {
        List<Show> shows = showService.getShowsByCategoryOrderByCreatedAtDesc(category);
        return new ResponseEntity<>(shows, HttpStatus.OK);
    }

    @GetMapping("/shows/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        List<String> categories = showService.getAllDistinctCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @GetMapping("/shows/sort/category/asc")
    public ResponseEntity<List<Show>> getShowsSortedByCategoryAsc() {
        List<Show> shows = showService.findAllByOrderByCategoryAsc();
        return new ResponseEntity<>(shows, HttpStatus.OK);
    }

    @GetMapping("/shows/sort/category/desc")
    public ResponseEntity<List<Show>> getShowsSortedByCategoryDesc() {
        List<Show> shows = showService.findAllByOrderByCategoryDesc();
        return new ResponseEntity<>(shows, HttpStatus.OK);
    }
}
