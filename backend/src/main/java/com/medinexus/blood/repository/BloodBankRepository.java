package com.medinexus.blood.repository;

import com.medinexus.blood.entity.BloodBank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BloodBankRepository extends JpaRepository<BloodBank, Long> {
}