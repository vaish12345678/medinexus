package com.medinexus.organ.dto;

import com.medinexus.organ.entity.OrganDonorStatus;
import com.medinexus.organ.entity.OrganType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganDonorResponseDto {

    private Long id;

    private Long userId;

    private OrganType organType;

    private OrganDonorStatus status;

    private LocalDateTime registeredAt;

    private LocalDateTime updatedAt;
}