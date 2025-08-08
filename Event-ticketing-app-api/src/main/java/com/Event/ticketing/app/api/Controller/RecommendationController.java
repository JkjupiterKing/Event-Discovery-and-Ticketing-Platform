package com.Event.ticketing.app.api.Controller;

import com.Event.ticketing.app.api.Model.Event;
import com.Event.ticketing.app.api.Service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recommendations")
@RequiredArgsConstructor
@CrossOrigin
public class RecommendationController {

    private final RecommendationService recommendationService;

    @PostMapping("/generate/{customerId}")
    public ResponseEntity<?> generate(@PathVariable Long customerId) {
        recommendationService.generateAndSaveRecommendations(customerId);
        return ResponseEntity.ok("Recommendations generated");
    }

    @GetMapping("/customer/{customerId}")
    public List<Event> getRecommendations(@PathVariable Long customerId) {
        return recommendationService.getRecommendations(customerId);
    }
}

