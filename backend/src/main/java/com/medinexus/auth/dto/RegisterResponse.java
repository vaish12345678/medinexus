package com.medinexus.auth.dto;

import com.medinexus.user.entity.Role;
import com.medinexus.user.entity.UserStatus;
import lombok.Builder;
import lombok.Getter;


    @Getter
    @Builder
    public class RegisterResponse {

        private Long id;
        private String name;
        private String email;
        private String phone;
        private Role role;
        private UserStatus status;
}
