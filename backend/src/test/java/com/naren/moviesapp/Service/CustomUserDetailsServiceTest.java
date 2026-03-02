package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Repo.AdminRepository;
import com.naren.moviesapp.Repo.ContentManagerRepository;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Security.AppUserPrincipal;
import com.naren.moviesapp.Security.CustomUserDetailsService;
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
class CustomUserDetailsServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private ContentManagerRepository contentManagerRepository;

    private CustomUserDetailsService underTest;

    @BeforeEach
    void setUp() {
        underTest = new CustomUserDetailsService(customerRepository, adminRepository, contentManagerRepository);
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
        assertThat(result).isInstanceOf(AppUserPrincipal.class);
        assertThat(result.getUsername()).isEqualTo(username);
        verify(customerRepository).findByEmail(username);
    }

    @Test
    void loadUserByUsername_NotFound() {
        String username = "nonexistent@example.com";

        when(adminRepository.findByEmail(username)).thenReturn(Optional.empty());
        when(customerRepository.findByEmail(username)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.loadUserByUsername(username))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessage("User not found with email: " + username);

        verify(customerRepository).findByEmail(username);
    }

    @Test
    void loadUserByUsername_NullUsername() {
        String username = null;

        when(adminRepository.findByEmail(username)).thenReturn(Optional.empty());
        when(customerRepository.findByEmail(username)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.loadUserByUsername(username))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessage("User not found with email: null");

        verify(customerRepository).findByEmail(username);
    }

    @Test
    void loadUserByUsername_EmptyUsername() {
        String username = "";

        when(adminRepository.findByEmail(username)).thenReturn(Optional.empty());
        when(customerRepository.findByEmail(username)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.loadUserByUsername(username))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessage("User not found with email: ");

        verify(customerRepository).findByEmail(username);
    }
}
