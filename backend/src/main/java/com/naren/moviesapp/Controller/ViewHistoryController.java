package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Dto.ViewHistoryDTOMapper;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Record.RecordViewRequest;
import com.naren.moviesapp.Record.ViewHistoryResponse;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Service.ViewHistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/view-history")
@RequiredArgsConstructor
public class ViewHistoryController {

    private final ViewHistoryService viewHistoryService;
    private final CustomerRepository customerRepository;
    private final ViewHistoryDTOMapper viewHistoryDTOMapper;

    @PostMapping
    public ResponseEntity<Map<String, String>> recordView(Authentication authentication,
                                                          @Valid @RequestBody RecordViewRequest request) {
        Customer customer = customerRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        viewHistoryService.recordView(customer, request.tmdbId(), request.mediaType(),
                request.title(), request.posterPath());
        return ResponseEntity.ok(Map.of("message", "View recorded"));
    }

    @GetMapping
    public ResponseEntity<List<ViewHistoryResponse>> getRecentViews(Authentication authentication) {
        Customer customer = customerRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        List<ViewHistoryResponse> history = viewHistoryService.getRecentViews(customer.getId())
                .stream()
                .map(viewHistoryDTOMapper)
                .toList();

        return ResponseEntity.ok(history);
    }

    @DeleteMapping
    public ResponseEntity<Map<String, String>> clearHistory(Authentication authentication) {
        Customer customer = customerRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        viewHistoryService.clearHistory(customer.getId());
        return ResponseEntity.ok(Map.of("message", "History cleared"));
    }

    @DeleteMapping("/{tmdbId}/{mediaType}")
    public ResponseEntity<Map<String, String>> removeView(Authentication authentication,
                                                          @PathVariable Long tmdbId,
                                                          @PathVariable String mediaType) {
        Customer customer = customerRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        viewHistoryService.removeView(customer.getId(), tmdbId, mediaType);
        return ResponseEntity.ok(Map.of("message", "View removed"));
    }
}
