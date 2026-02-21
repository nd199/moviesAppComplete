package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.Movie;
import com.naren.moviesapp.Entity.Show;
import com.naren.moviesapp.Exception.ResourceAlreadyExists;
import com.naren.moviesapp.Exception.ResourceNotFoundException;
import com.naren.moviesapp.Record.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);
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
                        productUpdateRequest.rating(),
                        productUpdateRequest.description(),
                        productUpdateRequest.poster(),
                        productUpdateRequest.ageRating(),
                        productUpdateRequest.year(),
                        productUpdateRequest.runtime(),
                        productUpdateRequest.genre(),
                        productUpdateRequest.category()
                );
                Movie movieUpdated = movieService.updateMovie(movieUpdation, id);
                return ResponseEntity.ok()
                        .body(movieUpdated);
            } else if ("shows".equals(type)) {
                ShowUpdation showUpdation = new ShowUpdation(
                        productUpdateRequest.name(),
                        productUpdateRequest.rating(),
                        productUpdateRequest.description(),
                        productUpdateRequest.poster(),
                        productUpdateRequest.ageRating(),
                        productUpdateRequest.year(),
                        productUpdateRequest.runtime(),
                        productUpdateRequest.genre(),
                        productUpdateRequest.category()
                );
                Show showUpdated = showService.updateShow(showUpdation, id);
                return ResponseEntity.ok()
                        .body(showUpdated);
            } else {
                return ResponseEntity.badRequest().body("Unsupported type: " + type);
            }
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Product not found: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(" Invalid request: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error updating product with id {} and type {}: {}", id, type, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred while updating the product");
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
            logger.error("Failed to delete product with id {} and type {}: {}", id, type, e.getMessage());
            throw new RuntimeException("Failed to delete product", e);
        }
    }

    public ResponseEntity<?> addProduct(ProductCreateRequest productCreateRequest) {

        try {
            if (productCreateRequest.type().equals("movies")) {
                MovieRegistration movieRegistration
                        = new MovieRegistration(
                        productCreateRequest.name(),
                        productCreateRequest.rating(),
                        productCreateRequest.description(),
                        productCreateRequest.poster(),
                        productCreateRequest.ageRating(),
                        productCreateRequest.year(),
                        productCreateRequest.runtime(),
                        productCreateRequest.genre(),
                        productCreateRequest.category()
                );
                movieService.addMovie(movieRegistration);
                return new ResponseEntity<>(movieRegistration, HttpStatus.CREATED);
            } else if (productCreateRequest.type().equals("shows")) {
                ShowRegistration showRegistration = new ShowRegistration(
                        productCreateRequest.name(),
                        productCreateRequest.rating(),
                        productCreateRequest.description(),
                        productCreateRequest.poster(),
                        productCreateRequest.ageRating(),
                        productCreateRequest.year(),
                        productCreateRequest.runtime(),
                        productCreateRequest.genre(),
                        productCreateRequest.category()
                );
                showService.addShow(showRegistration);
                return new ResponseEntity<>(showRegistration, HttpStatus.CREATED);
            } else {
                return ResponseEntity.badRequest().body("Unsupported type: " + productCreateRequest.type());
            }
        } catch (ResourceAlreadyExists e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Product already exists: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(" Invalid request: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error adding product of type {}: {}", productCreateRequest.type(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred while adding the product");
        }
    }
}
