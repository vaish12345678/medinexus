package com.medinexus.user.repository;

import com.medinexus.user.entity.PatientProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientProfileRepository extends JpaRepository<PatientProfile, Long> {
}