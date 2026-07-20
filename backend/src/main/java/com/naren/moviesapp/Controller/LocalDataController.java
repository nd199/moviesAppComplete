package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Entity.Movie;
import com.naren.moviesapp.Entity.Show;
import com.naren.moviesapp.Service.MovieService;
import com.naren.moviesapp.Service.ShowService;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/local")
@Profile("dev")
public class LocalDataController {

    private final MovieService movieService;
    private final ShowService showService;

    public LocalDataController(MovieService movieService, ShowService showService) {
        this.movieService = movieService;
        this.showService = showService;
    }

    private Map<String, Object> wrap(List<?> items) {
        return Map.of("results", items, "page", 1, "totalPages", 1, "totalResults", items.size());
    }

    @GetMapping("/trending/movies")
    public ResponseEntity<?> trendingMovies() {
        return ResponseEntity.ok(wrap(movieService.getMovieList()));
    }

    @GetMapping("/trending/shows")
    public ResponseEntity<?> trendingShows() {
        return ResponseEntity.ok(wrap(showService.getShowList()));
    }

    @GetMapping("/popular/movies")
    public ResponseEntity<?> popularMovies() {
        return ResponseEntity.ok(wrap(movieService.getMovieList()));
    }

    @GetMapping("/popular/shows")
    public ResponseEntity<?> popularShows() {
        return ResponseEntity.ok(wrap(showService.getShowList()));
    }

    @GetMapping("/top-rated/movies")
    public ResponseEntity<?> topRatedMovies() {
        return ResponseEntity.ok(wrap(movieService.getMovieList()));
    }

    @GetMapping("/top-rated/shows")
    public ResponseEntity<?> topRatedShows() {
        return ResponseEntity.ok(wrap(showService.getShowList()));
    }

    @GetMapping("/now-playing/movies")
    public ResponseEntity<?> nowPlayingMovies() {
        return ResponseEntity.ok(wrap(movieService.getMovieList()));
    }

    @GetMapping("/upcoming/movies")
    public ResponseEntity<?> upcomingMovies() {
        return ResponseEntity.ok(wrap(movieService.getMovieList()));
    }

    @GetMapping("/discover/movies")
    public ResponseEntity<?> discoverMovies() {
        return ResponseEntity.ok(wrap(movieService.getMovieList()));
    }

    @GetMapping("/discover/shows")
    public ResponseEntity<?> discoverShows() {
        return ResponseEntity.ok(wrap(showService.getShowList()));
    }

    @GetMapping("/south-indian/movies")
    public ResponseEntity<?> southIndianMovies() {
        return ResponseEntity.ok(wrap(movieService.getMovieList()));
    }

    @GetMapping("/search/movies")
    public ResponseEntity<?> searchMovies(@RequestParam String query) {
        String q = query.toLowerCase();
        List<Movie> filtered = movieService.getMovieList().stream()
                .filter(m -> m.getName().toLowerCase().contains(q))
                .toList();
        return ResponseEntity.ok(wrap(filtered));
    }

    @GetMapping("/search/shows")
    public ResponseEntity<?> searchShows(@RequestParam String query) {
        String q = query.toLowerCase();
        List<Show> filtered = showService.getShowList().stream()
                .filter(s -> s.getName().toLowerCase().contains(q))
                .toList();
        return ResponseEntity.ok(wrap(filtered));
    }

    @GetMapping("/featured")
    public ResponseEntity<?> featured() {
        List<Movie> movies = movieService.getMovieList().stream().limit(5).toList();
        return ResponseEntity.ok(wrap(movies));
    }

    @GetMapping("/movie/{id}")
    public ResponseEntity<?> movieDetail(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(movieService.getMovieById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/tv/{id}")
    public ResponseEntity<?> showDetail(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(showService.getShowById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/movie/{id}/videos")
    public ResponseEntity<?> movieVideos(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("results", List.of(), "totalResults", 0));
    }

    @GetMapping("/show/{id}/videos")
    public ResponseEntity<?> showVideos(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("results", List.of(), "totalResults", 0));
    }

    @GetMapping("/movie/{id}/cast")
    public ResponseEntity<?> movieCast(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("cast", List.of()));
    }

    @GetMapping("/tv/{id}/cast")
    public ResponseEntity<?> showCast(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("cast", List.of()));
    }

    @GetMapping("/movie/{id}/similar")
    public ResponseEntity<?> similarMovies(@PathVariable Long id) {
        return ResponseEntity.ok(wrap(movieService.getMovieList().stream()
                .filter(m -> !m.getId().equals(id)).limit(6).toList()));
    }

    @GetMapping("/tv/{id}/similar")
    public ResponseEntity<?> similarShows(@PathVariable Long id) {
        return ResponseEntity.ok(wrap(showService.getShowList().stream()
                .filter(s -> !s.getShow_id().equals(id)).limit(6).toList()));
    }

    @GetMapping("/movie/{id}/recommended")
    public ResponseEntity<?> recommendedMovies(@PathVariable Long id) {
        return ResponseEntity.ok(wrap(movieService.getMovieList().stream()
                .filter(m -> !m.getId().equals(id)).limit(6).toList()));
    }

    @GetMapping("/tv/{id}/recommended")
    public ResponseEntity<?> recommendedShows(@PathVariable Long id) {
        return ResponseEntity.ok(wrap(showService.getShowList().stream()
                .filter(s -> !s.getShow_id().equals(id)).limit(6).toList()));
    }

    @GetMapping("/genres/movies")
    public ResponseEntity<?> movieGenres() {
        return ResponseEntity.ok(Map.of("genres", List.of()));
    }

    @GetMapping("/genres/tv")
    public ResponseEntity<?> tvGenres() {
        return ResponseEntity.ok(Map.of("genres", List.of()));
    }
}
