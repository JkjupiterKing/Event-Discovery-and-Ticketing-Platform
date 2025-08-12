package com.Event.ticketing.app.api.Controller;

import com.Event.ticketing.app.api.Model.RegisteredEvents;
import com.Event.ticketing.app.api.Service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/sms")
@CrossOrigin
public class SmsController {

    @Autowired
    private SmsService smsService;

    // Generic SMS sender
    @PostMapping("/send")
    public String sendSms(@RequestParam String to, @RequestParam String message) {
        smsService.sendSms(to, message);
        return "SMS sent to " + to;
    }

    // SMS Reminder for registered event
    @PostMapping("/send-sms-reminder")
    public ResponseEntity<String> sendSmsReminder(@RequestBody RegisteredEvents registeredEvent) {
        if (registeredEvent == null ||
                registeredEvent.getCustomer() == null ||
                registeredEvent.getEvent() == null) {
            return new ResponseEntity<>("Invalid request", HttpStatus.BAD_REQUEST);
        }

        String phoneNumber = registeredEvent.getCustomer().getPhoneNumber(); // Ensure this exists
        String firstName = registeredEvent.getCustomer().getFirstName();
        String eventName = registeredEvent.getEvent().getEventName();
        LocalDateTime eventDateTime = registeredEvent.getEvent().getEventDateTime();

        String smsBody = String.format(
                "Hi %s! Reminder: Your event \"%s\" is scheduled for %s. See you there!",
                firstName,
                eventName,
                eventDateTime.toString()
        );

        try {
            smsService.sendSms(phoneNumber, smsBody);
            return new ResponseEntity<>("SMS reminder sent successfully to " + phoneNumber, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to send SMS: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // SMS Confirmation for registration success
    @PostMapping("/send-sms-registration-success")
    public ResponseEntity<String> sendRegistrationSuccessSms(@RequestBody RegisteredEvents registeredEvent) {
        if (registeredEvent == null ||
                registeredEvent.getCustomer() == null ||
                registeredEvent.getEvent() == null) {
            return new ResponseEntity<>("Invalid request", HttpStatus.BAD_REQUEST);
        }

        String phoneNumber = registeredEvent.getCustomer().getPhoneNumber(); // Ensure this exists
        String firstName = registeredEvent.getCustomer().getFirstName();
        String eventName = registeredEvent.getEvent().getEventName();
        LocalDateTime eventDateTime = registeredEvent.getEvent().getEventDateTime();

        String smsBody = String.format(
                "Hi %s! You've successfully registered for \"%s\" on %s. Thank you!",
                firstName,
                eventName,
                eventDateTime.toString()
        );

        try {
            smsService.sendSms(phoneNumber, smsBody);
            return new ResponseEntity<>("Registration SMS sent successfully to " + phoneNumber, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to send registration SMS: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
