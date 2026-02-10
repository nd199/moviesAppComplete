package com.naren.moviesapp.Dto;

import com.naren.moviesapp.Entity.Movie;
import com.naren.moviesapp.Entity.Show;

import java.util.List;

public record ProductDTO(
        List<Movie> movies,
        List<Show> shows
) {
}
