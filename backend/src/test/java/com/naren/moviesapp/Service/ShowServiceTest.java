package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.Show;
import com.naren.moviesapp.Exception.RequestValidationException;
import com.naren.moviesapp.Exception.ResourceAlreadyExists;
import com.naren.moviesapp.Record.ShowRegistration;
import com.naren.moviesapp.Record.ShowUpdation;
import com.naren.moviesapp.Repo.ShowRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@Slf4j
class ShowServiceTest {

    @Mock
    private ShowRepository showRepository;
    private ShowService underTest;

    @BeforeEach
    void setUp() {
        underTest = new ShowService(showRepository);
    }

    @Test
    void addShow() {
        ShowRegistration registration = new ShowRegistration(
                "testName", 5.00, "A great show",
                "http://poster.url", "PG-13", 2022,
                "120 mins", "Drama", "Trending");

        when(showRepository.existsByName("testName")).thenReturn(false);

        // Mock save to return the captured entity
        ArgumentCaptor<Show> captor = ArgumentCaptor.forClass(Show.class);
        when(showRepository.save(captor.capture())).thenAnswer(invocation -> {
            Show show = invocation.getArgument(0);
            show.setShow_id(1L); // Simulate DB-generated ID
            return show;
        });

        underTest.addShow(registration);

        assertThat(captor.getValue().getCategory()).isEqualTo("Trending");
    }

    @Test
    void addShowWithNullCategoryDefaultsToGeneral() {
        ShowRegistration registration = new ShowRegistration(
                "testName", 5.00, "A great show",
                "http://poster.url", "PG-13", 2022,
                "120 mins", "Drama", null);

        when(showRepository.existsByName("testName")).thenReturn(false);

        // Mock save to return the captured entity
        ArgumentCaptor<Show> captor = ArgumentCaptor.forClass(Show.class);
        when(showRepository.save(captor.capture())).thenAnswer(invocation -> {
            Show show = invocation.getArgument(0);
            show.setShow_id(1L); // Simulate DB-generated ID
            return show;
        });

        underTest.addShow(registration);

        assertThat(captor.getValue().getCategory()).isEqualTo("General");
    }

    @Test
    void throwsShowNameExists() {
        ShowRegistration registration = new ShowRegistration(
                "testName", 5.00, "A great show",
                "http://poster.url", "PG-13", 2022,
                "120 mins", "Drama", "Trending");

        when(showRepository.existsByName("testName")).thenReturn(true);

        assertThatThrownBy(() -> underTest.addShow(registration))
                .isInstanceOf(ResourceAlreadyExists.class);
        verify(showRepository, never()).save(any());
    }

    @Test
    void removeShow() {
        Show show = new Show("testName", 5.00, "A great show", "http://poster.url",
                "PG-13", 2022, "120 mins", "Drama", "shows", "Trending");
        show.setShow_id(1L);

        when(showRepository.findById(1L)).thenReturn(Optional.of(show));
        underTest.removeShow(1L);
        verify(showRepository).delete(show);
    }

    @Test
    void getShowById() {
        Show show = new Show("testName", 5.00, "A great show", "http://poster.url",
                "PG-13", 2022, "120 mins", "Drama", "shows", "Trending");
        show.setShow_id(1L);

        when(showRepository.findById(1L)).thenReturn(Optional.of(show));
        assertThat(underTest.getShowById(1L)).isEqualTo(show);
    }

    @Test
    void getShowList() {
        when(showRepository.findAll(any(org.springframework.data.domain.Pageable.class)))
                .thenReturn(new org.springframework.data.domain.PageImpl<>(List.of()));
        assertThat(underTest.getShowList()).isNotNull();
    }

    @Test
    void updateShow() {
        Show show = new Show("testName22", 2.0, "A show", "http://poster.url",
                "PG", 2000, "100 mins", "Comedy", "shows", "General");
        show.setShow_id(2L);

        when(showRepository.findById(2L)).thenReturn(Optional.of(show));

        ShowUpdation showUpdation = new ShowUpdation("testName2", 5.0, "An awesome show",
                "http://newposter.url", "R", 2021, "130 mins", "Thriller", "Trending");

        underTest.updateShow(showUpdation, 2L);

        ArgumentCaptor<Show> captor = ArgumentCaptor.forClass(Show.class);
        verify(showRepository).save(captor.capture());
        assertThat(captor.getValue().getCategory()).isEqualTo("Trending");
    }

    @Test
    void testUpdateShowNoChanges() {
        Show show = new Show();
        ShowUpdation update = new ShowUpdation(null, null, null, null, null, null, null, null, null);

        when(showRepository.findById(1L)).thenReturn(Optional.of(show));
        assertThatThrownBy(() -> underTest.updateShow(update, 1L))
                .hasMessage("No data changes found");
    }

    @Test
    void throwsIfNoChangesFoundForUpdation() {
        Show show = new Show("testName", 2.0, "A show", "http://poster.url",
                "PG", 2000, "100 mins", "Comedy", "shows", "Trending");
        show.setShow_id(2L);

        when(showRepository.findById(2L)).thenReturn(Optional.of(show));

        ShowUpdation showUpdation = new ShowUpdation("testName", 2.0, "A show",
                "http://poster.url", "PG", 2000, "100 mins", "Comedy", "Trending");

        assertThatThrownBy(() -> underTest.updateShow(showUpdation, 2L))
                .isInstanceOf(RequestValidationException.class)
                .hasMessageContaining("No data changes found");
    }

    @Test
    void testGetShowsByYear() {
        List<Show> expectedShows = Arrays.asList(
                new Show("Show1", 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "shows", "Trending"),
                new Show("Show2", 4.5, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "shows", "Popular"));

        when(showRepository.findByYear(2021)).thenReturn(expectedShows);
        assertEquals(expectedShows, underTest.getShowsByYear(2021));
    }

    // Category-based tests
    @Test
    void testGetShowsByCategory() {
        List<Show> expectedShows = Arrays.asList(
                new Show("Show1", 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "shows", "Trending"),
                new Show("Show2", 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "shows", "Trending"));

        when(showRepository.findByCategory("Trending")).thenReturn(expectedShows);
        assertEquals(expectedShows, underTest.getShowsByCategory("Trending"));
    }

    @Test
    void testGetShowsByCategoryOrderByRatingDesc() {
        List<Show> expectedShows = Arrays.asList(
                new Show("Show2", 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "shows", "Trending"),
                new Show("Show1", 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "shows", "Trending"));

        when(showRepository.findByCategoryOrderByRatingDesc("Trending")).thenReturn(expectedShows);
        assertEquals(expectedShows, underTest.getShowsByCategoryOrderByRatingDesc("Trending"));
    }

    @Test
    void testFindAllByOrderByCategoryAsc() {
        List<Show> expectedShows = Arrays.asList(
                new Show("Show1", 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "shows", "Popular"),
                new Show("Show2", 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "shows", "Trending"));

        when(showRepository.findAllByOrderByCategoryAsc()).thenReturn(expectedShows);
        assertEquals(expectedShows, underTest.findAllByOrderByCategoryAsc());
    }

    @Test
    void testFindAllByOrderByCategoryDesc() {
        List<Show> expectedShows = Arrays.asList(
                new Show("Show2", 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "shows", "Trending"),
                new Show("Show1", 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "shows", "Popular"));

        when(showRepository.findAllByOrderByCategoryDesc()).thenReturn(expectedShows);
        assertEquals(expectedShows, underTest.findAllByOrderByCategoryDesc());
    }

    @Test
    void testGetAllDistinctCategories() {
        List<String> expectedCategories = Arrays.asList("Trending", "Popular", "New Releases", "Top Rated");

        when(showRepository.findAllDistinctCategories()).thenReturn(expectedCategories);
        assertEquals(expectedCategories, underTest.getAllDistinctCategories());
    }
}
