package com.naren.moviesapp.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "content_manager", uniqueConstraints = {
        @UniqueConstraint(name = "content_manager_email_unique", columnNames = "email"),
        @UniqueConstraint(name = "content_manager_phone_number_unique", columnNames = "phone_number")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContentManager extends BaseUser {

    @Id
    @SequenceGenerator(name = "id", sequenceName = "id", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "id")
    private Long id;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "department", columnDefinition = "TEXT")
    private String department;

    @Column(name = "specialization", nullable = false)
    private String specialization; // "movies", "shows", "both"

    @Column(name = "access_level", nullable = false)
    private Integer accessLevel = 1;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "content_managers_roles",
            joinColumns = @JoinColumn(name = "content_manager_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"),
            foreignKey = @ForeignKey(name = "fk_content_manager_role_id"),
            inverseForeignKey = @ForeignKey(name = "fk_content_managers_role_content_manager_id")
    )
    @JsonBackReference
    private Set<Role> roles = new HashSet<>();

    public ContentManager(String name, String email, String password, String phoneNumber,
                          Boolean isEmailVerified, Boolean isRegistered,
                          String imageUrl, String department, String specialization, Integer accessLevel) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.isEmailVerified = isEmailVerified;
        this.isRegistered = isRegistered;
        this.imageUrl = imageUrl;
        this.department = department;
        this.specialization = specialization;
        this.accessLevel = accessLevel;
        this.isActive = true;
    }

    public ContentManager(String name, String email, String password, String phoneNumber,
                          String department, String specialization) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.department = department;
        this.specialization = specialization;
        this.isEmailVerified = false;
        this.isRegistered = false;
        this.accessLevel = 1;
        this.isActive = true;
    }

    @Override
    public String toString() {
        return "ContentManager{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", isEmailVerified=" + isEmailVerified +
                ", department='" + department + '\'' +
                ", specialization='" + specialization + '\'' +
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
        if (!(o instanceof ContentManager)) return false;
        ContentManager that = (ContentManager) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    public void addRole(Role role) {
        if (role != null && !roles.contains(role)) {
            roles.add(role);
            role.getContentManagers().add(this);
        }
    }

    public void removeRole(Role role) {
        if (role != null && roles.contains(role)) {
            roles.remove(role);
            role.getContentManagers().remove(this);
        }
    }
}
