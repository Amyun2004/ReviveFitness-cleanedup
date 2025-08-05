package com.ReviveFitness.controller;

import com.ReviveFitness.dto.AdminLoginRequest;
import com.ReviveFitness.model.Admin;
import com.ReviveFitness.security.JwtProvider;
import com.ReviveFitness.service.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {

    @Autowired private AdminService adminService;
    @Autowired private JwtProvider jwtProvider;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest loginReq) {
        try {
            // 1) authenticate or throw
            Admin admin = adminService.authenticateAdmin(
                loginReq.getAdminId(),
                loginReq.getPassword()
            );

            // 2) issue JWT
            String token = jwtProvider.generateToken(admin.getAdminId());

            // 3) update last-login timestamp
            adminService.updateLastLogin(admin.getId());

            // 4) reply with token + adminId
            return ResponseEntity.ok(Map.of(
                "token",   token,
                "adminId", admin.getAdminId()
            ));

        } catch (BadCredentialsException ex) {
            // invalid credentials → 401
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            // any other error → 500
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Login failed"));
        }
    }
}
