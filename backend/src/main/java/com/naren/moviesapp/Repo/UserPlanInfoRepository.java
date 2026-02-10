package com.naren.moviesapp.Repo;

import com.naren.moviesapp.Entity.UserPlanInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPlanInfoRepository extends JpaRepository<UserPlanInfo, Long> {

    Optional<UserPlanInfo> findByCustomerId(Long customerId);

    @Query("SELECT upi FROM UserPlanInfo upi WHERE upi.customer.email = :email")
    Optional<UserPlanInfo> findByCustomerEmail(@Param("email") String email);

    @Query("SELECT upi FROM UserPlanInfo upi WHERE upi.customer.email = :email AND upi.isActive = true")
    Optional<UserPlanInfo> findActivePlanByEmail(@Param("email") String email);
}
