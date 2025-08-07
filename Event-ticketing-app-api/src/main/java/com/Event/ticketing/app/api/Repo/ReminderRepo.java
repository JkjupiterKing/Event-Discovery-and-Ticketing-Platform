package com.Event.ticketing.app.api.Repo;

import com.Event.ticketing.app.api.Model.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReminderRepo extends JpaRepository<Reminder, Long> {
}
