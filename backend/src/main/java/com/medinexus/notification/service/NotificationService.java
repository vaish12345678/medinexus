package com.medinexus.notification.service;

import com.medinexus.notification.dto.NotificationResponseDto;
import com.medinexus.notification.entity.Notification;
import com.medinexus.notification.entity.NotificationType;
import com.medinexus.notification.repository.NotificationRepository;
import com.medinexus.user.entity.User;
import com.medinexus.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;


    // ============================================================
    // CREATE NOTIFICATION
    // ============================================================

    @Transactional
    public NotificationResponseDto createNotification(
            Long userId,
            String title,
            String message,
            NotificationType type
    ) {

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        Notification notification =
                Notification.builder()
                        .user(user)
                        .title(title)
                        .message(message)
                        .type(type)
                        .isRead(false)
                        .build();

        Notification saved =
                notificationRepository.save(notification);

        return mapToResponseDto(saved);
    }


    // ============================================================
    // GET ALL MY NOTIFICATIONS
    // ============================================================

    @Transactional(readOnly = true)
    public List<NotificationResponseDto> getMyNotifications(
            Long userId
    ) {

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return notificationRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }


    // ============================================================
    // GET MY UNREAD NOTIFICATIONS
    // ============================================================

    @Transactional(readOnly = true)
    public List<NotificationResponseDto> getUnreadNotifications(
            Long userId
    ) {

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return notificationRepository
                .findByUserAndIsReadFalseOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }


    // ============================================================
    // GET UNREAD COUNT
    // ============================================================

    @Transactional(readOnly = true)
    public long getUnreadCount(
            Long userId
    ) {

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return notificationRepository
                .countByUserAndIsReadFalse(user);
    }


    // ============================================================
    // MARK ONE NOTIFICATION AS READ
    // ============================================================

    @Transactional
    public NotificationResponseDto markAsRead(
            Long userId,
            Long notificationId
    ) {

        Notification notification =
                notificationRepository.findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                )
                        );

        // Make sure this notification belongs
        // to the logged-in user
        if (!notification.getUser()
                .getId()
                .equals(userId)) {

            throw new RuntimeException(
                    "You are not allowed to modify this notification"
            );
        }

        notification.setIsRead(true);

        Notification updated =
                notificationRepository.save(notification);

        return mapToResponseDto(updated);
    }


    // ============================================================
    // MARK ALL NOTIFICATIONS AS READ
    // ============================================================

    @Transactional
    public void markAllAsRead(
            Long userId
    ) {

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        List<Notification> notifications =
                notificationRepository
                        .findByUserOrderByCreatedAtDesc(user);

        for (Notification notification : notifications) {

            if (!Boolean.TRUE.equals(
                    notification.getIsRead()
            )) {

                notification.setIsRead(true);
            }
        }

        notificationRepository.saveAll(notifications);
    }


    // ============================================================
    // ENTITY → DTO
    // ============================================================

    private NotificationResponseDto mapToResponseDto(
            Notification notification
    ) {

        return NotificationResponseDto.builder()
                .id(notification.getId())
                .userId(notification.getUser().getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}