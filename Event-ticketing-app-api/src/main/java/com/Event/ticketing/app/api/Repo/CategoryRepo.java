package com.Event.ticketing.app.api.Repo;

import com.Event.ticketing.app.api.Model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepo extends JpaRepository<Category, Long> {
    // You can define custom query methods here if needed
}

