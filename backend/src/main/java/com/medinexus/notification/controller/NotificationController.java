package com.medinexus.notification.controller;

import com.medinexus.notification.dto.NotificationResponseDto;
import com.medinexus.notification.service.NotificationService;
import com.medinexus.user.entity.User;
import com.medinexus.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;


    // ============================================================
    // GET MY NOTIFICATIONS
    // ============================================================

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<NotificationResponseDto>>
    getMyNotifications(
            Authentication authentication
    ) {

        Long userId =
                getLoggedInUserId(authentication);

        return ResponseEntity.ok(
                notificationService.getMyNotifications(
                        userId
                )
        );
    }


    // ============================================================
    // GET MY UNREAD NOTIFICATIONS
    // ============================================================

    @GetMapping("/unread")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<NotificationResponseDto>>
    getUnreadNotifications(
            Authentication authentication
    ) {

        Long userId =
                getLoggedInUserId(authentication);

        return ResponseEntity.ok(
                notificationService.getUnreadNotifications(
                        userId
                )
        );
    }


    // ============================================================
    // GET MY UNREAD COUNT
    // ============================================================

    @GetMapping("/unread/count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Long> getUnreadCount(
            Authentication authentication
    ) {

        Long userId =
                getLoggedInUserId(authentication);

        return ResponseEntity.ok(
                notificationService.getUnreadCount(
                        userId
                )
        );
    }


    // ============================================================
    // MARK ONE AS READ
    // ============================================================

    @PutMapping("/{notificationId}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<NotificationResponseDto>
    markAsRead(
            @PathVariable Long notificationId,
            Authentication authentication
    ) {

        Long userId =
                getLoggedInUserId(authentication);

        return ResponseEntity.ok(
                notificationService.markAsRead(
                        userId,
                        notificationId
                )
        );
    }


    // ============================================================
    // MARK ALL AS READ
    // ============================================================

    @PutMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> markAllAsRead(
            Authentication authentication
    ) {

        Long userId =
                getLoggedInUserId(authentication);

        notificationService.markAllAsRead(
                userId
        );

        return ResponseEntity.ok(
                "All notifications marked as read"
        );
    }


    // ============================================================
    // GET LOGGED-IN USER ID
    // ============================================================

    private Long getLoggedInUserId(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return user.getId();
    }
}