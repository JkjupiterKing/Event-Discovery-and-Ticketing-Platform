package com.Event.ticketing.app.api.Repo;

import com.Event.ticketing.app.api.Model.Event;
import com.Event.ticketing.app.api.Model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepo extends JpaRepository<Event, Long> {
    List<Event> findByCategory(Category category);
}
