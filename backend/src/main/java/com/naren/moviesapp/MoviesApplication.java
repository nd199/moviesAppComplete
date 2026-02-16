package com.naren.moviesapp;

import com.github.javafaker.Faker;
import com.naren.moviesapp.Entity.*;
import com.naren.moviesapp.Repo.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Random;

@SpringBootApplication
@EnableJpaAuditing
public class MoviesApplication {
    private static final Random RANDOM = new Random();
    private static final Faker FAKER = new Faker();

    public static void main(String[] args) {
        SpringApplication.run(MoviesApplication.class, args);
    }

    @Bean
    @ConditionalOnProperty(name = "app.data-initialization.enabled", havingValue = "true", matchIfMissing = false)
    public CommandLineRunner commandLineRunner(CustomerRepository customerRepository,
                                               MovieRepository movieRepository, PasswordEncoder encoder,
                                               RoleRepository roleRepository,
                                               ShowRepository showRepository,
                                               SubscriptionPlanRepository subscriptionPlanRepository) {
        return args -> {
            int i = 4;
            while (i != 0) {
                createRandomCustomer(customerRepository, encoder);
                createRandomMovie(movieRepository);
                createRandomShow(showRepository);
                i--;
            }
            createDefaultPlans(subscriptionPlanRepository);
            createRole(roleRepository);
        };
    }

    private void createRandomCustomer(CustomerRepository customerRepository, PasswordEncoder encoder) {
        String customerName = FAKER.name().fullName();
        String domain = System.getenv().getOrDefault("EMAIL_DOMAIN", "codeNaren.com");
        String customerEmail = customerName.toLowerCase().replace(" ", "") + "@" + domain;
        String password = encoder.encode(FAKER.internet().password(8, 12));
        String phoneNumber = FAKER.phoneNumber().subscriberNumber(9);
        Boolean isLoggedIn = FAKER.options().<Boolean>option(true, false);
        Boolean isRegistered = FAKER.options().<Boolean>option(true, false);
        Customer customer = new Customer(customerName, customerEmail, password,
                phoneNumber, "", false, "Chennai, India", isLoggedIn, isRegistered, false);

        customerRepository.save(customer);
    }

    private void createRandomMovie(MovieRepository movieRepository) {
        String movieName = FAKER.book().title();
        var rating = Math.floor(RANDOM.nextDouble(2, 5) * 100) / 100;
        var cost = Math.floor(RANDOM.nextDouble(200, 1200) * 100) / 100;
        String description = FAKER.lorem().sentence(40);
        String poster = FAKER.internet().url();
        String ageRating = FAKER.options().option("G", "PG", "PG-13", "R", "NC-17");
        int year = RANDOM.nextInt(1980, 2023);
        String runtime = RANDOM.nextInt(80, 180) + " mins";
        String genre1 = FAKER.book().genre();
        String genre2 = FAKER.book().genre();
        var instant = Instant.now().toString().substring(20, 24);

        Movie movie = new Movie(movieName + "-" + instant, cost, rating,
                description, poster, ageRating, year, runtime, genre1 + "," + genre2, "movies");
        movieRepository.save(movie);

    }

    private void createRandomShow(ShowRepository showRepository) {
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
        var instant = Instant.now().toString().substring(20, 24);

        Show show = new Show(showName + "-" + instant, cost, rating, description, poster,
                ageRating, year, runtime, genre1 + "," + genre2, "shows");
        showRepository.save(show);
    }

    private SubscriptionPlan basicPlan() {
        return SubscriptionPlan.builder()
                .planName("Monthly")
                .description("Access to all content for a month")
                .price(149.00)
                .interval("Month")
                .build();
    }

    private SubscriptionPlan mediumPlan() {
        return SubscriptionPlan.builder()
                .planName("6 Months")
                .description("Access to all content for 6 months")
                .price(749.00)
                .interval("6 Months")
                .build();
    }

    private SubscriptionPlan premiumPlan() {
        return SubscriptionPlan.builder()
                .planName("Yearly")
                .description("Access to all content for a year")
                .price(1499.00)
                .interval("Year")
                .build();
    }

    private void createDefaultPlans(SubscriptionPlanRepository planRepository) {
        if (!planRepository.existsByPlanName("Monthly")) {
            planRepository.save(basicPlan());
        }
        if (!planRepository.existsByPlanName("6 Months")) {
            planRepository.save(mediumPlan());
        }
        if (!planRepository.existsByPlanName("Yearly")) {
            planRepository.save(premiumPlan());
        }
    }

    private void createRole(RoleRepository roleRepository) {

        if (!roleRepository.existsRoleByName("ROLE_USER")) {
            Role user = new Role("ROLE_USER");
            roleRepository.save(user);
        }
        if (!roleRepository.existsRoleByName("ROLE_ADMIN")) {
            Role admin = new Role("ROLE_ADMIN");
            roleRepository.save(admin);
        }
    }
}
