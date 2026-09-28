package com.medinexus.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        // ============================
        // GET JWT FROM COOKIE
        // ============================

        String jwt = null;

        Cookie[] cookies = request.getCookies();

        if (cookies != null) {

            for (Cookie cookie : cookies) {

                if ("medinexus_token".equals(cookie.getName())) {

                    jwt = cookie.getValue();

                    break;
                }
            }
        }


        // No cookie
        if (jwt == null || jwt.isEmpty()) {

            filterChain.doFilter(request, response);

            return;
        }


        String email;

        try {

            email = jwtService.extractUsername(jwt);

        } catch (Exception e) {

            filterChain.doFilter(request, response);

            return;
        }


        if (email != null &&
                SecurityContextHolder
                        .getContext()
                        .getAuthentication() == null) {

            UserDetails userDetails =
                    userDetailsService
                            .loadUserByUsername(email);


            if (jwtService.isTokenValid(
                    jwt,
                    userDetails
            )) {

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(
                                authentication
                        );
            }
        }


        filterChain.doFilter(request, response);
    }
}