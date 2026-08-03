package com.naren.moviesapp.Dto;

public record ItemReactionDTO(
        Long tmdbId,
        String title,
        String mediaType,
        long liked,
        long disliked,
        double likePercentage,
        double dislikePercentage
) {
    public static ItemReactionDTO fromRow(Object[] row) {
        long liked = ((Number) row[3]).longValue();
        long disliked = ((Number) row[4]).longValue();
        double total = liked + disliked;
        double likePct = total == 0 ? 0 : (liked * 100.0 / total);
        return new ItemReactionDTO(
                ((Number) row[0]).longValue(),
                (String) row[1],
                (String) row[2],
                liked,
                disliked,
                Math.round(likePct * 10) / 10.0,
                Math.round((100 - likePct) * 10) / 10.0
        );
    }
}
