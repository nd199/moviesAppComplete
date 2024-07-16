package com.naren.movieticketbookingapplication.Service;

import com.naren.movieticketbookingapplication.Entity.Movie;
import com.naren.movieticketbookingapplication.Entity.Show;
import com.naren.movieticketbookingapplication.Record.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final MovieService movieService;
    private final ShowService showService;

    public ProductService(MovieService movieService, ShowService showService) {
        this.movieService = movieService;
        this.showService = showService;
    }

    public ResponseEntity<?> updateProduct(ProductUpdateRequest productUpdateRequest,
                                           Long id,
                                           String type) {
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

    public void deleteProduct(Long id, String type) {
        try {
            if (type.equals("movies")) {
                movieService.removeMovie(id);
            } else if (type.equals("shows")) {
                showService.removeShow(id);
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    public ResponseEntity<?> addProduct(ProductCreateRequest productCreateRequest) {

        try {
            if (productCreateRequest.type().equals("movies")) {
                MovieRegistration movieRegistration
                        = new MovieRegistration(
                        productCreateRequest.name(),
                        productCreateRequest.cost(),
                        productCreateRequest.rating(),
                        productCreateRequest.description(),
                        productCreateRequest.poster(),
                        productCreateRequest.ageRating(),
                        productCreateRequest.year(),
                        productCreateRequest.runtime(),
                        productCreateRequest.genre()
                );
                movieService.addMovie(movieRegistration);
                return new ResponseEntity<>(movieRegistration, HttpStatus.CREATED);
            } else if (productCreateRequest.type().equals("shows")) {
                ShowRegistration showRegistration = new ShowRegistration(
                        productCreateRequest.name(),
                        productCreateRequest.cost(),
                        productCreateRequest.rating(),
                        productCreateRequest.description(),
                        productCreateRequest.poster(),
                        productCreateRequest.ageRating(),
                        productCreateRequest.year(),
                        productCreateRequest.runtime(),
                        productCreateRequest.genre()
                );
                showService.addShow(showRegistration);
                return new ResponseEntity<>(showRegistration, HttpStatus.CREATED);
            } else {
                return ResponseEntity.badRequest().body("Unsupported type: " + productCreateRequest.type());
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Could Not Add a Product", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
