package com.medinexus.medicine.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "medicines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String genericName;

    private String manufacturer;

    @Column(columnDefinition = "TEXT")
    private String description;
}