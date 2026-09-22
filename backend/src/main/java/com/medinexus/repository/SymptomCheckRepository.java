package com.medinexus.repository;

import com.medinexus.Entity.SymptomCheck;
import com.medinexus.user.entity.PatientProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SymptomCheckRepository
        extends JpaRepository<SymptomCheck, Long> {

    List<SymptomCheck> findByPatientOrderByCreatedAtDesc(
            PatientProfile patient
    );
}