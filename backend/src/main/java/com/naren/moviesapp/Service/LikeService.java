package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Like;
import com.naren.moviesapp.Entity.LikeStatus;
import com.naren.moviesapp.Exception.ResourceNotFoundException;
import com.naren.moviesapp.Record.AddToLikeRequest;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Repo.LikeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LikeService {

    private static final Logger log = LoggerFactory.getLogger(LikeService.class);
    private final LikeRepository likeRepository;
    private final CustomerRepository customerRepository;

    public LikeService(LikeRepository likeRepository, CustomerRepository customerRepository) {
        this.likeRepository = likeRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional
    public Like like(Long customerId, AddToLikeRequest request) {
        Optional<Like> existing = likeRepository.findByCustomerIdAndTmdbIdAndMediaType(
                customerId, request.tmdbId(), request.mediaType());

        if (existing.isPresent()) {
            Like like = existing.get();
            like.setLikeStatus(LikeStatus.LIKE);
            like.setTitle(request.title());
            like.setLikedAt(LocalDateTime.now());
            return likeRepository.save(like);
        }

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Like like = new Like();
        like.setCustomer(customer);
        like.setTmdbId(request.tmdbId());
        like.setTitle(request.title());
        like.setMediaType(request.mediaType());
        like.setLikeStatus(LikeStatus.LIKE);
        like.setLikedAt(LocalDateTime.now());

        Like saved = likeRepository.save(like);
        log.info("Liked tmdbId={} ({}) for customer={}", request.tmdbId(), request.mediaType(), customerId);
        return saved;
    }

    @Transactional
    public void unlike(Long customerId, Long tmdbId, String mediaType) {
        likeRepository.deleteByCustomerIdAndTmdbIdAndMediaType(customerId, tmdbId, mediaType);
        log.info("Unliked tmdbId={} ({}) for customer={}", tmdbId, mediaType, customerId);
    }

    public List<Like> getLikes(Long customerId) {
        return likeRepository.findByCustomerIdAndLikeStatusOrderByLikedAtDesc(customerId, LikeStatus.LIKE);
    }

    public Page<Like> getLikesPaginated(Long customerId, Pageable pageable) {
        return likeRepository.findByCustomerIdAndLikeStatusOrderByLikedAtDesc(customerId, LikeStatus.LIKE, pageable);
    }

    public boolean isLiked(Long customerId, Long tmdbId, String mediaType) {
        return likeRepository.existsByCustomerIdAndTmdbIdAndMediaType(customerId, tmdbId, mediaType);
    }

    public long getLikeCount(Long customerId) {
        return likeRepository.countByCustomerIdAndLikeStatus(customerId, LikeStatus.LIKE);
    }

    public long getTotalLikes(Long tmdbId, String mediaType) {
        return likeRepository.countByTmdbIdAndMediaTypeAndLikeStatus(tmdbId, mediaType, LikeStatus.LIKE);
    }
}
