package com.Event.ticketing.app.api.Model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Cities")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Cityid;

    @Column(name = "city_name", nullable = false)
    private String cityName;

    @Column(name = "state_name", nullable = false)
    private String stateName;

    @Column(name = "country_name", nullable = false)
    private String countryName;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

