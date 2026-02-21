package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Dto.TmdbConvertedDto;
import com.naren.moviesapp.Dto.TmdbMovieDto;
import com.naren.moviesapp.Dto.TmdbSearchResponse;
import com.naren.moviesapp.Dto.TmdbTvShowDto;
import com.naren.moviesapp.Dto.TmdbVideoDto;
import com.naren.moviesapp.Entity.Movie;
import com.naren.moviesapp.Entity.Show;
import com.naren.moviesapp.Service.MovieService;
import com.naren.moviesapp.Service.ShowService;
import com.naren.moviesapp.Service.TmdbService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tmdb")
public class TmdbController {

    private final TmdbService tmdbService;
    private final MovieService movieService;
    private final ShowService showService;

    public TmdbController(TmdbService tmdbService, MovieService movieService, ShowService showService) {
        this.tmdbService = tmdbService;
        this.movieService = movieService;
        this.showService = showService;
    }

    /**
     * Check TMDB configuration status
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        return ResponseEntity.ok(Map.of(
                "configured", tmdbService.isConfigured(),
                "message", tmdbService.isConfigured() ? "TMDB is configured" : "TMDB API key not configured"
        ));
    }

    /**
     * Search movies from TMDB
     */
    @GetMapping("/search/movies")
    public ResponseEntity<?> searchMovies(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page) {
        
        if (!tmdbService.isConfigured()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "TMDB API key not configured"
            ));
        }
        
        if (query == null || query.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Query parameter is required"
            ));
        }
        
        var response = tmdbService.searchMovies(query, page);
        
        if (response.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "results", List.of(),
                    "page", page,
                    "totalPages", 0,
                    "totalResults", 0
            ));
        }
        
        TmdbSearchResponse<TmdbMovieDto> searchResponse = response.get();
        List<TmdbConvertedDto> results = new ArrayList<>();
        
        if (searchResponse.getResults() != null) {
            for (TmdbMovieDto movie : searchResponse.getResults()) {
                results.add(TmdbConvertedDto.fromMovie(movie, tmdbService));
            }
        }
        
        return ResponseEntity.ok(Map.of(
                "results", results,
                "page", searchResponse.getPage() != null ? searchResponse.getPage() : page,
                "totalPages", searchResponse.getTotalPages() != null ? searchResponse.getTotalPages() : 0,
                "totalResults", searchResponse.getTotalResults() != null ? searchResponse.getTotalResults() : 0
        ));
    }

    /**
     * Search TV shows from TMDB
     */
    @GetMapping("/search/shows")
    public ResponseEntity<?> searchTvShows(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page) {
        
        if (!tmdbService.isConfigured()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "TMDB API key not configured"
            ));
        }
        
        if (query == null || query.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Query parameter is required"
            ));
        }
        
        var response = tmdbService.searchTvShows(query, page);
        
        if (response.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "results", List.of(),
                    "page", page,
                    "totalPages", 0,
                    "totalResults", 0
            ));
        }
        
        TmdbSearchResponse<TmdbTvShowDto> searchResponse = response.get();
        List<TmdbConvertedDto> results = new ArrayList<>();
        
        if (searchResponse.getResults() != null) {
            for (TmdbTvShowDto tvShow : searchResponse.getResults()) {
                results.add(TmdbConvertedDto.fromTvShow(tvShow, tmdbService));
            }
        }
        
        return ResponseEntity.ok(Map.of(
                "results", results,
                "page", searchResponse.getPage() != null ? searchResponse.getPage() : page,
                "totalPages", searchResponse.getTotalPages() != null ? searchResponse.getTotalPages() : 0,
                "totalResults", searchResponse.getTotalResults() != null ? searchResponse.getTotalResults() : 0
        ));
    }

    /**
     * Get trending movies from TMDB
     */
    @GetMapping("/trending/movies")
    public ResponseEntity<?> getTrendingMovies(
            @RequestParam(defaultValue = "1") int page) {
        
        if (!tmdbService.isConfigured()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "TMDB API key not configured"
            ));
        }
        
        var response = tmdbService.getTrendingMovies(page);
        
        if (response.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "results", List.of(),
                    "page", page,
                    "totalPages", 0,
                    "totalResults", 0
            ));
        }
        
        TmdbSearchResponse<TmdbMovieDto> searchResponse = response.get();
        List<TmdbConvertedDto> results = new ArrayList<>();
        
        if (searchResponse.getResults() != null) {
            for (TmdbMovieDto movie : searchResponse.getResults()) {
                results.add(TmdbConvertedDto.fromMovie(movie, tmdbService));
            }
        }
        
        return ResponseEntity.ok(Map.of(
                "results", results,
                "page", searchResponse.getPage() != null ? searchResponse.getPage() : page,
                "totalPages", searchResponse.getTotalPages() != null ? searchResponse.getTotalPages() : 0,
                "totalResults", searchResponse.getTotalResults() != null ? searchResponse.getTotalResults() : 0
        ));
    }

    /**
     * Get trending TV shows from TMDB
     */
    @GetMapping("/trending/shows")
    public ResponseEntity<?> getTrendingTvShows(
            @RequestParam(defaultValue = "1") int page) {
        
        if (!tmdbService.isConfigured()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "TMDB API key not configured"
            ));
        }
        
        var response = tmdbService.getTrendingTvShows(page);
        
        if (response.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "results", List.of(),
                    "page", page,
                    "totalPages", 0,
                    "totalResults", 0
            ));
        }
        
        TmdbSearchResponse<TmdbTvShowDto> searchResponse = response.get();
        List<TmdbConvertedDto> results = new ArrayList<>();
        
        if (searchResponse.getResults() != null) {
            for (TmdbTvShowDto tvShow : searchResponse.getResults()) {
                results.add(TmdbConvertedDto.fromTvShow(tvShow, tmdbService));
            }
        }
        
        return ResponseEntity.ok(Map.of(
                "results", results,
                "page", searchResponse.getPage() != null ? searchResponse.getPage() : page,
                "totalPages", searchResponse.getTotalPages() != null ? searchResponse.getTotalPages() : 0,
                "totalResults", searchResponse.getTotalResults() != null ? searchResponse.getTotalResults() : 0
        ));
    }

    /**
     * Discover movies from TMDB with optional filters
     */
    @GetMapping("/discover/movies")
    public ResponseEntity<?> discoverMovies(
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) Integer genreId,
            @RequestParam(required = false) Integer year,
            @RequestParam(defaultValue = "1") int page) {
        
        if (!tmdbService.isConfigured()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "TMDB API key not configured"
            ));
        }
        
        var response = tmdbService.discoverMovies(sortBy, genreId, year, page);
        
        if (response.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "results", List.of(),
                    "page", page,
                    "totalPages", 0,
                    "totalResults", 0
            ));
        }
        
        TmdbSearchResponse<TmdbMovieDto> searchResponse = response.get();
        List<TmdbConvertedDto> results = new ArrayList<>();
        
        if (searchResponse.getResults() != null) {
            for (TmdbMovieDto movie : searchResponse.getResults()) {
                results.add(TmdbConvertedDto.fromMovie(movie, tmdbService));
            }
        }
        
        return ResponseEntity.ok(Map.of(
                "results", results,
                "page", searchResponse.getPage() != null ? searchResponse.getPage() : page,
                "totalPages", searchResponse.getTotalPages() != null ? searchResponse.getTotalPages() : 0,
                "totalResults", searchResponse.getTotalResults() != null ? searchResponse.getTotalResults() : 0
        ));
    }

    /**
     * Discover TV shows from TMDB with optional filters
     */
    @GetMapping("/discover/shows")
    public ResponseEntity<?> discoverTvShows(
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) Integer genreId,
            @RequestParam(required = false) Integer year,
            @RequestParam(defaultValue = "1") int page) {
        
        if (!tmdbService.isConfigured()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "TMDB API key not configured"
            ));
        }
        
        var response = tmdbService.discoverTvShows(sortBy, genreId, year, page);
        
        if (response.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "results", List.of(),
                    "page", page,
                    "totalPages", 0,
                    "totalResults", 0
            ));
        }
        
        TmdbSearchResponse<TmdbTvShowDto> searchResponse = response.get();
        List<TmdbConvertedDto> results = new ArrayList<>();
        
        if (searchResponse.getResults() != null) {
            for (TmdbTvShowDto tvShow : searchResponse.getResults()) {
                results.add(TmdbConvertedDto.fromTvShow(tvShow, tmdbService));
            }
        }
        
        return ResponseEntity.ok(Map.of(
                "results", results,
                "page", searchResponse.getPage() != null ? searchResponse.getPage() : page,
                "totalPages", searchResponse.getTotalPages() != null ? searchResponse.getTotalPages() : 0,
                "totalResults", searchResponse.getTotalResults() != null ? searchResponse.getTotalResults() : 0
        ));
    }

    /**
     * Get movie details from TMDB by ID
     */
    @GetMapping("/movie/{tmdbId}")
    public ResponseEntity<?> getMovieDetails(@PathVariable Long tmdbId) {
        
        if (!tmdbService.isConfigured()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "TMDB API key not configured"
            ));
        }
        
        var movieOpt = tmdbService.getMovieDetails(tmdbId);
        
        if (movieOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        TmdbConvertedDto result = TmdbConvertedDto.fromMovie(movieOpt.get(), tmdbService);
        return ResponseEntity.ok(result);
    }

    /**
     * Get TV show details from TMDB by ID
     */
    @GetMapping("/tv/{tmdbId}")
    public ResponseEntity<?> getTvShowDetails(@PathVariable Long tmdbId) {
        
        if (!tmdbService.isConfigured()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "TMDB API key not configured"
            ));
        }
        
        var tvShowOpt = tmdbService.getTvShowDetails(tmdbId);
        
        if (tvShowOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        TmdbConvertedDto result = TmdbConvertedDto.fromTvShow(tvShowOpt.get(), tmdbService);
        return ResponseEntity.ok(result);
    }

    /**
     * Get featured content for home page from TMDB
     * Returns trending movies and TV shows with category set to "Featured"
     */
    @GetMapping("/featured")
    public ResponseEntity<?> getFeaturedContent(
            @RequestParam(defaultValue = "1") int page) {
        
        if (!tmdbService.isConfigured()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "TMDB API key not configured"
            ));
        }
        
        List<TmdbConvertedDto> allFeatured = new ArrayList<>();
        
        // Get trending movies
        var moviesResponse = tmdbService.getTrendingMovies(page);
        if (moviesResponse.isPresent() && moviesResponse.get().getResults() != null) {
            for (TmdbMovieDto movie : moviesResponse.get().getResults()) {
                TmdbConvertedDto dto = TmdbConvertedDto.fromMovie(movie, tmdbService);
                if (dto != null) {
                    dto.setCategory("Featured");
                    allFeatured.add(dto);
                }
            }
        }
        
        // Get trending TV shows
        var showsResponse = tmdbService.getTrendingTvShows(page);
        if (showsResponse.isPresent() && showsResponse.get().getResults() != null) {
            for (TmdbTvShowDto tvShow : showsResponse.get().getResults()) {
                TmdbConvertedDto dto = TmdbConvertedDto.fromTvShow(tvShow, tmdbService);
                if (dto != null) {
                    dto.setCategory("Featured");
                    allFeatured.add(dto);
                }
            }
        }
        
        return ResponseEntity.ok(Map.of(
                "results", allFeatured,
                "page", page,
                "totalPages", 1,
                "totalResults", allFeatured.size()
        ));
    }

    /**
     * Sync movie from TMDB to local database
     */
    @PostMapping("/sync/movie/{tmdbId}")
    public ResponseEntity<?> syncMovie(@PathVariable Long tmdbId) {
        
        if (!tmdbService.isConfigured()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "TMDB API key not configured"
            ));
        }
        
        var movieOpt = tmdbService.getMovieDetails(tmdbId);
        
        if (movieOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        TmdbMovieDto tmdbMovie = movieOpt.get();
        
        // Create Movie entity from TMDB data
        Movie movie = new Movie();
        movie.setTmdbId(tmdbMovie.getTmdbId());
        movie.setName(tmdbMovie.getTitle());
        movie.setRating(tmdbMovie.getVoteAverage() != null ? tmdbMovie.getVoteAverage() : 0.0);
        movie.setDescription(tmdbMovie.getOverview() != null ? tmdbMovie.getOverview() : "");
        movie.setPoster(tmdbService.getFullPosterPath(tmdbMovie.getPosterPath()));
        movie.setAgeRating(tmdbMovie.getAdult() != null && tmdbMovie.getAdult() ? "R" : "PG-13");
        
        // Parse year from release date
        if (tmdbMovie.getReleaseDate() != null && tmdbMovie.getReleaseDate().length() >= 4) {
            try {
                movie.setYear(Integer.parseInt(tmdbMovie.getReleaseDate().substring(0, 4)));
            } catch (NumberFormatException e) {
                movie.setYear(2024);
            }
        } else {
            movie.setYear(2024);
        }
        
        // Parse runtime
        if (tmdbMovie.getRuntime() != null) {
            int hours = tmdbMovie.getRuntime() / 60;
            int minutes = tmdbMovie.getRuntime() % 60;
            if (hours > 0) {
                movie.setRuntime(hours + "h " + minutes + "m");
            } else {
                movie.setRuntime(minutes + "m");
            }
        } else {
            movie.setRuntime("0m");
        }
        
        // Parse genres
        if (tmdbMovie.getGenres() != null && !tmdbMovie.getGenres().isEmpty()) {
            movie.setGenre(String.join(", ", tmdbMovie.getGenres().stream()
                    .map(TmdbMovieDto.TmdbGenreDto::getName)
                    .toList()));
        } else {
            movie.setGenre("Unknown");
        }
        
        movie.setType("movies");
        movie.setCategory("General");
        
        Movie savedMovie = movieService.addMovie(movie);
        
        return ResponseEntity.ok(Map.of(
                "message", "Movie synced successfully",
                "movie", savedMovie
        ));
    }

    /**
     * Sync TV show from TMDB to local database
     */
    @PostMapping("/sync/tv/{tmdbId}")
    public ResponseEntity<?> syncTvShow(@PathVariable Long tmdbId) {
        
        if (!tmdbService.isConfigured()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "TMDB API key not configured"
            ));
        }
        
        var tvShowOpt = tmdbService.getTvShowDetails(tmdbId);
        
        if (tvShowOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        TmdbTvShowDto tmdbTvShow = tvShowOpt.get();
        
        // Create Show entity from TMDB data
        Show show = new Show();
        show.setTmdbId(tmdbTvShow.getTmdbId());
        show.setName(tmdbTvShow.getName());
        show.setRating(tmdbTvShow.getVoteAverage() != null ? tmdbTvShow.getVoteAverage() : 0.0);
        show.setDescription(tmdbTvShow.getOverview() != null ? tmdbTvShow.getOverview() : "");
        show.setPoster(tmdbService.getFullPosterPath(tmdbTvShow.getPosterPath()));
        show.setAgeRating("TV-14");
        
        // Parse year from first air date
        if (tmdbTvShow.getFirstAirDate() != null && tmdbTvShow.getFirstAirDate().length() >= 4) {
            try {
                show.setYear(Integer.parseInt(tmdbTvShow.getFirstAirDate().substring(0, 4)));
            } catch (NumberFormatException e) {
                show.setYear(2024);
            }
        } else {
            show.setYear(2024);
        }
        
        // Parse runtime
        if (tmdbTvShow.getEpisodeRunTime() != null && !tmdbTvShow.getEpisodeRunTime().isEmpty()) {
            Integer runtime = tmdbTvShow.getEpisodeRunTime().get(0);
            if (runtime != null) {
                int hours = runtime / 60;
                int minutes = runtime % 60;
                if (hours > 0) {
                    show.setRuntime(hours + "h " + minutes + "m");
                } else {
                    show.setRuntime(minutes + "m");
                }
            } else {
                show.setRuntime("0m");
            }
        } else {
            show.setRuntime("0m");
        }
        
        // Parse genres
        if (tmdbTvShow.getGenres() != null && !tmdbTvShow.getGenres().isEmpty()) {
            show.setGenre(String.join(", ", tmdbTvShow.getGenres().stream()
                    .map(TmdbTvShowDto.TmdbGenreDto::getName)
                    .toList()));
        } else {
            show.setGenre("Unknown");
        }
        
        show.setType("shows");
        show.setCategory("General");
        
        Show savedShow = showService.addShow(show);
        
        return ResponseEntity.ok(Map.of(
                "message", "TV Show synced successfully",
                "show", savedShow
        ));
    }

    /**
     * Get videos (trailers, teasers) for a movie by TMDB ID
     */
    @GetMapping("/movie/{tmdbId}/videos")
    public ResponseEntity<?> getMovieVideos(@PathVariable Long tmdbId) {
        
        if (!tmdbService.isConfigured()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "TMDB API key not configured"
            ));
        }
        
        var videosOpt = tmdbService.getMovieVideos(tmdbId);
        
        if (videosOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<TmdbVideoDto> videos = videosOpt.get();
        
        return ResponseEntity.ok(Map.of(
                "results", videos,
                "totalResults", videos.size()
        ));
    }

    /**
     * Get videos (trailers, teasers) for a TV show by TMDB ID
     */
    @GetMapping("/show/{tmdbId}/videos")
    public ResponseEntity<?> getTvShowVideos(@PathVariable Long tmdbId) {
        
        if (!tmdbService.isConfigured()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "TMDB API key not configured"
            ));
        }
        
        var videosOpt = tmdbService.getTvShowVideos(tmdbId);
        
        if (videosOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<TmdbVideoDto> videos = videosOpt.get();
        
        return ResponseEntity.ok(Map.of(
                "results", videos,
                "totalResults", videos.size()
        ));
    }
}
