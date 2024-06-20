package com.naren.movieticketbookingapplication.Dao;

import com.naren.movieticketbookingapplication.Entity.Show;
import com.naren.movieticketbookingapplication.Repo.ShowRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ShowDaoImplTest {

    private ShowDaoImpl underTest;
    private AutoCloseable autoCloseable;
    @Mock
    private ShowRepository showRepository;

    private Show sh;

    @BeforeEach
    void setUp() {
        autoCloseable = MockitoAnnotations.openMocks(this);
        underTest = new ShowDaoImpl(showRepository);
        sh = new Show(1L,
                "Harry Potter",
                200D,
                5D, "none", "none", "none", 2000, "none", "none", "shows");
    }

    @AfterEach
    void tearDown() throws Exception {
        autoCloseable.close();
    }


    @Test
    void addShow() {
        underTest.addShow(sh);

        verify(showRepository).save(sh);
    }


    @Test
    void getShowById() {

        Long id = sh.getShow_id();

        underTest.getShowById(id);

        verify(showRepository).findById(id);
    }

    @Test
    void updateShow() {
        underTest.updateShow(sh);

        verify(showRepository).save(sh);
    }

    @Test
    void existsByName() {
        underTest.existsByName(sh.getName());

        verify(showRepository).existsByName(sh.getName());
    }

    @Test
    void getShowList() {
        Page<Show> page = mock(Page.class);
        List<Show> shs = List.of(new Show());

        when(page.getContent()).thenReturn(shs);
        when(showRepository.findAll(any(Pageable.class))).thenReturn(page);

        List<Show> expected = underTest.getShowList();

        assertThat(expected).isEqualTo(shs);
        ArgumentCaptor<Pageable> pageableArgumentCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(showRepository).findAll(pageableArgumentCaptor.capture());
        assertThat(pageableArgumentCaptor.getValue()).isEqualTo(Pageable.ofSize(1000));
    }

    @Test
    void removeShowById() {
        underTest.removeShow(sh);
        verify(showRepository).delete(sh);
    }

    @Test
    void getShowsByYear() {
        int year = 2000;
        underTest.getShowsByYear(year);
        verify(showRepository).findByYear(year);
    }


    @Test
    void getShowsByAgeRating() {
        String ageRating = "PG-13";
        underTest.getShowsByAgeRating(ageRating);
        verify(showRepository).findByAgeRating(ageRating);
    }

    @Test
    void findByRatingGreaterThanEqual() {
        double rating = 4.0;
        underTest.findByRatingGreaterThanEqual(rating);
        verify(showRepository).findByRatingGreaterThanEqual(rating);
    }

    @Test
    void findByRatingLessThanEqual() {
        double rating = 4.0;
        underTest.findByRatingLessThanEqual(rating);
        verify(showRepository).findByRatingLessThanEqual(rating);
    }

    @Test
    void findByCostBetween() {
        double minCost = 100.0;
        double maxCost = 200.0;
        underTest.findByCostBetween(minCost, maxCost);
        verify(showRepository).findByCostBetween(minCost, maxCost);
    }

    @Test
    void findAllByOrderByNameAsc() {
        underTest.findAllByOrderByNameAsc();
        verify(showRepository).findAllByOrderByNameAsc();
    }

    @Test
    void findAllByOrderByNameDesc() {
        underTest.findAllByOrderByNameDesc();
        verify(showRepository).findAllByOrderByNameDesc();
    }

    @Test
    void findAllByOrderByCostAsc() {
        underTest.findAllByOrderByCostAsc();
        verify(showRepository).findAllByOrderByCostAsc();
    }

    @Test
    void findAllByOrderByCostDesc() {
        underTest.findAllByOrderByCostDesc();
        verify(showRepository).findAllByOrderByCostDesc();
    }

    @Test
    void findAllByOrderByRatingAsc() {
        underTest.findAllByOrderByRatingAsc();
        verify(showRepository).findAllByOrderByRatingAsc();
    }

    @Test
    void findAllByOrderByRatingDesc() {
        underTest.findAllByOrderByRatingDesc();
        verify(showRepository).findAllByOrderByRatingDesc();
    }

    @Test
    void findAllByOrderByYearAsc() {
        underTest.findAllByOrderByYearAsc();
        verify(showRepository).findAllByOrderByYearAsc();
    }

    @Test
    void findAllByOrderByYearDesc() {
        underTest.findAllByOrderByYearDesc();
        verify(showRepository).findAllByOrderByYearDesc();
    }

    @Test
    void findAllByOrderByGenreAsc() {
        underTest.findAllByOrderByGenreAsc();
        verify(showRepository).findAllByOrderByGenreAsc();
    }

    @Test
    void findAllByOrderByGenreDesc() {
        underTest.findAllByOrderByGenreDesc();
        verify(showRepository).findAllByOrderByGenreDesc();
    }

    @Test
    void findByName() {
        String name = "sh";
        underTest.findByName(name);
        verify(showRepository).findByName(name);
    }

    @Test
    void findByGenre() {
        String genre = "genre";
        underTest.findByGenre(genre);
        verify(showRepository).findByGenre(genre);
    }
}