package com.medinexus.organ.entity;

import com.medinexus.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "organ_donors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganDonor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrganType organType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrganDonorStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime registeredAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        registeredAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (status == null) {
            status = OrganDonorStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}