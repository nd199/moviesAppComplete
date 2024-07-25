package com.naren.movieticketbookingapplication.Repo;

import com.naren.movieticketbookingapplication.AbstractTestContainers;
import com.naren.movieticketbookingapplication.Entity.Customer;
import com.naren.movieticketbookingapplication.TestConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Import;
import org.springframework.web.servlet.HandlerAdapter;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(TestConfig.class)
class CustomerRepositoryTest extends AbstractTestContainers {

}
