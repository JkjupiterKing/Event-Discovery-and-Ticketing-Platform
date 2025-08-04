package com.Event.ticketing.app.api.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventResponse {
    private Long eventId;
    private String eventName;
    private String description;
    private String organizer;
    private String status;
    private String contactEmail;
    private String contactPhone;
    private String result;
    private int capacity;
    private double registrationFee;
    private String category;
    private String eventDateTime;
    private String eventImage; // Base64 string
}
