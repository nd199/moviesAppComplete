package com.naren.moviesapp.Auth;

import com.naren.moviesapp.Dto.CustomerDTO;
import com.naren.moviesapp.Dto.CustomerDTOMapper;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Entity.RoleName;
import com.naren.moviesapp.Exception.InvalidCredentialsException;
import com.naren.moviesapp.Exception.ResourceNotFoundException;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.TestData.TestDataFactory;
import com.naren.moviesapp.jwt.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private CustomerDTOMapper customerDTOMapper;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthService underTest;

    private Customer principal;

    @BeforeEach
    void setUp() {
        principal = TestDataFactory.createTestCustomer(10L);
        principal.setName("User");
        principal.setEmail("user@codeNaren.com");
        principal.setPhoneNumber("9999999999");
        principal.setImageUrl("");
        principal.setIsEmailVerified(true);
        principal.setAddress("Chennai, India");
        principal.setIsRegistered(true);
        principal.setRoles(Set.of(new Role(RoleName.ROLE_USER)));
    }

    @Test
    void login_whenCustomerNotLogged_updatesCustomer_andIssuesToken() {

        principal.setIsLogged(false);

        when(authenticationManager.authenticate(any()))
                .thenReturn(authentication);
        when(authentication.getPrincipal())
                .thenReturn(principal);
        when(customerRepository.existsByEmail(principal.getEmail()))
                .thenReturn(true);

        CustomerDTO mapped = buildDTO("ROLE_USER");
        when(customerDTOMapper.apply(principal)).thenReturn(mapped);
        when(jwtUtil.issueToken(eq(mapped.email()), anySet()))
                .thenReturn("jwt-token");

        AuthResponse response =
                underTest.login(new AuthRequest("user@codeNaren.com", "password"));

        assertThat(response.customerDTO()).isEqualTo(mapped);
        assertThat(response.token()).isEqualTo("jwt-token");

        verify(customerRepository).save(principal);
        verify(jwtUtil).issueToken(eq(mapped.email()), anySet());
    }

    @Test
    void login_whenCustomerAlreadyLogged_doesNotUpdateCustomer() {

        principal.setIsLogged(true);

        when(authenticationManager.authenticate(any()))
                .thenReturn(authentication);
        when(authentication.getPrincipal())
                .thenReturn(principal);
        when(customerRepository.existsByEmail(principal.getEmail()))
                .thenReturn(true);

        CustomerDTO mapped = buildDTO("ROLE_ADMIN");
        when(customerDTOMapper.apply(principal)).thenReturn(mapped);
        when(jwtUtil.issueToken(eq(mapped.email()), anySet()))
                .thenReturn("jwt-token");

        AuthResponse response =
                underTest.login(new AuthRequest("user@codeNaren.com", "password"));

        assertThat(response.customerDTO()).isEqualTo(mapped);
        assertThat(response.token()).isEqualTo("jwt-token");

        verify(customerRepository, never()).save(any());
    }

    @Test
    void login_throwsResourceNotFound_whenProfileMissing() {

        when(authenticationManager.authenticate(any()))
                .thenReturn(authentication);
        when(authentication.getPrincipal())
                .thenReturn(principal);
        when(customerRepository.existsByEmail(principal.getEmail()))
                .thenReturn(false);

        assertThatThrownBy(() ->
                underTest.login(new AuthRequest("user@codeNaren.com", "password"))
        ).isInstanceOf(ResourceNotFoundException.class);

        verify(jwtUtil, never())
                .issueToken(anyString(), anySet());
    }

    @Test
    void login_wrapsBadCredentials() {

        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("bad"));

        assertThatThrownBy(() ->
                underTest.login(new AuthRequest("user@codeNaren.com", "bad"))
        ).isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void login_superAdmin_canLoginWithoutVerificationOrRegistration() {

        principal.setIsEmailVerified(false);
        principal.setIsRegistered(false);
        principal.setIsLogged(false);
        principal.setRoles(Set.of(new Role(RoleName.ROLE_SUPER_ADMIN)));

        when(authenticationManager.authenticate(any()))
                .thenReturn(authentication);
        when(authentication.getPrincipal())
                .thenReturn(principal);
        when(customerRepository.existsByEmail(principal.getEmail()))
                .thenReturn(true);

        CustomerDTO mapped = buildDTO("ROLE_SUPER_ADMIN");
        when(customerDTOMapper.apply(principal)).thenReturn(mapped);
        when(jwtUtil.issueToken(eq(mapped.email()), anySet()))
                .thenReturn("jwt-token");

        AuthResponse response =
                underTest.login(new AuthRequest("superadmin@codeNaren.com", "password"));

        assertThat(response.customerDTO().roles())
                .contains("ROLE_SUPER_ADMIN");

        verify(customerRepository).save(principal);
        verify(jwtUtil).issueToken(eq(mapped.email()), anySet());
    }

    private CustomerDTO buildDTO(String role) {
        return new CustomerDTO(
                principal.getId(),
                principal.getName(),
                principal.getEmail(),
                principal.getPhoneNumber(),
                principal.getImageUrl(),
                principal.getIsEmailVerified(),
                principal.getAddress(),
                true,
                principal.getIsRegistered(),
                false,
                List.of(),
                List.of(role),
                LocalDateTime.now(),
                LocalDateTime.now(),
                principal
        );
    }
}