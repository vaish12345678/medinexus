package com.medinexus.admin.controller;

import com.medinexus.admin.service.AdminUserService;
import com.medinexus.user.dto.AdminUserResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public List<AdminUserResponseDto> getAllUsers() {
        return adminUserService.getAllUsers();
    }

    @GetMapping("/{id}")
    public AdminUserResponseDto getUserById(
            @PathVariable Long id) {

        return adminUserService.getUserById(id);
    }

    @PutMapping("/{id}/suspend")
    public AdminUserResponseDto suspendUser(
            @PathVariable Long id) {

        return adminUserService.suspendUser(id);
    }
}