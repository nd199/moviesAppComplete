package com.naren.moviesapp.Repo;

import com.naren.moviesapp.Entity.WatchlistItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchlistRepository extends JpaRepository<WatchlistItem, Long> {
    
    List<WatchlistItem> findByCustomerIdOrderByAddedAtDesc(Long customerId);
    
    Page<WatchlistItem> findByCustomerIdOrderByAddedAtDesc(Long customerId, Pageable pageable);
    
    Optional<WatchlistItem> findByCustomerIdAndTmdbIdAndMediaType(
            Long customerId, Long tmdbId, String mediaType);
    
    boolean existsByCustomerIdAndTmdbIdAndMediaType(
            Long customerId, Long tmdbId, String mediaType);
    
    void deleteByCustomerIdAndTmdbIdAndMediaType(
            Long customerId, Long tmdbId, String mediaType);
    
    long countByCustomerId(Long customerId);
}
