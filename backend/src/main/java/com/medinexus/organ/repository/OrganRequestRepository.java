package com.medinexus.organ.repository;

import com.medinexus.organ.entity.OrganRequest;
import com.medinexus.organ.entity.OrganRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrganRequestRepository
        extends JpaRepository<OrganRequest, Long> {

    // Patient → view their own requests
    List<OrganRequest> findByPatientIdOrderByCreatedAtDesc(
            Long patientId
    );

    // Doctor → view only approved requests
    List<OrganRequest> findByStatusOrderByCreatedAtDesc(
            OrganRequestStatus status
    );
}