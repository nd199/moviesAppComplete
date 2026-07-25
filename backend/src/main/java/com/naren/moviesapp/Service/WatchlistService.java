package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.WatchlistItem;
import com.naren.moviesapp.Exception.ResourceNotFoundException;
import com.naren.moviesapp.Record.AddToWatchlistRequest;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Repo.WatchlistRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WatchlistService {

    private static final Logger log = LoggerFactory.getLogger(WatchlistService.class);
    private final WatchlistRepository watchlistRepository;
    private final CustomerRepository customerRepository;

    public WatchlistService(WatchlistRepository watchlistRepository, CustomerRepository customerRepository) {
        this.watchlistRepository = watchlistRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional
    public WatchlistItem addToWatchlist(Long customerId, AddToWatchlistRequest request) {
        // Check if already in watchlist
        if (watchlistRepository.existsByCustomerIdAndTmdbIdAndMediaType(
                customerId, request.tmdbId(), request.mediaType())) {
            throw new com.naren.moviesapp.Exception.ResourceAlreadyExists("Item already in watchlist");
        }

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        WatchlistItem item = new WatchlistItem();
        item.setCustomer(customer);
        item.setTmdbId(request.tmdbId());
        item.setTitle(request.title());
        item.setPosterPath(request.posterPath());
        item.setMediaType(request.mediaType());
        item.setAddedAt(LocalDateTime.now());

        WatchlistItem saved = watchlistRepository.save(item);
        log.info("Added watchlist item: tmdbId={} for customer={}", request.tmdbId(), customerId);
        return saved;
    }

    public List<WatchlistItem> getWatchlist(Long customerId) {
        return watchlistRepository.findByCustomerIdOrderByAddedAtDesc(customerId);
    }

    public Page<WatchlistItem> getWatchlistPaginated(Long customerId, Pageable pageable) {
        return watchlistRepository.findByCustomerIdOrderByAddedAtDesc(customerId, pageable);
    }

    @Transactional
    public void removeFromWatchlist(Long customerId, Long tmdbId, String mediaType) {
        watchlistRepository.deleteByCustomerIdAndTmdbIdAndMediaType(customerId, tmdbId, mediaType);
        log.info("Removed watchlist item: tmdbId={} ({}) for customer={}", tmdbId, mediaType, customerId);
    }

    public boolean isInWatchlist(Long customerId, Long tmdbId, String mediaType) {
        return watchlistRepository.existsByCustomerIdAndTmdbIdAndMediaType(
                customerId, tmdbId, mediaType);
    }

    public long getWatchlistCount(Long customerId) {
        return watchlistRepository.countByCustomerId(customerId);
    }
}
