package com.naren.moviesapp.Config;

import com.naren.moviesapp.Entity.RoleName;

import java.util.Map;

public class RoleHierarchyPolicy {

    private static final Map<RoleName, Integer> Levels = Map.of(
            RoleName.ROLE_USER, 1,
            RoleName.ROLE_SUPPORT, 2,
            RoleName.ROLE_CONTENT_MANAGER, 3,
            RoleName.ROLE_ADMIN, 4,
            RoleName.ROLE_SUPER_ADMIN, 5
    );

    public static boolean canAssign(RoleName curr, RoleName target) {
        //current user's level should be greater than target user's level to assign
        return Levels.get(curr) > Levels.get(target);
    }

    public static boolean canModify(RoleName curr, RoleName target) {
        //current user's level should be greater than or
        // equal to target user's level to modify
        return Levels.get(curr) >= Levels.get(target);
    }

    public static int getLevel(RoleName roleName) {
        return Levels.getOrDefault(roleName, 0);
    }
}
