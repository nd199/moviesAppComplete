package com.naren.movieticketbookingapplication.IT.CustomerIntegrationTest;

import com.github.javafaker.Faker;
import com.naren.movieticketbookingapplication.Dto.CustomerDTO;
import com.naren.movieticketbookingapplication.Entity.Movie;
import com.naren.movieticketbookingapplication.Entity.Role;
import com.naren.movieticketbookingapplication.Record.CustomerRegistration;
import com.naren.movieticketbookingapplication.Record.CustomerUpdateRequest;
import com.naren.movieticketbookingapplication.Record.MovieRegistration;
import com.naren.movieticketbookingapplication.Repo.RoleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Random;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class CustomerIT {

    private static final Faker FAKER = new Faker();
    private static final String API_PATH = "/api/v1/customers";
    private static final Random RANDOM = new Random();

    @Autowired
    private WebTestClient webTestClient;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    private CustomerRegistration registration;

    private CustomerRegistration adminRegistration;

    @BeforeEach
    void setUp() {
        createRoleIfNotExists();

        String customerName = "IM CUSTOMER" + FAKER.name().fullName();
        String customerEmail = customerName.replace(" ", ".") + "@codeNaren.com";
        String password = FAKER.internet().password(8, 12);
        Long customerPhone = Long.valueOf(FAKER.phoneNumber().subscriberNumber(9));
        boolean isEmailVerified = false;
        boolean isPhoneVerified = false;

        registration = new CustomerRegistration(customerName, customerEmail, password, customerPhone, isEmailVerified, isPhoneVerified, false);

        String adminName = "IM ADMIN" + FAKER.name().fullName();
        String adminEmail = adminName.replace(" ", ".1123131213") + "@codeNaren.com";
        adminRegistration = new CustomerRegistration(adminName, adminEmail, password, customerPhone, isEmailVerified, isPhoneVerified, false);
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

    private String registerCustomerAndGetToken(CustomerRegistration registration) {
        return webTestClient.post()
                .uri(API_PATH)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(registration), CustomerRegistration.class)
                .exchange()
                .expectStatus().isCreated()
                .returnResult(Void.class)
                .getResponseHeaders()
                .getFirst(HttpHeaders.AUTHORIZATION);
    }

    private String registerAdminAndGetToken(CustomerRegistration registration) {
        return webTestClient.post()
                .uri(API_PATH.substring(0, 8) + "admins")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(adminRegistration), CustomerRegistration.class)
                .exchange()
                .expectStatus().isCreated()
                .returnResult(Void.class)
                .getResponseHeaders()
                .getFirst(HttpHeaders.AUTHORIZATION);
    }

    @Test
    void createCustomer() {
        String adminToken = registerAdminAndGetToken(adminRegistration);


        List<CustomerDTO> customerDTOList = webTestClient.get()
                .uri(API_PATH)
                .accept(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.AUTHORIZATION, String.format("Bearer %s", adminToken))
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(new ParameterizedTypeReference<CustomerDTO>() {
                })
                .returnResult()
                .getResponseBody();
        System.out.println("Customer List: " + customerDTOList);

        assert customerDTOList != null;
        long customerId = customerDTOList.stream()
                .filter(c -> c.email().equals(adminRegistration.email()))
                .map(CustomerDTO::id)
                .findFirst().orElseThrow();

        CustomerDTO customerDTO = webTestClient.get()
                .uri(API_PATH + "/{id}", customerId)
                .accept(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.AUTHORIZATION, String.format("Bearer %s", adminToken))
                .exchange()
                .expectStatus().isOk()
                .expectBody(new ParameterizedTypeReference<CustomerDTO>() {
                })
                .returnResult()
                .getResponseBody();

        assertThat(customerDTOList).contains(customerDTO);
    }

    @Test
    void deleteACustomer() {

        Faker faker = new Faker();
        String customerName1 = faker.name().fullName();
        String email1 = customerName1.replace(" ", ".") + "@codeNaren.com";
        Long phone1 = Long.valueOf(faker.phoneNumber().subscriberNumber(9));

        String customerName2 = faker.name().fullName();
        String email2 = customerName2.replace(" ", ".") + "@codeNaren.com";
        Long phone2 = Long.valueOf(faker.phoneNumber().subscriberNumber(9));

        String password = faker.internet().password(8, 12);
        boolean isEmailVerified = false;
        boolean isPhoneVerified = false;

        CustomerRegistration customer1 = new CustomerRegistration(customerName1, email1, password, phone1, isEmailVerified, isPhoneVerified, false);
        CustomerRegistration customer2 = new CustomerRegistration(customerName2, email2, password, phone2, isEmailVerified, isPhoneVerified, false);

        registerCustomerAndGetToken(customer2);
        String adminToken = registerAdminAndGetToken(customer1);

        List<CustomerDTO> allCustomers = webTestClient.get()
                .uri(API_PATH)
                .accept(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(new ParameterizedTypeReference<CustomerDTO>() {
                })
                .returnResult()
                .getResponseBody();

        assert allCustomers != null;
        long id = allCustomers.stream()
                .filter(c -> c.email().equals(customer2.email()))
                .map(CustomerDTO::id)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        webTestClient.delete()
                .uri(API_PATH + "/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
                .exchange()
                .expectStatus().isOk();

        webTestClient.get()
                .uri(API_PATH + "/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken)
                .exchange()
                .expectStatus().isNotFound();
    }

    @Test
    void updateCustomer() {
        Faker faker = new Faker();

        // Generate data for the admin and customer
        String adminName = faker.name().fullName();
        String adminEmail = adminName.replace(" ", ".") + "@codeNaren.com";
        Long adminPhone = Long.valueOf(faker.phoneNumber().subscriberNumber(9));
        String password = faker.internet().password(8, 12);

        String customerName = faker.name().fullName();
        String customerEmail = customerName.replace(" ", ".") + "@codeNaren.com";
        Long customerPhone = Long.valueOf(faker.phoneNumber().subscriberNumber(9));

        boolean isEmailVerified = false;
        boolean isPhoneVerified = false;

        CustomerRegistration adminReg = new CustomerRegistration(adminName, adminEmail, password, adminPhone, isEmailVerified, isPhoneVerified, false);
        CustomerRegistration customerReg = new CustomerRegistration(customerName, customerEmail, password, customerPhone, isEmailVerified, isPhoneVerified, false);

        // Register admin and customer
        String adminToken = registerAdminAndGetToken(adminReg);
        String customerToken = registerCustomerAndGetToken(customerReg);

        // Fetch list of customers
        List<CustomerDTO> customerDTOList = webTestClient.get()
                .uri(API_PATH)
                .accept(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.AUTHORIZATION, String.format("Bearer %s", adminToken))
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(new ParameterizedTypeReference<CustomerDTO>() {
                })
                .returnResult()
                .getResponseBody();

        assert customerDTOList != null;
        long customerId = customerDTOList.stream()
                .filter(c -> c.email().equals(customerReg.email()))
                .map(CustomerDTO::id)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Create update request with new data
        CustomerUpdateRequest updateRequest = new CustomerUpdateRequest(
                customerReg.name() + " Updated",
                customerReg.email(),
                customerReg.phoneNumber(),
                customerReg.isEmailVerified(),
                customerReg.isPhoneVerified(),
                customerReg.isLogged()
        );

        // Update customer
        webTestClient.put()
                .uri(API_PATH + "/{id}", customerId)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.AUTHORIZATION, String.format("Bearer %s", customerToken))
                .body(Mono.just(updateRequest), CustomerUpdateRequest.class)
                .exchange()
                .expectStatus().isOk();

        // Fetch the updated customer
        CustomerDTO updatedCustomerDTO = webTestClient.get()
                .uri(API_PATH + "/{id}", customerId)
                .accept(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.AUTHORIZATION, String.format("Bearer %s", adminToken))
                .exchange()
                .expectStatus().isOk()
                .expectBody(new ParameterizedTypeReference<CustomerDTO>() {
                })
                .returnResult()
                .getResponseBody();

        // Create the expected customer DTO
        CustomerDTO expectedCustomerDTO = new CustomerDTO(customerId, updateRequest.name(), updateRequest.email(),
                List.of("ROLE_USER"), updateRequest.phoneNumber(), updateRequest.email(), List.of(), false, false, false);

        // Verify the updated customer matches the expected customer
        assertThat(updatedCustomerDTO).isEqualTo(expectedCustomerDTO);
    }


    @Test
    void addMovie() {
        String adminName = FAKER.name().fullName();
        String adminEmail = adminName.replace(" ", ".") + "@codeNaren.com";
        Long adminPhone = Long.valueOf(FAKER.phoneNumber().subscriberNumber(9));
        String password = FAKER.internet().password(8, 12);
        boolean isEmailVerified = false;
        boolean isPhoneVerified = false;

        CustomerRegistration adminRegistration = new CustomerRegistration(adminName,
                adminEmail, password, adminPhone, isEmailVerified, isPhoneVerified, false);

        String adminToken = registerAdminAndGetToken(adminRegistration);

        String movieName = FAKER.book().title();
        Double rating = Math.floor(RANDOM.nextDouble(2, 5) * 100) / 100;
        Double cost = Math.floor(RANDOM.nextDouble(200, 1200) * 100) / 100;
        String description = "Hello Hi Bye!";
        String poster = FAKER.internet().url();
        String ageRating = "PG-13";
        Integer year = 2000;
        String runtime = RANDOM.nextInt(90, 180) + " mins";
        String genre = "Action";

        MovieRegistration movie =
                new MovieRegistration(movieName, cost,
                        rating, description, poster, ageRating,
                        year, runtime, genre);

        webTestClient.post()
                .uri("/api/v1/movies")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.AUTHORIZATION, String.format("Bearer %s", adminToken))
                .body(Mono.just(movie), MovieRegistration.class)
                .exchange()
                .expectStatus().isCreated();

        List<Movie> moviesList = webTestClient.get()
                .uri("/api/v1/movies")
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(new ParameterizedTypeReference<Movie>() {
                })
                .returnResult()
                .getResponseBody();

        assert moviesList != null;

        Movie addedMovie = moviesList.stream()
                .filter(m -> m.getName().equals(movie.name()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        assertThat(addedMovie.getName()).isEqualTo(movie.name());
        assertThat(addedMovie.getRating()).isEqualTo(movie.rating());
        assertThat(addedMovie.getCost()).isEqualTo(movie.cost());
        assertThat(addedMovie.getDescription()).isEqualTo(movie.description());
        assertThat(addedMovie.getPoster()).isEqualTo(movie.poster());
        assertThat(addedMovie.getYear()).isEqualTo(movie.year());
    }


}
