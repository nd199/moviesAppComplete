package com.naren.moviesapp.Repo;

import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Enum.RoleName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoleRepositoryTest {

    @Mock
    private RoleRepository roleRepository;

    @Test
    void findRoleByName_ReturnsRole_WhenRoleExists() {
        RoleName roleName = RoleName.ROLE_USER;
        Role expectedRole = new Role(roleName);

        when(roleRepository.findByName(roleName)).thenReturn(Optional.of(expectedRole));

        Role result = roleRepository.findByName(roleName).orElse(null);

        assertThat(result).isEqualTo(expectedRole);
        verify(roleRepository).findByName(roleName);
    }

    @Test
    void findRoleByName_ReturnsNull_WhenRoleDoesNotExist() {
        RoleName roleName = RoleName.ROLE_USER;

        when(roleRepository.findByName(roleName)).thenReturn(Optional.empty());

        Role result = roleRepository.findByName(roleName).orElse(null);

        assertThat(result).isNull();
        verify(roleRepository).findByName(roleName);
    }

    @Test
    void existsRoleByName_ReturnsTrue_WhenRoleExists() {
        RoleName roleName = RoleName.ROLE_USER;
        Role role = new Role(roleName);

        when(roleRepository.existsByName(roleName)).thenReturn(true);

        boolean result = roleRepository.existsByName(roleName);

        assertThat(result).isTrue();
        verify(roleRepository).existsByName(roleName);
    }

    @Test
    void existsRoleByName_ReturnsFalse_WhenRoleDoesNotExist() {
        RoleName roleName = RoleName.ROLE_USER;

        when(roleRepository.existsByName(roleName)).thenReturn(false);

        boolean result = roleRepository.existsByName(roleName);

        assertThat(result).isFalse();
        verify(roleRepository).existsByName(roleName);
    }

    @Test
    void existsRoleByName_WithDefaultMethod_ReturnsTrue_WhenRoleExists() {
        String roleName = "ROLE_USER";
        Role role = new Role(RoleName.valueOf(roleName));

        when(roleRepository.existsByName(RoleName.valueOf(roleName))).thenReturn(true);

        boolean result = roleRepository.existsByName(RoleName.valueOf(roleName));

        assertThat(result).isTrue();
        verify(roleRepository).existsByName(RoleName.valueOf(roleName));
    }

    @Test
    void existsRoleByName_WithDefaultMethod_ReturnsFalse_WhenRoleDoesNotExist() {
        String roleName = "ROLE_NONEXISTENT";

        when(roleRepository.existsByName(RoleName.ROLE_USER)).thenReturn(false);

        boolean result = roleRepository.existsByName(RoleName.ROLE_USER);

        assertThat(result).isFalse();
        verify(roleRepository).existsByName(RoleName.ROLE_USER);
    }
}
