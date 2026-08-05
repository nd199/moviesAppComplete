package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Dto.CustomerStatsDTO;
import com.naren.moviesapp.Dto.ItemReactionDTO;
import com.naren.moviesapp.Entity.LikeStatus;
import com.naren.moviesapp.Repo.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAuthority('USER_READ')")
@Tag(name = "Admin Dashboard Stats", description = "Admin dashboard statistics APIs")
public class AdminStatsController {

    private static final Logger logger = LoggerFactory.getLogger(AdminStatsController.class);

    private final CustomerRepository customerRepository;
    private final MovieRepository movieRepository;
    private final ShowRepository showRepository;
    private final UserPlanInfoRepository userPlanInfoRepository;
    private final LikeRepository likeRepository;

    public AdminStatsController(CustomerRepository customerRepository,
                                MovieRepository movieRepository,
                                ShowRepository showRepository,
                                UserPlanInfoRepository userPlanInfoRepository,
                                LikeRepository likeRepository) {
        this.customerRepository = customerRepository;
        this.movieRepository = movieRepository;
        this.showRepository = showRepository;
        this.userPlanInfoRepository = userPlanInfoRepository;
        this.likeRepository = likeRepository;
    }

    @GetMapping("/stats/users")
    public ResponseEntity<?> getUserStats() {
        logger.debug("Fetching user registration stats by month");
        List<CustomerStatsDTO> stats = customerRepository.getCustomerCountByEachMonthInYear()
                .stream()
                .map(result -> new CustomerStatsDTO(
                        ((Number) result[0]).intValue(),
                        ((Number) result[1]).longValue()))
                .toList();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats/content")
    public ResponseEntity<?> getContentStats() {
        logger.debug("Fetching content stats");
        long totalMovies = movieRepository.count();
        long totalShows = showRepository.count();
        long activeSubscriptions = userPlanInfoRepository.countActiveSubscriptions();
        return ResponseEntity.ok(Map.of(
                "totalMovies", totalMovies,
                "totalShows", totalShows,
                "activeSubscriptions", activeSubscriptions
        ));
    }

    @GetMapping("/stats/reactions")
    public ResponseEntity<?> getReactionStats() {
        logger.debug("Fetching like/dislike reaction stats");

        long totalLikes = likeRepository.countByLikeStatus(LikeStatus.LIKE);
        long totalDislikes = likeRepository.countByLikeStatus(LikeStatus.DISLIKE);
        double total = totalLikes + totalDislikes;
        double likePct = total == 0 ? 0 : totalLikes * 100.0 / total;
        double dislikePct = total == 0 ? 0 : totalDislikes * 100.0 / total;

        List<ItemReactionDTO> allItems = likeRepository.countReactionsByItem().stream()
                .map(ItemReactionDTO::fromRow)
                .toList();

        List<ItemReactionDTO> mostLiked = allItems.stream()
                .sorted(Comparator.comparingLong(ItemReactionDTO::liked).reversed())
                .limit(10)
                .toList();

        List<ItemReactionDTO> mostDisliked = allItems.stream()
                .sorted(Comparator.comparingLong(ItemReactionDTO::disliked).reversed())
                .limit(10)
                .toList();

        LocalDateTime now = LocalDateTime.now();
        Map<String, List<ItemReactionDTO>> byPeriod = Map.of(
                "today", topLikedSince(now.toLocalDate().atStartOfDay()),
                "week", topLikedSince(now.toLocalDate().minusDays(6).atStartOfDay()),
                "month", topLikedSince(now.withDayOfMonth(1).toLocalDate().atStartOfDay())
        );

        return ResponseEntity.ok(Map.of(
                "overall", Map.of(
                        "totalLikes", totalLikes,
                        "totalDislikes", totalDislikes,
                        "likePercentage", Math.round(likePct * 10) / 10.0,
                        "dislikePercentage", Math.round(dislikePct * 10) / 10.0
                ),
                "mostLiked", mostLiked,
                "mostDisliked", mostDisliked,
                "byPeriod", byPeriod
        ));
    }

    private List<ItemReactionDTO> topLikedSince(LocalDateTime since) {
        return likeRepository.countReactionsByItemSince(since).stream()
                .map(ItemReactionDTO::fromRow)
                .filter(dto -> dto.liked() > 0)
                .sorted(Comparator.comparingLong(ItemReactionDTO::liked).reversed())
                .limit(5)
                .toList();
    }
}
