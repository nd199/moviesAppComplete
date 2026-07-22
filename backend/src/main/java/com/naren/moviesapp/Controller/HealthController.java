package com.naren.moviesapp.Controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class HealthController {

    private static final Logger logger = LoggerFactory.getLogger(HealthController.class);

    private final DataSource dataSource;

    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/health-check")
    public ResponseEntity<Map<String, Object>> ping() {
        logger.debug("Health check ping received");

        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", Instant.now().toString());
        response.put("service", "movieOttApplication");
        response.put("version", "1.0.0");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        logger.debug("Detailed health check received");

        String dbStatus = checkDatabaseHealth();

        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP".equals(dbStatus) ? "UP" : "DOWN");
        response.put("timestamp", Instant.now().toString());
        response.put("service", "movieOttApplication");
        response.put("version", "1.0.0");
        response.put("database", dbStatus);
        response.put("components", Map.of(
                "database", Map.of("status", dbStatus),
                "jwt", Map.of("status", "UP"),
                "refreshTokens", Map.of("status", "UP")
        ));

        return ResponseEntity.ok(response);
    }

    private String checkDatabaseHealth() {
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(5)) {
                return "UP";
            }
        } catch (SQLException e) {
            logger.error("Database health check failed: {}", e.getMessage());
        }
        return "DOWN";
    }
}
