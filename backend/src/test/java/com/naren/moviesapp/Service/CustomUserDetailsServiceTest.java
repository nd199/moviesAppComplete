package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Repo.AdminRepository;
import com.naren.moviesapp.Repo.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomerUserDetailsServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private AdminRepository adminRepository;

    private CustomerUserDetailsService underTest;

    @BeforeEach
    void setUp() {
        underTest = new CustomerUserDetailsService(customerRepository, adminRepository);
    }

    @Test
    void loadUserByUsername_Success() {
        String username = "test@example.com";
        Customer expectedCustomer = new Customer();
        expectedCustomer.setEmail(username);
        expectedCustomer.setPassword("encodedPassword");
        expectedCustomer.setName("Test User");

        when(customerRepository.findByEmail(username)).thenReturn(Optional.of(expectedCustomer));

        UserDetails result = underTest.loadUserByUsername(username);

        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo(username);
        verify(customerRepository).findByEmail(username);
    }

    @Test
    void loadUserByUsername_NotFound() {
        String username = "nonexistent@example.com";

        when(customerRepository.findByEmail(username)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.loadUserByUsername(username))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessage("User not found: " + username);

        verify(customerRepository).findByEmail(username);
    }

    @Test
    void loadUserByUsername_NullUsername() {
        String username = null;

        when(customerRepository.findByEmail(username)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.loadUserByUsername(username))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessage("User not found: null");

        verify(customerRepository).findByEmail(username);
    }

    @Test
    void loadUserByUsername_EmptyUsername() {
        String username = "";

        when(customerRepository.findByEmail(username)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.loadUserByUsername(username))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessage("User not found: ");

        verify(customerRepository).findByEmail(username);
    }
}
