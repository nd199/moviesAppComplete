package com.naren.movieticketbookingapplication.Service;


import com.naren.movieticketbookingapplication.Entity.Role;
import com.naren.movieticketbookingapplication.Repo.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    void saveRole(Role role) {
        if (!roleRepository.existsRoleByName(role.getName())) {
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
        return roleRepository.findRoleByName(roleName);
    }

    public boolean existsByName(Role role) {
        return roleRepository.existsRoleByName(role.getName());
    }
}
