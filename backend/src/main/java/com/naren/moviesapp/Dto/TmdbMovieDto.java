package com.naren.moviesapp.Dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmdbMovieDto {

    @JsonProperty("id")
    private Long tmdbId;

    @JsonProperty("title")
    private String title;

    @JsonProperty("original_title")
    private String originalTitle;

    @JsonProperty("overview")
    private String overview;

    @JsonProperty("poster_path")
    private String posterPath;

    @JsonProperty("backdrop_path")
    private String backdropPath;

    @JsonProperty("vote_average")
    private Double voteAverage;

    @JsonProperty("vote_count")
    private Integer voteCount;

    @JsonProperty("release_date")
    private String releaseDate;

    @JsonProperty("runtime")
    private Integer runtime;

    @JsonProperty("tagline")
    private String tagline;

    @JsonProperty("status")
    private String status;

    @JsonProperty("genres")
    private List<TmdbGenreDto> genres;

    @JsonProperty("adult")
    private Boolean adult;

    @JsonProperty("imdb_id")
    private String imdbId;

    @JsonProperty("production_countries")
    private List<TmdbProductionCountryDto> productionCountries;

    @JsonProperty("spoken_languages")
    private List<TmdbSpokenLanguageDto> spokenLanguages;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TmdbGenreDto {
        @JsonProperty("id")
        private Integer id;
        @JsonProperty("name")
        private String name;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TmdbProductionCountryDto {
        @JsonProperty("iso_3166_1")
        private String iso31661;
        @JsonProperty("name")
        private String name;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TmdbSpokenLanguageDto {
        @JsonProperty("iso_639_1")
        private String iso6391;
        @JsonProperty("english_name")
        private String englishName;
        @JsonProperty("name")
        private String name;
    }
}
