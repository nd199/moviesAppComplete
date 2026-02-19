package com.naren.moviesapp.Repo;

import com.naren.moviesapp.AbstractRepositoryTest;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Movie;
import com.naren.moviesapp.TestData.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class MovieRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private CustomerRepository customerRepository;

    private Customer testCustomer;

    @BeforeEach
    void setUp() {
        testCustomer = TestDataFactory.createTestCustomer();
        customerRepository.save(testCustomer);
    }

    @Test
    void findByYear() {
        Movie movie = TestDataFactory.createTestMovie();
        movie.setCustomer(testCustomer);
        movie = movieRepository.save(movie);
        final Long movieId = movie.getId();


        List<Movie> movies = movieRepository.findByYear(movie.getYear());
        assertThat(movies)
                .anySatisfy(m -> assertThat(m.getId()).isEqualTo(movieId));
    }
}
