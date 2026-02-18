package com.naren.moviesapp;

import com.github.javafaker.Faker;
import org.flywaydb.core.Flyway;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers(disabledWithoutDocker = true)
public abstract class AbstractIntegrationTest {

    protected static final Faker FAKER = new Faker();

    @Container
    protected static final PostgreSQLContainer<?> postgresContainer =
            new PostgreSQLContainer<>("postgres:15-alpine")
                    .withDatabaseName("movieott_integration")
                    .withUsername("integration_test")
                    .withPassword("test_password")
                    .withReuse(true); // Enable reuse for integration tests

    static {
        postgresContainer.start();

        Flyway flyway = Flyway
                .configure()
                .dataSource(postgresContainer.getJdbcUrl(),
                        postgresContainer.getUsername(),
                        postgresContainer.getPassword()
                )
                .cleanDisabled(true)
                .validateMigrationNaming(false)
                .load();
        flyway.migrate();
    }

    @DynamicPropertySource
    protected static void registerDynamicPropertySource(
            DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgresContainer::getJdbcUrl);
        registry.add("spring.datasource.username", postgresContainer::getUsername);
        registry.add("spring.datasource.password", postgresContainer::getPassword);
        registry.add("spring.datasource.driver-class-name", postgresContainer::getDriverClassName);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
        registry.add("spring.flyway.enabled", () -> "false"); // Flyway already run
        // Optimized connection pool for integration tests
        registry.add("spring.datasource.hikari.connection-timeout", () -> "60000");
        registry.add("spring.datasource.hikari.maximum-pool-size", () -> "20");
        registry.add("spring.datasource.hikari.minimum-idle", () -> "5");
        registry.add("spring.datasource.hikari.idle-timeout", () -> "300000");
        registry.add("spring.datasource.hikari.max-lifetime", () -> "900000");
        registry.add("spring.datasource.hikari.leak-detection-threshold", () -> "60000");
        registry.add("spring.datasource.hikari.connection-test-query", () -> "SELECT 1");
        registry.add("spring.datasource.hikari.validation-timeout", () -> "5000");
    }
}
