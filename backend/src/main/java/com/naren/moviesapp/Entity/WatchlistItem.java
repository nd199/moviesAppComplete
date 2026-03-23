package com.naren.moviesapp.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "watchlist_items", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"customer_id", "tmdb_id", "media_type"}))
public class WatchlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "tmdb_id", nullable = false)
    private Long tmdbId;

    @Column(nullable = false)
    private String title;

    @Column(name = "poster_path")
    private String posterPath;

    @Column(name = "media_type", nullable = false)
    private String mediaType; // "movie" or "tv"

    @Column(name = "added_at", nullable = false)
    private LocalDateTime addedAt;

    // Constructors
    public WatchlistItem() {}

    public WatchlistItem(Customer customer, Long tmdbId, String title, String posterPath, String mediaType) {
        this.customer = customer;
        this.tmdbId = tmdbId;
        this.title = title;
        this.posterPath = posterPath;
        this.mediaType = mediaType;
        this.addedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    @JsonIgnore
    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public Long getTmdbId() { return tmdbId; }
    public void setTmdbId(Long tmdbId) { this.tmdbId = tmdbId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getPosterPath() { return posterPath; }
    public void setPosterPath(String posterPath) { this.posterPath = posterPath; }

    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }

    public LocalDateTime getAddedAt() { return addedAt; }
    public void setAddedAt(LocalDateTime addedAt) { this.addedAt = addedAt; }
}
