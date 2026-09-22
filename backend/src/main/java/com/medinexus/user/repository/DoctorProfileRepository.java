package com.medinexus.user.repository;

import com.medinexus.user.entity.DoctorProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, Long> {

    List<DoctorProfile> findBySpecializationIgnoreCase(String specialization);

    boolean existsByLicenseUrl(String licenseUrl);
}