package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Dto.CustomerStatsDTO;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Repo.MovieRepository;
import com.naren.moviesapp.Repo.ShowRepository;
import com.naren.moviesapp.Repo.UserPlanInfoRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    public AdminStatsController(CustomerRepository customerRepository,
                                MovieRepository movieRepository,
                                ShowRepository showRepository,
                                UserPlanInfoRepository userPlanInfoRepository) {
        this.customerRepository = customerRepository;
        this.movieRepository = movieRepository;
        this.showRepository = showRepository;
        this.userPlanInfoRepository = userPlanInfoRepository;
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
}
