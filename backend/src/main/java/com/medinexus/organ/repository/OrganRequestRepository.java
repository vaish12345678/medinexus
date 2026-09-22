package com.medinexus.organ.repository;

import com.medinexus.organ.entity.OrganRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganRequestRepository extends JpaRepository<OrganRequest, Long> {
}