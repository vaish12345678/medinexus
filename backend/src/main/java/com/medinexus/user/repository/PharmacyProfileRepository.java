package com.medinexus.user.repository;

import com.medinexus.user.entity.PharmacyProfile;
import com.medinexus.user.entity.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PharmacyProfileRepository extends JpaRepository<PharmacyProfile, Long> {
    boolean existsByLicenseUrl(String licenseUrl);

    List<PharmacyProfile> findByVerificationStatus(
            VerificationStatus verificationStatus
    );
}