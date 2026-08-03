package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Like;
import com.naren.moviesapp.Entity.LikeStatus;
import com.naren.moviesapp.Record.AddToLikeRequest;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Service.LikeService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/likes")
public class LikeController {

    private static final Logger log = LoggerFactory.getLogger(LikeController.class);
    private final LikeService likeService;
    private final CustomerRepository customerRepository;

    public LikeController(LikeService likeService, CustomerRepository customerRepository) {
        this.likeService = likeService;
        this.customerRepository = customerRepository;
    }

    @PostMapping
    public ResponseEntity<?> toggleLike(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AddToLikeRequest request) {

        Customer customer = getCustomer(userDetails);

        if (request.likeStatus() == LikeStatus.UNLIKE) {
            log.info("Unliking tmdbId={} ({}) for customer={}", request.tmdbId(), request.mediaType(), customer.getId());
            likeService.unlike(customer.getId(), request.tmdbId(), request.mediaType());
            return ResponseEntity.noContent().build();
        }

        log.info("Liking tmdbId={} ({}) for customer={}", request.tmdbId(), request.mediaType(), customer.getId());
        Like like = likeService.like(customer.getId(), request);
        return ResponseEntity.ok(like);
    }

    @GetMapping
    public ResponseEntity<List<Like>> getLikes(
            @AuthenticationPrincipal UserDetails userDetails) {

        Customer customer = getCustomer(userDetails);
        List<Like> likes = likeService.getLikes(customer.getId());
        return ResponseEntity.ok(likes);
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<Like>> getLikesPaginated(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Customer customer = getCustomer(userDetails);
        Pageable pageable = PageRequest.of(page, size);
        Page<Like> likes = likeService.getLikesPaginated(customer.getId(), pageable);
        return ResponseEntity.ok(likes);
    }

    @DeleteMapping("/{tmdbId}/{mediaType}")
    public ResponseEntity<Void> removeLike(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long tmdbId,
            @PathVariable String mediaType) {

        Customer customer = getCustomer(userDetails);
        likeService.unlike(customer.getId(), tmdbId, mediaType);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check/{tmdbId}/{mediaType}")
    public ResponseEntity<Map<String, Boolean>> checkLiked(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long tmdbId,
            @PathVariable String mediaType) {

        Customer customer = getCustomer(userDetails);
        boolean liked = likeService.isLiked(customer.getId(), tmdbId, mediaType);
        return ResponseEntity.ok(Map.of("liked", liked));
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getLikeCount(
            @AuthenticationPrincipal UserDetails userDetails) {

        Customer customer = getCustomer(userDetails);
        long count = likeService.getLikeCount(customer.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    @GetMapping("/total/{tmdbId}/{mediaType}")
    public ResponseEntity<Map<String, Long>> getTotalLikes(
            @PathVariable Long tmdbId,
            @PathVariable String mediaType) {

        long total = likeService.getTotalLikes(tmdbId, mediaType);
        return ResponseEntity.ok(Map.of("totalLikes", total));
    }

    private Customer getCustomer(UserDetails userDetails) {
        return customerRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }
}
