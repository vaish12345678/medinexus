package com.medinexus.organ.repository;

import com.medinexus.organ.entity.OrganDonor;
import com.medinexus.organ.entity.OrganDonorStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrganDonorRepository
        extends JpaRepository<OrganDonor, Long> {

    Optional<OrganDonor> findByPatientId(Long patientId);

    boolean existsByPatientId(Long patientId);

    List<OrganDonor> findByStatus(
            OrganDonorStatus status
    );
}