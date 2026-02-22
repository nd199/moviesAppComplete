package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Movie;
import com.naren.moviesapp.Entity.Show;
import com.naren.moviesapp.Service.CustomerService;
import com.naren.moviesapp.Service.MovieService;
import com.naren.moviesapp.Service.ShowService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class StreamingController {

    private static final Logger logger = LoggerFactory.getLogger(StreamingController.class);

    private final CustomerService customerService;
    private final MovieService movieService;
    private final ShowService showService;

    public StreamingController(CustomerService customerService, MovieService movieService, ShowService showService) {
        this.customerService = customerService;
        this.movieService = movieService;
        this.showService = showService;
    }

    @GetMapping("/video/movies/{id}/play")
    public ResponseEntity<?> playMovie(@PathVariable("id") Long movieId, Authentication authentication) {
        String email = authentication.getName();
        logger.info("Play movie request for movie ID: {} by user: {}", movieId, email);
        
        Customer customer = customerService.getCustomerEntityByEmail(email);

        if (!customerService.hasActiveSubscription(customer)) {
            logger.warn("User {} does not have active subscription", email);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Active subscription required");
        }

        Movie movie = movieService.getMovieById(movieId);
        logger.info("Movie {} ready for streaming by user {}", movieId, email);
        return ResponseEntity.ok(movie);
    }

    @GetMapping("/video/shows/{id}/play")
    public ResponseEntity<?> playShow(@PathVariable("id") Long showId, Authentication authentication) {
        String email = authentication.getName();
        logger.info("Play show request for show ID: {} by user: {}", showId, email);
        
        Customer customer = customerService.getCustomerEntityByEmail(email);

        if (!customerService.hasActiveSubscription(customer)) {
            logger.warn("User {} does not have active subscription", email);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Active subscription required");
        }

        Show show = showService.getShowById(showId);
        logger.info("Show {} ready for streaming by user {}", showId, email);
        return ResponseEntity.ok(show);
    }
}
