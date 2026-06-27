package com.naren.moviesapp.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.*;

import static jakarta.persistence.CascadeType.*;

@Entity
@Table(name = "customer", uniqueConstraints = {
        @UniqueConstraint(name = "email_id_unique", columnNames = "email"),
        @UniqueConstraint(name = "phone_number_unique", columnNames = "phone_number")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Customer extends BaseUser {

    @Id
    @SequenceGenerator(name = "customer_id", sequenceName = "customer_id", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "customer_id")
    private Long id;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(nullable = false)
    private String address;

    private Boolean isSubscribed;

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

    @OneToOne(mappedBy = "customer", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    private UserPlanInfo userPlanInfo;

    public Customer(Long id, String name, String email, String password, String phoneNumber, Boolean isEmailVerified, String address, List<Movie> movies, Set<Role> roles, Boolean isSubscribed) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.isEmailVerified = isEmailVerified;
        this.address = address;
        this.movies = movies;
        this.roles = roles;
        this.isSubscribed = isSubscribed;
    }

    public Customer(Long id, String name, String email, String password, String phoneNumber, Boolean isEmailVerified, String address, Boolean isSubscribed) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.isEmailVerified = isEmailVerified;
        this.address = address;
        this.isSubscribed = isSubscribed;

    }

    public Customer(Long id, String name, String email, String password, String phoneNumber, String imageUrl, Boolean isEmailVerified, String address, Boolean isSubscribed) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.imageUrl = imageUrl;
        this.isEmailVerified = isEmailVerified;
        this.address = address;
        this.isSubscribed = isSubscribed;

    }

    public Customer(String name, String email, String password, String phoneNumber, Boolean isEmailVerified, String address, Boolean isSubscribed) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.isEmailVerified = isEmailVerified;
        this.address = address;
        this.isSubscribed = isSubscribed;
    }

    public Customer(String name, String email, String password,
                    String phoneNumber, String imageUrl, Boolean isEmailVerified, String address, Boolean isSubscribed) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.imageUrl = imageUrl;
        this.isEmailVerified = isEmailVerified;
        this.address = address;
        this.isSubscribed = isSubscribed;
    }

    @Override
    public String toString() {
        return "Customer{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", phoneNumber=" + phoneNumber +
                ", imageUrl='" + imageUrl + '\'' +
                ", isEmailVerified=" + isEmailVerified +
                ", address='" + address + '\'' +
                ", isSubscribed=" + isSubscribed +
                ", movies=" + movies +
                ", roles=" + roles +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Customer)) return false;
        Customer that = (Customer) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
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
        } else {
        }
    }

    public void removeMovies(List<Movie> movies) {
        Iterator<Movie> iterator = this.movies.iterator();
        while (iterator.hasNext()) {
            Movie movie = iterator.next();
            if (movies.contains(movie)) {
                iterator.remove();
                movie.setCustomer(null);
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
