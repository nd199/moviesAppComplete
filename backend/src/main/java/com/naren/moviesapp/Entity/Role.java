package com.naren.moviesapp.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "role",
        uniqueConstraints = @UniqueConstraint(
                name = "name_unique", columnNames = "name"
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Role {

    @ManyToMany(mappedBy = "roles")
    @JsonIgnore
    Set<Customer> customers = new HashSet<>();

    @ManyToMany(mappedBy = "roles")
    @JsonIgnore
    Set<Admin> admins = new HashSet<>();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(unique = true, nullable = false)
    private RoleName name;

    public Role(RoleName name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Role role = (Role) o;
        return name != null ? name.equals(role.name) : role.name == null;
    }

    @Override
    public int hashCode() {
        return name != null ? name.hashCode() : 0;
    }
}
