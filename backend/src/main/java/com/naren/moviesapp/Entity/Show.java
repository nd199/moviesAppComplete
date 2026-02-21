package com.naren.moviesapp.Entity;

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
@Table(name = "Show", uniqueConstraints = {
        @UniqueConstraint(name = "show_name_unique",
                columnNames = "name")
})
@Setter
@Getter
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
public class Show {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "show_id")
    @SequenceGenerator(name = "show_id",
            sequenceName = "show_id",
            allocationSize = 1)
    private Long show_id;

    @Column(name = "tmdb_id")
    private Long tmdbId;

    @Column(name = "name", nullable = false, columnDefinition = "TEXT")
    private String name;

    @Column(name = "rating", nullable = false)
    private Double rating;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String poster;

    @Column(nullable = false)
    private String ageRating;

    @Column(nullable = false, name = "\"year\"")
    private Integer year;

    @Column(nullable = false)
    private String runtime;

    @Column(nullable = false)
    private String genre;

    @Column(nullable = false, columnDefinition = "TEXT default 'shows'")
    private String type;

    @Column(nullable = false, columnDefinition = "varchar(255) default 'General'")
    private String category;

    @ManyToOne
    @JoinColumn(name = "customer_id",
            foreignKey = @ForeignKey(name = "fk_customer_show_id"))
    @JsonBackReference
    private Customer customer;

    @Column(nullable = false, updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @LastModifiedDate
    private LocalDateTime updatedAt;

    public Show(String name, Double rating, String description,
                String poster, String ageRating,
                Integer year, String runtime, String genre, String type, String category) {
        this.name = name;
        this.rating = rating;
        this.description = description;
        this.poster = poster;
        this.ageRating = ageRating;
        this.year = year;
        this.runtime = runtime;
        this.genre = genre;
        this.type = type;
        this.category = category;
    }

    public Show(Long show_id, String name, Double rating, String description,
                String poster, String ageRating, Integer year, String runtime, String genre, String type, String category) {
        this.show_id = show_id;
        this.name = name;
        this.rating = rating;
        this.description = description;
        this.poster = poster;
        this.ageRating = ageRating;
        this.year = year;
        this.runtime = runtime;
        this.genre = genre;
        this.type = type;
        this.category = category;
    }

    public String toString() {
        return "Show{" +
                "show_id=" + show_id +
                ", name='" + name + '\'' +
                ", rating=" + rating +
                ", description='" + description + '\'' +
                ", poster='" + poster + '\'' +
                ", ageRating='" + ageRating + '\'' +
                ", year=" + year +
                ", runtime='" + runtime + '\'' +
                ", genre='" + genre + '\'' +
                ", type='" + type + '\'' +
                ", category='" + category + '\'' +
                ", customer=" + customer +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }

    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Show show = (Show) o;
        return Objects.equals(show_id, show.show_id) && Objects.equals(name, show.name) && Objects.equals(rating, show.rating) && Objects.equals(description, show.description) && Objects.equals(poster, show.poster) && Objects.equals(ageRating, show.ageRating) && Objects.equals(year, show.year) && Objects.equals(runtime, show.runtime) && Objects.equals(genre, show.genre) && Objects.equals(type, show.type) && Objects.equals(category, show.category) && Objects.equals(customer, show.customer) && Objects.equals(createdAt, show.createdAt) && Objects.equals(updatedAt, show.updatedAt);
    }

    public int hashCode() {
        return Objects.hash(show_id, name, rating, description, poster, ageRating, year, runtime, genre, type, category, customer, createdAt, updatedAt);
    }
}
