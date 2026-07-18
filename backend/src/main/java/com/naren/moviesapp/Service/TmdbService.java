  package com.naren.moviesapp.Service;

import com.naren.moviesapp.Dto.TmdbCastMemberDto;
import com.naren.moviesapp.Dto.TmdbConvertedDto;
import com.naren.moviesapp.Dto.TmdbMovieDto;
import com.naren.moviesapp.Dto.TmdbSearchResponse;
import com.naren.moviesapp.Dto.TmdbTvShowDto;
import com.naren.moviesapp.Dto.TmdbVideoDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import reactor.netty.http.client.HttpClient;
import reactor.netty.resources.ConnectionProvider;

@Service
@SuppressWarnings("unchecked")
public class TmdbService {

    private static final Logger logger = LoggerFactory.getLogger(TmdbService.class);

    private final WebClient webClient;
    private final String apiKey;
    private final String baseUrl;
    private final String imageBaseUrl;

    // Cache for trailers to avoid repeated API calls
    private final Map<Long, List<TmdbVideoDto>> movieTrailerCache = new ConcurrentHashMap<>();
    private final Map<Long, List<TmdbVideoDto>> tvShowTrailerCache = new ConcurrentHashMap<>();
    
    // Cache timestamps for TTL-based invalidation
    private final Map<Long, Long> movieTrailerCacheTimestamps = new ConcurrentHashMap<>();
    private final Map<Long, Long> tvShowTrailerCacheTimestamps = new ConcurrentHashMap<>();
    
    // Cache TTL: 24 hours in milliseconds
    private static final long CACHE_TTL_MS = 24 * 60 * 60 * 1000;

    public TmdbService(@Value("${app.tmdb.api-key}") String apiKey, @Value("${app.tmdb.base-url}") String baseUrl, @Value("${app.tmdb.image-base-url}") String imageBaseUrl) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.imageBaseUrl = imageBaseUrl;
        
        // Create connection provider with timeouts
        ConnectionProvider connectionProvider = ConnectionProvider.builder("tmdb-pool")
                .maxConnections(50)
                .maxIdleTime(Duration.ofSeconds(30))
                .maxLifeTime(Duration.ofMinutes(5))
                .pendingAcquireTimeout(Duration.ofSeconds(30))
                .build();
        
        // Create HTTP client with timeouts and TLS configuration
        HttpClient httpClient = HttpClient.create(connectionProvider)
                .responseTimeout(Duration.ofSeconds(30))
                .secure();
        
        // TMDB API uses Bearer token (Read Access Token v4) in Authorization header
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
    }

    public Optional<TmdbSearchResponse<TmdbMovieDto>> searchMovies(String query, int page) {
        if (apiKey == null || apiKey.isBlank()) {
            logger.warn("TMDB API key not configured");
            return Optional.empty();
        }

        try {
            Map<String, Object> response = webClient.get().uri(uriBuilder -> uriBuilder.path("/search/movie").queryParam("query", query).queryParam("page", page).queryParam("api_key", apiKey).build()).retrieve().bodyToMono(Map.class).block();

            return Optional.of(convertToMovieSearchResponse(response));
        } catch (WebClientResponseException e) {
            logger.error("Error searching movies: {}", e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<TmdbSearchResponse<TmdbTvShowDto>> searchTvShows(String query, int page) {
        if (apiKey == null || apiKey.isBlank()) {
            logger.warn("TMDB API key not configured");
            return Optional.empty();
        }

        try {
            Map<String, Object> response = webClient.get().uri(uriBuilder -> uriBuilder.path("/search/tv").queryParam("query", query).queryParam("page", page).queryParam("api_key", apiKey).build()).retrieve().bodyToMono(Map.class).block();

            return Optional.of(convertToTvShowSearchResponse(response));
        } catch (WebClientResponseException e) {
            logger.error("Error searching TV shows: {}", e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<TmdbMovieDto> getMovieDetails(Long tmdbId) {
        if (apiKey == null || apiKey.isBlank()) {
            logger.warn("TMDB API key not configured");
            return Optional.empty();
        }

        try {
            Map<String, Object> response = webClient.get().uri(uriBuilder -> uriBuilder.path("/movie/" + tmdbId).queryParam("api_key", apiKey).build()).retrieve().bodyToMono(Map.class).block();

            return Optional.of(convertToMovieDto(response));
        } catch (WebClientResponseException e) {
            logger.error("Error getting movie details: {}", e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<TmdbTvShowDto> getTvShowDetails(Long tmdbId) {
        if (apiKey == null || apiKey.isBlank()) {
            logger.warn("TMDB API key not configured");
            return Optional.empty();
        }

        try {
            Map<String, Object> response = webClient.get().uri(uriBuilder -> uriBuilder.path("/tv/" + tmdbId).queryParam("api_key", apiKey).build()).retrieve().bodyToMono(Map.class).block();

            return Optional.of(convertToTvShowDto(response));
        } catch (WebClientResponseException e) {
            logger.error("Error getting TV show details: {}", e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<TmdbSearchResponse<TmdbMovieDto>> getTrendingMovies(int page) {
        if (apiKey == null || apiKey.isBlank()) {
            logger.warn("TMDB API key not configured");
            return Optional.empty();
        }

        try {
            Map<String, Object> response = webClient.get().uri(uriBuilder -> uriBuilder.path("/trending/movie/day").queryParam("page", page).queryParam("api_key", apiKey).build()).retrieve().bodyToMono(Map.class).block();

            return Optional.of(convertToMovieSearchResponse(response));
        } catch (WebClientResponseException e) {
            logger.error("Error getting trending movies: {}", e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<TmdbSearchResponse<TmdbMovieDto>> getTopRatedMovies(int page) {
        if (apiKey == null || apiKey.isBlank()) {
            logger.warn("TMDB API key not configured");
            return Optional.empty();
        }

        try {
            Map<String, Object> response = webClient.get().uri(uriBuilder -> uriBuilder.path("/movie/top_rated").queryParam("page", page).queryParam("api_key", apiKey).build()).retrieve().bodyToMono(Map.class).block();

            return Optional.of(convertToMovieSearchResponse(response));
        } catch (WebClientResponseException e) {
            logger.error("Error getting top rated movies: {}", e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<TmdbSearchResponse<TmdbMovieDto>> getNowPlayingMovies(int page) {
        if (apiKey == null || apiKey.isBlank()) {
            logger.warn("TMDB API key not configured");
            return Optional.empty();
        }

        try {
            Map<String, Object> response = webClient.get().uri(uriBuilder -> uriBuilder.path("/movie/now_playing").queryParam("page", page).queryParam("api_key", apiKey).build()).retrieve().bodyToMono(Map.class).block();

            return Optional.of(convertToMovieSearchResponse(response));
        } catch (WebClientResponseException e) {
            logger.error("Error getting now playing movies: {}", e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<TmdbSearchResponse<TmdbMovieDto>> getUpcomingMovies(int page) {
        if (apiKey == null || apiKey.isBlank()) {
            logger.warn("TMDB API key not configured");
            return Optional.empty();
        }

        try {
            Map<String, Object> response = webClient.get().uri(uriBuilder -> uriBuilder.path("/movie/upcoming").queryParam("page", page).queryParam("api_key", apiKey).build()).retrieve().bodyToMono(Map.class).block();

            return Optional.of(convertToMovieSearchResponse(response));
        } catch (WebClientResponseException e) {
            logger.error("Error getting upcoming movies: {}", e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<TmdbSearchResponse<TmdbTvShowDto>> getPopularTvShows(int page) {
        if (apiKey == null || apiKey.isBlank()) {
            logger.warn("TMDB API key not configured");
            return Optional.empty();
        }

        try {
            Map<String, Object> response = webClient.get().uri(uriBuilder -> uriBuilder.path("/tv/popular").queryParam("page", page).queryParam("api_key", apiKey).build()).retrieve().bodyToMono(Map.class).block();

            return Optional.of(convertToTvShowSearchResponse(response));
        } catch (WebClientResponseException e) {
            logger.error("Error getting popular TV shows: {}", e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<TmdbSearchResponse<TmdbTvShowDto>> getTopRatedTvShows(int page) {
        if (apiKey == null || apiKey.isBlank()) {
            logger.warn("TMDB API key not configured");
            return Optional.empty();
        }

        try {
            Map<String, Object> response = webClient.get().uri(uriBuilder -> uriBuilder.path("/tv/top_rated").queryParam("page", page).queryParam("api_key", apiKey).build()).retrieve().bodyToMono(Map.class).block();

            return Optional.of(convertToTvShowSearchResponse(response));
        } catch (WebClientResponseException e) {
            logger.error("Error getting top rated TV shows: {}", e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<TmdbSearchResponse<TmdbMovieDto>> getSouthIndianMovies(int page) {
        if (apiKey == null || apiKey.isBlank()) {
            logger.warn("TMDB API key not configured");
            return Optional.empty();
        }

        try {
            Map<String, Object> response = webClient.get().uri(uriBuilder -> {
                var builder = uriBuilder.path("/discover/movie")
                        .queryParam("page", page)
                        .queryParam("with_original_language", "te") // Telugu
                        .queryParam("sort_by", "popularity.desc")
                        .queryParam("api_key", apiKey);
                return builder.build();
            }).retrieve().bodyToMono(Map.class).block();

            return Optional.of(convertToMovieSearchResponse(response));
        } catch (WebClientResponseException e) {
            logger.error("Error getting South Indian movies: {}", e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<TmdbSearchResponse<TmdbTvShowDto>> getTrendingTvShows(int page) {
        if (apiKey == null || apiKey.isBlank()) {
            logger.warn("TMDB API key not configured");
            return Optional.empty();
        }

        try {
            Map<String, Object> response = webClient.get().uri(uriBuilder -> uriBuilder.path("/trending/tv/day").queryParam("page", page).queryParam("api_key", apiKey).build()).retrieve().bodyToMono(Map.class).block();

            return Optional.of(convertToTvShowSearchResponse(response));
        } catch (WebClientResponseException e) {
            logger.error("Error getting trending TV shows: {}", e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<TmdbSearchResponse<TmdbMovieDto>> discoverMovies(String sortBy, Integer genreId, Integer year, Integer page) {
        if (apiKey == null || apiKey.isBlank()) {
            logger.warn("TMDB API key not configured");
            return Optional.empty();
        }

        try {
            Map<String, Object> response = webClient.get().uri(uriBuilder -> {
                var builder = uriBuilder.path("/discover/movie").queryParam("page", page).queryParam("api_key", apiKey);

                if (sortBy != null && !sortBy.isBlank()) {
                    builder.queryParam("sort_by", sortBy);
                }
                if (genreId != null) {
                    builder.queryParam("with_genres", genreId);
                }
                if (year != null) {
                    builder.queryParam("primary_release_year", year);
                }

                return builder.build();
            }).retrieve().bodyToMono(Map.class).block();

            return Optional.of(convertToMovieSearchResponse(response));
        } catch (WebClientResponseException e) {
            logger.error("Error discovering movies: {}", e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<TmdbSearchResponse<TmdbTvShowDto>> discoverTvShows(String sortBy, Integer genreId, Integer firstAirDateYear, Integer page) {
        if (apiKey == null || apiKey.isBlank()) {
            logger.warn("TMDB API key not configured");
            return Optional.empty();
        }

        try {
            Map<String, Object> response = webClient.get().uri(uriBuilder -> {
                var builder = uriBuilder.path("/discover/tv").queryParam("page", page).queryParam("api_key", apiKey);

                if (sortBy != null && !sortBy.isBlank()) {
                    builder.queryParam("sort_by", sortBy);
                }
                if (genreId != null) {
                    builder.queryParam("with_genres", genreId);
                }
                if (firstAirDateYear != null) {
                    builder.queryParam("first_air_date_year", firstAirDateYear);
                }

                return builder.build();
            }).retrieve().bodyToMono(Map.class).block();

            return Optional.of(convertToTvShowSearchResponse(response));
        } catch (WebClientResponseException e) {
            logger.error("Error discovering TV shows: {}", e.getMessage());
            return Optional.empty();
        }
    }

    @SuppressWarnings("unchecked")
    private TmdbSearchResponse<TmdbMovieDto> convertToMovieSearchResponse(Map<String, Object> response) {
        if (response == null) {
            return TmdbSearchResponse.<TmdbMovieDto>builder().build();
        }

        java.util.List<TmdbMovieDto> results = null;
        if (response.get("results") != null) {
            results = ((java.util.List<Map<String, Object>>) response.get("results")).stream().map(this::convertToMovieDto).toList();
        }

        return TmdbSearchResponse.<TmdbMovieDto>builder().page((Integer) response.get("page")).totalPages((Integer) response.get("total_pages")).totalResults((Integer) response.get("total_results")).results(results).build();
    }

    @SuppressWarnings("unchecked")
    private TmdbSearchResponse<TmdbTvShowDto> convertToTvShowSearchResponse(Map<String, Object> response) {
        if (response == null) {
            return TmdbSearchResponse.<TmdbTvShowDto>builder().build();
        }

        List<TmdbTvShowDto> results = null;
        if (response.get("results") != null) {
            results = ((List<Map<String, Object>>) response.get("results")).stream().map(this::convertToTvShowDto).toList();
        }

        return TmdbSearchResponse.<TmdbTvShowDto>builder().page((Integer) response.get("page")).totalPages((Integer) response.get("total_pages")).totalResults((Integer) response.get("total_results")).results(results).build();
    }

    @SuppressWarnings("unchecked")
    private TmdbMovieDto convertToMovieDto(Map<String, Object> map) {
        if (map == null) {
            return TmdbMovieDto.builder().build();
        }

        List<TmdbMovieDto.TmdbGenreDto> genres = null;
        if (map.get("genres") != null) {
            genres = ((List<Map<String, Object>>) map.get("genres")).stream().map(g -> TmdbMovieDto.TmdbGenreDto.builder().id((Integer) g.get("id")).name((String) g.get("name")).build()).toList();
        }

        return TmdbMovieDto.builder()
                .tmdbId(getLong(map.get("id")))
                .title((String) map.get("title"))
                .originalTitle((String) map.get("original_title"))
                .overview((String) map.get("overview"))
                .posterPath((String) map.get("poster_path"))
                .backdropPath((String) map.get("backdrop_path"))
                .voteAverage(getDouble(map.get("vote_average")))
                .voteCount(getInteger(map.get("vote_count")))
                .releaseDate((String) map.get("release_date"))
                .runtime(getInteger(map.get("runtime")))
                .tagline((String) map.get("tagline"))
                .status((String) map.get("status"))
                .genres(genres)
                .adult((Boolean) map.get("adult"))
                .imdbId((String) map.get("imdb_id"))
                .productionCountries(getProductionCountries(map.get("production_countries")))
                .spokenLanguages(getSpokenLanguages(map.get("spoken_languages")))
                .build();
    }

    @SuppressWarnings("unchecked")
    private List<TmdbMovieDto.TmdbProductionCountryDto> getProductionCountries(Object value) {
        if (value == null) return null;
        return ((List<Map<String, Object>>) value).stream()
                .map(g -> TmdbMovieDto.TmdbProductionCountryDto.builder()
                        .iso31661((String) g.get("iso_3166_1"))
                        .name((String) g.get("name"))
                        .build())
                .toList();
    }

    @SuppressWarnings("unchecked")
    private List<TmdbMovieDto.TmdbSpokenLanguageDto> getSpokenLanguages(Object value) {
        if (value == null) return null;
        return ((List<Map<String, Object>>) value).stream()
                .map(g -> TmdbMovieDto.TmdbSpokenLanguageDto.builder()
                        .iso6391((String) g.get("iso_639_1"))
                        .englishName((String) g.get("english_name"))
                        .name((String) g.get("name"))
                        .build())
                .toList();
    }

    @SuppressWarnings("unchecked")
    private TmdbTvShowDto convertToTvShowDto(Map<String, Object> map) {
        if (map == null) {
            return TmdbTvShowDto.builder().build();
        }

        List<TmdbTvShowDto.TmdbGenreDto> genres = null;
        if (map.get("genres") != null) {
            genres = ((List<Map<String, Object>>) map.get("genres")).stream().map(g -> TmdbTvShowDto.TmdbGenreDto.builder().id((Integer) g.get("id")).name((String) g.get("name")).build()).toList();
        }

        List<Integer> episodeRunTime = null;
        if (map.get("episode_run_time") != null) {
            episodeRunTime = ((List<Number>) map.get("episode_run_time")).stream().map(Number::intValue).toList();
        }

        return TmdbTvShowDto.builder().tmdbId(getLong(map.get("id"))).name((String) map.get("name")).originalName((String) map.get("original_name")).overview((String) map.get("overview")).posterPath((String) map.get("poster_path")).backdropPath((String) map.get("backdrop_path")).voteAverage(getDouble(map.get("vote_average"))).voteCount(getInteger(map.get("vote_count"))).firstAirDate((String) map.get("first_air_date")).episodeRunTime(episodeRunTime).tagline((String) map.get("tagline")).status((String) map.get("status")).genres(genres).build();
    }

    private Long getLong(Object value) {
        if (value == null) return null;
        if (value instanceof Number) return ((Number) value).longValue();
        try {
            return Long.parseLong(value.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Double getDouble(Object value) {
        if (value == null) return null;
        if (value instanceof Number) return ((Number) value).doubleValue();
        try {
            return Double.parseDouble(value.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Integer getInteger(Object value) {
        if (value == null) return null;
        if (value instanceof Number) return ((Number) value).intValue();
        try {
            return Integer.parseInt(value.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public String getMovieCertification(Long tmdbId) {
        if (apiKey == null || apiKey.isBlank()) return null;
        try {
            Map<String, Object> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/movie/" + tmdbId + "/release_dates").queryParam("api_key", apiKey).build())
                    .retrieve().bodyToMono(Map.class).block();
            if (response == null || response.get("results") == null) return null;
            List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
            for (Map<String, Object> country : results) {
                if ("US".equals(country.get("iso_3166_1"))) {
                    List<Map<String, Object>> releaseDates = (List<Map<String, Object>>) country.get("release_dates");
                    if (releaseDates != null) {
                        for (Map<String, Object> rd : releaseDates) {
                            String cert = (String) rd.get("certification");
                            if (cert != null && !cert.isBlank()) return cert;
                        }
                    }
                }
            }
            for (Map<String, Object> country : results) {
                List<Map<String, Object>> releaseDates = (List<Map<String, Object>>) country.get("release_dates");
                if (releaseDates != null) {
                    for (Map<String, Object> rd : releaseDates) {
                        String cert = (String) rd.get("certification");
                        if (cert != null && !cert.isBlank()) return cert;
                    }
                }
            }
        } catch (Exception e) {
            logger.debug("Failed to fetch certification for movie {}: {}", tmdbId, e.getMessage());
        }
        return null;
    }

    public String getTvShowCertification(Long tmdbId) {
        if (apiKey == null || apiKey.isBlank()) return null;
        try {
            Map<String, Object> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/tv/" + tmdbId + "/content_ratings").queryParam("api_key", apiKey).build())
                    .retrieve().bodyToMono(Map.class).block();
            if (response == null || response.get("results") == null) return null;
            List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
            for (Map<String, Object> country : results) {
                if ("US".equals(country.get("iso_3166_1"))) {
                    String rating = (String) country.get("rating");
                    if (rating != null && !rating.isBlank()) return rating;
                }
            }
            for (Map<String, Object> country : results) {
                String rating = (String) country.get("rating");
                if (rating != null && !rating.isBlank()) return rating;
            }
        } catch (Exception e) {
            logger.debug("Failed to fetch certification for TV show {}: {}", tmdbId, e.getMessage());
        }
        return null;
    }

    public String getFullPosterPath(String posterPath) {
        if (posterPath == null || posterPath.isBlank()) {
            return "";
        }
        return imageBaseUrl + "/w500" + posterPath;
    }

    public String getFullBackdropPath(String backdropPath) {
        if (backdropPath == null || backdropPath.isBlank()) {
            return "";
        }
        return imageBaseUrl + "/w1280" + backdropPath;
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    public Optional<List<TmdbVideoDto>> getMovieVideos(Long tmdbId) {
        if (apiKey == null || apiKey.isBlank()) {
            logger.warn("TMDB API key not configured");
            return Optional.empty();
        }

        // Check if cache is valid (not expired)
        Long cacheTimestamp = movieTrailerCacheTimestamps.get(tmdbId);
        if (cacheTimestamp != null && (System.currentTimeMillis() - cacheTimestamp) < CACHE_TTL_MS) {
            List<TmdbVideoDto> cachedTrailers = movieTrailerCache.get(tmdbId);
            if (cachedTrailers != null) {
                logger.debug("Returning cached trailers for movie ID: {}", tmdbId);
                return Optional.of(cachedTrailers);
            }
        } else {
            // Cache expired or not present, remove old entries
            movieTrailerCache.remove(tmdbId);
            movieTrailerCacheTimestamps.remove(tmdbId);
        }

        try {
            logger.debug("Fetching trailers from TMDB API for movie ID: {}", tmdbId);
            Map<String, Object> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/movie/" + tmdbId + "/videos")
                            .queryParam("api_key", apiKey)
                            .build())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            List<TmdbVideoDto> trailers = convertToVideoDtoList((List<Map<String, Object>>) response.get("results"));

            movieTrailerCache.put(tmdbId, trailers);
            movieTrailerCacheTimestamps.put(tmdbId, System.currentTimeMillis());
            logger.debug("Cached trailers for movie ID: {}", tmdbId);

            return Optional.of(trailers);
        } catch (WebClientResponseException e) {
            logger.error("Error getting movie videos: {}", e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<List<TmdbVideoDto>> getTvShowVideos(Long tmdbId) {
        if (apiKey == null || apiKey.isBlank()) {
            logger.warn("TMDB API key not configured");
            return Optional.empty();
        }

        // Check if cache is valid (not expired)
        Long cacheTimestamp = tvShowTrailerCacheTimestamps.get(tmdbId);
        if (cacheTimestamp != null && (System.currentTimeMillis() - cacheTimestamp) < CACHE_TTL_MS) {
            List<TmdbVideoDto> cachedTrailers = tvShowTrailerCache.get(tmdbId);
            if (cachedTrailers != null) {
                logger.debug("Returning cached trailers for TV show ID: {}", tmdbId);
                return Optional.of(cachedTrailers);
            }
        } else {
            // Cache expired or not present, remove old entries
            tvShowTrailerCache.remove(tmdbId);
            tvShowTrailerCacheTimestamps.remove(tmdbId);
        }

        try {
            logger.debug("Fetching trailers from TMDB API for TV show ID: {}", tmdbId);
            Map<String, Object> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/tv/" + tmdbId + "/videos")
                            .queryParam("api_key", apiKey)
                            .build())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            List<TmdbVideoDto> trailers = convertToVideoDtoList((List<Map<String, Object>>) response.get("results"));

            // Cache the result
            tvShowTrailerCache.put(tmdbId, trailers);
            tvShowTrailerCacheTimestamps.put(tmdbId, System.currentTimeMillis());
            logger.debug("Cached trailers for TV show ID: {}", tmdbId);

            return Optional.of(trailers);
        } catch (WebClientResponseException e) {
            logger.error("Error getting TV show videos: {}", e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Refresh movie trailer cache by forcing a new fetch from TMDB
     */
    public void refreshMovieTrailerCache(Long tmdbId) {
        logger.info("Refreshing movie trailer cache for ID: {}", tmdbId);
        movieTrailerCache.remove(tmdbId);
        movieTrailerCacheTimestamps.remove(tmdbId);
        // The next call to getMovieVideos will fetch fresh data
    }

    /**
     * Refresh TV show trailer cache by forcing a new fetch from TMDB
     */
    public void refreshTvShowTrailerCache(Long tmdbId) {
        logger.info("Refreshing TV show trailer cache for ID: {}", tmdbId);
        tvShowTrailerCache.remove(tmdbId);
        tvShowTrailerCacheTimestamps.remove(tmdbId);
        // The next call to getTvShowVideos will fetch fresh data
    }

    /**
     * Clear all trailer caches
     */
    public void clearAllTrailerCaches() {
        logger.info("Clearing all trailer caches");
        movieTrailerCache.clear();
        tvShowTrailerCache.clear();
        movieTrailerCacheTimestamps.clear();
        tvShowTrailerCacheTimestamps.clear();
    }

    @SuppressWarnings("unchecked")
    private List<TmdbVideoDto> convertToVideoDtoList(List<Map<String, Object>> videoMaps) {
        if (videoMaps == null) {
            return List.of();
        }

        return videoMaps.stream()
                .map(this::convertToVideoDto)
                .toList();
    }

    @SuppressWarnings("unchecked")
    private TmdbVideoDto convertToVideoDto(Map<String, Object> map) {
        if (map == null) {
            return TmdbVideoDto.builder().build();
        }

        return TmdbVideoDto.builder()
                .id((String) map.get("id"))
                .key((String) map.get("key"))
                .name((String) map.get("name"))
                .site((String) map.get("site"))
                .type((String) map.get("type"))
                .official((Boolean) map.get("official"))
                .publishedAt((String) map.get("published_at"))
                .size((Integer) map.get("size"))
                .build();
    }

    @SuppressWarnings("unchecked")
    public List<TmdbCastMemberDto> getMovieCast(Long tmdbId) {
        if (apiKey == null || apiKey.isBlank()) return List.of();
        try {
            Map<String, Object> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/movie/" + tmdbId + "/credits").queryParam("api_key", apiKey).build())
                    .retrieve().bodyToMono(Map.class).block();
            if (response == null || response.get("cast") == null) return List.of();
            List<Map<String, Object>> cast = (List<Map<String, Object>>) response.get("cast");
            return cast.stream().limit(20).map(m -> TmdbCastMemberDto.builder()
                    .id(getLong(m.get("id")))
                    .name((String) m.get("name"))
                    .character((String) m.get("character"))
                    .profilePath((String) m.get("profile_path"))
                    .order(getInteger(m.get("order")))
                    .build()).toList();
        } catch (Exception e) {
            logger.debug("Failed to fetch cast for movie {}: {}", tmdbId, e.getMessage());
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    public List<TmdbCastMemberDto> getTvShowCast(Long tmdbId) {
        if (apiKey == null || apiKey.isBlank()) return List.of();
        try {
            Map<String, Object> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/tv/" + tmdbId + "/credits").queryParam("api_key", apiKey).build())
                    .retrieve().bodyToMono(Map.class).block();
            if (response == null || response.get("cast") == null) return List.of();
            List<Map<String, Object>> cast = (List<Map<String, Object>>) response.get("cast");
            return cast.stream().limit(20).map(m -> TmdbCastMemberDto.builder()
                    .id(getLong(m.get("id")))
                    .name((String) m.get("name"))
                    .character((String) m.get("character"))
                    .profilePath((String) m.get("profile_path"))
                    .order(getInteger(m.get("order")))
                    .build()).toList();
        } catch (Exception e) {
            logger.debug("Failed to fetch cast for TV show {}: {}", tmdbId, e.getMessage());
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    public List<TmdbConvertedDto> getSimilarMovies(Long tmdbId, int page) {
        if (apiKey == null || apiKey.isBlank()) return List.of();
        try {
            Map<String, Object> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/movie/" + tmdbId + "/similar").queryParam("page", page).queryParam("api_key", apiKey).build())
                    .retrieve().bodyToMono(Map.class).block();
            if (response == null || response.get("results") == null) return List.of();
            List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
            return results.stream().limit(10).map(m -> {
                TmdbMovieDto movie = convertToMovieDto(m);
                return TmdbConvertedDto.fromMovie(movie, this);
            }).filter(java.util.Objects::nonNull).toList();
        } catch (Exception e) {
            logger.debug("Failed to fetch similar movies for {}: {}", tmdbId, e.getMessage());
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    public List<TmdbConvertedDto> getSimilarTvShows(Long tmdbId, int page) {
        if (apiKey == null || apiKey.isBlank()) return List.of();
        try {
            Map<String, Object> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/tv/" + tmdbId + "/similar").queryParam("page", page).queryParam("api_key", apiKey).build())
                    .retrieve().bodyToMono(Map.class).block();
            if (response == null || response.get("results") == null) return List.of();
            List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
            return results.stream().limit(10).map(m -> {
                TmdbTvShowDto show = convertToTvShowDto(m);
                return TmdbConvertedDto.fromTvShow(show, this);
            }).filter(java.util.Objects::nonNull).toList();
        } catch (Exception e) {
            logger.debug("Failed to fetch similar TV shows for {}: {}", tmdbId, e.getMessage());
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    public List<TmdbConvertedDto> getRecommendedMovies(Long tmdbId, int page) {
        if (apiKey == null || apiKey.isBlank()) return List.of();
        try {
            Map<String, Object> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/movie/" + tmdbId + "/recommendations").queryParam("page", page).queryParam("api_key", apiKey).build())
                    .retrieve().bodyToMono(Map.class).block();
            if (response == null || response.get("results") == null) return List.of();
            List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
            return results.stream().limit(10).map(m -> {
                TmdbMovieDto movie = convertToMovieDto(m);
                return TmdbConvertedDto.fromMovie(movie, this);
            }).filter(java.util.Objects::nonNull).toList();
        } catch (Exception e) {
            logger.debug("Failed to fetch recommended movies for {}: {}", tmdbId, e.getMessage());
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    public List<TmdbConvertedDto> getRecommendedTvShows(Long tmdbId, int page) {
        if (apiKey == null || apiKey.isBlank()) return List.of();
        try {
            Map<String, Object> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/tv/" + tmdbId + "/recommendations").queryParam("page", page).queryParam("api_key", apiKey).build())
                    .retrieve().bodyToMono(Map.class).block();
            if (response == null || response.get("results") == null) return List.of();
            List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
            return results.stream().limit(10).map(m -> {
                TmdbTvShowDto show = convertToTvShowDto(m);
                return TmdbConvertedDto.fromTvShow(show, this);
            }).filter(java.util.Objects::nonNull).toList();
        } catch (Exception e) {
            logger.debug("Failed to fetch recommended TV shows for {}: {}", tmdbId, e.getMessage());
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getMovieGenres() {
        if (apiKey == null || apiKey.isBlank()) return List.of();
        try {
            Map<String, Object> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/genre/movie/list").queryParam("api_key", apiKey).build())
                    .retrieve().bodyToMono(Map.class).block();
            if (response == null || response.get("genres") == null) return List.of();
            return (List<Map<String, Object>>) response.get("genres");
        } catch (Exception e) {
            logger.debug("Failed to fetch movie genres: {}", e.getMessage());
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getTvGenres() {
        if (apiKey == null || apiKey.isBlank()) return List.of();
        try {
            Map<String, Object> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/genre/tv/list").queryParam("api_key", apiKey).build())
                    .retrieve().bodyToMono(Map.class).block();
            if (response == null || response.get("genres") == null) return List.of();
            return (List<Map<String, Object>>) response.get("genres");
        } catch (Exception e) {
            logger.debug("Failed to fetch TV genres: {}", e.getMessage());
            return List.of();
        }
    }
}
