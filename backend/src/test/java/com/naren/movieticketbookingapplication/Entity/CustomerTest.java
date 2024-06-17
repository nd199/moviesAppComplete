package com.naren.movieticketbookingapplication.Entity;

import com.naren.movieticketbookingapplication.AbstractTestContainers;
import com.naren.movieticketbookingapplication.Dao.CustomerDaoImpl;
import com.naren.movieticketbookingapplication.Repo.CustomerRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class CustomerTest extends AbstractTestContainers {

    private AutoCloseable autoCloseable;

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerDaoImpl underTest;

    @Mock
    private Customer customer;


    @BeforeEach
    void setUp() {

        autoCloseable = MockitoAnnotations.openMocks(this);

        underTest = new CustomerDaoImpl(customerRepository);

        customer = new Customer(1L, FAKER.name().name(),
                FAKER.internet().emailAddress(), FAKER.internet().password(),
                Long.valueOf(FAKER.phoneNumber().subscriberNumber(9)), false,false, false);
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
        Long phoneNumber = customer.getPhoneNumber();
        underTest.existsByPhoneNumber(phoneNumber);
        verify(customerRepository).existsByPhoneNumber(phoneNumber);
    }

    @Test
    void getCustomerList() {
        Page<Customer> page = mock(Page.class);
        List<Customer> customers = List.of(new Customer());

        when(page.getContent()).thenReturn(customers);
        when(customerRepository.findAll(any(Pageable.class))).thenReturn(page);

        List<Customer> expected = underTest.getCustomerList();

        assertThat(expected).isEqualTo(customers);

        ArgumentCaptor<Pageable> pageableArgumentCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(customerRepository).findAll(pageableArgumentCaptor.capture());

        assertThat(pageableArgumentCaptor.getValue()).isEqualTo(Pageable.ofSize(1000));
    }

    @Test
    void deleteCustomer() {
        underTest.deleteCustomer(customer);
        verify(customerRepository).delete(customer);
    }
}
