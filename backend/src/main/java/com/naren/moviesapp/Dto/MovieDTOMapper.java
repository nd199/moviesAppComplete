package com.naren.moviesapp.Dto;

import com.naren.moviesapp.Entity.Movie;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class MovieDTOMapper implements Function<Movie, MovieDTO> {

    @Override
    public MovieDTO apply(Movie movie) {
        return new MovieDTO(
                movie.getId(),
                movie.getName(),
                movie.getRating(),
                movie.getDescription(),
                movie.getPoster(),
                movie.getAgeRating(),
                movie.getYear(),
                movie.getRuntime(),
                movie.getGenre(),
                movie.getType(),
                movie.getCustomer() != null ? movie.getCustomer().getId() : null,
                movie.getCreatedAt(),
                movie.getUpdatedAt()
        );
    }
}
