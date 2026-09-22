package com.medinexus.repository;

import com.medinexus.Entity.AmbulanceService;
import com.medinexus.user.entity.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AmbulanceServiceRepository
        extends JpaRepository<AmbulanceService, Long> {

    List<AmbulanceService> findByIsAvailableTrueAndVerificationStatus(
            VerificationStatus verificationStatus
    );
}