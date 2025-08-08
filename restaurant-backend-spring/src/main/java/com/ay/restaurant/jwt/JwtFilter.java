package com.ay.restaurant.jwt;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;

    private final CustomUserDetailsService customUserDetailsService;

    private Claims claims = null;
    private String userEmail = null;

    /* It checks if the incoming request contains an Authorization header with a value starting with "Bearer ", if not it passes the
    * request along the filter chain without further processing otherwise it extracts the username and all the claims from the token.
    * It then loads the user details if the user is not yet authenticated.
    * If the token is valid, it creates an Authentication object of type UsernamePasswordAuthenticationToken, sets it in the
    * SecurityContextHolder, and finally it continues the filter chain */
    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {
        if(!httpServletRequest.getServletPath().matches("/users/login|/users/signup|/users/forgotPassword")) {
            final String authorizationHeader = httpServletRequest.getHeader("Authorization");
            String token = null;
            if(authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                filterChain.doFilter(httpServletRequest, httpServletResponse);
                return;
            }
            token = authorizationHeader.substring(7);
            this.userEmail = jwtUtils.extractUsername(token);
            this.claims = jwtUtils.extractAllClaims(token);
            /* I also need to check whether the user is not yet authenticated because if they are, I don't need to perform all the checks again.
             * In this scenario, all I need to do is update the SecurityContextHolder and leave it to the DispatcherServlet */
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.customUserDetailsService.loadUserByUsername(userEmail);
                if (jwtUtils.validateToken(token, userDetails)) { //&& isTokenValid) {
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpServletRequest));
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                }
            }
        }
        filterChain.doFilter(httpServletRequest, httpServletResponse);
    }

    public boolean isAdmin() {
        return "admin".equalsIgnoreCase((String) claims.get("role"));
    }

    public boolean isUser() {
        return "user".equalsIgnoreCase((String) claims.get("role"));
    }

    public String getCurrentUser() {
        return userEmail;
    }
}