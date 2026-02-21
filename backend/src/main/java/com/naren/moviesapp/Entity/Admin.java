package com.naren.moviesapp.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.naren.moviesapp.Config.RolePermissionMapper;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.*;

@Entity
@Table(name = "admin", uniqueConstraints = {
        @UniqueConstraint(name = "admin_email_unique", columnNames = "email"),
        @UniqueConstraint(name = "admin_phone_number_unique", columnNames = "phone_number")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Admin extends BaseUser {

    @Id
    @SequenceGenerator(name = "admin_id", sequenceName = "admin_id", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "admin_id")
    private Long id;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(nullable = false)
    private String address;

    @Column(name = "department", columnDefinition = "TEXT")
    private String department;

    @Column(name = "access_level", nullable = false)
    private Integer accessLevel = 1;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "admins_roles",
            joinColumns = @JoinColumn(name = "admin_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"),
            foreignKey = @ForeignKey(name = "fk_admin_role_id"),
            inverseForeignKey = @ForeignKey(name = "fk_admins_role_admin_id")
    )
    @JsonBackReference
    private Set<Role> roles = new HashSet<>();

    public Admin(Long id, String name, String email, String password, String phoneNumber,
                 Boolean isEmailVerified, String address, Boolean isRegistered,
                 Set<Role> roles, String department, Integer accessLevel, Boolean isActive) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.isEmailVerified = isEmailVerified;
        this.address = address;
        this.isRegistered = isRegistered;
        this.roles = roles;
        this.department = department;
        this.accessLevel = accessLevel;
        this.isActive = isActive;
    }

    public Admin(String name, String email, String password, String phoneNumber,
                 Boolean isEmailVerified, Boolean isRegistered,
                 String address, String department, Integer accessLevel) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.isEmailVerified = isEmailVerified;
        this.address = address;
        this.isRegistered = isRegistered;
        this.department = department;
        this.accessLevel = accessLevel;
        this.isActive = true;
    }

    public Admin(String name, String email, String password,
                 String phoneNumber, String imageUrl, Boolean isEmailVerified,
                 String address, Boolean isRegistered,
                 String department, Integer accessLevel) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.imageUrl = imageUrl;
        this.isEmailVerified = isEmailVerified;
        this.address = address;
        this.isRegistered = isRegistered;
        this.department = department;
        this.accessLevel = accessLevel;
        this.isActive = true;
    }

    @Override
    public String toString() {
        return "Admin{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", isEmailVerified=" + isEmailVerified +
                ", address='" + address + '\'' +
                ", isRegistered=" + isRegistered +
                ", department='" + department + '\'' +
                ", accessLevel=" + accessLevel +
                ", isActive=" + isActive +
                ", roles=" + roles +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Admin)) return false;
        Admin that = (Admin) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    public void addRole(Role role) {
        if (role != null && !roles.contains(role)) {
            roles.add(role);
            role.getAdmins().add(this);
        }
    }

    public void removeRole(Role role) {
        if (role != null && roles.contains(role)) {
            roles.remove(role);
            role.getAdmins().remove(this);
        }
    }
}
