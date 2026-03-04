package com.naren.moviesapp.Repository;

import com.naren.moviesapp.Entity.BaseUser;
import com.naren.moviesapp.Entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    Optional<RefreshToken> findByToken(String token);

    void deleteByUser(BaseUser user);
}
