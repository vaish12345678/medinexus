package com.medinexus.hospital.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;


    @Entity
    @Table(name = "hospital_schemes")
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class HospitalScheme {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false)
        private String name;

        @Column(length = 1000)
        private String description;

        @Column(nullable = false)
        private String provider;

        private String category;

        @Column(nullable = false, length = 1000)
        private String officialUrl;

        @Builder.Default
        @Column(nullable = false)
        private Boolean active = true;
    }



