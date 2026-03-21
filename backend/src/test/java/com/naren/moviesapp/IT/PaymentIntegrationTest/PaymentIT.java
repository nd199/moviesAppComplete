package com.naren.moviesapp.IT.PaymentIntegrationTest;

import com.github.javafaker.Faker;
import com.naren.moviesapp.AbstractIntegrationTest;
import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Entity.RoleName;
import com.naren.moviesapp.Entity.SubscriptionPlan;
import com.naren.moviesapp.Record.CustomerRegistration;
import com.naren.moviesapp.Repo.RoleRepository;
import com.naren.moviesapp.Repo.SubscriptionPlanRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Random;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class PaymentIT extends AbstractIntegrationTest {

    private static final Faker FAKER = new Faker();
    private static final Random RANDOM = new Random();

    private static final String AUTH_ADMINS_PATH = "/api/v1/auth/admins";
    private static final String API_PATH = "/api/v1/payments";

    @Autowired
    private WebTestClient webTestClient;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private SubscriptionPlanRepository subscriptionPlanRepository;

    private CustomerRegistration adminRegistration;

    @BeforeEach
    void setUp() {
        createRoleIfNotExists();

        String password = FAKER.internet().password(8, 12);
        String phone = FAKER.phoneNumber().subscriberNumber(9);
        boolean isEmailVerified = true;
        String address = "Chennai, India";

        String adminName = "IM ADMIN " + FAKER.name().fullName();
        String adminEmail = adminName.replace(" ", ".") + RANDOM.nextInt(1000) + "@codeNaren.com";
        adminRegistration = new CustomerRegistration(adminName, adminEmail, password, phone, "", isEmailVerified, address);
    }

    private void createRoleIfNotExists() {
        if (!roleRepository.existsByName(RoleName.valueOf("ROLE_USER"))) {
            roleRepository.save(new Role(RoleName.valueOf("ROLE_USER")));
        }
        if (!roleRepository.existsByName(RoleName.valueOf("ROLE_ADMIN"))) {
            roleRepository.save(new Role(RoleName.valueOf("ROLE_ADMIN")));
        }
    }

    private String registerAdminAndGetToken(CustomerRegistration registration) {
        return Objects.requireNonNull(webTestClient.post()
                .uri(AUTH_ADMINS_PATH)
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
    void submitPayment_createsPayment_and_historyReturnsIt() {
        registerAdminAndGetToken(adminRegistration);

        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setPlanName("Basic-" + RANDOM.nextInt(100000));
        plan.setPrice(99.99);
        plan.setInterval("monthly");
        plan.setDescription("basic plan");
        plan = subscriptionPlanRepository.save(plan);

        Map<String, Object> finalUser = new HashMap<>();
        finalUser.put("email", adminRegistration.email());

        Map<String, Object> finalPlan = new HashMap<>();
        finalPlan.put("id", plan.getId().intValue());

        Map<String, Object> finalPayment = new HashMap<>();
        finalPayment.put("finalUser", finalUser);
        finalPayment.put("finalPlan", finalPlan);
        finalPayment.put("paymentMethod", "credit_card");

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("finalPayment", finalPayment);

        webTestClient.post()
                .uri(API_PATH + "/submitPayment")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.message").isEqualTo("Payment processed successfully")
                .jsonPath("$.data.transactionId").exists();

        webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path(API_PATH + "/history")
                        .queryParam("email", adminRegistration.email())
                        .build())
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(new ParameterizedTypeReference<Map<String, Object>>() {
                })
                .value(body -> {
                    assertThat(body).containsKey("data");
                });
    }
}
