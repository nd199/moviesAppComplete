package com.naren.moviesapp.Dao;

import com.github.javafaker.Faker;
import com.naren.moviesapp.AbstractTestContainers;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.TestData.TestDataFactory;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class CustomerDaoImplTest extends AbstractTestContainers {

    private CustomerDao underTest;
    private AutoCloseable autoCloseable;
    @Mock
    private CustomerRepository customerRepository;
    private Customer customer;
    private static final Faker FAKER = new Faker();

    @BeforeEach
    void setUp() {
        autoCloseable = MockitoAnnotations.openMocks(this);
        underTest = new CustomerDao(customerRepository);

        customer = TestDataFactory.createTestCustomer(1L);
    }

    @AfterEach
    void tearDown() throws Exception {
        autoCloseable.close();
    }

    @Test
    void addCustomer() {

        underTest.addCustomer(customer);

        verify(customerRepository).save(customer);
    }

    @Test
    void getCustomer() {

        underTest.getCustomer(customer.getId());

        verify(customerRepository).findById(customer.getId());
    }

    @Test
    void updateCustomer() {
        underTest.updateCustomer(customer);

        verify(customerRepository).save(customer);
    }

    @Test
    void existsByEmail() {
        String email = customer.getEmail();

        underTest.existsByEmail(email);

        verify(customerRepository).existsByEmail(email);
    }

    @Test
    void existsByPhoneNumber() {
        String phoneNumber = customer.getPhoneNumber();

        underTest.existsByPhoneNumber(phoneNumber);
        verify(customerRepository).existsByPhoneNumber(phoneNumber);
    }

    @Test
    void getCustomerList() {
        Page<Customer> page = mock(Page.class);
        List<Customer> customers = List.of(TestDataFactory.createTestCustomer());

        when(page.getContent()).thenReturn(customers);
        when(customerRepository.findAll(any(Pageable.class))).thenReturn(page);

        List<Customer> expected = underTest.getCustomerList();

        assertThat(expected).isEqualTo(customers);
        verify(customerRepository).findAll(PageRequest.of(0, 20));
    }

    @Test
    void deleteCustomer() {

        underTest.deleteCustomer(customer);

        verify(customerRepository).delete(customer);
    }
}