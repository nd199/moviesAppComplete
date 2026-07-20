package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.PasswordResetToken;
import com.naren.moviesapp.Exception.ResourceNotFoundException;
import com.naren.moviesapp.Record.PasswordResetRequest;
import com.naren.moviesapp.Repo.AdminRepository;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Repo.PasswordRTRepository;
import com.naren.moviesapp.Utils.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PasswordResetServiceTest {

    @Mock
    private PasswordRTRepository tokenRepository;
    @Mock
    private EmailService emailService;
    @Mock
    private CustomerService customerService;
    @Mock
    private AdminService adminService;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private AdminRepository adminRepository;

    private PasswordResetService underTest;

    @BeforeEach
    void setUp() {
        underTest = new PasswordResetService(tokenRepository, emailService, customerService, adminService, customerRepository, adminRepository);
    }

    @Test
    void createPasswordResetToken_Success() {
        String email = "test@example.com";

        when(customerRepository.existsByEmail(email)).thenReturn(false);
        when(adminRepository.existsByEmail(email)).thenReturn(false);

        assertThatThrownBy(() -> underTest.createPasswordResetToken(email))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Your account is not present please check your email else register first");

        verify(tokenRepository, never()).save(any());
        verify(emailService, never()).sendPasswordResetMail(any(), any());
    }

    @Test
    void createPasswordResetToken_CustomerEmailExists() {
        String email = "test@example.com";

        when(customerRepository.existsByEmail(email)).thenReturn(true);
        doNothing().when(emailService).sendPasswordResetMail(any(), any());

        underTest.createPasswordResetToken(email);

        ArgumentCaptor<PasswordResetToken> tokenCaptor = ArgumentCaptor.forClass(PasswordResetToken.class);
        verify(tokenRepository).deleteByEmail(email);
        verify(tokenRepository).save(tokenCaptor.capture());

        PasswordResetToken capturedToken = tokenCaptor.getValue();
        assertThat(capturedToken.getEmail()).isEqualTo(email);
        assertThat(capturedToken.getToken()).isNotNull();
        assertThat(capturedToken.getExpiry()).isAfter(Instant.now());

        verify(emailService).sendPasswordResetMail(eq(email), eq(capturedToken.getToken()));
    }

    @Test
    void createPasswordResetToken_AdminEmailExists() {
        String email = "admin@example.com";

        when(customerRepository.existsByEmail(email)).thenReturn(false);
        when(adminRepository.existsByEmail(email)).thenReturn(true);
        doNothing().when(emailService).sendPasswordResetMail(any(), any());

        underTest.createPasswordResetToken(email);

        ArgumentCaptor<PasswordResetToken> tokenCaptor = ArgumentCaptor.forClass(PasswordResetToken.class);
        verify(tokenRepository).deleteByEmail(email);
        verify(tokenRepository).save(tokenCaptor.capture());

        PasswordResetToken capturedToken = tokenCaptor.getValue();
        assertThat(capturedToken.getEmail()).isEqualTo(email);
        assertThat(capturedToken.getToken()).isNotNull();
        assertThat(capturedToken.getExpiry()).isAfter(Instant.now());

        verify(emailService).sendPasswordResetMail(eq(email), eq(capturedToken.getToken()));
    }

    @Test
    void createPasswordResetToken_EmailServiceFails() {
        String email = "test@example.com";

        when(customerRepository.existsByEmail(email)).thenReturn(true);
        doThrow(new RuntimeException("Email failed")).when(emailService).sendPasswordResetMail(any(), any());

        assertThatThrownBy(() -> underTest.createPasswordResetToken(email))
                .isInstanceOf(com.naren.moviesapp.Exception.EmailSendingException.class)
                .hasMessage("Failed to send password reset email");

        verify(tokenRepository).deleteByEmail(email);
        verify(tokenRepository).save(any());
    }

    @Test
    void isTokenValid_ValidToken() {
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setExpiry(Instant.now().plus(1, java.time.temporal.ChronoUnit.HOURS));

        when(tokenRepository.findByToken(token)).thenReturn(Optional.of(resetToken));

        boolean result = underTest.isTokenValid(token);

        assertThat(result).isTrue();
        verify(tokenRepository).findByToken(token);
    }

    @Test
    void isTokenValid_ExpiredToken() {
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setExpiry(Instant.now().minus(1, java.time.temporal.ChronoUnit.HOURS));

        when(tokenRepository.findByToken(token)).thenReturn(Optional.of(resetToken));

        boolean result = underTest.isTokenValid(token);

        assertThat(result).isFalse();
        verify(tokenRepository).findByToken(token);
    }

    @Test
    void isTokenValid_NonExistentToken() {
        String token = UUID.randomUUID().toString();

        when(tokenRepository.findByToken(token)).thenReturn(Optional.empty());

        boolean result = underTest.isTokenValid(token);

        assertThat(result).isFalse();
        verify(tokenRepository).findByToken(token);
    }

    @Test
    void resetPassword_CustomerSuccess() {
        String token = UUID.randomUUID().toString();
        String newPassword = "newPassword123";
        String email = "test@example.com";
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setEmail(email);
        resetToken.setExpiry(Instant.now().plus(1, java.time.temporal.ChronoUnit.HOURS));

        when(tokenRepository.findByToken(token)).thenReturn(Optional.of(resetToken));
        when(customerRepository.existsByEmail(email)).thenReturn(true);

        PasswordResetRequest request = new PasswordResetRequest(token, newPassword);
        underTest.resetPassword(request);

        verify(customerService).updatePassword(email, newPassword);
        verify(tokenRepository).deleteByEmail(email);
    }

    @Test
    void resetPassword_AdminSuccess() {
        String token = UUID.randomUUID().toString();
        String newPassword = "newPassword123";
        String email = "admin@example.com";
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setEmail(email);
        resetToken.setExpiry(Instant.now().plus(1, java.time.temporal.ChronoUnit.HOURS));

        when(tokenRepository.findByToken(token)).thenReturn(Optional.of(resetToken));
        when(customerRepository.existsByEmail(email)).thenReturn(false);
        when(adminRepository.existsByEmail(email)).thenReturn(true);

        PasswordResetRequest request = new PasswordResetRequest(token, newPassword);
        underTest.resetPassword(request);

        verify(adminService).updateAdminPassword(email, newPassword);
        verify(tokenRepository).deleteByEmail(email);
    }

    @Test
    void resetPassword_InvalidToken() {
        String token = UUID.randomUUID().toString();
        String newPassword = "newPassword123";

        when(tokenRepository.findByToken(token)).thenReturn(Optional.empty());

        PasswordResetRequest request = new PasswordResetRequest(token, newPassword);

        assertThatThrownBy(() -> underTest.resetPassword(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Token is Expired or Invalid");

        verify(customerService, never()).updatePassword(any(), any());
        verify(adminService, never()).updateAdminPassword(any(), any());
        verify(tokenRepository, never()).deleteByEmail(any());
    }

    @Test
    void resetPassword_ExpiredToken() {
        String token = UUID.randomUUID().toString();
        String newPassword = "newPassword123";
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setEmail("test@example.com");
        resetToken.setExpiry(Instant.now().minus(1, java.time.temporal.ChronoUnit.HOURS));

        when(tokenRepository.findByToken(token)).thenReturn(Optional.of(resetToken));

        PasswordResetRequest request = new PasswordResetRequest(token, newPassword);

        assertThatThrownBy(() -> underTest.resetPassword(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Token is Expired or Invalid");

        verify(customerService, never()).updatePassword(any(), any());
        verify(adminService, never()).updateAdminPassword(any(), any());
        verify(tokenRepository, never()).deleteByEmail(any());
    }
}
