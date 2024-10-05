package com.Event.ticketing.app.api.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Events")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId;

    private String eventName;
    private String description;

    @Column(name = "event_date_time")
    private LocalDateTime eventDateTime;

    @ManyToOne
    @JoinColumn(name = "City_id")
    private City city;

    private String organizer;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    private int capacity;
    private double registrationFee;
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    private String contactEmail;
    private String contactPhone;
}
