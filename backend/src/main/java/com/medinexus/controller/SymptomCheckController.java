package com.medinexus.controller;

import com.medinexus.dto.SymptomCheckRequestDto;
import com.medinexus.dto.SymptomCheckResponseDto;
import com.medinexus.service.SymptomCheckService;
import com.medinexus.user.entity.User;
import com.medinexus.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/symptoms")
@RequiredArgsConstructor
public class SymptomCheckController {

    private final SymptomCheckService symptomCheckService;
    private final UserRepository userRepository;

    @PostMapping("/check")
    @PreAuthorize("hasRole('PATIENT')")
    public SymptomCheckResponseDto checkSymptoms(
            @Valid @RequestBody SymptomCheckRequestDto request,
            Authentication authentication
    ) {

        Long userId = getLoggedInUserId(authentication);

        return symptomCheckService.checkSymptoms(
                userId,
                request
        );
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('PATIENT')")
    public List<SymptomCheckResponseDto> getMySymptomChecks(
            Authentication authentication
    ) {

        Long userId = getLoggedInUserId(authentication);

        return symptomCheckService.getMySymptomChecks(
                userId
        );
    }

    private Long getLoggedInUserId(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));

        return user.getId();
    }
}