package com.medinexus.user.dto;

import com.medinexus.user.entity.Role;
import com.medinexus.user.entity.UserStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserResponseDto {

    private Long id;

    private String name;

    private String email;

    private String phone;

    private Role role;

    private UserStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}