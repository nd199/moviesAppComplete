package com.naren.moviesapp.Repo;

import com.naren.moviesapp.Entity.Like;
import com.naren.moviesapp.Entity.LikeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    List<Like> findByCustomerIdAndLikeStatusOrderByLikedAtDesc(Long customerId, LikeStatus likeStatus);

    Page<Like> findByCustomerIdAndLikeStatusOrderByLikedAtDesc(Long customerId, LikeStatus likeStatus, Pageable pageable);

    Optional<Like> findByCustomerIdAndTmdbIdAndMediaType(Long customerId, Long tmdbId, String mediaType);

    boolean existsByCustomerIdAndTmdbIdAndMediaType(Long customerId, Long tmdbId, String mediaType);

    void deleteByCustomerIdAndTmdbIdAndMediaType(Long customerId, Long tmdbId, String mediaType);

    long countByCustomerIdAndLikeStatus(Long customerId, LikeStatus likeStatus);

    long countByTmdbIdAndMediaTypeAndLikeStatus(Long tmdbId, String mediaType, LikeStatus likeStatus);

}
