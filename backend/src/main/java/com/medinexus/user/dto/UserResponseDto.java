package com.medinexus.user.dto;

import com.medinexus.user.entity.Role;
import com.medinexus.user.entity.UserStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {

    private Long id;

    private String name;

    private String email;

    private String phone;

    private Role role;

    private UserStatus status;
}