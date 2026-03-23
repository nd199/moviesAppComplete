package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.WatchlistItem;
import com.naren.moviesapp.Record.AddToWatchlistRequest;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Service.WatchlistService;
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
@RequestMapping("/api/v1/watchlist")
public class WatchlistController {

    private final WatchlistService watchlistService;
    private final CustomerRepository customerRepository;

    public WatchlistController(WatchlistService watchlistService, CustomerRepository customerRepository) {
        this.watchlistService = watchlistService;
        this.customerRepository = customerRepository;
    }

    @PostMapping
    public ResponseEntity<WatchlistItem> addToWatchlist(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody AddToWatchlistRequest request) {
        
        Customer customer = getCustomer(userDetails);
        WatchlistItem item = watchlistService.addToWatchlist(customer.getId(), request);
        return ResponseEntity.ok(item);
    }

    @GetMapping
    public ResponseEntity<List<WatchlistItem>> getWatchlist(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Customer customer = getCustomer(userDetails);
        List<WatchlistItem> watchlist = watchlistService.getWatchlist(customer.getId());
        return ResponseEntity.ok(watchlist);
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<WatchlistItem>> getWatchlistPaginated(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Customer customer = getCustomer(userDetails);
        Pageable pageable = PageRequest.of(page, size);
        Page<WatchlistItem> watchlist = watchlistService.getWatchlistPaginated(customer.getId(), pageable);
        return ResponseEntity.ok(watchlist);
    }

    @DeleteMapping("/{tmdbId}/{mediaType}")
    public ResponseEntity<Void> removeFromWatchlist(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long tmdbId,
            @PathVariable String mediaType) {
        
        Customer customer = getCustomer(userDetails);
        watchlistService.removeFromWatchlist(customer.getId(), tmdbId, mediaType);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check/{tmdbId}/{mediaType}")
    public ResponseEntity<Map<String, Boolean>> checkInWatchlist(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long tmdbId,
            @PathVariable String mediaType) {
        
        Customer customer = getCustomer(userDetails);
        boolean inWatchlist = watchlistService.isInWatchlist(customer.getId(), tmdbId, mediaType);
        return ResponseEntity.ok(Map.of("inWatchlist", inWatchlist));
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getWatchlistCount(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Customer customer = getCustomer(userDetails);
        long count = watchlistService.getWatchlistCount(customer.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    private Customer getCustomer(UserDetails userDetails) {
        return customerRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }
}
