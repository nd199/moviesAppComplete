package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.RefreshToken;
import com.naren.moviesapp.Entity.UserType;
import com.naren.moviesapp.Repo.AdminRepository;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Repository.RefreshTokenRepository;
import com.naren.moviesapp.TestData.TestDataFactory;
import com.naren.moviesapp.jwt.JwtUtil;
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
class RefreshTokenServiceTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private AdminRepository adminRepository;
    @Mock
    private JwtUtil jwtUtil;

    private RefreshTokenService underTest;

    @BeforeEach
    void setUp() {
        underTest = new RefreshTokenService(refreshTokenRepository, customerRepository, adminRepository, jwtUtil);
    }

    @Test
    void createRefreshToken_Success() {
        Customer user = TestDataFactory.createTestCustomer();
        user.setEmail("test@example.com");

        RefreshToken savedToken = TestDataFactory.createTestRefreshToken();
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(savedToken);

        RefreshToken result = underTest.createRefreshToken(user);

        verify(refreshTokenRepository).deleteByUserIdAndUserType(user.getId(), UserType.CUSTOMER);

        ArgumentCaptor<RefreshToken> tokenCaptor = ArgumentCaptor.forClass(RefreshToken.class);
        verify(refreshTokenRepository).save(tokenCaptor.capture());

        RefreshToken capturedToken = tokenCaptor.getValue();
        assertThat(capturedToken.getUserId()).isEqualTo(user.getId());
        assertThat(capturedToken.getUserType()).isEqualTo(UserType.CUSTOMER);
        assertThat(capturedToken.getToken()).isNotNull();
        assertThat(capturedToken.getExpiryDate()).isAfter(Instant.now().minusSeconds(1));
    }

    @Test
    void rotateRefreshToken_Success() {
        String oldToken = UUID.randomUUID().toString();
        Customer user = TestDataFactory.createTestCustomer();
        user.setEmail("test@example.com");

        RefreshToken existingToken = TestDataFactory.createTestRefreshToken();
        existingToken.setUserId(user.getId());
        existingToken.setUserType(UserType.CUSTOMER);
        existingToken.setToken(oldToken);
        existingToken.setExpiryDate(Instant.now().plus(1, java.time.temporal.ChronoUnit.DAYS));

        RefreshToken newSavedToken = TestDataFactory.createTestRefreshToken();
        when(refreshTokenRepository.findByToken(oldToken)).thenReturn(Optional.of(existingToken));
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(newSavedToken);

        RefreshToken result = underTest.rotateRefreshToken(oldToken);

        verify(refreshTokenRepository).delete(existingToken);

        ArgumentCaptor<RefreshToken> tokenCaptor = ArgumentCaptor.forClass(RefreshToken.class);
        verify(refreshTokenRepository).save(tokenCaptor.capture());

        RefreshToken capturedToken = tokenCaptor.getValue();
        assertThat(capturedToken.getUserId()).isEqualTo(user.getId());
        assertThat(capturedToken.getUserType()).isEqualTo(UserType.CUSTOMER);
        assertThat(capturedToken.getToken()).isNotEqualTo(oldToken);
        assertThat(capturedToken.getExpiryDate()).isAfter(Instant.now().minusSeconds(1));
    }

    @Test
    void rotateRefreshToken_TokenNotFound() {
        String oldToken = UUID.randomUUID().toString();

        when(refreshTokenRepository.findByToken(oldToken)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.rotateRefreshToken(oldToken))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Refresh token not found");

        verify(refreshTokenRepository).findByToken(oldToken);
        verify(refreshTokenRepository, never()).delete(any());
        verify(refreshTokenRepository, never()).save(any());
    }

    @Test
    void rotateRefreshToken_TokenExpired() {
        String oldToken = UUID.randomUUID().toString();
        Customer user = TestDataFactory.createTestCustomer();
        user.setEmail("test@example.com");

        RefreshToken existingToken = TestDataFactory.createTestRefreshToken();
        existingToken.setUserId(user.getId());
        existingToken.setUserType(UserType.CUSTOMER);
        existingToken.setToken(oldToken);
        existingToken.setExpiryDate(Instant.now().minus(1, java.time.temporal.ChronoUnit.DAYS));

        when(refreshTokenRepository.findByToken(oldToken)).thenReturn(Optional.of(existingToken));

        assertThatThrownBy(() -> underTest.rotateRefreshToken(oldToken))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Refresh token expired");

        verify(refreshTokenRepository).findByToken(oldToken);
        verify(refreshTokenRepository, never()).delete(any());
        verify(refreshTokenRepository, never()).save(any());
    }

    @Test
    void findByToken_ValidToken() {
        String token = UUID.randomUUID().toString();
        Customer user = TestDataFactory.createTestCustomer();
        user.setEmail("test@example.com");

        RefreshToken refreshToken = TestDataFactory.createTestRefreshToken();
        refreshToken.setUserId(user.getId());
        refreshToken.setUserType(UserType.CUSTOMER);
        refreshToken.setToken(token);
        refreshToken.setExpiryDate(Instant.now().plus(1, java.time.temporal.ChronoUnit.DAYS));

        when(refreshTokenRepository.findByToken(token)).thenReturn(Optional.of(refreshToken));

        RefreshToken result = underTest.findByToken(token);

        assertThat(result).isEqualTo(refreshToken);
        verify(refreshTokenRepository).findByToken(token);
    }

    @Test
    void findByToken_ExpiredToken() {
        String token = UUID.randomUUID().toString();
        Customer user = TestDataFactory.createTestCustomer();
        user.setEmail("test@example.com");

        RefreshToken refreshToken = TestDataFactory.createTestRefreshToken();
        refreshToken.setUserId(user.getId());
        refreshToken.setUserType(UserType.CUSTOMER);
        refreshToken.setToken(token);
        refreshToken.setExpiryDate(Instant.now().minus(1, java.time.temporal.ChronoUnit.DAYS));

        when(refreshTokenRepository.findByToken(token)).thenReturn(Optional.of(refreshToken));

        RefreshToken result = underTest.findByToken(token);

        assertThat(result).isNull();
        verify(refreshTokenRepository).findByToken(token);
    }

    @Test
    void findByToken_NonExistentToken() {
        String token = UUID.randomUUID().toString();

        when(refreshTokenRepository.findByToken(token)).thenReturn(Optional.empty());

        RefreshToken result = underTest.findByToken(token);

        assertThat(result).isNull();
        verify(refreshTokenRepository).findByToken(token);
    }

    @Test
    void verifyExpiration_ValidToken() {
        Customer user = TestDataFactory.createTestCustomer();
        user.setEmail("test@example.com");

        RefreshToken token = TestDataFactory.createTestRefreshToken();
        token.setUserId(user.getId());
        token.setUserType(UserType.CUSTOMER);
        token.setExpiryDate(Instant.now().plus(1, java.time.temporal.ChronoUnit.DAYS));

        RefreshToken result = underTest.verifyExpiration(token);

        assertThat(result).isEqualTo(token);
        verify(refreshTokenRepository, never()).delete(any());
    }

    @Test
    void verifyExpiration_ExpiredToken() {
        Customer user = TestDataFactory.createTestCustomer();
        user.setEmail("test@example.com");

        RefreshToken token = TestDataFactory.createTestRefreshToken();
        token.setUserId(user.getId());
        token.setUserType(UserType.CUSTOMER);
        token.setExpiryDate(Instant.now().minus(1, java.time.temporal.ChronoUnit.DAYS));

        assertThatThrownBy(() -> underTest.verifyExpiration(token))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Refresh token was expired");

        verify(refreshTokenRepository).delete(token);
    }

    @Test
    void deleteRefreshToken_ExistingToken() {
        String token = UUID.randomUUID().toString();
        Customer user = TestDataFactory.createTestCustomer();
        user.setEmail("test@example.com");

        RefreshToken refreshToken = TestDataFactory.createTestRefreshToken();
        refreshToken.setUserId(user.getId());
        refreshToken.setUserType(UserType.CUSTOMER);
        refreshToken.setToken(token);
        refreshToken.setExpiryDate(Instant.now().plus(1, java.time.temporal.ChronoUnit.DAYS));

        when(refreshTokenRepository.findByToken(token)).thenReturn(Optional.of(refreshToken));

        underTest.deleteRefreshToken(token);

        verify(refreshTokenRepository).delete(refreshToken);
    }

    @Test
    void deleteRefreshToken_NonExistentToken() {
        String token = UUID.randomUUID().toString();

        when(refreshTokenRepository.findByToken(token)).thenReturn(Optional.empty());

        underTest.deleteRefreshToken(token);

        verify(refreshTokenRepository, never()).delete(any());
    }

    @Test
    void deleteByUser_Success() {
        Customer user = TestDataFactory.createTestCustomer();
        user.setEmail("test@example.com");

        underTest.deleteByUserIdAndUserType(user.getId(), UserType.CUSTOMER);

        verify(refreshTokenRepository).deleteByUserIdAndUserType(user.getId(), UserType.CUSTOMER);
    }

    @Test
    void isValidRefreshToken_ValidToken() {
        String token = UUID.randomUUID().toString();
        Customer user = TestDataFactory.createTestCustomer();
        user.setEmail("test@example.com");

        RefreshToken refreshToken = TestDataFactory.createTestRefreshToken();
        refreshToken.setUserId(user.getId());
        refreshToken.setUserType(UserType.CUSTOMER);
        refreshToken.setToken(token);
        refreshToken.setExpiryDate(Instant.now().plus(1, java.time.temporal.ChronoUnit.DAYS));

        when(refreshTokenRepository.findByToken(token)).thenReturn(Optional.of(refreshToken));

        boolean result = underTest.isValidRefreshToken(token);

        assertThat(result).isTrue();
        verify(refreshTokenRepository).findByToken(token);
    }

    @Test
    void isValidRefreshToken_InvalidToken() {
        String token = UUID.randomUUID().toString();

        when(refreshTokenRepository.findByToken(token)).thenReturn(Optional.empty());

        boolean result = underTest.isValidRefreshToken(token);

        assertThat(result).isFalse();
        verify(refreshTokenRepository).findByToken(token);
    }

    @Test
    void isValidRefreshToken_ExpiredToken() {
        String token = UUID.randomUUID().toString();
        Customer user = TestDataFactory.createTestCustomer();
        user.setEmail("test@example.com");

        RefreshToken refreshToken = TestDataFactory.createTestRefreshToken();
        refreshToken.setUserId(user.getId());
        refreshToken.setUserType(UserType.CUSTOMER);
        refreshToken.setToken(token);
        refreshToken.setExpiryDate(Instant.now().minus(1, java.time.temporal.ChronoUnit.DAYS));

        when(refreshTokenRepository.findByToken(token)).thenReturn(Optional.of(refreshToken));

        boolean result = underTest.isValidRefreshToken(token);

        assertThat(result).isFalse();
        verify(refreshTokenRepository).findByToken(token);
    }

    @Test
    void isValidRefreshToken_ExceptionHandling() {
        String token = UUID.randomUUID().toString();

        when(refreshTokenRepository.findByToken(token))
                .thenThrow(new RuntimeException("Database error"));

        boolean result = underTest.isValidRefreshToken(token);

        assertThat(result).isFalse();
        verify(refreshTokenRepository).findByToken(token);
    }
}
