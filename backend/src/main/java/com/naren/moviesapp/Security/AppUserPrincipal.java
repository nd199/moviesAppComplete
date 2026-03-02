package com.naren.moviesapp.Security;

import com.naren.moviesapp.Config.RolePermissionMapper;
import com.naren.moviesapp.Entity.Admin;
import com.naren.moviesapp.Entity.ContentManager;
import com.naren.moviesapp.Entity.Customer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

public class AppUserPrincipal implements UserDetails {

    private final String username, password;
    private final boolean active;
    private final Collection<? extends GrantedAuthority> authorities;
    private final Object userEntity;


    public AppUserPrincipal(Admin admin) {
        this.username = admin.getEmail();
        this.password = admin.getPassword();
        this.active = admin.getIsActive();
        this.userEntity = admin;
        this.authorities = admin.getRoles()
                .stream()
                .flatMap(role -> {
                    Set<GrantedAuthority> permissions = RolePermissionMapper
                            .getPermissions(role.getName())
                            .stream()
                            .map(p -> new SimpleGrantedAuthority(p.name()))
                            .collect(Collectors.toSet());
                    permissions.add(new SimpleGrantedAuthority(role.getName().name()));
                    return permissions.stream();
                })
                .collect(Collectors.toSet());
    }

    public AppUserPrincipal(Customer customer) {
        this.username = customer.getEmail();
        this.password = customer.getPassword();
        this.active = customer.getIsActive();
        this.userEntity = customer;
        this.authorities = customer.getRoles()
                .stream()
                .flatMap(role -> {
                    Set<GrantedAuthority> permissions = RolePermissionMapper
                            .getPermissions(role.getName())
                            .stream()
                            .map(p -> new SimpleGrantedAuthority(p.name()))
                            .collect(Collectors.toSet());
                    permissions.add(new SimpleGrantedAuthority(role.getName().name()));
                    return permissions.stream();
                })
                .collect(Collectors.toSet());
    }

    public AppUserPrincipal(ContentManager contentManager) {
        this.username = contentManager.getEmail();
        this.password = contentManager.getPassword();
        this.active = contentManager.getIsActive();
        this.userEntity = contentManager;
        this.authorities = contentManager.getRoles()
                .stream()
                .flatMap(role -> {
                    Set<GrantedAuthority> permissions = RolePermissionMapper
                            .getPermissions(role.getName())
                            .stream()
                            .map(p -> new SimpleGrantedAuthority(p.name()))
                            .collect(Collectors.toSet());
                    permissions.add(new SimpleGrantedAuthority(role.getName().name()));
                    return permissions.stream();
                })
                .collect(Collectors.toSet());
    }

    public Object getUserEntity() {
        return userEntity;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}
