package com.medinexus.notification.repository;

import com.medinexus.notification.entity.Notification;
import com.medinexus.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    // Get all notifications of a user
    List<Notification> findByUserOrderByCreatedAtDesc(
            User user
    );

    // Get unread notifications
    List<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(
            User user
    );

    // Count unread notifications
    long countByUserAndIsReadFalse(
            User user
    );
}