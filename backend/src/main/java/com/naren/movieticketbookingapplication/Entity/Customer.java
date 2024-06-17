package com.naren.movieticketbookingapplication.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.*;

import static jakarta.persistence.CascadeType.*;

@Entity
@Table(name = "Customer", uniqueConstraints = {
        @UniqueConstraint(name = "email_id_unique", columnNames = "email"),
        @UniqueConstraint(name = "phone_number_unique", columnNames = "phone_number")
})
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
@Slf4j
public class Customer implements UserDetails {
    @Id
    @SequenceGenerator(name = "customer_id", sequenceName = "customer_id", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "customer_id")
    private Long id;

    @Column(name = "name", columnDefinition = "TEXT")
    private String name;

    @Column(name = "email", columnDefinition = "TEXT", nullable = false)
    private String email;

    @Column(name = "password", columnDefinition = "TEXT", nullable = false)
    private String password;

    @Column(name = "phone_number", nullable = false)
    private Long phoneNumber;

    @Column(nullable = false)
    private Boolean isEmailVerified;

    @Column(nullable = false)
    private Boolean isPhoneVerified;

    @Column(nullable = false)
    private Boolean isLogged;

    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY, cascade = {DETACH, REFRESH, PERSIST, MERGE})
    @JsonIgnore
    private List<Movie> movies = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "customers_roles",
            joinColumns = @JoinColumn(name = "customer_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"),
            foreignKey = @ForeignKey(name = "fk_customer_role_id"),
            inverseForeignKey = @ForeignKey(name = "fk_customers_role_customer_id")
    )
    @JsonBackReference
    private Set<Role> roles = new HashSet<>();

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Customer(Long id, String name, String email, String password, Long phoneNumber, Boolean isEmailVerified, Boolean isPhoneVerified, Boolean isLogged, List<Movie> movies, Set<Role> roles) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.isEmailVerified = isEmailVerified;
        this.isPhoneVerified = isPhoneVerified;
        this.isLogged = isLogged;
        this.movies = movies;
        this.roles = roles;
    }

    public Customer(Long id, String name, String email, String password, Long phoneNumber, Boolean isEmailVerified, Boolean isPhoneVerified, Boolean isLogged) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.isEmailVerified = isEmailVerified;
        this.isPhoneVerified = isPhoneVerified;
        this.isLogged = isLogged;
    }

    public Customer(String name, String email, String password, Long phoneNumber, Boolean isEmailVerified, Boolean isPhoneVerified, Boolean isLogged) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.isEmailVerified = isEmailVerified;
        this.isPhoneVerified = isPhoneVerified;
        this.isLogged = isLogged;
    }

    @Override
    public String toString() {
        return "Customer{" +
                "customer_id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", phoneNumber=" + phoneNumber +
                ", isEmailVerified=" + isEmailVerified +
                ", isPhoneVerified=" + isPhoneVerified +
                ", isLoggedIn=" + isLogged +
                ", movies=" + movies +
                ", roles=" + roles +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Customer customer = (Customer) o;
        return Objects.equals(id, customer.id) &&
                Objects.equals(name, customer.name) &&
                Objects.equals(email, customer.email) &&
                Objects.equals(password, customer.password) &&
                Objects.equals(phoneNumber, customer.phoneNumber) &&
                Objects.equals(isEmailVerified, customer.isEmailVerified) &&
                Objects.equals(isPhoneVerified, customer.isPhoneVerified) &&
                Objects.equals(isLogged, customer.isLogged) &&
                Objects.equals(movies, customer.movies) &&
                Objects.equals(roles, customer.roles) &&
                Objects.equals(createdAt, customer.createdAt) &&
                Objects.equals(updatedAt, customer.updatedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, email, password, phoneNumber, isEmailVerified, isPhoneVerified, isLogged, movies, roles, createdAt, updatedAt);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();
        for (Role role : roles) {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        }
        return authorities;
    }

    @Override
    public String getUsername() {
        return email;
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
        return true;
    }

    public void addMovie(Movie movie) {
        if (movie != null && !movies.contains(movie)) {
            movies.add(movie);
            movie.setCustomer(this);
        }
    }

    public void removeMovie(Movie movie) {
        if (movie != null && movies.contains(movie)) {
            movies.remove(movie);
            movie.setCustomer(null);
            log.info("Removed movie with ID {} from customer with ID {}", movie.getMovie_id(), this.getId());
        } else {
            log.warn("Attempted to remove a movie that is not associated with the customer or movie is null");
        }
    }

    public void removeMovies(List<Movie> movies) {
        Iterator<Movie> iterator = this.movies.iterator();
        while (iterator.hasNext()) {
            Movie movie = iterator.next();
            if (movies.contains(movie)) {
                iterator.remove();
                movie.setCustomer(null);
                log.info("Removed movie with ID {} from customer_with ID {}", movie.getMovie_id(), this.getId());
            }
        }
    }

    public void addRole(Role role) {
        if (role != null && !roles.contains(role)) {
            roles.add(role);
            role.getCustomers().add(this);
        }
    }


}
