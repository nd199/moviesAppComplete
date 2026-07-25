package com.naren.moviesapp.Dto;

import com.naren.moviesapp.Entity.ViewHistory;
import com.naren.moviesapp.Record.ViewHistoryResponse;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class ViewHistoryDTOMapper implements Function<ViewHistory, ViewHistoryResponse> {

    @Override
    public ViewHistoryResponse apply(ViewHistory viewHistory) {
        return new ViewHistoryResponse(
                viewHistory.getTmdbId(),
                viewHistory.getMediaType(),
                viewHistory.getTitle(),
                viewHistory.getPosterPath(),
                viewHistory.getViewedAt()
        );
    }
}
