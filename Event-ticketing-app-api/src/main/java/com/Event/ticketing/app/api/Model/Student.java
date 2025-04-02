package com.Event.ticketing.app.api.Model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Students")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;
    private String password;
    private String semester;
    private String branch;
    private String year;
}
