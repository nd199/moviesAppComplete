package com.naren.movieticketbookingapplication.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "Movie", uniqueConstraints = {
        @UniqueConstraint(name = "movie_name_unique",
                columnNames = "name")
})
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "movie_id")
    @SequenceGenerator(name = "movie_id",
            sequenceName = "movie_id",
            allocationSize = 1)
    private Long movie_id;

    @Column(name = "name", nullable = false, columnDefinition = "TEXT")
    private String name;

    @Column(name = "cost", nullable = false)
    private Double cost;

    @Column(name = "rating", nullable = false)
    private Double rating;

    @Column(nullable = false, length = 1000) // Example length
    private String description;

    @Column(nullable = false)
    private String poster;

    @Column(nullable = false)
    private String ageRating;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private String runtime;

    @Column(nullable = false)
    private String genre;

    @ManyToOne
    @JoinColumn(name = "customer_id",
            foreignKey = @ForeignKey(name = "fk_customer_movie_id"))
    @JsonBackReference
    private Customer customer;

    @Column(nullable = false, updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @LastModifiedDate
    private LocalDateTime updatedAt;

    public Movie(String name, Double cost, Double rating, String description,
                 String poster, String ageRating,
                 Integer year, String runtime, String genre) {
        this.name = name;
        this.cost = cost;
        this.rating = rating;
        this.description = description;
        this.poster = poster;
        this.ageRating = ageRating;
        this.year = year;
        this.runtime = runtime;
        this.genre = genre;
    }

    public Movie(Long movie_id, String name, Double cost, Double rating,
                 String description, String poster, String ageRating, Integer year,
                 String runtime, String genre) {
        this.movie_id = movie_id;
        this.name = name;
        this.cost = cost;
        this.rating = rating;
        this.description = description;
        this.poster = poster;
        this.ageRating = ageRating;
        this.year = year;
        this.runtime = runtime;
        this.genre = genre;
    }


    @Override
    public String toString() {
        return "Movie{" +
                "movie_id=" + movie_id +
                ", name='" + name + '\'' +
                ", cost=" + cost +
                ", rating=" + rating +
                ", description='" + description + '\'' +
                ", poster='" + poster + '\'' +
                ", ageRating='" + ageRating + '\'' +
                ", year=" + year +
                ", runtime='" + runtime + '\'' +
                ", genre='" + genre + '\'' +
                ", customer=" + customer +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Movie movie = (Movie) o;
        return Objects.equals(movie_id, movie.movie_id) && Objects.equals(name, movie.name) && Objects.equals(cost, movie.cost) && Objects.equals(rating, movie.rating) && Objects.equals(description, movie.description) && Objects.equals(poster, movie.poster) && Objects.equals(ageRating, movie.ageRating) && Objects.equals(year, movie.year) && Objects.equals(runtime, movie.runtime) && Objects.equals(genre, movie.genre) && Objects.equals(customer, movie.customer);
    }

    @Override
    public int hashCode() {
        return Objects.hash(movie_id, name, cost, rating, description, poster, ageRating, year, runtime, genre, customer);
    }
}
