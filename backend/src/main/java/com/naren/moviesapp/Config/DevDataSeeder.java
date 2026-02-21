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
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Random;

@Configuration
@Profile({"dev", "default"})
@RequiredArgsConstructor
@Slf4j
public class DevDataSeeder {

    private static final Random RANDOM = new Random();
    private static final Faker FAKER = new Faker();
    private static final int DEMO_DATA_COUNT = 20;

    private final CustomerRepository customerRepository;
    private final MovieRepository movieRepository;
    private final ShowRepository showRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @Transactional
    public CommandLineRunner seedDevData() {
        return args -> {
            log.info("Seeding development/demo data...");

            // Create demo user
            createDemoUser();

            for (int i = 0; i < DEMO_DATA_COUNT; i++) {
                createRandomCustomer();
                createRandomMovie();
                createRandomShow();
            }

            log.info("Development data seeding completed.");
        };
    }

    private void createDemoUser() {
        String demoEmail = "demo@example.com";
        
        // Check if demo user already exists by email
        var existingUser = customerRepository.findByEmail(demoEmail);
        if (existingUser.isPresent()) {
            // Update existing user to ensure they can login
            Customer user = existingUser.get();
            user.setIsEmailVerified(true);
            user.setIsRegistered(true);
            user.setIsActive(true);
            user.setIsSubscribed(true);
            customerRepository.save(user);
            log.info("Demo user updated with verified email and active status");
            return;
        }

        // Generate unique phone number
        String phoneNumber = "9999999" + String.format("%03d", RANDOM.nextInt(1000));
        
        // Verify phone number doesn't exist (simple check)
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
        double cost = Math.floor(RANDOM.nextDouble(200, 1200) * 100) / 100;
        String description = FAKER.lorem().sentence(40);
        String poster = FAKER.internet().url();
        String ageRating = FAKER.options().option("G", "PG", "PG-13", "R", "NC-17");
        int year = RANDOM.nextInt(1980, 2023);
        String runtime = RANDOM.nextInt(80, 180) + " mins";
        String genre1 = FAKER.book().genre();
        String genre2 = FAKER.book().genre();
        String instant = Instant.now().toString().substring(20, 24);

        Movie movie = new Movie();
        movie.setName(movieName + "-" + instant);
        movie.setCost(cost);
        movie.setRating(rating);
        movie.setDescription(description);
        movie.setPoster(poster);
        movie.setAgeRating(ageRating);
        movie.setYear(year);
        movie.setRuntime(runtime);
        movie.setGenre(genre1 + "," + genre2);
        movie.setType("movies");

        movieRepository.save(movie);
        log.debug("Created movie: {}", movie.getName());
    }

    private void createRandomShow() {
        String showName = FAKER.book().title();
        double rating = Math.floor(RANDOM.nextDouble(2, 5) * 100) / 100;
        double cost = Math.floor(RANDOM.nextDouble(200, 1200) * 100) / 100;
        String description = FAKER.lorem().sentence(40);
        String poster = FAKER.internet().url();
        String ageRating = FAKER.options().option("G", "PG", "PG-13", "R", "NC-17");
        int year = RANDOM.nextInt(1980, 2023);
        String runtime = RANDOM.nextInt(20, 60) + " mins";
        String genre1 = FAKER.book().genre();
        String genre2 = FAKER.book().genre();
        String instant = Instant.now().toString().substring(20, 24);

        Show show = new Show();
        show.setName(showName + "-" + instant);
        show.setCost(cost);
        show.setRating(rating);
        show.setDescription(description);
        show.setPoster(poster);
        show.setAgeRating(ageRating);
        show.setYear(year);
        show.setRuntime(runtime);
        show.setGenre(genre1 + "," + genre2);
        show.setType("shows");

        showRepository.save(show);
        log.debug("Created show: {}", show.getName());
    }
}
