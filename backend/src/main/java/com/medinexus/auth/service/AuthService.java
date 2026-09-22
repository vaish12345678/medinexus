package com.medinexus.auth.service;


import com.medinexus.auth.dto.LoginRequest;
import com.medinexus.auth.dto.LoginResponse;
import com.medinexus.auth.dto.RegisterRequest;
import com.medinexus.auth.dto.RegisterResponse;
import com.medinexus.security.JwtService;
import com.medinexus.user.entity.User;
import com.medinexus.user.entity.UserStatus;
import com.medinexus.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    public RegisterResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole())
                .status(getInitialStatus(request))
                .build();

        User savedUser = userRepository.save(user);

        return RegisterResponse.builder()
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .phone(savedUser.getPhone())
                .role(savedUser.getRole())
                .status(savedUser.getStatus())
                .build();
    }

    private UserStatus getInitialStatus(RegisterRequest request) {

        return switch (request.getRole()) {
            case PATIENT -> UserStatus.ACTIVE;

            case DOCTOR,
                 HOSPITAL,
                 PHARMACY,
                 AMBULANCE,
                 ADMIN -> UserStatus.PENDING;
        };
    }
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new BadCredentialsException("Invalid email or password")
                );

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {
            throw new BadCredentialsException(
                    "Invalid email or password"
            );
        }

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponse(
                token,
                "Login successful"
        );
    }

}
