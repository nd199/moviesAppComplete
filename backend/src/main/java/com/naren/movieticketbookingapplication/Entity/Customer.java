package com.naren.movieticketbookingapplication.Entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

import static jakarta.persistence.CascadeType.*;


@Entity
@Table(name = "Customer", uniqueConstraints = {
        @UniqueConstraint(name = "email_id_unique",
                columnNames = "email"),
        @UniqueConstraint(name = "phone_number_unique",
                columnNames = "phone_number")
})
@Getter
@Setter
@NoArgsConstructor
@Slf4j
public class Customer implements UserDetails {
    @Id
    @SequenceGenerator(name = "customer_id",
            sequenceName = "customer_id",
            allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "customer_id")
    private Long customer_id;

    @Column(name = "name", columnDefinition = "TEXT")
    private String name;

    @Column(name = "email", columnDefinition = "TEXT", nullable = false)
    private String email;

    @Column(name = "password", columnDefinition = "TEXT", nullable = false, length = 8)
    private String password;

    @Column(name = "phone_number", nullable = false)
    private Long phoneNumber;

    @Column(nullable = false)
    private Boolean isEmailVerified;

    @Column(nullable = false)
    private Boolean isPhoneVerified;


    @OneToMany(mappedBy = "customer", fetch = FetchType.EAGER, cascade = {DETACH, REFRESH, PERSIST, MERGE})
    @JsonIgnore
    private List<Movie> movies = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "customers_roles",
            joinColumns = @JoinColumn(name = "customer_id"),
            inverseJoinColumns = @JoinColumn(
                    name = "role_id",
                    foreignKey = @ForeignKey(name = "fk_customer_role_id")
            ),
            foreignKey = @ForeignKey(name = "fk_customers_role_customer_id")
    )
    @JsonBackReference
    private Set<Role> roles = new HashSet<>();

    public Customer(Long customer_id, String name, String email,
                    String password, Long phoneNumber, Boolean isEmailVerified,
                    Boolean isPhoneVerified, List<Movie> movies, Set<Role> roles) {
        this.customer_id = customer_id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.isEmailVerified = isEmailVerified;
        this.isPhoneVerified = isPhoneVerified;
        this.movies = movies;
        this.roles = roles;
    }

    public Customer(Long customer_id, String name, String email, String password, Long phoneNumber) {
        this.customer_id = customer_id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
    }


    public Customer(Long customer_id, String name, String email,
                    String password, Long phoneNumber,
                    Boolean isEmailVerified, Boolean isPhoneVerified) {
        this.customer_id = customer_id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.isEmailVerified = isEmailVerified;
        this.isPhoneVerified = isPhoneVerified;
    }

    public Customer(String name, String email, String password,
                    Long phoneNumber, Boolean isEmailVerified,
                    Boolean isPhoneVerified) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.isEmailVerified = isEmailVerified;
        this.isPhoneVerified = isPhoneVerified;
    }

    @Override
    public String toString() {
        return "Customer{" +
                "customer_id=" + customer_id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", phoneNumber=" + phoneNumber +
                ", isEmailVerified=" + isEmailVerified +
                ", isPhoneVerified=" + isPhoneVerified +
                ", movies=" + movies +
                ", roles=" + roles +
                '}';
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Customer customer = (Customer) o;
        return Objects.equals(customer_id, customer.customer_id) && Objects.equals(name, customer.name) && Objects.equals(email, customer.email) && Objects.equals(password, customer.password) && Objects.equals(phoneNumber, customer.phoneNumber) && Objects.equals(isEmailVerified, customer.isEmailVerified) && Objects.equals(isPhoneVerified, customer.isPhoneVerified) && Objects.equals(movies, customer.movies) && Objects.equals(roles, customer.roles);
    }

    @Override
    public int hashCode() {
        return Objects.hash(customer_id, name, email, password, phoneNumber, isEmailVerified, isPhoneVerified, movies, roles);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();
        Set<Role> roles1 = this.roles;
        for (Role role : roles1) {
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
        if (!movies.contains(movie) && movie != null) {
            movies.add(movie);
            movie.setCustomer(this);
        }
    }

    public void removeMovie(Movie movie) {
        if (movie != null && movies.contains(movie)) {
            movies.remove(movie);
            movie.setCustomer(null);
            log.info("Removed movie with ID {} from customer with ID {}", movie.getMovie_id(), this.getCustomer_id());
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
                log.info("Removed movie with ID {} from customer with I-D {}", movie.getMovie_id(), this.getCustomer_id());
            }
        }
    }


    public void addRole(Role role) {
        this.roles.add(role);
        role.getCustomers().add(this);
    }

    public void removeRole(Role role) {
        this.roles.remove(role);
        role.getCustomers().remove(this);
    }
}
