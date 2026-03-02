package com.naren.moviesapp.Repo;

import com.naren.moviesapp.Entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ShowRepository extends JpaRepository<Show, Long> {

    boolean existsByName(String name);

    Show findByName(String name);

    List<Show> findByGenre(String genre);

    List<Show> findByYear(Integer year);

    List<Show> findByAgeRating(String ageRating);

    List<Show> findByRatingGreaterThanEqual(Double rating);

    List<Show> findByRatingLessThanEqual(Double rating);

    List<Show> findAllByOrderByNameAsc();

    List<Show> findAllByOrderByNameDesc();

    List<Show> findAllByOrderByRatingAsc();

    List<Show> findAllByOrderByRatingDesc();

    List<Show> findAllByOrderByYearAsc();

    List<Show> findAllByOrderByYearDesc();

    List<Show> findAllByOrderByGenreAsc();

    List<Show> findAllByOrderByGenreDesc();

    List<Show> findShowByType(String type);

    // Category-based queries
    List<Show> findByCategory(String category);

    List<Show> findByCategoryOrderByRatingDesc(String category);

    List<Show> findByCategoryOrderByCreatedAtDesc(String category);

    List<Show> findAllByOrderByCategoryAsc();

    List<Show> findAllByOrderByCategoryDesc();

    // Get all distinct categories using native query
    @Query("SELECT DISTINCT s.category FROM Show s WHERE s.category IS NOT NULL")
    List<String> findAllDistinctCategories();

    // Content Manager queries
    List<Show> findByContentManagerId(Long contentManagerId);

    @Query("SELECT COUNT(s) FROM Show s WHERE s.contentManager.id = :contentManagerId")
    Long countShowsByContentManagerId(Long contentManagerId);

    @Query("SELECT s FROM Show s WHERE s.contentManager.id = :contentManagerId AND s.category = :category")
    List<Show> findByContentManagerIdAndCategory(Long contentManagerId, String category);
}
