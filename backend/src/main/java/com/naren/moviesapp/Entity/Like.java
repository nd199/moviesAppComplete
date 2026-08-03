package com.naren.moviesapp.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import static jakarta.persistence.FetchType.LAZY;
import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "likes",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"customer_id", "tmdb_id", "media_type"}
        ))
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Like {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "customer_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_like_customer"))
    @JsonIgnore
    private Customer customer;

    @Column(name = "tmdb_id", nullable = false)
    private Long tmdbId;

    @Column(name = "title", nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "like_status")
    private LikeStatus likeStatus;

    @Column(name = "media_type", nullable = false)
    private String mediaType;

    @Column(name = "liked_at", nullable = false)
    private LocalDateTime likedAt;
}
