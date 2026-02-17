package com.naren.moviesapp.Config;

import com.naren.moviesapp.Entity.Permission;
import com.naren.moviesapp.Entity.RoleName;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public class RolePermissionMapper {

    public static Set<Permission> getPermissions(RoleName role) {

        return switch (role) {
            case ROLE_USER -> Set.of(
                    Permission.MOVIE_READ
            );
            case ROLE_ADMIN -> Set.of(
                    Permission.MOVIE_READ,
                    Permission.MOVIE_WRITE,
                    Permission.USER_READ,
                    Permission.VIEW_REPORTS
            );
            case ROLE_SUPER_ADMIN -> Arrays.stream(Permission.values())
                    .collect(Collectors.toSet());
        };
    }
}
