package com.naren.moviesapp.Config;

import com.github.javafaker.Faker;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Movie;
import com.naren.moviesapp.Entity.Show;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Repo.MovieRepository;
import com.naren.moviesapp.Repo.ShowRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Configuration
@Profile({"dev", "default"})
@RequiredArgsConstructor
@Slf4j
public class DevDataSeeder {

    private static final Random RANDOM = new Random();
    private static final Faker FAKER = new Faker();
    private static final int DEMO_DATA_COUNT = 20;

    // OTT Platform Categories
    private static final List<String> MOVIE_CATEGORIES = Arrays.asList(
            "Trending",
            "New Releases",
            "Popular",
            "Top Rated",
            "Action",
            "Comedy",
            "Drama",
            "Sci-Fi",
            "Horror",
            "Romance"
    );

    private static final List<String> SHOW_CATEGORIES = Arrays.asList(
            "Trending",
            "New Releases",
            "Popular",
            "Top Rated",
            "Binge Worthy",
            "Originals",
            "Drama",
            "Comedy",
            "Reality TV",
            "Documentary"
    );

    private final CustomerRepository customerRepository;
    private final MovieRepository movieRepository;
    private final ShowRepository showRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Value("${app.tmdb.api-key:}")
    private String tmdbApiKey;

    @Bean
    @Transactional
    public CommandLineRunner seedDevData() {
        return args -> {
            log.info("Seeding development/demo data...");

            createDemoUser();

            // Only create random customers
            for (int i = 0; i < DEMO_DATA_COUNT; i++) {
                createRandomCustomer();
            }
            
            // Only create fake movies/shows if TMDB is not configured
            // If TMDB is configured, TmdbDataSeeder will import real data
            boolean tmdbConfigured = tmdbApiKey != null && !tmdbApiKey.isBlank();
            if (!tmdbConfigured) {
                log.info("TMDB not configured. Creating fake movies and shows...");
                for (int i = 0; i < DEMO_DATA_COUNT; i++) {
                    createRandomMovie();
                    createRandomShow();
                }
            } else {
                log.info("TMDB is configured. Skipping fake movie/show creation. Real data will be imported by TmdbDataSeeder.");
            }

            log.info("Development data seeding completed.");
        };
    }

    private void createDemoUser() {
        String demoEmail = "demo@example.com";
        
        var existingUser = customerRepository.findByEmail(demoEmail);
        if (existingUser.isPresent()) {
            Customer user = existingUser.get();
            user.setIsEmailVerified(true);
            user.setIsRegistered(true);
            user.setIsActive(true);
            user.setIsSubscribed(true);
            customerRepository.save(user);
            log.info("Demo user updated with verified email and active status");
            return;
        }

        String phoneNumber = "9999999" + String.format("%03d", RANDOM.nextInt(1000));
        
        while (isPhoneNumberTaken(phoneNumber)) {
            phoneNumber = "9999999" + String.format("%03d", RANDOM.nextInt(1000));
        }

        Customer demoUser = new Customer();
        demoUser.setName("Demo User");
        demoUser.setEmail(demoEmail);
        demoUser.setPassword(passwordEncoder.encode("Demo123456"));
        demoUser.setPhoneNumber(phoneNumber);
        demoUser.setImageUrl("");
        demoUser.setAddress("123 Demo Street");
        demoUser.setIsActive(true);
        demoUser.setIsSubscribed(true);
        demoUser.setIsEmailVerified(true);
        demoUser.setIsRegistered(true);

        customerRepository.save(demoUser);
        log.info("Created demo user: {} with phone: {}", demoEmail, phoneNumber);
    }
    
    private boolean isPhoneNumberTaken(String phoneNumber) {
        return customerRepository.findAll().stream()
            .anyMatch(c -> c.getPhoneNumber() != null && c.getPhoneNumber().equals(phoneNumber));
    }

    private void createRandomCustomer() {
        String customerName = FAKER.name().fullName();
        String domain = System.getenv().getOrDefault("EMAIL_DOMAIN", "codeNaren.com");
        String customerEmail = customerName.toLowerCase().replace(" ", "") + "@" + domain;
        String password = passwordEncoder.encode(FAKER.internet().password(8, 12));
        String phoneNumber = FAKER.phoneNumber().subscriberNumber(9);
        Boolean isActive = RANDOM.nextBoolean();

        Customer customer = new Customer();
        customer.setName(customerName);
        customer.setEmail(customerEmail);
        customer.setPassword(password);
        customer.setPhoneNumber(phoneNumber);
        customer.setImageUrl("");
        customer.setAddress(FAKER.address().fullAddress());
        customer.setIsActive(isActive);
        customer.setIsSubscribed(false);

        customerRepository.save(customer);
        log.debug("Created customer: {}", customerEmail);
    }

    private void createRandomMovie() {
        String movieName = FAKER.book().title();
        double rating = Math.floor(RANDOM.nextDouble(2, 5) * 100) / 100;
        String description = FAKER.lorem().sentence(40);
        String poster = FAKER.internet().url();
        String ageRating = FAKER.options().option("G", "PG", "PG-13", "R", "NC-17");
        int year = RANDOM.nextInt(1980, 2023);
        String runtime = RANDOM.nextInt(80, 180) + " mins";
        String genre1 = FAKER.book().genre();
        String genre2 = FAKER.book().genre();
        String instant = Instant.now().toString().substring(20, 24);
        
        // Assign random category
        String category = MOVIE_CATEGORIES.get(RANDOM.nextInt(MOVIE_CATEGORIES.size()));

        Movie movie = new Movie();
        movie.setName(movieName + "-" + instant);
        movie.setRating(rating);
        movie.setDescription(description);
        movie.setPoster(poster);
        movie.setAgeRating(ageRating);
        movie.setYear(year);
        movie.setRuntime(runtime);
        movie.setGenre(genre1 + "," + genre2);
        movie.setType("movies");
        movie.setCategory(category);

        movieRepository.save(movie);
        log.debug("Created movie: {} with category: {}", movie.getName(), category);
    }

    private void createRandomShow() {
        String showName = FAKER.book().title();
        double rating = Math.floor(RANDOM.nextDouble(2, 5) * 100) / 100;
        String description = FAKER.lorem().sentence(40);
        String poster = FAKER.internet().url();
        String ageRating = FAKER.options().option("G", "PG", "PG-13", "R", "NC-17");
        int year = RANDOM.nextInt(1980, 2023);
        String runtime = RANDOM.nextInt(20, 60) + " mins";
        String genre1 = FAKER.book().genre();
        String genre2 = FAKER.book().genre();
        String instant = Instant.now().toString().substring(20, 24);
        
        // Assign random category
        String category = SHOW_CATEGORIES.get(RANDOM.nextInt(SHOW_CATEGORIES.size()));

        Show show = new Show();
        show.setName(showName + "-" + instant);
        show.setRating(rating);
        show.setDescription(description);
        show.setPoster(poster);
        show.setAgeRating(ageRating);
        show.setYear(year);
        show.setRuntime(runtime);
        show.setGenre(genre1 + "," + genre2);
        show.setType("shows");
        show.setCategory(category);

        showRepository.save(show);
        log.debug("Created show: {} with category: {}", show.getName(), category);
    }
}
