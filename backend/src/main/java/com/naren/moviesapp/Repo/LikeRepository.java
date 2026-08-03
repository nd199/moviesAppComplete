package com.naren.moviesapp.Repo;

import com.naren.moviesapp.Entity.Like;
import com.naren.moviesapp.Entity.LikeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
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

    long countByLikeStatus(LikeStatus likeStatus);

    @Query("SELECT l.tmdbId, l.title, l.mediaType, " +
            "SUM(CASE WHEN l.likeStatus = com.naren.moviesapp.Entity.LikeStatus.LIKE THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN l.likeStatus = com.naren.moviesapp.Entity.LikeStatus.DISLIKE THEN 1 ELSE 0 END) " +
            "FROM Like l GROUP BY l.tmdbId, l.title, l.mediaType")
    List<Object[]> countReactionsByItem();

    @Query("SELECT l.tmdbId, l.title, l.mediaType, " +
            "SUM(CASE WHEN l.likeStatus = com.naren.moviesapp.Entity.LikeStatus.LIKE THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN l.likeStatus = com.naren.moviesapp.Entity.LikeStatus.DISLIKE THEN 1 ELSE 0 END) " +
            "FROM Like l WHERE l.likedAt >= :since GROUP BY l.tmdbId, l.title, l.mediaType")
    List<Object[]> countReactionsByItemSince(@Param("since") LocalDateTime since);

}
