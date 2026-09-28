package com.medinexus.admin.service;

import com.medinexus.user.dto.AdminUserResponseDto;
import com.medinexus.user.entity.User;
import com.medinexus.user.entity.UserStatus;
import com.medinexus.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;

    public List<AdminUserResponseDto> getAllUsers() {

        return userRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public AdminUserResponseDto getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return mapToResponse(user);
    }

    public AdminUserResponseDto suspendUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new RuntimeException("User is already suspended");
        }

        user.setStatus(UserStatus.SUSPENDED);

        return mapToResponse(userRepository.save(user));
    }

    private AdminUserResponseDto mapToResponse(User user) {

        return AdminUserResponseDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}