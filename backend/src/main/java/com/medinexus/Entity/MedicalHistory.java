package com.medinexus.Entity;

import com.medinexus.user.entity.PatientProfile;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private PatientProfile patient;

    @Column(name = "medical_condition")
    private String condition;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDate diagnosedDate;

    @Column(columnDefinition = "TEXT")
    private String treatment;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}