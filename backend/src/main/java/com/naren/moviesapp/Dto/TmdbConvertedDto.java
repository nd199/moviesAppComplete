package com.naren.moviesapp.Dto;

import com.naren.moviesapp.Service.TmdbService;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TmdbConvertedDto {

    private Long tmdbId;
    private String title;
    private String name;
    private Double rating;
    private String description;
    private String poster;
    private String backdrop;
    private String ageRating;
    private Integer year;
    private String runtime;
    private String genre;
    private String type;
    private String category;
    private String tagline;
    private Boolean adult;
    private String originalTitle;
    private String originalName;
    private Integer voteCount;
    private String status;
    private String releaseDate;
    private String firstAirDate;
    private String imdbId;
    private List<String> productionCountries;
    private List<String> spokenLanguages;
    private String trailer;

    public static TmdbConvertedDto fromMovie(TmdbMovieDto movie, TmdbService tmdbService) {
        if (movie == null) return null;

        String genreStr = "";
        if (movie.getGenres() != null && !movie.getGenres().isEmpty()) {
            genreStr = String.join(", ", movie.getGenres().stream()
                    .map(TmdbMovieDto.TmdbGenreDto::getName)
                    .toList());
        }

        Integer year = null;
        if (movie.getReleaseDate() != null && movie.getReleaseDate().length() >= 4) {
            try {
                year = Integer.parseInt(movie.getReleaseDate().substring(0, 4));
            } catch (NumberFormatException e) {
                // ignore
            }
        }

        String runtimeStr = "";
        if (movie.getRuntime() != null) {
            int hours = movie.getRuntime() / 60;
            int minutes = movie.getRuntime() % 60;
            if (hours > 0) {
                runtimeStr = hours + "h " + minutes + "m";
            } else {
                runtimeStr = minutes + "m";
            }
        }

        // Extract production countries
        List<String> prodCountries = null;
        if (movie.getProductionCountries() != null && !movie.getProductionCountries().isEmpty()) {
            prodCountries = movie.getProductionCountries().stream()
                    .map(TmdbMovieDto.TmdbProductionCountryDto::getName)
                    .toList();
        }

        // Extract spoken languages
        List<String> langs = null;
        if (movie.getSpokenLanguages() != null && !movie.getSpokenLanguages().isEmpty()) {
            langs = movie.getSpokenLanguages().stream()
                    .map(TmdbMovieDto.TmdbSpokenLanguageDto::getEnglishName)
                    .toList();
        }

        // Get trailer URL
        String trailerUrl = null;
        try {
            var videosOpt = tmdbService.getMovieVideos(movie.getTmdbId());
            if (videosOpt.isPresent() && !videosOpt.get().isEmpty()) {
                List<TmdbVideoDto> videos = videosOpt.get();
                // First try to find a trailer (type "Trailer" and site "YouTube")
                trailerUrl = videos.stream()
                        .filter(video -> "Trailer".equals(video.getType()) && "YouTube".equals(video.getSite()))
                        .findFirst()
                        .map(video -> "https://www.youtube.com/watch?v=" + video.getKey())
                        // Fallback to teaser if no trailer found
                        .orElseGet(() -> videos.stream()
                                .filter(video -> "Teaser".equals(video.getType()) && "YouTube".equals(video.getSite()))
                                .findFirst()
                                .map(video -> "https://www.youtube.com/watch?v=" + video.getKey())
                                .orElse(null));
            } else {
            }
        } catch (Exception e) {
            // Ignore trailer fetch errors
        }

        return TmdbConvertedDto.builder()
                .tmdbId(movie.getTmdbId())
                .title(movie.getTitle())
                .originalTitle(movie.getOriginalTitle())
                .rating(movie.getVoteAverage())
                .voteCount(movie.getVoteCount())
                .description(movie.getOverview())
                .poster(tmdbService.getFullPosterPath(movie.getPosterPath()))
                .backdrop(tmdbService.getFullBackdropPath(movie.getBackdropPath()))
                .ageRating(movie.getAdult() != null && movie.getAdult() ? "R" : "PG-13")
                .year(year)
                .runtime(runtimeStr)
                .genre(genreStr)
                .type("movies")
                .tagline(movie.getTagline())
                .adult(movie.getAdult())
                .status(movie.getStatus())
                .releaseDate(movie.getReleaseDate())
                .imdbId(movie.getImdbId())
                .productionCountries(prodCountries)
                .spokenLanguages(langs)
                .trailer(trailerUrl)
                .build();
    }

    public static TmdbConvertedDto fromTvShow(TmdbTvShowDto tvShow, TmdbService tmdbService) {
        if (tvShow == null) return null;

        String genreStr = "";
        if (tvShow.getGenres() != null && !tvShow.getGenres().isEmpty()) {
            genreStr = String.join(", ", tvShow.getGenres().stream()
                    .map(TmdbTvShowDto.TmdbGenreDto::getName)
                    .toList());
        }

        Integer year = null;
        if (tvShow.getFirstAirDate() != null && tvShow.getFirstAirDate().length() >= 4) {
            try {
                year = Integer.parseInt(tvShow.getFirstAirDate().substring(0, 4));
            } catch (NumberFormatException e) {
                // ignore
            }
        }

        String runtimeStr = "";
        if (tvShow.getEpisodeRunTime() != null && !tvShow.getEpisodeRunTime().isEmpty()) {
            Integer runtime = tvShow.getEpisodeRunTime().get(0);
            if (runtime != null) {
                int hours = runtime / 60;
                int minutes = runtime % 60;
                if (hours > 0) {
                    runtimeStr = hours + "h " + minutes + "m";
                } else {
                    runtimeStr = minutes + "m";
                }
            }
        }

        // Get trailer URL
        String trailerUrl = null;
        try {
            var videosOpt = tmdbService.getTvShowVideos(tvShow.getTmdbId());
            if (videosOpt.isPresent() && !videosOpt.get().isEmpty()) {
                List<TmdbVideoDto> videos = videosOpt.get();
                // First try to find a trailer (type "Trailer" and site "YouTube")
                trailerUrl = videos.stream()
                        .filter(video -> "Trailer".equals(video.getType()) && "YouTube".equals(video.getSite()))
                        .findFirst()
                        .map(video -> "https://www.youtube.com/watch?v=" + video.getKey())
                        // Fallback to teaser if no trailer found
                        .orElseGet(() -> videos.stream()
                                .filter(video -> "Teaser".equals(video.getType()) && "YouTube".equals(video.getSite()))
                                .findFirst()
                                .map(video -> "https://www.youtube.com/watch?v=" + video.getKey())
                                .orElse(null));
            }
        } catch (Exception e) {
            // Ignore trailer fetch errors
        }

        return TmdbConvertedDto.builder()
                .tmdbId(tvShow.getTmdbId())
                .name(tvShow.getName())
                .originalName(tvShow.getOriginalName())
                .rating(tvShow.getVoteAverage())
                .voteCount(tvShow.getVoteCount())
                .description(tvShow.getOverview())
                .poster(tmdbService.getFullPosterPath(tvShow.getPosterPath()))
                .backdrop(tmdbService.getFullBackdropPath(tvShow.getBackdropPath()))
                .ageRating("TV-14")
                .year(year)
                .runtime(runtimeStr)
                .genre(genreStr)
                .type("shows")
                .tagline(tvShow.getTagline())
                .status(tvShow.getStatus())
                .firstAirDate(tvShow.getFirstAirDate())
                .trailer(trailerUrl)
                .build();
    }
}
