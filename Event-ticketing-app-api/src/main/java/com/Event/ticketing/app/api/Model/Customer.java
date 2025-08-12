package com.Event.ticketing.app.api.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Customers")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String gender;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;
    private String city;
    private String state;
    private String country;
    private String phoneNumber;
}
