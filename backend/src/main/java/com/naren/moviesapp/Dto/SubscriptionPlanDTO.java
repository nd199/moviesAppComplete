package com.naren.moviesapp.Dto;

public record SubscriptionPlanDTO(
        Long id,
        String planName,
        Double price,
        String interval,
        String description
) {
}
