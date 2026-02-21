package com.naren.moviesapp.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "movie", uniqueConstraints = {
        @UniqueConstraint(name = "movie_name_unique",
                columnNames = "name")
})
@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "movie_id")
    @SequenceGenerator(name = "movie_id",
            sequenceName = "movie_id",
            allocationSize = 1)
    @Column(name = "movie_id")
    private Long id;

    @Column(name = "name", nullable = false, columnDefinition = "TEXT")
    private String name;

    @Column(name = "rating", nullable = false)
    private Double rating;

    @Column(nullable = false, length = 1000) // Example length
    private String description;

    @Column(nullable = false)
    private String poster;

    @Column(nullable = false)
    private String ageRating;

    @Column(nullable = false, name = "\"year\"")
    private Integer year;

    @Column(nullable = false)
    private String runtime;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String genre;

    @Column(nullable = false, columnDefinition = "varchar(255) default 'movies'")
    private String type;

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

    public Movie(String name, Double rating, String description, String poster, String ageRating, Integer year, String runtime, String genre, String type) {
        this.name = name;
        this.rating = rating;
        this.description = description;
        this.poster = poster;
        this.ageRating = ageRating;
        this.year = year;
        this.runtime = runtime;
        this.genre = genre;
        this.type = type;
    }

}
