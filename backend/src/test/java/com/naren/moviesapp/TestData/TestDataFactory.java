package com.naren.moviesapp.TestData;

import com.github.javafaker.Faker;
import com.naren.moviesapp.Entity.*;
import com.naren.moviesapp.Enum.RoleName;
import com.naren.moviesapp.Record.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class TestDataFactory {

    private static final Faker FAKER = new Faker();

    // Customer Test Data
    public static Customer createTestCustomer() {
        return createTestCustomer(null);
    }

    public static Customer createTestCustomer(Long id) {
        Customer customer = new Customer();
        if (id != null) {
            customer.setId(id);
        }
        customer.setName(FAKER.name().fullName());
        customer.setEmail(FAKER.internet().emailAddress());
        customer.setPassword(FAKER.internet().password());
        customer.setPhoneNumber(FAKER.phoneNumber().subscriberNumber(9));
        customer.setImageUrl(FAKER.internet().url());
        customer.setIsEmailVerified(FAKER.bool().bool());
        customer.setIsLogged(FAKER.bool().bool());
        customer.setIsRegistered(FAKER.bool().bool());
        customer.setIsSubscribed(FAKER.bool().bool());
        customer.setAddress(FAKER.address().fullAddress());
        customer.setCreatedAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());
        return customer;
    }

    public static CustomerRegistration createTestCustomerRegistration() {
        return new CustomerRegistration(
                FAKER.name().fullName(),
                FAKER.internet().emailAddress(),
                FAKER.internet().password(),
                FAKER.phoneNumber().subscriberNumber(9),
                FAKER.internet().url(),
                FAKER.bool().bool(),
                FAKER.address().fullAddress(),
                FAKER.bool().bool(),
                FAKER.bool().bool()
        );
    }

    // Role Test Data
    public static Role createTestRole(RoleName roleName) {
        Role role = new Role();
        role.setName(roleName);
        return role;
    }

    public static List<Role> createAllRoles() {
        return List.of(
                createTestRole(RoleName.ROLE_USER),
                createTestRole(RoleName.ROLE_ADMIN),
                createTestRole(RoleName.ROLE_SUPER_ADMIN),
                createTestRole(RoleName.ROLE_CONTENT_MANAGER),
                createTestRole(RoleName.ROLE_SUPPORT)
        );
    }

    // Movie Test Data
    public static Movie createTestMovie() {
        return createTestMovie(null);
    }

    public static Movie createTestMovie(Long id) {
        Movie movie = new Movie();
        if (id != null) {
            movie.setId(id);
        }
        movie.setName(FAKER.book().title() + "-" + UUID.randomUUID().toString().substring(0, 8));
        movie.setCost(FAKER.number().randomDouble(2, 50, 500));
        movie.setRating(FAKER.number().randomDouble(1, 1, 5));
        movie.setDescription(FAKER.lorem().sentence(20));
        movie.setPoster(FAKER.internet().url());
        movie.setAgeRating(FAKER.options().option("G", "PG", "PG-13", "R", "NC-17"));
        movie.setYear(FAKER.number().numberBetween(1980, 2023));
        movie.setRuntime(FAKER.number().numberBetween(80, 180) + " mins");
        movie.setGenre(FAKER.book().genre() + "," + FAKER.book().genre());
        movie.setType("movies");
        movie.setCreatedAt(LocalDateTime.now());
        movie.setUpdatedAt(LocalDateTime.now());
        return movie;
    }

    public static MovieRegistration createTestMovieRegistration() {
        return new MovieRegistration(
                FAKER.book().title(),
                FAKER.number().randomDouble(2, 50, 500),
                FAKER.number().randomDouble(1, 1, 5),
                FAKER.lorem().sentence(20),
                FAKER.internet().url(),
                FAKER.options().option("G", "PG", "PG-13", "R", "NC-17"),
                FAKER.number().numberBetween(1980, 2023),
                FAKER.number().numberBetween(80, 180) + " mins",
                FAKER.book().genre()
        );
    }

    public static MovieUpdation createTestMovieUpdation() {
        return new MovieUpdation(
                FAKER.book().title(),
                FAKER.number().randomDouble(2, 50, 500),
                FAKER.number().randomDouble(1, 1, 5),
                FAKER.lorem().sentence(20),
                FAKER.internet().url(),
                FAKER.options().option("G", "PG", "PG-13", "R", "NC-17"),
                FAKER.number().numberBetween(1980, 2023),
                FAKER.number().numberBetween(80, 180) + " mins",
                FAKER.book().genre()
        );
    }

    // Show Test Data
    public static Show createTestShow() {
        return createTestShow(null);
    }

    public static Show createTestShow(Long id) {
        Show show = new Show();
        if (id != null) {
            show.setShow_id(id);
        }
        show.setName(FAKER.book().title() + "-" + UUID.randomUUID().toString().substring(0, 8));
        show.setCost(FAKER.number().randomDouble(2, 50, 500));
        show.setRating(FAKER.number().randomDouble(1, 1, 5));
        show.setDescription(FAKER.lorem().sentence(20));
        show.setPoster(FAKER.internet().url());
        show.setAgeRating(FAKER.options().option("G", "PG", "PG-13", "R", "NC-17"));
        show.setYear(FAKER.number().numberBetween(1980, 2023));
        show.setRuntime(FAKER.number().numberBetween(20, 60) + " mins");
        show.setGenre(FAKER.book().genre() + "," + FAKER.book().genre());
        show.setType("shows");
        show.setCreatedAt(LocalDateTime.now());
        show.setUpdatedAt(LocalDateTime.now());
        return show;
    }

    public static ShowRegistration createTestShowRegistration() {
        return new ShowRegistration(
                FAKER.book().title(),
                FAKER.number().randomDouble(2, 50, 500),
                FAKER.number().randomDouble(1, 1, 5),
                FAKER.lorem().sentence(20),
                FAKER.internet().url(),
                FAKER.options().option("G", "PG", "PG-13", "R", "NC-17"),
                FAKER.number().numberBetween(1980, 2023),
                FAKER.number().numberBetween(20, 60) + " mins",
                FAKER.book().genre()
        );
    }

    public static ShowUpdation createTestShowUpdation() {
        return new ShowUpdation(
                FAKER.book().title(),
                FAKER.number().randomDouble(2, 50, 500),
                FAKER.number().randomDouble(1, 1, 5),
                FAKER.lorem().sentence(20),
                FAKER.internet().url(),
                FAKER.options().option("G", "PG", "PG-13", "R", "NC-17"),
                FAKER.number().numberBetween(1980, 2023),
                FAKER.number().numberBetween(20, 60) + " mins",
                FAKER.book().genre()
        );
    }

    // Payment Test Data
    public static Payment createTestPayment() {
        return createTestPayment(null, null, null);
    }

    public static Payment createTestPayment(Long id, Customer customer, SubscriptionPlan plan) {
        Payment payment = new Payment();
        if (id != null) {
            payment.setId(id);
        }
        payment.setCustomer(customer != null ? customer : createTestCustomer());
        payment.setPlan(plan != null ? plan : createTestSubscriptionPlan());
        payment.setAmount(FAKER.number().randomDouble(2, 50, 1000));
        payment.setTransactionId("txn_" + UUID.randomUUID().toString().substring(0, 8));
        payment.setStatus("SUCCESS");
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        return payment;
    }

    // Subscription Plan Test Data
    public static SubscriptionPlan createTestSubscriptionPlan() {
        return createTestSubscriptionPlan(null);
    }

    public static SubscriptionPlan createTestSubscriptionPlan(Long id) {
        SubscriptionPlan plan = new SubscriptionPlan();
        if (id != null) {
            plan.setId(id);
        }
        plan.setPlanName(FAKER.options().option("Monthly", "6 Months", "Yearly"));
        plan.setDescription(FAKER.lorem().sentence(10));
        plan.setPrice(FAKER.number().randomDouble(2, 100, 2000));
        plan.setInterval(FAKER.options().option("Month", "6 Months", "Year"));
        return plan;
    }

    // User Plan Info Test Data
    public static UserPlanInfo createTestUserPlanInfo() {
        return createTestUserPlanInfo(null, null, null);
    }

    public static UserPlanInfo createTestUserPlanInfo(Long id, Customer customer, SubscriptionPlan plan) {
        UserPlanInfo userPlanInfo = new UserPlanInfo();
        if (id != null) {
            userPlanInfo.setId(id);
        }
        userPlanInfo.setCustomer(customer != null ? customer : createTestCustomer());
        userPlanInfo.setSelectedPlan(plan != null ? plan : createTestSubscriptionPlan());
        userPlanInfo.setSubscriptionStartDate(LocalDateTime.now());
        userPlanInfo.setSubscriptionEndDate(LocalDateTime.now().plusSeconds(FAKER.number().numberBetween(2592000, 31536000))); // 30 days to 1 year
        userPlanInfo.setIsActive(FAKER.bool().bool());
        userPlanInfo.setCreatedAt(LocalDateTime.now());
        userPlanInfo.setUpdatedAt(LocalDateTime.now());
        return userPlanInfo;
    }

    // Refresh Token Test Data
    public static RefreshToken createTestRefreshToken() {
        return createTestRefreshToken(null, null);
    }

    public static RefreshToken createTestRefreshToken(String id, Customer user) {
        RefreshToken refreshToken = new RefreshToken();
        if (id != null) {
            refreshToken.setId(id);
        }
        refreshToken.setUser(user != null ? user : createTestCustomer());
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusSeconds(FAKER.number().numberBetween(604800, 2592000))); // 7 days to 30 days
        return refreshToken;
    }

    // Password Reset Token Test Data
    public static PasswordResetToken createTestPasswordResetToken() {
        return createTestPasswordResetToken(null, null);
    }

    public static PasswordResetToken createTestPasswordResetToken(Long id, Customer customer) {
        PasswordResetToken token = new PasswordResetToken();
        if (id != null) {
            token.setId(id);
        }
        token.setEmail(customer != null ? customer.getEmail() : FAKER.internet().emailAddress());
        token.setToken(UUID.randomUUID().toString());
        token.setExpiry(Instant.now().plusSeconds(3600)); // 1 hour
        return token;
    }

    // Utility methods for creating lists of test data
    public static List<Customer> createTestCustomerList(int count) {
        return java.util.stream.IntStream.range(0, count)
                .mapToObj(i -> createTestCustomer())
                .collect(java.util.stream.Collectors.toList());
    }

    public static List<Movie> createTestMovieList(int count) {
        return java.util.stream.IntStream.range(0, count)
                .mapToObj(i -> createTestMovie())
                .collect(java.util.stream.Collectors.toList());
    }

    public static List<Show> createTestShowList(int count) {
        return java.util.stream.IntStream.range(0, count)
                .mapToObj(i -> createTestShow())
                .collect(java.util.stream.Collectors.toList());
    }

    public static List<Payment> createTestPaymentList(int count) {
        return java.util.stream.IntStream.range(0, count)
                .mapToObj(i -> createTestPayment())
                .collect(java.util.stream.Collectors.toList());
    }

    // Constants for common test values
    public static class TestConstants {
        public static final String TEST_EMAIL = "test@example.com";
        public static final String TEST_PASSWORD = "testPassword123";
        public static final String TEST_PHONE_NUMBER = "1234567890";
        public static final String TEST_ADDRESS = "123 Test Street, Test City";
        public static final String TEST_MOVIE_NAME = "Test Movie";
        public static final String TEST_SHOW_NAME = "Test Show";
        public static final String TEST_TRANSACTION_ID = "txn_test123";
        public static final Double TEST_AMOUNT = 100.00;
        public static final String TEST_TOKEN = "test-token-123";

        private TestConstants() {
            // Utility class - prevent instantiation
        }
    }
}
