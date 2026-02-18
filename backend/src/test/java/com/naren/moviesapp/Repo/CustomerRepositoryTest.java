package com.naren.moviesapp.Repo;

import com.naren.moviesapp.AbstractRepositoryTest;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.TestData.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;

public class CustomerRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private CustomerRepository underTest;

    @Test
    void existsByEmail() {
        Customer customer = TestDataFactory.createTestCustomer();
        underTest.save(customer);
        var actual = underTest.existsByEmail(customer.getEmail());
        assertThat(actual).isTrue();
    }

    @Test
    void existsByPhoneNumber() {
        Customer customer = TestDataFactory.createTestCustomer();
        underTest.save(customer);
        var actual = underTest.existsByPhoneNumber(customer.getPhoneNumber());
        assertThat(actual).isTrue();
    }
}
