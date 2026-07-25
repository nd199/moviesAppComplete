package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.ViewHistory;
import com.naren.moviesapp.Repo.ViewHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ViewHistoryService {

    private static final Logger logger = LoggerFactory.getLogger(ViewHistoryService.class);
    private static final int DEFAULT_LIMIT = 20;

    private final ViewHistoryRepository viewHistoryRepository;

    @Transactional
    public void recordView(Customer customer, Long tmdbId, String mediaType, String title, String posterPath) {
        Optional<ViewHistory> existing = viewHistoryRepository
                .findByCustomerIdAndTmdbIdAndMediaType(customer.getId(), tmdbId, mediaType);

        if (existing.isPresent()) {
            existing.get().setPosterPath(posterPath);
            viewHistoryRepository.save(existing.get());
            logger.info("Updated view history for customer {} and tmdbId {}", customer.getId(), tmdbId);
        } else {
            ViewHistory history = ViewHistory.builder()
                    .customer(customer)
                    .tmdbId(tmdbId)
                    .mediaType(mediaType)
                    .title(title)
                    .posterPath(posterPath)
                    .build();
            viewHistoryRepository.save(history);
            logger.info("Recorded new view for customer {} and tmdbId {}", customer.getId(), tmdbId);
        }
    }

    public List<ViewHistory> getRecentViews(Long customerId) {
        return viewHistoryRepository.findRecentByCustomerId(customerId, PageRequest.of(0, DEFAULT_LIMIT));
    }

    @Transactional
    public void removeView(Long customerId, Long tmdbId, String mediaType) {
        viewHistoryRepository.deleteByCustomerIdAndTmdbIdAndMediaType(customerId, tmdbId, mediaType);
    }

    @Transactional
    public void clearHistory(Long customerId) {
        List<ViewHistory> history = viewHistoryRepository.findRecentByCustomerId(customerId, PageRequest.of(0, 1000));
        viewHistoryRepository.deleteAll(history);
    }
}
