package com.naren.moviesapp.Repo;

import com.naren.moviesapp.Entity.ContentManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContentManagerRepository extends JpaRepository<ContentManager, Long> {

    Optional<ContentManager> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    List<ContentManager> findBySpecialization(String specialization);

    List<ContentManager> findByDepartment(String department);

    List<ContentManager> findByAccessLevel(Integer accessLevel);

    List<ContentManager> findByIsActive(Boolean isActive);

    @Query("SELECT cm FROM ContentManager cm JOIN cm.roles r WHERE r.name = :roleName")
    List<ContentManager> findByRoleName(String roleName);

    @Query("SELECT cm FROM ContentManager cm WHERE cm.specialization = :specialization AND cm.isActive = true")
    List<ContentManager> findActiveBySpecialization(String specialization);

    @Query("SELECT COUNT(cm) FROM ContentManager cm WHERE cm.isActive = true")
    Long countActiveContentManagers();

    @Query("SELECT cm FROM ContentManager cm WHERE cm.department = :department AND cm.accessLevel >= :minAccessLevel")
    List<ContentManager> findByDepartmentAndMinAccessLevel(String department, Integer minAccessLevel);
}
