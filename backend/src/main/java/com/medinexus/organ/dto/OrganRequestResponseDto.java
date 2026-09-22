package com.medinexus.organ.dto;

import com.medinexus.organ.entity.OrganRequestStatus;
import com.medinexus.organ.entity.OrganType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganRequestResponseDto {

    private Long id;

    private Long patientId;

    private OrganType organType;

    private String reason;

    private OrganRequestStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}