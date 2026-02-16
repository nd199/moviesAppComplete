package com.naren.moviesapp.Repo;

import com.naren.moviesapp.AbstractTestContainers;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.TestConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(TestConfig.class)
@Transactional
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class CustomerRepositoryTest extends AbstractTestContainers {

    @Autowired
    private CustomerRepository underTest;

    @Test
    void existsByEmail() {
        Customer customer = new Customer();
        customer.setName("Test User");
        customer.setEmail("test-" + UUID.randomUUID() + "@example.com");
        customer.setPassword("password123");
        customer.setPhoneNumber("9" + UUID.randomUUID().toString().substring(0, 9));
        customer.setImageUrl("");
        customer.setIsEmailVerified(true);
        customer.setAddress("Chennai, India");
        customer.setIsLogged(false);
        customer.setIsRegistered(true);
        customer.setIsSubscribed(false);

        underTest.save(customer);
        var actual = underTest.existsByEmail(customer.getEmail());
        assertThat(actual).isTrue();
    }

    @Test
    void existsByPhoneNumber() {
        Customer customer = new Customer();
        customer.setName("Test User");
        customer.setEmail("test-" + UUID.randomUUID() + "@example.com");
        customer.setPassword("password123");
        customer.setPhoneNumber("9" + UUID.randomUUID().toString().substring(0, 9));
        customer.setImageUrl("");
        customer.setIsEmailVerified(true);
        customer.setAddress("Chennai, India");
        customer.setIsLogged(false);
        customer.setIsRegistered(true);
        customer.setIsSubscribed(false);

        underTest.save(customer);
        var actual = underTest.existsByPhoneNumber(customer.getPhoneNumber());
        assertThat(actual).isTrue();
    }
}
