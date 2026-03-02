package com.naren.moviesapp.Repo;

import com.naren.moviesapp.Entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    boolean existsByName(String name);

    Movie findByName(String name);

    List<Movie> findByGenre(String genre);

    List<Movie> findByYear(Integer year);

    List<Movie> findByAgeRating(String ageRating);

    List<Movie> findByRatingGreaterThanEqual(Double rating);

    List<Movie> findByRatingLessThanEqual(Double rating);

    List<Movie> findAllByOrderByNameAsc();

    List<Movie> findAllByOrderByNameDesc();

    List<Movie> findAllByOrderByRatingAsc();

    List<Movie> findAllByOrderByRatingDesc();

    List<Movie> findAllByOrderByYearAsc();

    List<Movie> findAllByOrderByYearDesc();

    List<Movie> findAllByOrderByGenreAsc();

    List<Movie> findAllByOrderByGenreDesc();

    List<Movie> findMovieByType(String type);

    // Category-based queries
    List<Movie> findByCategory(String category);

    List<Movie> findByCategoryOrderByRatingDesc(String category);

    List<Movie> findByCategoryOrderByCreatedAtDesc(String category);

    List<Movie> findAllByOrderByCategoryAsc();

    List<Movie> findAllByOrderByCategoryDesc();

    // Get all distinct categories using native query
    @Query("SELECT DISTINCT m.category FROM Movie m WHERE m.category IS NOT NULL")
    List<String> findAllDistinctCategories();

    // Content Manager queries
    List<Movie> findByContentManagerId(Long contentManagerId);

    @Query("SELECT COUNT(m) FROM Movie m WHERE m.contentManager.id = :contentManagerId")
    Long countMoviesByContentManagerId(Long contentManagerId);

    @Query("SELECT m FROM Movie m WHERE m.contentManager.id = :contentManagerId AND m.category = :category")
    List<Movie> findByContentManagerIdAndCategory(Long contentManagerId, String category);
}
