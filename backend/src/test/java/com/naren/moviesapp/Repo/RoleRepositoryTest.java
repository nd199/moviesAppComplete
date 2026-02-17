package com.naren.moviesapp.Repo;

import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Enum.RoleName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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

        when(roleRepository.findRoleByName(roleName)).thenReturn(expectedRole);

        Role result = roleRepository.findRoleByName(roleName);

        assertThat(result).isEqualTo(expectedRole);
        verify(roleRepository).findRoleByName(roleName);
    }

    @Test
    void findRoleByName_ReturnsNull_WhenRoleDoesNotExist() {
        RoleName roleName = RoleName.ROLE_USER;

        when(roleRepository.findRoleByName(roleName)).thenReturn(null);

        Role result = roleRepository.findRoleByName(roleName);

        assertThat(result).isNull();
        verify(roleRepository).findRoleByName(roleName);
    }

    @Test
    void existsRoleByName_ReturnsTrue_WhenRoleExists() {
        RoleName roleName = RoleName.ROLE_USER;
        Role role = new Role(roleName);

        when(roleRepository.existsRoleByName(roleName)).thenReturn(true);

        boolean result = roleRepository.existsRoleByName(roleName);

        assertThat(result).isTrue();
        verify(roleRepository).existsRoleByName(roleName);
    }

    @Test
    void existsRoleByName_ReturnsFalse_WhenRoleDoesNotExist() {
        RoleName roleName = RoleName.ROLE_USER;

        when(roleRepository.existsRoleByName(roleName)).thenReturn(false);

        boolean result = roleRepository.existsRoleByName(roleName);

        assertThat(result).isFalse();
        verify(roleRepository).existsRoleByName(roleName);
    }

    @Test
    void existsRoleByName_WithDefaultMethod_ReturnsTrue_WhenRoleExists() {
        String roleName = "ROLE_USER";
        Role role = new Role(RoleName.valueOf(roleName));

        when(roleRepository.existsRoleByName(roleName)).thenReturn(true);

        boolean result = roleRepository.existsRoleByName(roleName);

        assertThat(result).isTrue();
        verify(roleRepository).existsRoleByName(roleName);
    }

    @Test
    void existsRoleByName_WithDefaultMethod_ReturnsFalse_WhenRoleDoesNotExist() {
        String roleName = "ROLE_NONEXISTENT";

        when(roleRepository.existsRoleByName(roleName)).thenReturn(false);

        boolean result = roleRepository.existsRoleByName(roleName);

        assertThat(result).isFalse();
        verify(roleRepository).existsRoleByName(roleName);
    }
}
