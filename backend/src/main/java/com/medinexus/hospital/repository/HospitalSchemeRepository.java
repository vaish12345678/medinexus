package com.medinexus.hospital.repository;

import com.medinexus.hospital.entity.HospitalScheme;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HospitalSchemeRepository
        extends JpaRepository<HospitalScheme, Long> {

    List<HospitalScheme> findByActiveTrue();
}