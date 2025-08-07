package com.Event.ticketing.app.api.Controller;

import com.Event.ticketing.app.api.Model.Reminder;
import com.Event.ticketing.app.api.Repo.ReminderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reminders")
@CrossOrigin
public class ReminderController {

    private final ReminderRepo reminderRepo;

    @Autowired
    public ReminderController(ReminderRepo reminderRepo) {
        this.reminderRepo = reminderRepo;
    }

    // Save a reminder
    @PostMapping("/save")
    public ResponseEntity<Reminder> saveReminder(@RequestBody Reminder reminder) {
        Reminder saved = reminderRepo.save(reminder);
        return ResponseEntity.ok(saved);
    }

    // Get all reminders
    @GetMapping("/all")
    public ResponseEntity<List<Reminder>> getAllReminders() {
        return ResponseEntity.ok(reminderRepo.findAll());
    }
}
