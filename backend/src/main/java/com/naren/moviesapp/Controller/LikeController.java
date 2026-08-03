package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Like;
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
    public ResponseEntity<Like> setReaction(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AddToLikeRequest request) {

        Customer customer = getCustomer(userDetails);
        Like like = likeService.setReaction(customer.getId(), request);
        return ResponseEntity.ok(like);
    }

    @DeleteMapping("/{tmdbId}/{mediaType}")
    public ResponseEntity<Void> clearReaction(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long tmdbId,
            @PathVariable String mediaType) {

        Customer customer = getCustomer(userDetails);
        likeService.clearReaction(customer.getId(), tmdbId, mediaType);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Like>> getLikes(
            @AuthenticationPrincipal UserDetails userDetails) {

        Customer customer = getCustomer(userDetails);
        return ResponseEntity.ok(likeService.getLikes(customer.getId()));
    }

    @GetMapping("/disliked")
    public ResponseEntity<List<Like>> getDislikes(
            @AuthenticationPrincipal UserDetails userDetails) {

        Customer customer = getCustomer(userDetails);
        return ResponseEntity.ok(likeService.getDislikes(customer.getId()));
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<Like>> getLikesPaginated(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Customer customer = getCustomer(userDetails);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(likeService.getLikesPaginated(customer.getId(), pageable));
    }

    @GetMapping("/disliked/paginated")
    public ResponseEntity<Page<Like>> getDislikesPaginated(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Customer customer = getCustomer(userDetails);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(likeService.getDislikesPaginated(customer.getId(), pageable));
    }

    @GetMapping("/check/{tmdbId}/{mediaType}")
    public ResponseEntity<Map<String, Boolean>> checkReaction(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long tmdbId,
            @PathVariable String mediaType) {

        Customer customer = getCustomer(userDetails);
        return ResponseEntity.ok(likeService.getReaction(customer.getId(), tmdbId, mediaType));
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getLikeCount(
            @AuthenticationPrincipal UserDetails userDetails) {

        Customer customer = getCustomer(userDetails);
        long count = likeService.getLikeCount(customer.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    @GetMapping("/total/{tmdbId}/{mediaType}")
    public ResponseEntity<Map<String, Long>> getTotalReactions(
            @PathVariable Long tmdbId,
            @PathVariable String mediaType) {

        return ResponseEntity.ok(likeService.getTotalReactions(tmdbId, mediaType));
    }

    private Customer getCustomer(UserDetails userDetails) {
        return customerRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }
}
