package com.naren.moviesapp.Repo;

import com.naren.moviesapp.Entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    Optional<Customer> findByEmail(String email);

    Optional<Customer> getCustomerByPhoneNumber(String phoneNumber);

    @Query(name = "getCustomerBy", nativeQuery = true,
            value = "Select * from customer order by  created_at limit 6")
    List<Customer> getCustomersByTop5();

    @Query(name = "getCustomerCountByEachMonthInYear", nativeQuery = true,
            value = """
                    SELECT extract(month from customer.updated_at) AS id,
                           COUNT(*)                                AS total
                    FROM customer
                    WHERE DATE_TRUNC('year', customer.created_at) = DATE_TRUNC('year', CURRENT_DATE)
                    GROUP BY id
                    ORDER BY id
                    """)
    List<Object[]> getCustomerCountByEachMonthInYear();
}
