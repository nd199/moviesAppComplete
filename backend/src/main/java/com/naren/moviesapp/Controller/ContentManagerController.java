package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Entity.ContentManager;
import com.naren.moviesapp.Entity.Movie;
import com.naren.moviesapp.Entity.Show;
import com.naren.moviesapp.Record.ContentManagerLogin;
import com.naren.moviesapp.Record.ContentManagerRegistration;
import com.naren.moviesapp.Record.ContentManagerUpdateRequest;
import com.naren.moviesapp.Service.ContentManagerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/content-manager")
public class ContentManagerController {

    private static final Logger logger = LoggerFactory.getLogger(ContentManagerController.class);

    private final ContentManagerService contentManagerService;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    public ContentManagerController(ContentManagerService contentManagerService) {
        this.contentManagerService = contentManagerService;
    }

    // Authentication endpoints
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody ContentManagerLogin login, 
                                                   HttpServletResponse response) {
        logger.info("Content manager login request: {}", login.email());
        String token = contentManagerService.login(login);
        
        // Set JWT cookie like admin login
        setJwtOnlyCookie(response, token);
        
        // Return user data like admin login
        ContentManager cm = contentManagerService.getContentManagerByEmail(login.email());
        Map<String, Object> responseBody = new HashMap<>();
        
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", cm.getId());
        userMap.put("name", cm.getName());
        userMap.put("email", cm.getEmail());
        userMap.put("phoneNumber", cm.getPhoneNumber());
        userMap.put("department", cm.getDepartment());
        userMap.put("specialization", cm.getSpecialization());
        userMap.put("isActive", cm.getIsActive());
        userMap.put("createdAt", cm.getCreatedAt());
        userMap.put("updatedAt", cm.getUpdatedAt());
        userMap.put("imageUrl", cm.getImageUrl());
        userMap.put("roles", cm.getRoles().stream().map(role -> role.getName().name()).toList());
        
        responseBody.put("user", userMap);
        responseBody.put("userType", "CONTENT_MANAGER");
        responseBody.put("token", token);
        responseBody.put("type", "Bearer");
        
        return ResponseEntity.ok(responseBody);
    }

    private void setJwtOnlyCookie(HttpServletResponse response, String jwt) {
        boolean isProduction = activeProfile.equals("prod");
        String domain = null;

        ResponseCookie jwtCookie = ResponseCookie.from("cm_jwt_token", jwt)
                .httpOnly(true)
                .secure(isProduction)
                .path("/")
                .maxAge(Duration.ofMinutes(30))
                .sameSite(isProduction ? "None" : "Lax")
                .domain(domain)
                .build();

        logger.info("Setting JWT cookie for content manager - Production: {}, Domain: {}, SameSite: {}",
                isProduction, domain, isProduction ? "None" : "Lax");

        response.addHeader("Set-Cookie", jwtCookie.toString());
    }

    @PostMapping("/register")
    public ResponseEntity<ContentManager> register(@RequestBody ContentManagerRegistration registration) {
        logger.info("Content manager registration request: {}", registration.email());
        ContentManager contentManager = contentManagerService.register(registration);
        return new ResponseEntity<>(contentManager, HttpStatus.CREATED);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String token) {
        logger.info("Content manager logout request");
        contentManagerService.logout(token);
        return ResponseEntity.ok().build();
    }

    // Content Manager CRUD endpoints
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('CONTENT_MANAGER') and #id == authentication.principal.id)")
    public ResponseEntity<ContentManager> getContentManagerById(@PathVariable("id") Long id) {
        logger.debug("Fetching content manager by ID: {}", id);
        ContentManager contentManager = contentManagerService.getContentManagerById(id);
        return ResponseEntity.ok(contentManager);
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('CONTENT_MANAGER') and #email == authentication.principal.username)")
    public ResponseEntity<ContentManager> getContentManagerByEmail(@PathVariable("email") String email) {
        logger.debug("Fetching content manager by email: {}", email);
        ContentManager contentManager = contentManagerService.getContentManagerByEmail(email);
        return ResponseEntity.ok(contentManager);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ContentManager>> getAllContentManagers() {
        logger.debug("Fetching all content managers");
        List<ContentManager> contentManagers = contentManagerService.getAllContentManagers();
        return ResponseEntity.ok(contentManagers);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('CONTENT_MANAGER') and #id == authentication.principal.id)")
    public ResponseEntity<ContentManager> updateContentManager(@PathVariable("id") Long id,
                                                               @RequestBody ContentManagerUpdateRequest update) {
        logger.info("Updating content manager with ID: {}", id);
        ContentManager contentManager = contentManagerService.updateContentManager(id, update);
        return ResponseEntity.ok(contentManager);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteContentManager(@PathVariable("id") Long id) {
        logger.info("Deleting content manager with ID: {}", id);
        contentManagerService.deleteContentManager(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> toggleContentManagerStatus(@PathVariable("id") Long id) {
        logger.info("Toggling status for content manager ID: {}", id);
        contentManagerService.toggleContentManagerStatus(id);
        return ResponseEntity.ok().build();
    }

    // Movie Management endpoints
    @PostMapping("/{contentManagerId}/movies")
    @PreAuthorize("hasRole('CONTENT_MANAGER') and #contentManagerId == authentication.principal.id")
    public ResponseEntity<Movie> addMovie(@PathVariable("contentManagerId") Long contentManagerId,
                                          @RequestBody Movie movie) {
        logger.info("Content manager {} adding movie: {}", contentManagerId, movie.getName());
        Movie createdMovie = contentManagerService.addMovie(movie, contentManagerId);
        return new ResponseEntity<>(createdMovie, HttpStatus.CREATED);
    }

    @PutMapping("/{contentManagerId}/movies/{movieId}")
    @PreAuthorize("hasRole('CONTENT_MANAGER') and #contentManagerId == authentication.principal.id")
    public ResponseEntity<Void> updateMovie(@PathVariable("contentManagerId") Long contentManagerId,
                                           @PathVariable("movieId") Long movieId,
                                           @RequestBody Movie movie) {
        logger.info("Content manager {} updating movie: {}", contentManagerId, movieId);
        contentManagerService.updateMovie(movieId, movie, contentManagerId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{contentManagerId}/movies/{movieId}")
    @PreAuthorize("hasRole('CONTENT_MANAGER') and #contentManagerId == authentication.principal.id")
    public ResponseEntity<Void> deleteMovie(@PathVariable("contentManagerId") Long contentManagerId,
                                            @PathVariable("movieId") Long movieId) {
        logger.info("Content manager {} deleting movie: {}", contentManagerId, movieId);
        contentManagerService.deleteMovie(movieId, contentManagerId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{contentManagerId}/movies")
    @PreAuthorize("hasRole('CONTENT_MANAGER') and #contentManagerId == authentication.principal.id")
    public ResponseEntity<List<Movie>> getMoviesByContentManager(@PathVariable("contentManagerId") Long contentManagerId) {
        logger.debug("Fetching movies for content manager: {}", contentManagerId);
        List<Movie> movies = contentManagerService.getMoviesByContentManager(contentManagerId);
        return ResponseEntity.ok(movies);
    }

    // Show Management endpoints
    @PostMapping("/{contentManagerId}/shows")
    @PreAuthorize("hasRole('CONTENT_MANAGER') and #contentManagerId == authentication.principal.id")
    public ResponseEntity<Show> addShow(@PathVariable("contentManagerId") Long contentManagerId,
                                        @RequestBody Show show) {
        logger.info("Content manager {} adding show: {}", contentManagerId, show.getName());
        Show createdShow = contentManagerService.addShow(show, contentManagerId);
        return new ResponseEntity<>(createdShow, HttpStatus.CREATED);
    }

    @PutMapping("/{contentManagerId}/shows/{showId}")
    @PreAuthorize("hasRole('CONTENT_MANAGER') and #contentManagerId == authentication.principal.id")
    public ResponseEntity<Void> updateShow(@PathVariable("contentManagerId") Long contentManagerId,
                                          @PathVariable("showId") Long showId,
                                          @RequestBody Show show) {
        logger.info("Content manager {} updating show: {}", contentManagerId, showId);
        contentManagerService.updateShow(showId, show, contentManagerId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{contentManagerId}/shows/{showId}")
    @PreAuthorize("hasRole('CONTENT_MANAGER') and #contentManagerId == authentication.principal.id")
    public ResponseEntity<Void> deleteShow(@PathVariable("contentManagerId") Long contentManagerId,
                                           @PathVariable("showId") Long showId) {
        logger.info("Content manager {} deleting show: {}", contentManagerId, showId);
        contentManagerService.deleteShow(showId, contentManagerId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{contentManagerId}/shows")
    @PreAuthorize("hasRole('CONTENT_MANAGER') and #contentManagerId == authentication.principal.id")
    public ResponseEntity<List<Show>> getShowsByContentManager(@PathVariable("contentManagerId") Long contentManagerId) {
        logger.debug("Fetching shows for content manager: {}", contentManagerId);
        List<Show> shows = contentManagerService.getShowsByContentManager(contentManagerId);
        return ResponseEntity.ok(shows);
    }

    // Analytics endpoints
    @GetMapping("/{contentManagerId}/analytics")
    @PreAuthorize("hasRole('CONTENT_MANAGER') and #contentManagerId == authentication.principal.id")
    public ResponseEntity<Map<String, Object>> getContentManagerAnalytics(@PathVariable("contentManagerId") Long contentManagerId) {
        logger.debug("Fetching analytics for content manager: {}", contentManagerId);
        Long movieCount = contentManagerService.getMovieCountByContentManager(contentManagerId);
        Long showCount = contentManagerService.getShowCountByContentManager(contentManagerId);
        
        Map<String, Object> analytics = Map.of(
            "movieCount", movieCount,
            "showCount", showCount,
            "totalContent", movieCount + showCount
        );
        
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ContentManager>> getActiveContentManagers() {
        logger.debug("Fetching active content managers");
        List<ContentManager> activeContentManagers = contentManagerService.getActiveContentManagers();
        return ResponseEntity.ok(activeContentManagers);
    }
}
