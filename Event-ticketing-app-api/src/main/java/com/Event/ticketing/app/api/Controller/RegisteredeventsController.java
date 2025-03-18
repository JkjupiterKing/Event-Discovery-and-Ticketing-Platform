package com.Event.ticketing.app.api.Controller;

import com.Event.ticketing.app.api.Model.RegisteredEvents;
import com.Event.ticketing.app.api.Repo.RegisteredEventsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/registered-events")
@CrossOrigin
public class RegisteredeventsController {

    private final RegisteredEventsRepo registeredEventRepository;

    @Autowired
    public RegisteredeventsController(RegisteredEventsRepo registeredEventRepository) {
        this.registeredEventRepository = registeredEventRepository;
    }

    // Get all registered events
    @GetMapping("/all")
    public ResponseEntity<List<RegisteredEvents>> getAllRegisteredEvents() {
        List<RegisteredEvents> registeredEvents = registeredEventRepository.findAll();
        return new ResponseEntity<>(registeredEvents, HttpStatus.OK);
    }

    // Get a specific registered event by ID
    @GetMapping("/{id}")
    public ResponseEntity<RegisteredEvents> getRegisteredEventById(@PathVariable Long id) {
        Optional<RegisteredEvents> registeredEvent = registeredEventRepository.findById(id);
        if (registeredEvent.isPresent()) {
            return new ResponseEntity<>(registeredEvent.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Register a new event for a student
    @PostMapping("/register")
    public ResponseEntity<RegisteredEvents> registerForEvent(@RequestBody RegisteredEvents registeredEvent) {
        RegisteredEvents savedRegisteredEvent = registeredEventRepository.save(registeredEvent);
        return new ResponseEntity<>(savedRegisteredEvent, HttpStatus.CREATED);
    }

    // Update registration (for example, change event or student)
    @PutMapping("/{id}")
    public ResponseEntity<RegisteredEvents> updateRegisteredEvent(
            @PathVariable Long id, @RequestBody RegisteredEvents registeredEvent) {
        if (registeredEventRepository.existsById(id)) {
            registeredEvent.setId(id);
            RegisteredEvents updatedRegisteredEvent = registeredEventRepository.save(registeredEvent);
            return new ResponseEntity<>(updatedRegisteredEvent, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Delete a registered event by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegisteredEvent(@PathVariable Long id) {
        if (registeredEventRepository.existsById(id)) {
            registeredEventRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    // New endpoint to get registered events by student ID
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<RegisteredEvents>> getRegisteredEventsByStudentId(@PathVariable Long studentId) {
        List<RegisteredEvents> registeredEvents = registeredEventRepository.findByStudentId(studentId);
        if (!registeredEvents.isEmpty()) {
            return new ResponseEntity<>(registeredEvents, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}

