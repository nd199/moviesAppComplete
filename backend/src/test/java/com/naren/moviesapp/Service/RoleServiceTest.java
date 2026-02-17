package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Enum.RoleName;
import com.naren.moviesapp.Repo.RoleRepository;
import com.naren.moviesapp.TestData.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
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
    void addRole() {
        // given
        Role role = TestDataFactory.createTestRole(RoleName.ROLE_USER);
        when(roleRepository.existsByName(RoleName.ROLE_USER)).thenReturn(false);

        // when
        underTest.saveRole(role);

        // then
        ArgumentCaptor<Role> roleArgumentCaptor = ArgumentCaptor.forClass(Role.class);
        verify(roleRepository).save(roleArgumentCaptor.capture());
        Role capturedRole = roleArgumentCaptor.getValue();
        assertThat(capturedRole).isEqualTo(role);
    }

    @Test
    void addRoleWhenRoleExists() {
        // given
        Role role = TestDataFactory.createTestRole(RoleName.ROLE_USER);
        when(roleRepository.existsByName(RoleName.ROLE_USER)).thenReturn(true);

        // when
        underTest.saveRole(role);

        // then
        verify(roleRepository, never()).save(any(Role.class));
    }

    @Test
    void findRoleById() {
        // given
        Long roleId = 1L;
        Role expectedRole = TestDataFactory.createTestRole(RoleName.ROLE_USER);
        when(roleRepository.findById(roleId)).thenReturn(Optional.of(expectedRole));

        // when
        Role actualRole = underTest.findRoleById(roleId);

        // then
        assertThat(actualRole).isEqualTo(expectedRole);
    }

    @Test
    void getAllRoles() {
        // given
        when(roleRepository.findAll()).thenReturn(java.util.List.of());

        // when
        var roles = underTest.getAllRoles();

        // then
        assertThat(roles).isNotNull();
        verify(roleRepository).findAll();
    }

    @Test
    void deleteRole() {
        // given
        Long roleId = 1L;

        // when
        underTest.deleteRole(roleId);

        // then
        verify(roleRepository).deleteById(roleId);
    }

    @Test
    void findRoleByName() {
        // given
        RoleName roleName = RoleName.ROLE_USER;
        Role expectedRole = new Role(roleName);

        when(roleRepository.findByName(roleName)).thenReturn(Optional.of(expectedRole));

        // when
        Role actualRole = underTest.findRoleByName(roleName);

        // then
        assertThat(actualRole).isEqualTo(expectedRole);
        verify(roleRepository).findByName(roleName);
    }

    @Test
    void findRoleByName_contentManager() {
        // given
        RoleName roleName = RoleName.ROLE_CONTENT_MANAGER;
        Role expectedRole = new Role(roleName);

        when(roleRepository.findByName(roleName)).thenReturn(Optional.of(expectedRole));

        // when
        Role actualRole = underTest.findRoleByName(roleName);

        // then
        assertThat(actualRole).isEqualTo(expectedRole);
        verify(roleRepository).findByName(roleName);
    }

    @Test
    void findRoleByName_support() {
        // given
        RoleName roleName = RoleName.ROLE_SUPPORT;
        Role expectedRole = new Role(roleName);

        when(roleRepository.findByName(roleName)).thenReturn(Optional.of(expectedRole));

        // when
        Role actualRole = underTest.findRoleByName(roleName);

        // then
        assertThat(actualRole).isEqualTo(expectedRole);
        verify(roleRepository).findByName(roleName);
    }

    @Test
    void findRoleByNameWithString() {
        // given
        String roleName = "ROLE_USER";
        Role expectedRole = TestDataFactory.createTestRole(RoleName.ROLE_USER);

        when(roleRepository.findByName(RoleName.ROLE_USER)).thenReturn(Optional.of(expectedRole));

        // when
        Role actualRole = underTest.findRoleByName(roleName);

        // then
        assertThat(actualRole).isEqualTo(expectedRole);
        verify(roleRepository).findByName(RoleName.ROLE_USER);
    }

    @Test
    void findRoleByNameWithString_contentManager() {
        // given
        String roleName = "ROLE_CONTENT_MANAGER";
        Role expectedRole = TestDataFactory.createTestRole(RoleName.ROLE_CONTENT_MANAGER);

        when(roleRepository.findByName(RoleName.ROLE_CONTENT_MANAGER)).thenReturn(Optional.of(expectedRole));

        // when
        Role actualRole = underTest.findRoleByName(roleName);

        // then
        assertThat(actualRole).isEqualTo(expectedRole);
        verify(roleRepository).findByName(RoleName.ROLE_CONTENT_MANAGER);
    }

    @Test
    void findRoleByNameWithString_support() {
        // given
        String roleName = "ROLE_SUPPORT";
        Role expectedRole = TestDataFactory.createTestRole(RoleName.ROLE_SUPPORT);

        when(roleRepository.findByName(RoleName.ROLE_SUPPORT)).thenReturn(Optional.of(expectedRole));

        // when
        Role actualRole = underTest.findRoleByName(roleName);

        // then
        assertThat(actualRole).isEqualTo(expectedRole);
        verify(roleRepository).findByName(RoleName.ROLE_SUPPORT);
    }

    @Test
    void existsByName() {
        // given
        Role role = TestDataFactory.createTestRole(RoleName.ROLE_USER);

        when(roleRepository.existsByName(role.getName())).thenReturn(true);

        // when
        boolean result = underTest.existsByName(role);

        // then
        assertThat(result).isTrue();
        verify(roleRepository).existsByName(role.getName());
    }

    @Test
    void existsByNameReturnsFalse() {
        // given
        Role role = TestDataFactory.createTestRole(RoleName.ROLE_USER);

        when(roleRepository.existsByName(role.getName())).thenReturn(false);

        // when
        boolean result = underTest.existsByName(role);

        // then
        assertThat(result).isFalse();
        verify(roleRepository).existsByName(role.getName());
    }
}
