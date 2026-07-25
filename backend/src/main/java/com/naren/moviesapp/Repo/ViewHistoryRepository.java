package com.naren.moviesapp.Repo;

import com.naren.moviesapp.Entity.ViewHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ViewHistoryRepository extends JpaRepository<ViewHistory, Long> {

    @Query("SELECT vh FROM ViewHistory vh WHERE vh.customer.id = :customerId ORDER BY vh.viewedAt DESC")
    List<ViewHistory> findRecentByCustomerId(@Param("customerId") Long customerId, Pageable pageable);

    Optional<ViewHistory> findByCustomerIdAndTmdbIdAndMediaType(Long customerId, Long tmdbId, String mediaType);

    void deleteByCustomerIdAndTmdbIdAndMediaType(Long customerId, Long tmdbId, String mediaType);
}
