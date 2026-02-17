package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Enum.RoleName;
import com.naren.moviesapp.Repo.RoleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoleServiceTest {

    @Mock
    private RoleRepository roleRepository;
    private RoleService underTest;

    @BeforeEach
    void setUp() {
        underTest = new RoleService(roleRepository);
    }

    @Test
    void saveRole() {
        Role role = new Role(RoleName.ROLE_USER);

        when(roleRepository.existsRoleByName(role.getName())).thenReturn(false);

        underTest.saveRole(role);

        ArgumentCaptor<Role> roleArgumentCaptor = ArgumentCaptor.forClass(Role.class);

        verify(roleRepository).save(roleArgumentCaptor.capture());

        Role captured = roleArgumentCaptor.getValue();

        assertThat(captured.getName()).isEqualTo(RoleName.ROLE_USER);
    }

    @Test
    void saveRoleDoesNotSaveIfRoleExists() {
        Role role = new Role(RoleName.ROLE_USER);

        when(roleRepository.existsRoleByName(role.getName())).thenReturn(true);

        underTest.saveRole(role);

        verify(roleRepository, never()).save(any());
    }

    @Test
    void updateRole() {
        Role role = new Role(RoleName.ROLE_ADMIN);
        role.setId(1L);

        underTest.updateRole(role);

        verify(roleRepository).save(role);
    }

    @Test
    void findRoleById() {
        Long roleId = 1L;
        Role expectedRole = new Role(RoleName.ROLE_USER);
        expectedRole.setId(roleId);

        when(roleRepository.findById(roleId)).thenReturn(Optional.of(expectedRole));

        Role actualRole = underTest.findRoleById(roleId);

        assertThat(actualRole).isEqualTo(expectedRole);
    }

    @Test
    void findRoleByIdReturnsNullIfNotFound() {
        Long roleId = 999L;

        when(roleRepository.findById(roleId)).thenReturn(Optional.empty());

        Role actualRole = underTest.findRoleById(roleId);

        assertThat(actualRole).isNull();
    }

    @Test
    void getAllRoles() {
        List<Role> expectedRoles = Arrays.asList(
                new Role(RoleName.ROLE_USER),
                new Role(RoleName.ROLE_ADMIN),
                new Role(RoleName.ROLE_SUPER_ADMIN)
        );

        when(roleRepository.findAll()).thenReturn(expectedRoles);

        List<Role> actualRoles = underTest.getAllRoles();

        assertThat(actualRoles).isEqualTo(expectedRoles);
        verify(roleRepository).findAll();
    }

    @Test
    void deleteRole() {
        Long roleId = 1L;

        underTest.deleteRole(roleId);

        verify(roleRepository).deleteById(roleId);
    }

    @Test
    void findRoleByName() {
        RoleName roleName = RoleName.ROLE_USER;
        Role expectedRole = new Role(roleName);

        when(roleRepository.findRoleByName(roleName)).thenReturn(expectedRole);

        Role actualRole = underTest.findRoleByName(roleName);

        assertThat(actualRole).isEqualTo(expectedRole);
        verify(roleRepository).findRoleByName(roleName);
    }

    @Test
    void findRoleByNameWithString() {
        String roleName = "ROLE_USER";
        Role expectedRole = new Role(RoleName.ROLE_USER);

        when(roleRepository.findRoleByName(RoleName.ROLE_USER)).thenReturn(expectedRole);

        Role actualRole = underTest.findRoleByName(roleName);

        assertThat(actualRole).isEqualTo(expectedRole);
        verify(roleRepository).findRoleByName(RoleName.ROLE_USER);
    }

    @Test
    void existsByName() {
        Role role = new Role(RoleName.ROLE_USER);

        when(roleRepository.existsRoleByName(role.getName())).thenReturn(true);

        boolean result = underTest.existsByName(role);

        assertThat(result).isTrue();
        verify(roleRepository).existsRoleByName(role.getName());
    }

    @Test
    void existsByNameReturnsFalse() {
        Role role = new Role(RoleName.ROLE_USER);

        when(roleRepository.existsRoleByName(role.getName())).thenReturn(false);

        boolean result = underTest.existsByName(role);

        assertThat(result).isFalse();
        verify(roleRepository).existsRoleByName(role.getName());
    }
}
