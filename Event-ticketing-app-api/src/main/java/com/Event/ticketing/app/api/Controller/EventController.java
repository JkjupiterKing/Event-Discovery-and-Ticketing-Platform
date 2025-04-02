package com.Event.ticketing.app.api.Controller;

import com.Event.ticketing.app.api.Model.Event;
import com.Event.ticketing.app.api.Model.Category;
import com.Event.ticketing.app.api.Repo.EventRepo;
import com.Event.ticketing.app.api.Repo.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/events")
@CrossOrigin
public class EventController {

    @Autowired
    private EventRepo eventRepository;

    @Autowired
    private CategoryRepo categoryRepository;

    @PostMapping("/addEvent")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        // Check for null fields in the request body
        if (event.getCategory() == null || event.getCategory().getId() == null) {
            return ResponseEntity.badRequest().body(null);
        }

        event.setCreatedAt(LocalDateTime.now());
        event.setUpdatedAt(LocalDateTime.now());

        // Fetch category by ID and set it to the event
        Optional<Category> categoryOptional = categoryRepository.findById(event.getCategory().getId());
        if (categoryOptional.isPresent()) {
            event.setCategory(categoryOptional.get());
        } else {
            return ResponseEntity.badRequest().body(null);
        }

        Event savedEvent = eventRepository.save(event);
        return new ResponseEntity<>(savedEvent, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<Event> getEventById(@PathVariable Long eventId) {
        Optional<Event> event = eventRepository.findById(eventId);
        return event.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long eventId, @RequestBody Event eventDetails) {
        // Check for null fields in the request body
        if (eventDetails.getCategory() == null || eventDetails.getCategory().getId() == null) {
            return ResponseEntity.badRequest().body(null);
        }

        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        if (!optionalEvent.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Event eventToUpdate = optionalEvent.get();
        eventToUpdate.setEventName(eventDetails.getEventName());
        eventToUpdate.setDescription(eventDetails.getDescription());
        eventToUpdate.setEventDateTime(eventDetails.getEventDateTime());
        eventToUpdate.setOrganizer(eventDetails.getOrganizer());

        // Fetch category by ID and update the event's category
        Optional<Category> categoryOptional = categoryRepository.findById(eventDetails.getCategory().getId());
        if (categoryOptional.isPresent()) {
            eventToUpdate.setCategory(categoryOptional.get());
        } else {
            return ResponseEntity.badRequest().body(null);
        }

        eventToUpdate.setCapacity(eventDetails.getCapacity());
        eventToUpdate.setRegistrationFee(eventDetails.getRegistrationFee());
        eventToUpdate.setStatus(eventDetails.getStatus());
        eventToUpdate.setContactEmail(eventDetails.getContactEmail());
        eventToUpdate.setContactPhone(eventDetails.getContactPhone());
        eventToUpdate.setUpdatedAt(LocalDateTime.now());

        Event updatedEvent = eventRepository.save(eventToUpdate);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            return ResponseEntity.notFound().build();
        }
        eventRepository.deleteById(eventId);
        return ResponseEntity.noContent().build();
    }
}
