package com.medinexus.blood.repository;

import com.medinexus.blood.entity.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
}