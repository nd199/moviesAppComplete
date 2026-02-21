package com.naren.moviesapp.Config;

import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.io.Serializable;

@Component
public class CustomPermissionEvaluator implements PermissionEvaluator {

    @Override
    public boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission) {
        if (authentication == null || targetDomainObject == null || !(permission instanceof String)) {
            return false;
        }
        
        String targetType = targetDomainObject.getClass().getSimpleName().toUpperCase();
        String requiredPermission = permission.toString().toUpperCase();

        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(auth -> {
                    String authority = auth.toUpperCase();
                    // Exact match
                    if (authority.equals(requiredPermission)) {
                        return true;
                    }
                    // Check if authority starts with the permission prefix
                    String permissionPrefix = requiredPermission.replace("_READ", "").replace("_WRITE", "").replace("_DELETE", "");
                    return authority.startsWith(permissionPrefix) || authority.contains(requiredPermission);
                });
    }

    @Override
    public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object permission) {
        // For ID-based permissions, just check if user has the permission
        return hasPermission(authentication, targetType, permission);
    }
}
