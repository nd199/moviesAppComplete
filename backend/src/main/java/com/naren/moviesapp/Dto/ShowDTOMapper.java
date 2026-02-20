package com.naren.moviesapp.Dto;

import com.naren.moviesapp.Entity.Show;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class ShowDTOMapper implements Function<Show, ShowDTO> {

    @Override
    public ShowDTO apply(Show show) {
        return new ShowDTO(
                show.getShow_id(),
                show.getName(),
                show.getCost(),
                show.getRating(),
                show.getDescription(),
                show.getPoster(),
                show.getAgeRating(),
                show.getYear(),
                show.getRuntime(),
                show.getGenre(),
                show.getType(),
                show.getCustomer() != null ? show.getCustomer().getId() : null,
                show.getCreatedAt(),
                show.getUpdatedAt()
        );
    }
}
