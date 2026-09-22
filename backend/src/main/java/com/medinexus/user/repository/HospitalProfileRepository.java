package com.medinexus.user.repository;

import com.medinexus.user.entity.HospitalProfile;
import com.medinexus.user.entity.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HospitalProfileRepository
        extends JpaRepository<HospitalProfile, Long> {

    List<HospitalProfile> findByVerificationStatus(
            VerificationStatus verificationStatus
    );

    List<HospitalProfile> findByCityIgnoreCaseAndActiveTrue(
            String city
    );

    List<HospitalProfile> findByActiveTrue();

    List<HospitalProfile> findByEmergencyAvailableTrueAndActiveTrue();
}