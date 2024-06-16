package com.naren.movieticketbookingapplication.Controller;

import com.naren.movieticketbookingapplication.Entity.Show;
import com.naren.movieticketbookingapplication.Record.ShowRegistration;
import com.naren.movieticketbookingapplication.Record.ShowUpdation;
import com.naren.movieticketbookingapplication.Service.ShowService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Slf4j
public class ShowController {

    private final ShowService showService;

    public ShowController(ShowService showService) {
        this.showService = showService;
    }

    @PostMapping("/shows")
    public ResponseEntity<Show> createShow(@RequestBody ShowRegistration registration) {
        log.info("Received request to create show with registration: {}", registration);
        showService.addShow(registration);
        log.info("Show created successfully");
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/shows/{id}")
    public ResponseEntity<Show> getShowById(@PathVariable("id") Long showId) {
        log.info("Received request to retrieve show with ID: {}", showId);
        Show show = showService.getShowById(showId);
        log.info("Retrieved show: {}", show);
        return new ResponseEntity<>(show, HttpStatus.OK);
    }

    @GetMapping("/shows")
    public ResponseEntity<List<Show>> showList() {
        log.info("Received request to retrieve list of shows");
        List<Show> shows = showService.getShowList();
        log.info("Retrieved list of shows: {}", shows);
        return new ResponseEntity<>(shows, HttpStatus.OK);
    }

    @PutMapping("/shows/{id}")
    public ResponseEntity<Show> updateShow(@RequestBody ShowUpdation update,
                                           @PathVariable("id") Long showId) {
        log.info("Received request to update show with ID: {}", showId);
        showService.updateShow(update, showId);
        log.info("Show updated successfully");
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/shows/{id}")
    public void deleteShow(@PathVariable("id") Long showId) {
        log.info("Received request to delete show with ID: {}", showId);
        showService.removeShow(showId);
        log.info("Show deleted successfully");
    }
}
