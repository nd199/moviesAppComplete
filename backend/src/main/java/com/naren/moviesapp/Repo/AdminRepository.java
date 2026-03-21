package com.naren.moviesapp.Repo;

import com.naren.moviesapp.Entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    @Query("SELECT a FROM Admin a WHERE LOWER(a.email) = LOWER(:email)")
    Optional<Admin> findByEmail(@Param("email") String email);

    @Query("SELECT a FROM Admin a LEFT JOIN FETCH a.roles WHERE LOWER(a.email) = LOWER(:email)")
    Optional<Admin> findByEmailWithRoles(@Param("email") String email);

    Optional<Admin> getAdminByPhoneNumber(String phoneNumber);

    List<Admin> findByIsActive(Boolean isActive);

    List<Admin> findByDepartment(String department);

    List<Admin> findByAccessLevelGreaterThanEqual(Integer accessLevel);

    @Query(value = "SELECT * FROM admin ORDER BY created_at DESC LIMIT 5", nativeQuery = true)
    List<Admin> getAdminsByTop5();

    @Query(value = """
            SELECT EXTRACT(MONTH FROM admin.updated_at) AS id,
                   COUNT(*) AS total
            FROM admin
            WHERE DATE_TRUNC('year', admin.created_at) = DATE_TRUNC('year', CURRENT_DATE)
            GROUP BY id
            ORDER BY id
            """, nativeQuery = true)
    List<Object[]> getAdminCountByEachMonthInYear();

    @Query("SELECT COUNT(a) FROM Admin a WHERE a.isActive = true")
    long countActiveAdmins();

    @Query("SELECT COUNT(a) FROM Admin a WHERE a.department = :department")
    long countAdminsByDepartment(String department);

    @Query("SELECT a.department, COUNT(a) FROM Admin a GROUP BY a.department")
    List<Object[]> getAdminCountByDepartment();

    List<Admin> getAdminsByIsActive(Boolean isActive);
}
