package com.Event.ticketing.app.api.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recommended_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendedEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;
}
