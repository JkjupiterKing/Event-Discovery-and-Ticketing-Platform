package com.Event.ticketing.app.api.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "registered_events")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class RegisteredEvents {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "registration_time", nullable = false)
    private LocalDateTime registrationTime;
}
