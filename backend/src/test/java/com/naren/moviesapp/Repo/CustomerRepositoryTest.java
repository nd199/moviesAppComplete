package com.naren.moviesapp.Repo;

import com.naren.moviesapp.AbstractTestContainers;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.TestConfig;
import com.naren.moviesapp.TestData.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(TestConfig.class)
@ActiveProfiles("test")
public class CustomerRepositoryTest extends AbstractTestContainers {

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
