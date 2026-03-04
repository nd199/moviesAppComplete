package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.ContentManager;
import com.naren.moviesapp.Entity.Movie;
import com.naren.moviesapp.Entity.Show;
import com.naren.moviesapp.Record.ContentManagerLogin;
import com.naren.moviesapp.Record.ContentManagerRegistration;
import com.naren.moviesapp.Record.ContentManagerUpdateRequest;

import java.util.List;

public interface ContentManagerServiceInterface {

    // Authentication
    String login(ContentManagerLogin login);

    ContentManager register(ContentManagerRegistration registration);

    void logout(String token);

    // Content Manager CRUD
    ContentManager getContentManagerById(Long id);

    ContentManager getContentManagerByEmail(String email);

    List<ContentManager> getAllContentManagers();

    ContentManager updateContentManager(Long id, ContentManagerUpdateRequest update);

    void deleteContentManager(Long id);

    void toggleContentManagerStatus(Long id);

    // Movie Management
    Movie addMovie(Movie movie, Long contentManagerId);

    void updateMovie(Long movieId, Movie movie, Long contentManagerId);

    void deleteMovie(Long movieId, Long contentManagerId);

    List<Movie> getMoviesByContentManager(Long contentManagerId);

    // Show Management
    Show addShow(Show show, Long contentManagerId);

    void updateShow(Long showId, Show show, Long contentManagerId);

    void deleteShow(Long showId, Long contentManagerId);

    List<Show> getShowsByContentManager(Long contentManagerId);

    // Analytics and Reporting
    Long getMovieCountByContentManager(Long contentManagerId);

    Long getShowCountByContentManager(Long contentManagerId);

    List<ContentManager> getActiveContentManagers();
}
