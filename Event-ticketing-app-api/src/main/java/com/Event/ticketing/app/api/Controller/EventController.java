package com.Event.ticketing.app.api.Controller;

import com.Event.ticketing.app.api.Model.Event;
import com.Event.ticketing.app.api.Model.Category;
import com.Event.ticketing.app.api.Repo.EventRepo;
import com.Event.ticketing.app.api.Repo.CategoryRepo;
import com.Event.ticketing.app.api.dto.EventResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.Base64;

@RestController
@RequestMapping("/events")
@CrossOrigin
public class EventController {

    @Autowired
    private EventRepo eventRepository;

    @Autowired
    private CategoryRepo categoryRepository;

    // ✅ Utility: Convert Event to EventResponse
    private EventResponse convertToDto(Event event) {
        String base64Image = event.getEventImage() != null
                ? Base64.getEncoder().encodeToString(event.getEventImage())
                : null;

        return new EventResponse(
                event.getEventId(),
                event.getEventName(),
                event.getDescription(),
                event.getOrganizer(),
                event.getStatus(),
                event.getContactEmail(),
                event.getContactPhone(),
                event.getResult(),
                event.getCapacity(),
                event.getRegistrationFee(),
                event.getCategory().getName(),
                event.getEventDateTime().toString(),
                base64Image
        );
    }

    // ✅ POST /addEvent (with image)
    @PostMapping("/addEvent")
    public ResponseEntity<EventResponse> createEvent(
            @RequestPart("event") Event event,
            @RequestPart("image") MultipartFile imageFile) {
        try {
            Optional<Category> category = categoryRepository.findById(event.getCategory().getId());
            if (category.isEmpty()) return ResponseEntity.badRequest().build();

            event.setCategory(category.get());
            event.setEventImage(imageFile.getBytes());
            event.setCreatedAt(LocalDateTime.now());
            event.setUpdatedAt(LocalDateTime.now());

            Event savedEvent = eventRepository.save(event);
            return new ResponseEntity<>(convertToDto(savedEvent), HttpStatus.CREATED);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ✅ PUT /{id} - update event (with optional new image)
    @PutMapping("/{eventId}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long eventId,
            @RequestPart("event") Event eventDetails,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        if (optionalEvent.isEmpty()) return ResponseEntity.notFound().build();

        try {
            Event event = optionalEvent.get();

            event.setEventName(eventDetails.getEventName());
            event.setDescription(eventDetails.getDescription());
            event.setEventDateTime(eventDetails.getEventDateTime());
            event.setOrganizer(eventDetails.getOrganizer());
            event.setCapacity(eventDetails.getCapacity());
            event.setRegistrationFee(eventDetails.getRegistrationFee());
            event.setStatus(eventDetails.getStatus());
            event.setContactEmail(eventDetails.getContactEmail());
            event.setContactPhone(eventDetails.getContactPhone());
            event.setResult(eventDetails.getResult());
            event.setUpdatedAt(LocalDateTime.now());

            Optional<Category> category = categoryRepository.findById(eventDetails.getCategory().getId());
            if (category.isEmpty()) return ResponseEntity.badRequest().build();
            event.setCategory(category.get());

            if (imageFile != null && !imageFile.isEmpty()) {
                event.setEventImage(imageFile.getBytes());
            }

            Event updatedEvent = eventRepository.save(event);
            return ResponseEntity.ok(convertToDto(updatedEvent));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ✅ GET /all
    @GetMapping("/all")
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return ResponseEntity.ok(events.stream().map(this::convertToDto).toList());
    }

    // ✅ GET /{id}
    @GetMapping("/{eventId}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long eventId) {
        Optional<Event> event = eventRepository.findById(eventId);
        return event.map(value -> ResponseEntity.ok(convertToDto(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ DELETE
    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        if (!eventRepository.existsById(eventId)) return ResponseEntity.notFound().build();
        eventRepository.deleteById(eventId);
        return ResponseEntity.noContent().build();
    }
}
