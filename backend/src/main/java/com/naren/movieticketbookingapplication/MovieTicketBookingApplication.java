package com.naren.movieticketbookingapplication;

import com.github.javafaker.Faker;
import com.naren.movieticketbookingapplication.Entity.Customer;
import com.naren.movieticketbookingapplication.Entity.Movie;
import com.naren.movieticketbookingapplication.Entity.Role;
import com.naren.movieticketbookingapplication.Entity.Show;
import com.naren.movieticketbookingapplication.Repo.CustomerRepository;
import com.naren.movieticketbookingapplication.Repo.MovieRepository;
import com.naren.movieticketbookingapplication.Repo.RoleRepository;
import com.naren.movieticketbookingapplication.Repo.ShowRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Random;

@Slf4j
@SpringBootApplication
@EnableJpaAuditing
public class MovieTicketBookingApplication {

    private static final Random RANDOM = new Random();
    private static final Faker FAKER = new Faker();

    public static void main(String[] args) {
        SpringApplication.run(MovieTicketBookingApplication.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(CustomerRepository customerRepository,
                                               MovieRepository movieRepository, PasswordEncoder encoder,
                                               RoleRepository roleRepository,
                                               ShowRepository showRepository) {
        return args -> {
            createRandomCustomer(customerRepository, encoder);
            createRandomMovie(movieRepository);
            createRandomShow(showRepository);
//            createRole(roleRepository);
        };
    }

    private void createRandomCustomer(CustomerRepository customerRepository, PasswordEncoder encoder) {
        String customerName = FAKER.name().fullName();
        String customerEmail = customerName.toLowerCase().replace(" ", "") + "@codeNaren.com";
        String password = encoder.encode(FAKER.internet().password(8, 12));
        Long phoneNumber = Long.valueOf(FAKER.phoneNumber().subscriberNumber(9));
        String imageUrl = FAKER.internet().image(200, 200, false, "");
        Boolean isLoggedIn = FAKER.options().option(true, false);
        Customer customer = new Customer(customerName, customerEmail, password,
                phoneNumber, imageUrl, false, "Chennai, India", isLoggedIn);

        customerRepository.save(customer);
        log.info("Created new customer: {}", customer);
    }

    private void createRandomMovie(MovieRepository movieRepository) {
        String movieName = FAKER.book().title() + Math.random();
        var rating = Math.floor(RANDOM.nextDouble(2, 5) * 100) / 100;
        var cost = Math.floor(RANDOM.nextDouble(200, 1200) * 100) / 100;
        String description = FAKER.lorem().sentence();
        String poster = FAKER.internet().url();
        String ageRating = FAKER.options().option("G", "PG", "PG-13", "R", "NC-17");
        int year = RANDOM.nextInt(1980, 2023);
        String runtime = RANDOM.nextInt(80, 180) + " mins";
        String genre = FAKER.book().genre();
        int Random = RANDOM.nextInt(1000);

        Movie movie = new Movie(movieName + "-" + Random, cost, rating,
                description, poster, ageRating, year, runtime, genre, "movies");
        movieRepository.save(movie);

        log.info("Created new movie: {}", movie);
    }

    private void createRandomShow(ShowRepository showRepository) {
        String showName = FAKER.book().title();
        double rating = Math.floor(RANDOM.nextDouble(2, 5) * 100) / 100;
        double cost = Math.floor(RANDOM.nextDouble(200, 1200) * 100) / 100;
        String description = FAKER.lorem().sentence();
        String poster = FAKER.internet().url();
        String ageRating = FAKER.options().option("G", "PG", "PG-13", "R", "NC-17");
        int year = RANDOM.nextInt(1980, 2023);
        String runtime = RANDOM.nextInt(20, 60) + " mins";
        String genre = FAKER.book().genre();
        int Random = RANDOM.nextInt(1000);

        Show show = new Show(showName + "-" + Random, cost, rating, description, poster,
                ageRating, year, runtime, genre, "shows");
        showRepository.save(show);
        log.info("Created new show: {}", show);
    }

    private void createRole(RoleRepository roleRepository) {

        if (roleRepository.existsRoleByName("ROLE_USER")) {
            Role user = new Role("ROLE_USER");
            roleRepository.save(user);
        }
        if (roleRepository.existsRoleByName("ROLE_ADMIN")) {
            Role admin = new Role("ROLE_ADMIN");
            roleRepository.save(admin);
        }
    }
}
