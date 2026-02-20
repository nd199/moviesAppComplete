package com.naren.moviesapp.Repo;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    Optional<RefreshToken> findByToken(String token);

    void deleteByUser(Customer user);

    @Query("SELECT COUNT(r) FROM RefreshToken r WHERE r.user.id = :customerId")
    long countByCustomerId(@Param("customerId") Long customerId);

    @Query("DELETE FROM RefreshToken r WHERE r.user.id = :customerId")
    void deleteByCustomerId(@Param("customerId") Long customerId);
}
