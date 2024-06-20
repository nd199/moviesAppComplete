package com.naren.movieticketbookingapplication.Service;

import com.naren.movieticketbookingapplication.Entity.Movie;
import com.naren.movieticketbookingapplication.Entity.Show;
import com.naren.movieticketbookingapplication.Record.MovieUpdation;
import com.naren.movieticketbookingapplication.Record.ProductUpdateRequest;
import com.naren.movieticketbookingapplication.Record.ShowUpdation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class ProductService {

    private final MovieService movieService;
    private final ShowService showService;

    public ProductService(MovieService movieService, ShowService showService) {
        this.movieService = movieService;
        this.showService = showService;
    }

    @PutMapping("/products/{id}/{type}")
    public ResponseEntity<?> updateProduct(@RequestBody ProductUpdateRequest productUpdateRequest,
                                           @PathVariable("id") Long id,
                                           @PathVariable("type") String type) {


        try {
            if ("movies".equals(type)) {
                MovieUpdation movieUpdation = new MovieUpdation(
                        productUpdateRequest.name(),
                        productUpdateRequest.cost(),
                        productUpdateRequest.rating(),
                        productUpdateRequest.description(),
                        productUpdateRequest.poster(),
                        productUpdateRequest.ageRating(),
                        productUpdateRequest.year(),
                        productUpdateRequest.runtime(),
                        productUpdateRequest.genre()
                );
                Movie movieUpdated = movieService.updateMovie(movieUpdation, id);
                return ResponseEntity.ok()
                        .body(movieUpdated);
            } else if ("shows".equals(type)) {
                ShowUpdation showUpdation = new ShowUpdation(
                        productUpdateRequest.name(),
                        productUpdateRequest.cost(),
                        productUpdateRequest.rating(),
                        productUpdateRequest.description(),
                        productUpdateRequest.poster(),
                        productUpdateRequest.ageRating(),
                        productUpdateRequest.year(),
                        productUpdateRequest.runtime(),
                        productUpdateRequest.genre()
                );
                Show showUpdated = showService.updateShow(showUpdation, id);
                return ResponseEntity.ok()
                        .body(showUpdated);
            } else {
                return ResponseEntity.badRequest().body("Unsupported type: " + type);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating product: " + e.getMessage());
        }
    }
}
