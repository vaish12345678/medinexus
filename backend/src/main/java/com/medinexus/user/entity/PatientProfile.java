package com.medinexus.user.entity;

import com.medinexus.user.entity.BloodGroup;
import jakarta.persistence.*;
import lombok.*;
import jakarta.persistence.Entity;
import java.time.LocalDate;

@Entity
@Table(name = "patient_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class PatientProfile {

    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDate dateOfBirth;

    private String gender;

    @Enumerated(EnumType.STRING)
    private BloodGroup bloodGroup;

    @Column(length = 500)
    private String address;
}