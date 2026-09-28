package com.medinexus.common.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ============================================================
    // VALIDATION ERRORS - @Valid / DTO validation
    // ============================================================

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            MethodArgumentNotValidException ex
    ) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        Map<String, Object> response = new HashMap<>();

        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "Validation failed");
        response.put("message", "Please check the provided fields.");
        response.put("errors", errors);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }


    // ============================================================
    // CONSTRAINT VIOLATION
    // ============================================================

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleConstraintViolation(
            ConstraintViolationException ex
    ) {

        Map<String, Object> response = new HashMap<>();

        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "Validation failed");
        response.put("message", ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }


    // ============================================================
    // ACCESS DENIED - 403
    // ============================================================

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(
            AccessDeniedException ex
    ) {

        Map<String, Object> response = new HashMap<>();

        response.put("status", HttpStatus.FORBIDDEN.value());
        response.put("error", "Forbidden");
        response.put(
                "message",
                "You are not allowed to perform this action."
        );

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(response);
    }


    // ============================================================
    // YOUR EXISTING RuntimeException
    // ============================================================

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException ex
    ) {

        Map<String, Object> response = new HashMap<>();

        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "Bad Request");
        response.put("message", ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }


    // ============================================================
    // UNEXPECTED SERVER ERROR
    // ============================================================

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(
            Exception ex
    ) {

        Map<String, Object> response = new HashMap<>();

        response.put(
                "status",
                HttpStatus.INTERNAL_SERVER_ERROR.value()
        );

        response.put(
                "error",
                "Internal Server Error"
        );

        response.put(
                "message",
                "Something went wrong on the server."
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }
}