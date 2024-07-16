package com.naren.movieticketbookingapplication.Dto;

import com.naren.movieticketbookingapplication.Entity.Movie;
import com.naren.movieticketbookingapplication.Entity.Show;

import java.util.List;

public record ProductDTO(
        List<Movie> movies,
        List<Show> shows
) {
}
