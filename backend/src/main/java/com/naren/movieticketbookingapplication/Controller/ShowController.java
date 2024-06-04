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

    private final ShowService movieService;

    public ShowController(ShowService movieService) {
        this.movieService = movieService;
    }

    @PostMapping("/shows")
    public ResponseEntity<Show> createShow(@RequestBody ShowRegistration registration) {
        log.info("Received request to create movie with registration: {}", registration);
        movieService.addShow(registration);
        log.info("Show created successfully");
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/shows/{id}")
    public ResponseEntity<Show> getShowById(@PathVariable("id") Long movieId) {
        log.info("Received request to retrieve movie with ID: {}", movieId);
        Show movie = movieService.getShowById(movieId);
        log.info("Retrieved movie: {}", movie);
        return new ResponseEntity<>(movie, HttpStatus.OK);
    }

    @GetMapping("/shows")
    public ResponseEntity<List<Show>> movieList() {
        log.info("Received request to retrieve list of shows");
        List<Show> shows = movieService.getShowList();
        log.info("Retrieved list of shows: {}", shows);
        return new ResponseEntity<>(shows, HttpStatus.OK);
    }

    @PutMapping("/shows/{id}")
    public ResponseEntity<Show> updateShow(@RequestBody ShowUpdation update,
                                           @PathVariable("id") Long movieId) {
        log.info("Received request to update movie with ID: {}", movieId);
        movieService.updateShow(update, movieId);
        log.info("Show updated successfully");
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/shows/{id}")
    public void deleteShow(@PathVariable("id") Long movieId) {
        log.info("Received request to delete movie with ID: {}", movieId);
        movieService.removeShow(movieId);
        log.info("Show deleted successfully");
    }

}
