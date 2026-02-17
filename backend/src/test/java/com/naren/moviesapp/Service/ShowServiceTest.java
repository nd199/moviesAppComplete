package com.naren.moviesapp.Service;

import com.naren.moviesapp.Dao.ShowDao;
import com.naren.moviesapp.Entity.Show;
import com.naren.moviesapp.Exception.RequestValidationException;
import com.naren.moviesapp.Exception.ResourceAlreadyExists;
import com.naren.moviesapp.Exception.ResourceNotFoundException;
import com.naren.moviesapp.Record.ShowRegistration;
import com.naren.moviesapp.Record.ShowUpdation;
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
    private ShowDao showDao;
    private ShowService underTest;

    @BeforeEach
    void setUp() {
        underTest = new ShowService(showDao);
    }

    @Test
    void addShow() {
        ShowRegistration registration = new ShowRegistration(
                "testName", 300.23, 5.00, "A great show",
                "http://poster.url", "PG-13", 2022,
                "120 mins", "Drama");

        when(showDao.existsByName("testName")).thenReturn(false);

        underTest.addShow(registration);

        ArgumentCaptor<Show> showArgumentCaptor = ArgumentCaptor.forClass(Show.class);

        verify(showDao).addShow(showArgumentCaptor.capture());

        Show captured = showArgumentCaptor.getValue();

        assertThat(captured.getShow_id()).isNull();
        assertThat(captured.getName()).isEqualTo(registration.name());
        assertThat(captured.getCost()).isEqualTo(registration.cost());
        assertThat(captured.getRating()).isEqualTo(registration.rating());
        assertThat(captured.getDescription()).isEqualTo(registration.description());
        assertThat(captured.getPoster()).isEqualTo(registration.poster());
        assertThat(captured.getAgeRating()).isEqualTo(registration.ageRating());
        assertThat(captured.getYear()).isEqualTo(registration.year());
        assertThat(captured.getRuntime()).isEqualTo(registration.runtime());
        assertThat(captured.getGenre()).isEqualTo(registration.genre());
        assertThat(captured.getType()).isEqualTo("shows");
    }

    @Test
    void throwsShowNameExists() {
        ShowRegistration registration = new ShowRegistration(
                "testName", 300.23, 5.00, "A great show",
                "http://poster.url", "PG-13", 2022,
                "120 mins", "Drama");

        when(showDao.existsByName("testName")).thenReturn(true);

        assertThatThrownBy(
                () -> underTest.addShow(registration))
                .isInstanceOf(ResourceAlreadyExists.class)
                .hasMessageContaining("Show name %s already exists".formatted(registration.name()));

        verify(showDao, never()).addShow(any());
    }

    @Test
    void removeShow() {
        long id = 1;
        Show show = new Show(
                "testName",
                300.22,
                5.00,
                "A great show",
                "http://poster.url",
                "PG-13",
                2022,
                "120 mins",
                "Drama",
                "shows");
        show.setShow_id(id);

        when(showDao.getShowById(id)).thenReturn(Optional.of(show));

        underTest.removeShow(id);

        verify(showDao).removeShow(show);
    }

    @Test
    void throwsWhenShowRemovalIfNotExist() {
        long id = 1;

        when(showDao.getShowById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.removeShow(id))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Show with ID %s not found".formatted(id));

        verify(showDao, never()).removeShow(any());
    }

    @Test
    void getShowById() {
        long id = 1;
        Show show = new Show(
                "testName",
                300.22,
                5.00,
                "A great show",
                "http://poster.url",
                "PG-13",
                2022,
                "120 mins",
                "Drama",
                "shows");
        show.setShow_id(id);

        when(showDao.getShowById(id)).thenReturn(Optional.of(show));

        Show actual = underTest.getShowById(id);

        assertThat(actual).isEqualTo(show);
    }

    @Test
    void getShowByIdThrowsIfNotExists() {
        long id = 1;

        when(showDao.getShowById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.getShowById(id))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Show with ID '%s' not found".formatted(id));
    }

    @Test
    void getShowList() {
        underTest.getShowList();

        verify(showDao).getShowList();
    }

    @Test
    void updateShow() {
        long id = 2;

        Show show = new Show(
                "testName22",
                200.0,
                2.0,
                "A show",
                "http://poster.url",
                "PG",
                2000,
                "100 mins",
                "Comedy",
                "shows");
        show.setShow_id(id);

        when(showDao.getShowById(id)).thenReturn(Optional.of(show));

        ShowUpdation showUpdation = new ShowUpdation(
                "testName2", 300.00, 5.0, "An awesome show",
                "http://newposter.url", "R", 2021,
                "130 mins", "Thriller");

        underTest.updateShow(showUpdation, id);

        ArgumentCaptor<Show> showArgumentCaptor = ArgumentCaptor.forClass(Show.class);

        verify(showDao).updateShow(showArgumentCaptor.capture());

        Show updatedShow = showArgumentCaptor.getValue();

        assertThat(updatedShow.getName()).isEqualTo(showUpdation.name());
        assertThat(updatedShow.getCost()).isEqualTo(showUpdation.cost());
        assertThat(updatedShow.getRating()).isEqualTo(showUpdation.rating());
        assertThat(updatedShow.getDescription()).isEqualTo(showUpdation.description());
        assertThat(updatedShow.getPoster()).isEqualTo(showUpdation.poster());
        assertThat(updatedShow.getAgeRating()).isEqualTo(showUpdation.ageRating());
        assertThat(updatedShow.getYear()).isEqualTo(showUpdation.year());
        assertThat(updatedShow.getRuntime()).isEqualTo(showUpdation.runtime());
        assertThat(updatedShow.getGenre()).isEqualTo(showUpdation.genre());
    }

    @Test
    void testUpdateShowNoChanges() {
        Show show = new Show();
        ShowUpdation update = new ShowUpdation(null, null, null, null, null, null, null, null, null);
        Long showId = 1L;

        when(showDao.getShowById(showId)).thenReturn(java.util.Optional.ofNullable(show));

        assertThatThrownBy
                (() -> underTest.updateShow(update, showId))
                .hasMessage("No data changes found");

        verify(showDao, never()).updateShow(show);
    }

    @Test
    void testUpdateShowShowNotFound() {
        Long showId = 1L;

        when(showDao.getShowById(showId)).thenReturn(java.util.Optional.empty());

        assertThatThrownBy(() -> underTest.updateShow(
                new ShowUpdation("Hello", 100.0, 4.5, "New Description", "New Poster",
                        "New Age Rating", 2000, "New Runtime", "New Genre"), showId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Show not found");

        verify(showDao, never()).updateShow(any());
    }

    @Test
    void throwsIfNoChangesFoundForUpdation() {
        long id = 2;

        Show show = new Show(
                "testName",
                200.0,
                2.0,
                "A show",
                "http://poster.url",
                "PG",
                2000,
                "100 mins",
                "Comedy",
                "shows");
        show.setShow_id(id);

        when(showDao.getShowById(id)).thenReturn(Optional.of(show));

        ShowUpdation showUpdation = new ShowUpdation(
                "testName", 200.0, 2.0, "A show",
                "http://poster.url", "PG", 2000,
                "100 mins", "Comedy");

        assertThatThrownBy(() -> underTest.updateShow(showUpdation, id))
                .isInstanceOf(RequestValidationException.class)
                .hasMessageContaining("No data changes found");
    }

    @Test
    void updateShowByIdThrowsIfNotExists() {
        long id = 1;

        when(showDao.getShowById(id)).thenReturn(Optional.empty());

        ShowUpdation updation = new ShowUpdation(
                "Name", 220.0, 3.30, "A good show",
                "http://poster.url", "PG-13", 2020,
                "110 mins", "Drama");

        assertThatThrownBy(() -> underTest.updateShow(updation, id))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Show not found");

        verify(showDao, never()).updateShow(any());
    }

    @Test
    void testGetShowsByYear() {
        int year = 2021;
        List<Show> expectedShows = Arrays.asList(
                new Show("Show1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "shows"),
                new Show("Show2", 10.0, 4.5, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "shows")
        );

        when(showDao.getShowsByYear(year)).thenReturn(expectedShows);

        List<Show> actualShows = underTest.getShowsByYear(year);

        assertEquals(expectedShows.size(), actualShows.size());
        assertEquals(expectedShows, actualShows);
    }

    @Test
    void testGetShowsByAgeRating() {
        String ageRating = "PG-13";
        List<Show> expectedShows = Arrays.asList(
                new Show("Show1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "shows"),
                new Show("Show2", 10.0, 4.5, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "shows")
        );

        when(showDao.getShowsByAgeRating(ageRating)).thenReturn(expectedShows);

        List<Show> actualShows = underTest.getShowsByAgeRating(ageRating);

        assertEquals(expectedShows.size(), actualShows.size());
        assertEquals(expectedShows, actualShows);
    }

    @Test
    void testFindByRatingGreaterThanEqual() {
        double rating = 4.5;
        List<Show> expectedShows = Arrays.asList(
                new Show("Show1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "shows"),
                new Show("Show2", 10.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "shows")
        );

        when(showDao.findByRatingGreaterThanEqual(rating)).thenReturn(expectedShows);

        List<Show> actualShows = underTest.findByRatingGreaterThanEqual(rating);

        assertEquals(expectedShows.size(), actualShows.size());
        assertEquals(expectedShows, actualShows);
    }

    @Test
    void testFindByRatingLessThanEqual() {
        double rating = 4.5;
        List<Show> expectedShows = Arrays.asList(
                new Show("Show1", 10.0, 4.2, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "shows"),
                new Show("Show2", 10.0, 4.5, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "shows")
        );

        when(showDao.findByRatingLessThanEqual(rating)).thenReturn(expectedShows);

        List<Show> actualShows = underTest.findByRatingLessThanEqual(rating);

        assertEquals(expectedShows.size(), actualShows.size());
        assertEquals(expectedShows, actualShows);
    }

    @Test
    void testFindByCostBetween() {
        double minCost = 5.0;
        double maxCost = 15.0;
        List<Show> expectedShows = Arrays.asList(
                new Show("Show1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "shows"),
                new Show("Show2", 12.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "shows")
        );

        when(showDao.findByCostBetween(minCost, maxCost)).thenReturn(expectedShows);

        List<Show> actualShows = underTest.findByCostBetween(minCost, maxCost);

        assertEquals(expectedShows.size(), actualShows.size());
        assertEquals(expectedShows, actualShows);
    }

    @Test
    void testFindAllByOrderByNameAsc() {
        List<Show> expectedShows = Arrays.asList(
                new Show("Show1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "shows"),
                new Show("Show2", 12.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "shows")
        );

        when(showDao.findAllByOrderByNameAsc()).thenReturn(expectedShows);

        List<Show> actualShows = underTest.findAllByOrderByNameAsc();

        assertEquals(expectedShows.size(), actualShows.size());
        assertEquals(expectedShows, actualShows);
    }

    @Test
    void testFindAllByOrderByNameDesc() {
        List<Show> expectedShows = Arrays.asList(
                new Show("Show2", 12.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "shows"),
                new Show("Show1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "shows")
        );

        when(showDao.findAllByOrderByNameDesc()).thenReturn(expectedShows);

        List<Show> actualShows = underTest.findAllByOrderByNameDesc();

        assertEquals(expectedShows.size(), actualShows.size());
        assertEquals(expectedShows, actualShows);
    }

    @Test
    void testFindAllByOrderByCostAsc() {
        List<Show> expectedShows = Arrays.asList(
                new Show("Show1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "shows"),
                new Show("Show2", 12.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "shows")
        );

        when(showDao.findAllByOrderByCostAsc()).thenReturn(expectedShows);

        List<Show> actualShows = underTest.findAllByOrderByCostAsc();

        assertEquals(expectedShows.size(), actualShows.size());
        assertEquals(expectedShows, actualShows);
    }

    @Test
    void testFindAllByOrderByCostDesc() {
        List<Show> expectedShows = Arrays.asList(
                new Show("Show2", 12.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "shows"),
                new Show("Show1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "shows")
        );

        when(showDao.findAllByOrderByCostDesc()).thenReturn(expectedShows);

        List<Show> actualShows = underTest.findAllByOrderByCostDesc();

        assertEquals(expectedShows.size(), actualShows.size());
        assertEquals(expectedShows, actualShows);
    }

    @Test
    void testFindAllByOrderByRatingAsc() {
        List<Show> expectedShows = Arrays.asList(
                new Show("Show1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "shows"),
                new Show("Show2", 12.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "shows")
        );

        when(showDao.findAllByOrderByRatingAsc()).thenReturn(expectedShows);

        List<Show> actualShows = underTest.findAllByOrderByRatingAsc();

        assertEquals(expectedShows.size(), actualShows.size());
        assertEquals(expectedShows, actualShows);
    }

    @Test
    void testFindAllByOrderByRatingDesc() {
        List<Show> expectedShows = Arrays.asList(
                new Show("Show2", 12.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "shows"),
                new Show("Show1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "shows")
        );

        when(showDao.findAllByOrderByRatingDesc()).thenReturn(expectedShows);

        List<Show> actualShows = underTest.findAllByOrderByRatingDesc();

        assertEquals(expectedShows.size(), actualShows.size());
        assertEquals(expectedShows, actualShows);
    }

    @Test
    void testFindAllByOrderByYearAsc() {
        List<Show> expectedShows = Arrays.asList(
                new Show("Show1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "shows"),
                new Show("Show2", 12.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "shows")
        );

        when(showDao.findAllByOrderByYearAsc()).thenReturn(expectedShows);

        List<Show> actualShows = underTest.findAllByOrderByYearAsc();

        assertEquals(expectedShows.size(), actualShows.size());
        assertEquals(expectedShows, actualShows);
    }

    @Test
    void testFindAllByOrderByYearDesc() {
        List<Show> expectedShows = Arrays.asList(
                new Show("Show2", 12.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "shows"),
                new Show("Show1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "shows")
        );

        when(showDao.findAllByOrderByYearDesc()).thenReturn(expectedShows);

        List<Show> actualShows = underTest.findAllByOrderByYearDesc();

        assertEquals(expectedShows.size(), actualShows.size());
        assertEquals(expectedShows, actualShows);
    }

    @Test
    void testFindAllByOrderByGenreAsc() {
        List<Show> expectedShows = Arrays.asList(
                new Show("Show1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "shows"),
                new Show("Show2", 12.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "shows")
        );

        when(showDao.findAllByOrderByGenreAsc()).thenReturn(expectedShows);

        List<Show> actualShows = underTest.findAllByOrderByGenreAsc();

        assertEquals(expectedShows.size(), actualShows.size());
        assertEquals(expectedShows, actualShows);
    }

    @Test
    void testFindAllByOrderByGenreDesc() {
        List<Show> expectedShows = Arrays.asList(
                new Show("Show2", 12.0, 4.8, "Description2", "Poster2", "PG-13", 2021, "120 mins", "Drama", "shows"),
                new Show("Show1", 10.0, 4.5, "Description1", "Poster1", "PG-13", 2021, "120 mins", "Action", "shows")
        );

        when(showDao.findAllByOrderByGenreDesc()).thenReturn(expectedShows);

        List<Show> actualShows = underTest.findAllByOrderByGenreDesc();

        assertEquals(expectedShows.size(), actualShows.size());
        assertEquals(expectedShows, actualShows);
    }
}
