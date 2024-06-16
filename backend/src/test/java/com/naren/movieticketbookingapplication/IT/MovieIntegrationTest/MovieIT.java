package com.naren.movieticketbookingapplication.IT.MovieIntegrationTest;

import com.github.javafaker.Faker;
import com.naren.movieticketbookingapplication.Entity.Customer;
import com.naren.movieticketbookingapplication.Entity.Movie;
import com.naren.movieticketbookingapplication.Entity.Role;
import com.naren.movieticketbookingapplication.Record.CustomerRegistration;
import com.naren.movieticketbookingapplication.Record.MovieRegistration;
import com.naren.movieticketbookingapplication.Record.MovieUpdation;
import com.naren.movieticketbookingapplication.Repo.RoleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Objects;
import java.util.Random;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class MovieIT {

    private static final String API_PATH = "api/v1/movies";

    private static final Faker FAKER = new Faker();

    private static final Random RANDOM = new Random();

    @Autowired
    private WebTestClient webTestClient;

    @Autowired
    private RoleRepository roleRepository;

    private MovieRegistration registration;

    private CustomerRegistration adminRegistration;

    @BeforeEach
    void setup() {
        createRoleIfNotExists();

        String customerName = "IM CUSTOMER " + FAKER.name().fullName();
        String customerEmail = customerName.replace(" ", ".") + "@codeNaren.com";
        String password = FAKER.internet().password(8, 12);
        Long customerPhone = Long.valueOf(FAKER.phoneNumber().subscriberNumber(9));
        boolean isEmailVerified = false;
        boolean isPhoneVerified = false;

        new CustomerRegistration(customerName, customerEmail,
                password, customerPhone, isEmailVerified, isPhoneVerified, false);

        String adminName = "IM ADMIN " + FAKER.name().fullName();
        String adminEmail = adminName.replace(" ", ".1123131213") + "@codeNaren.com";
        adminRegistration = new CustomerRegistration(adminName, adminEmail, password, customerPhone, isEmailVerified, isPhoneVerified, false);

        String movieName = FAKER.book().title() + Math.random();
        Double rating = Math.floor(RANDOM.nextDouble(2, 5) * 100) / 100;
        Double cost = Math.floor(RANDOM.nextDouble(200, 1200) * 100) / 100;
        String description = FAKER.lorem().paragraph();
        String poster = FAKER.internet().url();
        String ageRating = "PG-13";
        Integer year = RANDOM.nextInt(1950, 2023);
        String runtime = RANDOM.nextInt(90, 180) + " minutes";
        String genre = "Action";

        registration = new MovieRegistration(movieName, cost, rating, description,
                poster, ageRating, year, runtime, genre);
    }

    private void createRoleIfNotExists() {
        if (!roleRepository.existsRoleByName("ROLE_USER")) {
            addRole(new Role("ROLE_USER"));
        }
        if (!roleRepository.existsRoleByName("ROLE_ADMIN")) {
            addRole(new Role("ROLE_ADMIN"));
        }
    }

    private void addRole(Role role) {
        roleRepository.save(role);
    }

    private String registerAdminAndGetToken(CustomerRegistration registration) {
        return Objects.requireNonNull(webTestClient.post()
                .uri("/api/v1/auth/admins")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(registration), CustomerRegistration.class)
                .exchange()
                .expectStatus().isCreated()
                .returnResult(Void.class)
                .getResponseHeaders()
                .getFirst(HttpHeaders.AUTHORIZATION));
    }

    @Test
    void createMovie() {
        String adminToken = registerAdminAndGetToken(adminRegistration);

        webTestClient.post()
                .uri(API_PATH)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, "Bearer " + adminToken)
                .body(Mono.just(registration), MovieRegistration.class)
                .exchange()
                .expectStatus()
                .isCreated();

        List<Movie> movieList = webTestClient.get()
                .uri(API_PATH)
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectBodyList(new ParameterizedTypeReference<Movie>() {
                }).returnResult()
                .getResponseBody();

        assert movieList != null;
        Long id = movieList.stream()
                .filter(m -> m.getName().equals(registration.name()))
                .map(Movie::getMovie_id)
                .findFirst()
                .orElseThrow();

        Movie expected = webTestClient.get()
                .uri(API_PATH + "/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, "Bearer " + adminToken)
                .exchange()
                .expectBody(new ParameterizedTypeReference<Movie>() {
                }).returnResult()
                .getResponseBody();

        assertThat(movieList).contains(expected);
    }

    @Test
    void deleteMovie() {
        String adminToken = registerAdminAndGetToken(adminRegistration);

        webTestClient.post()
                .uri(API_PATH)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, "Bearer " + adminToken)
                .body(Mono.just(registration), MovieRegistration.class)
                .exchange()
                .expectStatus()
                .isCreated();

        List<Movie> movieList = webTestClient.get()
                .uri(API_PATH)
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectBodyList(new ParameterizedTypeReference<Movie>() {
                }).returnResult()
                .getResponseBody();

        assert movieList != null;
        Long id = movieList.stream()
                .filter(m -> m.getName().equals(registration.name()))
                .map(Movie::getMovie_id)
                .findFirst()
                .orElseThrow();

        webTestClient.delete()
                .uri(API_PATH + "/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, "Bearer " + adminToken)
                .exchange()
                .expectStatus()
                .isOk();

        webTestClient.get()
                .uri(API_PATH + "/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, "Bearer " + adminToken)
                .exchange()
                .expectStatus()
                .isNotFound();
    }

    @Test
    void updateMovie() {
        // Register admin and get token
        String adminToken = registerAdminAndGetToken(adminRegistration);

        // Create a new movie
        webTestClient.post()
                .uri(API_PATH)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, "Bearer " + adminToken)
                .body(Mono.just(registration), MovieRegistration.class)
                .exchange()
                .expectStatus().isCreated();

        // Fetch all movies and find the movie by name
        List<Movie> movieList = webTestClient.get()
                .uri(API_PATH)
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(new ParameterizedTypeReference<Movie>() {
                })
                .returnResult()
                .getResponseBody();

        assert movieList != null;
        Long id = movieList.stream()
                .filter(m -> m.getName().equals(registration.name()))
                .map(Movie::getMovie_id)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        // Create an updated movie request
        String newName = FAKER.funnyName().name();
        MovieUpdation movieUpdation = new MovieUpdation(
                newName,
                registration.cost(),
                registration.rating(),
                registration.description(),
                registration.poster(),
                registration.ageRating(),
                registration.year(),
                registration.runtime(),
                registration.genre()
        );

        // Update the movie
        webTestClient.put()
                .uri(API_PATH + "/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, "Bearer " + adminToken)
                .body(Mono.just(movieUpdation), MovieUpdation.class)
                .exchange()
                .expectStatus().isOk();

        // Fetch the updated movie
        Movie updatedMovie = webTestClient.get()
                .uri(API_PATH + "/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, "Bearer " + adminToken)
                .exchange()
                .expectStatus().isOk()
                .expectBody(new ParameterizedTypeReference<Movie>() {
                })
                .returnResult()
                .getResponseBody();

        assertThat(updatedMovie).usingRecursiveComparison()
                .ignoringFields("movie_id", "createdAt", "updatedAt", "customer")
                .isEqualTo(movieUpdation);

        assert updatedMovie != null;
        assertThat(updatedMovie.getCreatedAt()).isNotNull();
        assertThat(updatedMovie.getUpdatedAt()).isNotNull();

        // Optionally, assert specific fields if required
        assertThat(updatedMovie.getName()).isEqualTo(newName);
        assertThat(updatedMovie.getCost()).isEqualTo(registration.cost());
        assertThat(updatedMovie.getRating()).isEqualTo(registration.rating());
        // Add more assertions as needed
    }

}
