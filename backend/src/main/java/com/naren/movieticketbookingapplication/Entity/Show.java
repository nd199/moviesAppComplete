package com.naren.movieticketbookingapplication.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;

@Entity
@Table(name = "Show", uniqueConstraints = {
        @UniqueConstraint(name = "show_name_unique",
                columnNames = "name")
})
@Setter
@Getter
@NoArgsConstructor
public class Show {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE,
            generator = "show_id")
    @SequenceGenerator(name = "show_id",
            sequenceName = "show_id",
            allocationSize = 1)
    private Long show_id;

    @Column(name = "name", nullable = false, columnDefinition = "TEXT")
    private String name;

    @Column(name = "cost", nullable = false)
    private Double cost;

    @Column(name = "rating", nullable = false)
    private Double rating;

    @ManyToOne
    @JoinColumn(name = "customer_id",
            foreignKey = @ForeignKey(name = "fk_customer_show_id"))
    @JsonBackReference
    private Customer customer;

    public Show(Long show_id, String name, Double cost, Double rating) {
        this.show_id = show_id;
        this.name = name;
        this.cost = cost;
        this.rating = rating;
    }

    public Show(String name, Double cost, Double rating) {
        this.name = name;
        this.cost = cost;
        this.rating = rating;
    }

    @Override
    public String
    toString() {
        return "Show{" +
                "show_id=" + show_id +
                ", name='" + name + '\'' +
                ", cost=" + cost +
                ", rating=" + rating +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        com.naren.movieticketbookingapplication.Entity.Show show = (com.naren.movieticketbookingapplication.Entity.Show) o;
        return Objects.equals(show_id, show.show_id) && Objects.equals(name, show.name) && Objects.equals(cost, show.cost) && Objects.equals(rating, show.rating);
    }

    @Override
    public int hashCode() {
        return Objects.hash(show_id, name, cost, rating);
    }
}
