package com.Event.ticketing.app.api.Repo;

import com.Event.ticketing.app.api.Model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepo extends JpaRepository<Event, Long> {
    // Custom query methods can be added here if needed
}
