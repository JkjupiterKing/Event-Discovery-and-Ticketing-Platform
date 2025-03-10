package com.Event.ticketing.app.api.Repo;

import com.Event.ticketing.app.api.Model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepo extends JpaRepository<Student, Long> {
    Student findByEmail(String email);
}

