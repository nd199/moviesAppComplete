package com.naren.moviesapp.Repo;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.TestConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.annotation.DirtiesContext;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(TestConfig.class)
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class CustomerRepositoryTest {

    @Autowired
    private CustomerRepository underTest;
    private Customer customer;

    @BeforeEach
    void setUp() {
        customer = new Customer();
        customer.setName("Test User");
        customer.setEmail("test@example.com");
        customer.setPassword("password123");
        customer.setPhoneNumber(9999999999L);
        customer.setImageUrl("");
        customer.setIsEmailVerified(true);
        customer.setAddress("Chennai, India");
        customer.setIsLogged(false);
        customer.setIsRegistered(true);
        customer.setIsSubscribed(false);
    }

    @Test
    void existsByEmail() {
        underTest.save(customer);
        var actual = underTest.existsByEmail(customer.getEmail());
        assertThat(actual).isTrue();
    }

    @Test
    void existsByPhoneNumber() {
        underTest.save(customer);
        var actual = underTest.existsByPhoneNumber(customer.getPhoneNumber());
        assertThat(actual).isTrue();
    }
}