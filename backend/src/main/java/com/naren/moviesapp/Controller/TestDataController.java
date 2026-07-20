package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Repo.MovieRepository;
import com.naren.moviesapp.Repo.ShowRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/test-data")
@Profile("dev")
public class TestDataController {

    private static final Logger logger = LoggerFactory.getLogger(TestDataController.class);

    private final MovieRepository movieRepository;
    private final ShowRepository showRepository;
    private final CustomerRepository customerRepository;

    public TestDataController(MovieRepository movieRepository,
                              ShowRepository showRepository,
                              CustomerRepository customerRepository) {
        this.movieRepository = movieRepository;
        this.showRepository = showRepository;
        this.customerRepository = customerRepository;
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getDataStatus() {
        logger.debug("Fetching test data status");
        Map<String, Object> result = new HashMap<>();

        long movieCount = movieRepository.count();
        long showCount = showRepository.count();
        long customerCount = customerRepository.count();

        result.put("movies", movieCount);
        result.put("shows", showCount);
        result.put("customers", customerCount);
        result.put("status", movieCount > 0 && showCount > 0 ? "healthy" : "low_data");

        return ResponseEntity.ok(result);
    }

    @PostMapping("/reset")
    @PreAuthorize("hasAuthority('SYSTEM_CONFIG')")
    public ResponseEntity<Map<String, Object>> resetTestData() {
        logger.info("Reset test data request received");
        Map<String, Object> result = new HashMap<>();

        long movieCount = movieRepository.count();
        long showCount = showRepository.count();
        long customerCount = customerRepository.count();

        result.put("message", "Test data status retrieved");
        result.put("currentMovies", movieCount);
        result.put("currentShows", showCount);
        result.put("currentCustomers", customerCount);
        result.put("note", "To fully reset data, restart the application with an empty database or use dev profile");

        return ResponseEntity.ok(result);
    }

    @PostMapping("/seed")
    @PreAuthorize("hasAuthority('SYSTEM_CONFIG')")
    public ResponseEntity<Map<String, Object>> seedAdditionalData() {
        logger.info("Seed additional data request received");
        Map<String, Object> result = new HashMap<>();
        result.put("message", "Additional seeding should be done via DevDataSeeder on application startup");
        result.put("recommendation", "Restart application with 'dev' profile to trigger DevDataSeeder");
        return ResponseEntity.ok(result);
    }
}
