package com.naren.moviesapp.Repo;

import com.naren.moviesapp.Entity.RefreshToken;
import com.naren.moviesapp.Entity.UserType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    Optional<RefreshToken> findByToken(String token);

    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.userId = :userId AND rt.userType = :userType")
    void deleteByUserIdAndUserType(@Param("userId") Long userId, @Param("userType") UserType userType);

    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.familyId = :familyId")
    void deleteByFamilyId(@Param("familyId") String familyId);

    List<RefreshToken> findByUserIdAndUserType(Long userId, UserType userType);
}
