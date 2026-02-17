package com.naren.moviesapp.Repo;

import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Entity.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(RoleName name);

    boolean existsByName(RoleName name);
}