package com.naren.moviesapp.Config;

import com.naren.moviesapp.Entity.Movie;
import com.naren.moviesapp.Entity.Show;
import com.naren.moviesapp.Repo.MovieRepository;
import com.naren.moviesapp.Repo.ShowRepository;
import com.naren.moviesapp.Service.TmdbService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.transaction.annotation.Transactional;

@Configuration
@Profile({"prod", "production"})
@RequiredArgsConstructor
@Slf4j
public class TmdbDataSeeder {

    private static final int MOVIES_TO_IMPORT = 20;
    private static final int SHOWS_TO_IMPORT = 20;
    private final TmdbService tmdbService;
    private final MovieRepository movieRepository;
    private final ShowRepository showRepository;

    @Bean
    @Transactional
    public CommandLineRunner seedTmdbData() {
        return args -> {
            // Check if TMDB is configured
            if (!tmdbService.isConfigured()) {
                log.warn("TMDB API key not configured. Skipping TMDB data seeding.");
                return;
            }

            // Only seed if database is empty
            long movieCount = movieRepository.count();
            long showCount = showRepository.count();

            if (movieCount > 0 && showCount > 0) {
                log.info("Database already contains {} movies and {} shows. Skipping TMDB seeding.", movieCount, showCount);
                return;
            }

            log.info("Starting TMDB data seeding...");

            // Import trending movies
            if (movieCount == 0) {
                importTrendingMovies();
            }

            // Import trending TV shows
            if (showCount == 0) {
                importTrendingShows();
            }

            log.info("TMDB data seeding completed.");
        };
    }

    private void importTrendingMovies() {
        log.info("Importing trending movies from TMDB...");

        var response = tmdbService.getTrendingMovies(1);
        if (response.isEmpty()) {
            log.warn("Failed to fetch trending movies from TMDB");
            return;
        }

        var movies = response.get().getResults();
        if (movies == null || movies.isEmpty()) {
            log.warn("No trending movies found from TMDB");
            return;
        }

        int imported = 0;
        for (var tmdbMovie : movies) {
            if (imported >= MOVIES_TO_IMPORT) break;

            // Skip if movie already exists
            if (movieRepository.existsByName(tmdbMovie.getTitle())) {
                log.debug("Movie '{}' already exists, skipping", tmdbMovie.getTitle());
                continue;
            }

            // Fetch full movie details to get runtime and genres
            var detailsOpt = tmdbService.getMovieDetails(tmdbMovie.getTmdbId());
            if (detailsOpt.isEmpty()) {
                log.warn("Failed to fetch details for movie: {}", tmdbMovie.getTitle());
                continue;
            }
            var details = detailsOpt.get();

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

            // Parse runtime from details
            if (details.getRuntime() != null) {
                int hours = details.getRuntime() / 60;
                int minutes = details.getRuntime() % 60;
                if (hours > 0) {
                    movie.setRuntime(hours + "h " + minutes + "m");
                } else {
                    movie.setRuntime(minutes + "m");
                }
            } else {
                movie.setRuntime("0m");
            }

            // Parse genres from details
            if (details.getGenres() != null && !details.getGenres().isEmpty()) {
                movie.setGenre(String.join(", ", details.getGenres().stream()
                        .map(genre -> genre.getName())
                        .toList()));
            } else {
                movie.setGenre("Unknown");
            }

            movie.setType("movies");
            movie.setCategory("Trending");

            movieRepository.save(movie);
            imported++;
            log.debug("Imported movie: {}", movie.getName());
        }

        log.info("Successfully imported {} trending movies from TMDB", imported);
    }

    private void importTrendingShows() {
        log.info("Importing trending TV shows from TMDB...");

        var response = tmdbService.getTrendingTvShows(1);
        if (response.isEmpty()) {
            log.warn("Failed to fetch trending TV shows from TMDB");
            return;
        }

        var shows = response.get().getResults();
        if (shows == null || shows.isEmpty()) {
            log.warn("No trending TV shows found from TMDB");
            return;
        }

        int imported = 0;
        for (var tmdbShow : shows) {
            if (imported >= SHOWS_TO_IMPORT) break;

            // Skip if show already exists
            if (showRepository.existsByName(tmdbShow.getName())) {
                log.debug("Show '{}' already exists, skipping", tmdbShow.getName());
                continue;
            }

            // Fetch full show details to get runtime and genres
            var detailsOpt = tmdbService.getTvShowDetails(tmdbShow.getTmdbId());
            if (detailsOpt.isEmpty()) {
                log.warn("Failed to fetch details for show: {}", tmdbShow.getName());
                continue;
            }
            var details = detailsOpt.get();

            Show show = new Show();
            show.setTmdbId(tmdbShow.getTmdbId());
            show.setName(tmdbShow.getName());
            show.setRating(tmdbShow.getVoteAverage() != null ? tmdbShow.getVoteAverage() : 0.0);
            show.setDescription(tmdbShow.getOverview() != null ? tmdbShow.getOverview() : "");
            show.setPoster(tmdbService.getFullPosterPath(tmdbShow.getPosterPath()));
            show.setAgeRating("TV-14");

            // Parse year from first air date
            if (tmdbShow.getFirstAirDate() != null && tmdbShow.getFirstAirDate().length() >= 4) {
                try {
                    show.setYear(Integer.parseInt(tmdbShow.getFirstAirDate().substring(0, 4)));
                } catch (NumberFormatException e) {
                    show.setYear(2024);
                }
            } else {
                show.setYear(2024);
            }

            // Parse runtime from details
            if (details.getEpisodeRunTime() != null && !details.getEpisodeRunTime().isEmpty()) {
                Integer runtime = details.getEpisodeRunTime().get(0);
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

            // Parse genres from details
            if (details.getGenres() != null && !details.getGenres().isEmpty()) {
                show.setGenre(String.join(", ", details.getGenres().stream()
                        .map(genre -> genre.getName())
                        .toList()));
            } else {
                show.setGenre("Unknown");
            }

            show.setType("shows");
            show.setCategory("Trending");

            showRepository.save(show);
            imported++;
            log.debug("Imported show: {}", show.getName());
        }

        log.info("Successfully imported {} trending TV shows from TMDB", imported);
    }
}
