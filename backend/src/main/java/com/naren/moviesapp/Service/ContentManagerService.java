package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.ContentManager;
import com.naren.moviesapp.Entity.Movie;
import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Entity.RoleName;
import com.naren.moviesapp.Entity.Show;
import com.naren.moviesapp.Exception.ResourceAlreadyExists;
import com.naren.moviesapp.Exception.ResourceNotFoundException;
import com.naren.moviesapp.Record.ContentManagerLogin;
import com.naren.moviesapp.Record.ContentManagerRegistration;
import com.naren.moviesapp.Record.ContentManagerUpdateRequest;
import com.naren.moviesapp.Repo.ContentManagerRepository;
import com.naren.moviesapp.jwt.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
public class ContentManagerService implements ContentManagerServiceInterface {

    private static final Logger logger = LoggerFactory.getLogger(ContentManagerService.class);

    private final ContentManagerRepository contentManagerRepository;
    private final MovieService movieService;
    private final ShowService showService;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public ContentManagerService(ContentManagerRepository contentManagerRepository,
                                MovieService movieService,
                                ShowService showService,
                                RoleService roleService,
                                PasswordEncoder passwordEncoder,
                                JwtUtil jwtUtil) {
        this.contentManagerRepository = contentManagerRepository;
        this.movieService = movieService;
        this.showService = showService;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public String login(ContentManagerLogin login) {
        logger.info("Content manager login attempt: {}", login.email());
        
        ContentManager contentManager = contentManagerRepository.findByEmail(login.email())
                .orElseThrow(() -> {
                    logger.warn("Login failed - content manager not found: {}", login.email());
                    return new ResourceNotFoundException("Content manager not found with email: " + login.email());
                });

        if (!passwordEncoder.matches(login.password(), contentManager.getPassword())) {
            logger.warn("Login failed - invalid password for: {}", login.email());
            throw new ResourceNotFoundException("Invalid credentials");
        }

        if (!contentManager.getIsActive()) {
            logger.warn("Login failed - content manager is inactive: {}", login.email());
            throw new ResourceNotFoundException("Account is inactive");
        }

        Map<String, Object> claims = Map.of("type", "CONTENT_MANAGER");
        String token = jwtUtil.issueToken(contentManager.getEmail(), claims);
        logger.info("Content manager logged in successfully: {}", login.email());
        return token;
    }

    @Override
    public ContentManager register(ContentManagerRegistration registration) {
        logger.info("Registering new content manager: {}", registration.email());

        if (contentManagerRepository.existsByEmail(registration.email())) {
            String errorMessage = "Content manager with email %s already exists".formatted(registration.email());
            logger.warn("Registration failed: {}", errorMessage);
            throw new ResourceAlreadyExists(errorMessage);
        }

        if (contentManagerRepository.existsByPhoneNumber(registration.phoneNumber())) {
            String errorMessage = "Content manager with phone number %s already exists".formatted(registration.phoneNumber());
            logger.warn("Registration failed: {}", errorMessage);
            throw new ResourceAlreadyExists(errorMessage);
        }

        ContentManager contentManager = new ContentManager(
                registration.name(),
                registration.email(),
                passwordEncoder.encode(registration.password()),
                registration.phoneNumber(),
                registration.department(),
                registration.specialization()
        );

        // Assign default role
        Role contentManagerRole = roleService.findRoleByName(RoleName.ROLE_CONTENT_MANAGER);
        contentManager.addRole(contentManagerRole);

        ContentManager savedContentManager = contentManagerRepository.save(contentManager);
        logger.info("Content manager registered successfully: {}", registration.email());
        return savedContentManager;
    }

    @Override
    public void logout(String token) {
        // Token blacklisting logic would be implemented here
        logger.info("Content manager logged out");
    }

    @Override
    public ContentManager getContentManagerById(Long id) {
        logger.debug("Fetching content manager by ID: {}", id);
        return contentManagerRepository.findById(id)
                .orElseThrow(() -> {
                    String errorMessage = "Content manager not found with ID: " + id;
                    logger.warn("Content manager not found: {}", errorMessage);
                    return new ResourceNotFoundException(errorMessage);
                });
    }

    @Override
    public ContentManager getContentManagerByEmail(String email) {
        logger.debug("Fetching content manager by email: {}", email);
        return contentManagerRepository.findByEmail(email)
                .orElseThrow(() -> {
                    String errorMessage = "Content manager not found with email: " + email;
                    logger.warn("Content manager not found: {}", errorMessage);
                    return new ResourceNotFoundException(errorMessage);
                });
    }

    @Override
    public List<ContentManager> getAllContentManagers() {
        logger.debug("Fetching all content managers");
        return contentManagerRepository.findAll();
    }

    @Override
    public ContentManager updateContentManager(Long id, ContentManagerUpdateRequest update) {
        logger.info("Updating content manager with ID: {}", id);
        ContentManager contentManager = getContentManagerById(id);

        boolean changes = false;

        if (update.name() != null && !update.name().equals(contentManager.getName())) {
            contentManager.setName(update.name());
            changes = true;
        }
        if (update.phoneNumber() != null && !update.phoneNumber().equals(contentManager.getPhoneNumber())) {
            contentManager.setPhoneNumber(update.phoneNumber());
            changes = true;
        }
        if (update.imageUrl() != null && !update.imageUrl().equals(contentManager.getImageUrl())) {
            contentManager.setImageUrl(update.imageUrl());
            changes = true;
        }
        if (update.department() != null && !update.department().equals(contentManager.getDepartment())) {
            contentManager.setDepartment(update.department());
            changes = true;
        }
        if (update.specialization() != null && !update.specialization().equals(contentManager.getSpecialization())) {
            contentManager.setSpecialization(update.specialization());
            changes = true;
        }
        if (update.accessLevel() != null && !update.accessLevel().equals(contentManager.getAccessLevel())) {
            contentManager.setAccessLevel(update.accessLevel());
            changes = true;
        }
        if (update.isActive() != null && !update.isActive().equals(contentManager.getIsActive())) {
            contentManager.setIsActive(update.isActive());
            changes = true;
        }

        if (!changes) {
            logger.warn("No changes detected for content manager ID: {}", id);
            return contentManager;
        }

        ContentManager updatedContentManager = contentManagerRepository.save(contentManager);
        logger.info("Content manager updated successfully: {}", id);
        return updatedContentManager;
    }

    @Override
    public void deleteContentManager(Long id) {
        logger.info("Deleting content manager with ID: {}", id);
        ContentManager contentManager = getContentManagerById(id);
        contentManagerRepository.delete(contentManager);
        logger.info("Content manager deleted successfully: {}", id);
    }

    @Override
    public void toggleContentManagerStatus(Long id) {
        logger.info("Toggling status for content manager ID: {}", id);
        ContentManager contentManager = getContentManagerById(id);
        contentManager.setIsActive(!contentManager.getIsActive());
        contentManagerRepository.save(contentManager);
        logger.info("Content manager status toggled: {}", contentManager.getIsActive());
    }

    @Override
    public Movie addMovie(Movie movie, Long contentManagerId) {
        logger.info("Content manager {} adding movie: {}", contentManagerId, movie.getName());
        ContentManager contentManager = getContentManagerById(contentManagerId);
        
        if (!"movies".equals(contentManager.getSpecialization()) && !"both".equals(contentManager.getSpecialization())) {
            logger.warn("Content manager {} not authorized to add movies", contentManagerId);
            throw new ResourceNotFoundException("Content manager not authorized to manage movies");
        }

        movie.setContentManager(contentManager);
        return movieService.addMovie(movie);
    }

    @Override
    public void updateMovie(Long movieId, Movie movie, Long contentManagerId) {
        logger.info("Content manager {} updating movie: {}", contentManagerId, movieId);
        ContentManager contentManager = getContentManagerById(contentManagerId);
        
        if (!"movies".equals(contentManager.getSpecialization()) && !"both".equals(contentManager.getSpecialization())) {
            logger.warn("Content manager {} not authorized to update movies", contentManagerId);
            throw new ResourceNotFoundException("Content manager not authorized to manage movies");
        }

        movie.setContentManager(contentManager);
        // Update the existing movie with new data
        Movie existingMovie = movieService.getMovieById(movieId);
        existingMovie.setName(movie.getName());
        existingMovie.setRating(movie.getRating());
        existingMovie.setDescription(movie.getDescription());
        existingMovie.setPoster(movie.getPoster());
        existingMovie.setAgeRating(movie.getAgeRating());
        existingMovie.setYear(movie.getYear());
        existingMovie.setRuntime(movie.getRuntime());
        existingMovie.setGenre(movie.getGenre());
        existingMovie.setType(movie.getType());
        existingMovie.setCategory(movie.getCategory());
        existingMovie.setContentManager(contentManager);
        
        // Save the updated movie
        movieService.addMovie(existingMovie);
    }

    @Override
    public void deleteMovie(Long movieId, Long contentManagerId) {
        logger.info("Content manager {} deleting movie: {}", contentManagerId, movieId);
        ContentManager contentManager = getContentManagerById(contentManagerId);
        
        if (!"movies".equals(contentManager.getSpecialization()) && !"both".equals(contentManager.getSpecialization())) {
            logger.warn("Content manager {} not authorized to delete movies", contentManagerId);
            throw new ResourceNotFoundException("Content manager not authorized to manage movies");
        }

        movieService.removeMovie(movieId);
    }

    @Override
    public List<Movie> getMoviesByContentManager(Long contentManagerId) {
        logger.debug("Fetching movies for content manager: {}", contentManagerId);
        return movieService.getMoviesByContentManager(contentManagerId);
    }

    @Override
    public Show addShow(Show show, Long contentManagerId) {
        logger.info("Content manager {} adding show: {}", contentManagerId, show.getName());
        ContentManager contentManager = getContentManagerById(contentManagerId);
        
        if (!"shows".equals(contentManager.getSpecialization()) && !"both".equals(contentManager.getSpecialization())) {
            logger.warn("Content manager {} not authorized to add shows", contentManagerId);
            throw new ResourceNotFoundException("Content manager not authorized to manage shows");
        }

        show.setContentManager(contentManager);
        return showService.addShow(show);
    }

    @Override
    public void updateShow(Long showId, Show show, Long contentManagerId) {
        logger.info("Content manager {} updating show: {}", contentManagerId, showId);
        ContentManager contentManager = getContentManagerById(contentManagerId);
        
        if (!"shows".equals(contentManager.getSpecialization()) && !"both".equals(contentManager.getSpecialization())) {
            logger.warn("Content manager {} not authorized to update shows", contentManagerId);
            throw new ResourceNotFoundException("Content manager not authorized to manage shows");
        }

        show.setContentManager(contentManager);
        // Update the existing show with new data
        Show existingShow = showService.getShowById(showId);
        existingShow.setName(show.getName());
        existingShow.setRating(show.getRating());
        existingShow.setDescription(show.getDescription());
        existingShow.setPoster(show.getPoster());
        existingShow.setAgeRating(show.getAgeRating());
        existingShow.setYear(show.getYear());
        existingShow.setRuntime(show.getRuntime());
        existingShow.setGenre(show.getGenre());
        existingShow.setType(show.getType());
        existingShow.setCategory(show.getCategory());
        existingShow.setContentManager(contentManager);
        
        // Save the updated show
        showService.addShow(existingShow);
    }

    @Override
    public void deleteShow(Long showId, Long contentManagerId) {
        logger.info("Content manager {} deleting show: {}", contentManagerId, showId);
        ContentManager contentManager = getContentManagerById(contentManagerId);
        
        if (!"shows".equals(contentManager.getSpecialization()) && !"both".equals(contentManager.getSpecialization())) {
            logger.warn("Content manager {} not authorized to delete shows", contentManagerId);
            throw new ResourceNotFoundException("Content manager not authorized to manage shows");
        }

        showService.removeShow(showId);
    }

    @Override
    public List<Show> getShowsByContentManager(Long contentManagerId) {
        logger.debug("Fetching shows for content manager: {}", contentManagerId);
        return showService.getShowsByContentManager(contentManagerId);
    }

    @Override
    public Long getMovieCountByContentManager(Long contentManagerId) {
        logger.debug("Counting movies for content manager: {}", contentManagerId);
        return movieService.countMoviesByContentManager(contentManagerId);
    }

    @Override
    public Long getShowCountByContentManager(Long contentManagerId) {
        logger.debug("Counting shows for content manager: {}", contentManagerId);
        return showService.countShowsByContentManager(contentManagerId);
    }

    @Override
    public List<ContentManager> getActiveContentManagers() {
        logger.debug("Fetching active content managers");
        return contentManagerRepository.findByIsActive(true);
    }

    public void updateContentManagerPassword(String email, String newPassword) {
        logger.info("Updating password for content manager: {}", email);
        ContentManager contentManager = getContentManagerByEmail(email);
        contentManager.setPassword(passwordEncoder.encode(newPassword));
        contentManagerRepository.save(contentManager);
        logger.info("Password updated successfully for content manager: {}", email);
    }
}
