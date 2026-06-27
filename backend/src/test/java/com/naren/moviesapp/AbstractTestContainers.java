package com.naren.moviesapp;

import net.datafaker.Faker;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers(disabledWithoutDocker = true)
public class AbstractTestContainers {

    protected static final Faker FAKER = new Faker();

    @Container
    protected static final PostgreSQLContainer<?> postgresContainer =
            new PostgreSQLContainer<>("postgres:15-alpine")
                    .withDatabaseName("movieott")
                    .withUsername("postgres")
                    .withPassword("password")
                    .withReuse(false);

    @DynamicPropertySource
    private static void registerDynamicPropertySource(
            DynamicPropertyRegistry registry) {
        if (!postgresContainer.isRunning()) {
            postgresContainer.start();
        }

        registry.add(
                "spring.datasource.url",
                postgresContainer::getJdbcUrl
        );
        registry.add(
                "spring.datasource.username",
                postgresContainer::getUsername
        );
        registry.add(
                "spring.datasource.password",
                postgresContainer::getPassword
        );
        registry.add(
                "spring.datasource.driver-class-name",
                postgresContainer::getDriverClassName
        );
        registry.add(
                "spring.jpa.hibernate.ddl-auto",
                () -> "create-drop"
        );
        registry.add(
                "spring.flyway.enabled",
                () -> "false"
        );
        registry.add(
                "spring.datasource.hikari.connection-timeout",
                () -> "30000"
        );
        registry.add(
                "spring.datasource.hikari.maximum-pool-size",
                () -> "10"
        );
        registry.add(
                "spring.datasource.hikari.minimum-idle",
                () -> "2"
        );
        registry.add(
                "spring.datasource.hikari.idle-timeout",
                () -> "180000"
        );
        registry.add(
                "spring.datasource.hikari.max-lifetime",
                () -> "600000"
        );
        registry.add(
                "spring.datasource.hikari.leak-detection-threshold",
                () -> "30000"
        );
        // Connection validation settings
        registry.add(
                "spring.datasource.hikari.connection-test-query",
                () -> "SELECT 1"
        );
        registry.add(
                "spring.datasource.hikari.validation-timeout",
                () -> "5000"
        );
    }

}

