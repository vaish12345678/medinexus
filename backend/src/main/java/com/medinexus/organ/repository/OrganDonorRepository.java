package com.medinexus.organ.repository;

import com.medinexus.organ.entity.OrganDonor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganDonorRepository extends JpaRepository<OrganDonor, Long> {
}