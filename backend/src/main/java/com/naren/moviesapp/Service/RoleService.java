package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Enum.RoleName;
import com.naren.moviesapp.Repo.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    void saveRole(Role role) {
        if (!roleRepository.existsByName(role.getName())) {
            roleRepository.save(role);
        }
    }

    void setAddress(String RoleName) {

    }

    Role findRoleById(Long roleId) {
        return roleRepository.findById(roleId).orElse(null);
    }

    List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    void deleteRole(Long id) {
        roleRepository.deleteById(id);
    }

    Role findRoleByName(String roleName) {
        return roleRepository.findByName(RoleName.valueOf(roleName)).orElse(null);
    }

    Role findRoleByName(RoleName roleName) {
        return roleRepository.findByName(roleName).orElse(null);
    }

    public boolean existsByName(Role role) {
        return roleRepository.existsByName(role.getName());
    }
}
