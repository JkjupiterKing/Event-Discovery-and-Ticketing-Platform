package com.Event.ticketing.app.api.Repo;

import com.Event.ticketing.app.api.Model.RecommendedEvent;
import com.Event.ticketing.app.api.Model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecommendedEventRepo extends JpaRepository<RecommendedEvent, Long> {
    List<RecommendedEvent> findByCustomer(Customer customer);
}
