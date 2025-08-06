package com.Event.ticketing.app.api.Controller;

import com.Event.ticketing.app.api.Model.RegisteredEvents;
import com.Event.ticketing.app.api.Repo.RegisteredEventsRepo;
import com.Event.ticketing.app.api.Service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

    @Autowired
    private EmailService emailService;

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

    @PostMapping("/send-reminder")
    public ResponseEntity<String> sendReminder(@RequestBody RegisteredEvents registeredEvent) {
        if (registeredEvent == null ||
                registeredEvent.getCustomer() == null ||
                registeredEvent.getEvent() == null) {
            return new ResponseEntity<>("Invalid request", HttpStatus.BAD_REQUEST);
        }

        String recipientEmail = registeredEvent.getCustomer().getEmail();
        String firstName = registeredEvent.getCustomer().getFirstName();
        String eventName = registeredEvent.getEvent().getEventName();
        LocalDateTime eventDateTime = registeredEvent.getEvent().getEventDateTime();

        String subject = "Reminder: Upcoming Event - " + eventName;
        String body = String.format(
                "Dear %s,\n\n"
                        + "We hope you're doing well!\n\n"
                        + "This is a friendly reminder that you're registered for the event: \"%s\",\n"
                        + "scheduled to take place on %s.\n\n"
                        + "We’re excited to have you join us for this event. It promises to be an engaging and valuable experience.\n\n"
                        + "Best regards,\n"
                        + "Event Ticketing Team",
                firstName,
                eventName,
                eventDateTime.toString()
        );

        try {
            emailService.sendReminderEmail(recipientEmail, subject, body);
            return new ResponseEntity<>("Reminder sent successfully to " + recipientEmail, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to send reminder: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
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
    public ResponseEntity<List<RegisteredEvents>> getRegisteredEventsByCustomerId(@PathVariable Long customerId) {
        List<RegisteredEvents> registeredEvents = registeredEventRepository.findByCustomerId(customerId);
        if (!registeredEvents.isEmpty()) {
            return new ResponseEntity<>(registeredEvents, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}

