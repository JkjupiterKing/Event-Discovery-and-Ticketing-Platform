package com.Event.ticketing.app.api.Service;

import com.Event.ticketing.app.api.Model.*;
import com.Event.ticketing.app.api.Repo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RegisteredEventsRepo registeredEventsRepository;
    private final EventRepo eventRepository;
    private final RecommendedEventRepo recommendedEventRepository;
    private final CustomerRepo customerRepository;

    @Transactional
    public void generateAndSaveRecommendations(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        List<RegisteredEvents> registrations = registeredEventsRepository.findByCustomerId(customerId);

        Map<Category, Long> categoryCount = registrations.stream()
                .map(r -> r.getEvent().getCategory())
                .collect(Collectors.groupingBy(c -> c, Collectors.counting()));

        Optional<Category> topCategory = categoryCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey);

        if (topCategory.isEmpty()) return;

        List<Event> categoryEvents = eventRepository.findByCategory(topCategory.get());

        Set<Long> registeredEventIds = registrations.stream()
                .map(r -> r.getEvent().getEventId())
                .collect(Collectors.toSet());

        List<Event> recommended = categoryEvents.stream()
                .filter(event -> !registeredEventIds.contains(event.getEventId()))
                .collect(Collectors.toList());

        // Save to recommended_events table
        for (Event event : recommended) {
            RecommendedEvent recommendation = new RecommendedEvent();
            recommendation.setCustomer(customer);
            recommendation.setEvent(event);
            recommendedEventRepository.save(recommendation);
        }
    }

    @Transactional
    public List<Event> getRecommendations(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return recommendedEventRepository.findByCustomer(customer).stream()
                .map(RecommendedEvent::getEvent)
                .collect(Collectors.toList());
    }
}
