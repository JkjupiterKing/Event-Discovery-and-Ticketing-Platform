package com.Event.ticketing.app.api.Repo;

import com.Event.ticketing.app.api.Model.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CityRepo extends JpaRepository<City, Long> {
    // Additional query methods can be defined here if needed
}

