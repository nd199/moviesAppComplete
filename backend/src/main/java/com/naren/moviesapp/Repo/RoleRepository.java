package com.naren.moviesapp.Repo;

import com.naren.moviesapp.Entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Role findRoleByName(String name);

    boolean existsRoleByName(String name);
}