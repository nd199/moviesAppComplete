package com.naren.moviesapp.Auth;

import com.naren.moviesapp.Dao.CustomerDao;
import com.naren.moviesapp.Dto.CustomerDTO;
import com.naren.moviesapp.Dto.CustomerDTOMapper;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Exception.*;
import com.naren.moviesapp.Record.CustomerUpdateRequest;
import com.naren.moviesapp.Service.CustomerService;
import com.naren.moviesapp.jwt.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anySet;
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
    private CustomerService customerService;

    @Mock
    private CustomerDao customerDao;

    @Mock
    private Authentication authentication;

    @Captor
    private ArgumentCaptor<CustomerUpdateRequest> updateRequestCaptor;

    private AuthService underTest;

    @BeforeEach
    void setUp() {
        underTest = new AuthService(
                authenticationManager,
                customerDTOMapper,
                jwtUtil,
                customerService,
                customerDao
        );
    }

    @Test
    void login_whenCustomerNotLogged_updatesCustomer_andIssuesToken() {
        AuthRequest request = new AuthRequest("user@codeNaren.com", "password");

        Customer principal = new Customer();
        principal.setId(10L);
        principal.setName("User");
        principal.setEmail("user@codeNaren.com");
        principal.setPhoneNumber(9999999999L);
        principal.setImageUrl("");
        principal.setIsEmailVerified(true);
        principal.setAddress("Chennai, India");
        principal.setIsLogged(false);
        principal.setIsRegistered(true);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(principal);
        when(customerDao.existsByEmail(principal.getEmail())).thenReturn(true);

        CustomerDTO updated = new CustomerDTO(
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
                List.of("ROLE_USER"),
                LocalDateTime.now(),
                LocalDateTime.now(),
                principal
        );

        when(customerService.updateCustomer(any(CustomerUpdateRequest.class), eq(principal.getId())))
                .thenReturn(updated);
        when(jwtUtil.issueToken(eq(updated.email()), anySet())).thenReturn("jwt-token");

        AuthResponse response = underTest.login(request);

        assertThat(response.customerDTO()).isEqualTo(updated);
        assertThat(response.token()).isEqualTo("jwt-token");

        verify(customerService).updateCustomer(updateRequestCaptor.capture(), eq(principal.getId()));
        assertThat(updateRequestCaptor.getValue().isLogged()).isTrue();

        verify(jwtUtil).issueToken(eq(updated.email()), anySet());
        verify(customerDTOMapper, never()).apply(any());
    }

    @Test
    void login_whenCustomerAlreadyLogged_doesNotUpdateCustomer_andUsesMapper() {
        AuthRequest request = new AuthRequest("user@codeNaren.com", "password");

        Customer principal = new Customer();
        principal.setId(10L);
        principal.setName("User");
        principal.setEmail("user@codeNaren.com");
        principal.setPhoneNumber(9999999999L);
        principal.setImageUrl("");
        principal.setIsEmailVerified(true);
        principal.setAddress("Chennai, India");
        principal.setIsLogged(true);
        principal.setIsRegistered(true);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(principal);
        when(customerDao.existsByEmail(principal.getEmail())).thenReturn(true);

        CustomerDTO mapped = new CustomerDTO(
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
                List.of("ROLE_ADMIN"),
                LocalDateTime.now(),
                LocalDateTime.now(),
                principal
        );

        when(customerDTOMapper.apply(principal)).thenReturn(mapped);
        when(jwtUtil.issueToken(eq(mapped.email()), anySet())).thenReturn("jwt-token");

        AuthResponse response = underTest.login(request);

        assertThat(response.customerDTO()).isEqualTo(mapped);
        assertThat(response.token()).isEqualTo("jwt-token");

        verify(customerService, never()).updateCustomer(any(), any());
        verify(customerDTOMapper).apply(principal);
        verify(jwtUtil).issueToken(eq(mapped.email()), anySet());
    }

    @Test
    void login_throwsResourceNotFound_whenProfileMissing() {
        AuthRequest request = new AuthRequest("user@codeNaren.com", "password");

        Customer principal = new Customer();
        principal.setEmail("user@codeNaren.com");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(principal);
        when(customerDao.existsByEmail(principal.getEmail())).thenReturn(false);

        assertThatThrownBy(() -> underTest.login(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Profile not found");

        verify(customerService, never()).updateCustomer(any(), any());
        verify(customerDTOMapper, never()).apply(any());
        verify(jwtUtil, never()).issueToken(any(), anySet());
    }

    @Test
    void login_wrapsBadCredentials() {
        AuthRequest request = new AuthRequest("user@codeNaren.com", "bad");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("bad credentials"));

        assertThatThrownBy(() -> underTest.login(request))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessageContaining("Invalid email or password");
    }
}
