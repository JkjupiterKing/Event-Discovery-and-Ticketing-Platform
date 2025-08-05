package com.Event.ticketing.app.api.Repo;

import com.Event.ticketing.app.api.Model.RegisteredEvents;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegisteredEventsRepo extends JpaRepository<RegisteredEvents, Long> {
    // Corrected method to use 'customer.id' instead of nonexistent 'studentId'
    List<RegisteredEvents> findByCustomerId(Long customerId);
}
